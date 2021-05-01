const express = require('express');
const session = require("express-session")
const uuid =require("uuid")
const path = require("path")
const RoomControler = require("./modules/classes/RoomControler.js")
const Ludo = require("./modules/classes/Ludo")
const app = express()

//ustawienie rzeczy
app.set("view engine", "ejs")
app.use(express.json())
app.use(express.urlencoded({
    extended:true
}))
app.use("/static/img",express.static("static/img"))
app.use("/static/js",express.static("static/js"))
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
  }))
//zmienne potrzebne do działania
let currentNotFullRoom = null
const gameList = {}


//funkcje 

function setSession(playerId,id,playerName,req){
        req.session.roomId = id
        req.session.playerName = playerName
        req.session.status = 0
        req.session.playerId = playerId
}

//routes
app.get("/",function(req,res){
    if(req.session.playerName){
        res.redirect("/game")
    }else{
        res.sendFile(path.join(__dirname +"/static/index.html"))
    }
})

app.get("/game",function(req,res){
    if(!req.session.playerName){
        res.redirect("/")
    }else{
        res.render("game",{id:gameList[req.session.roomId].getId()})
    }
})

app.post("/getPlayers",function(req,res){
            res.end(JSON.stringify(gameList[req.body.roomId].getPlayers())) 
})


app.post("/addToRoom", function(req,res){
    const playerName = req.body.nickname    
    
    if(!currentNotFullRoom){
        currentNotFullRoom = new RoomControler(playerName)
        gameList[currentNotFullRoom.getId()] = currentNotFullRoom
        setSession(currentNotFullRoom.playerCount,currentNotFullRoom.getId(),playerName,req)
    }
    else if(currentNotFullRoom.playerCount < 4){
        currentNotFullRoom.addPlayer(playerName)
        setSession(currentNotFullRoom.playerCount,currentNotFullRoom.getId(),playerName,req)
    } 
    else if (currentNotFullRoom.playerCount == 4){
        currentNotFullRoom = new RoomControler(playerName)
        gameList[currentNotFullRoom.getId()] = currentNotFullRoom
        setSession(currentNotFullRoom.playerCount,currentNotFullRoom.getId(),playerName,req)
    }    
    res.end()
})

app.post("/updateStatus", function(req,res){
    req.session.status == 0 ? req.session.status = 1 : req.session.status = 0
    gameList[req.body.roomId].changePlayerStatus(req.session.playerId,req.session.status)
    res.end()
})

app.post("/gameReady", function(req,res){
    req.session.status = 2
    console.log(req.session);
    if(gameList[req.session.roomId].roomStatus == 0){
        gameList[req.session.roomId].changePlayerStatus(req.session.playerId,req.session.status)
        gameList[req.session.roomId].roomStatus = 2
        gameList[req.session.roomId].game = new Ludo(req.session)
    }
    else{
        gameList[req.session.roomId].game.addPlayer(req.session)
    }
    
    currentNotFullRoom = null
    res.end()
})

app.post("/throwDice",function(req,res){
   const game = gameList[req.session.roomId].game

   game.throwDice(req.session,req.body.value)

   res.end()
})

app.post("/getData",function(req,res){

    const game = gameList[req.session.roomId].game
    
    const info = game.sendData()
    if(info.forCurrent.legalMoves.length >0){
        info.forCurrent.hideButton = true
    }

    if(info.forAll.currentPlayerTurn[req.session.playerId]){
        res.end(JSON.stringify(info))
    }
    else{
    res.end(JSON.stringify(info.forAll))
    }
    //jeżeli dostanie możliwość ruszenia pionem dopisać wartość makeMove czy coś takiego
})

app.post("/movePawn",function(req,res){
    const game = gameList[req.session.roomId].game

    game.movePawn(req.session,req.body)
})

app.listen(process.env.PORT || 3000,function(req,res){
    console.log("Serwer ruszył");
})