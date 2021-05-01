const Pawn = require("./Pawn")
const Turn = require("./Config")
const Timer = require("./Timer")

module.exports = class GameProggres{
    constructor(player) {
        this.timer = null
        this.legalMoves = []
        this.players = {} 
        this.init(player)
    }

    init(player){
        this.timer = new Timer()
        this.players[player.playerId] = createPlayerInfo(player.playerId,player.playerName)
    }

    addPlayer(player){
        this.players[player.playerId] = createPlayerInfo(player.playerId,player.playerName)
    }

    throwDice(player,thrownNumber){
        let moves= this.checkLegalMove(thrownNumber,player)
        let canMakeLegalMove = false
        
        for(let move in moves){
            if(typeof(moves[move]) == "object"){
                canMakeLegalMove = true
                break
            }
        }

        if(canMakeLegalMove){
            this.legalMoves = moves
        }
        else{
            this.timer = new Timer()
            this.legalMoves = []
            Turn[player.playerId] = false
            if(player.playerId+1 == Object.keys(this.players).length+1){
                Turn[1] = true
            }else{
                Turn[player.playerId+1] = true
            }
        }
        
    }

    
    movePawn(player,howToMove){
        this.timer = new Timer()
        this.legalMoves = []
            Turn[player.playerId] = false
            if(player.playerId+1 == Object.keys(this.players).length+1){
                Turn[1] = true
            }else{
                Turn[player.playerId+1] = true
            }
        
        this.players[player.playerId].pawns[howToMove.pawnId].updatePosition(howToMove)
    }


    

    checkLegalMove(thrownNumber,player){
        const pawns = this.players[player.playerId].pawns
        const legalMoves = []
        for(let pawn in pawns){
            legalMoves.push(pawns[pawn].canIMove(thrownNumber))
        }
        return legalMoves
    }

    sendData(){
        if(this.timer.sek < 0){
            for(let key in Turn){
                if(Turn[key] == true){
                    Turn[key] = false
                    if(parseInt(key) == Object.keys(this.players).length){
                        Turn[1]= true
                    }
                    else{
                        Turn[parseInt(key)+1] = true
                    }
                    this.timer = new Timer()
                    this.legalMoves = []
                    break
                }
            }
        }
        return {
        forAll:{currentPlayerTurn:Turn,pawnPositions:this.players},
        forCurrent:{legalMoves: this.legalMoves,timer:this.timer.sek}
        }
    }
}



function createPlayerInfo(playerId,playerName){
    switch(playerId){
        case 1:
            return {
                nickname:playerName,
                pawns:{
                    1:new Pawn(1,"p48",1),
                    2:new Pawn(2,"p48",1),
                    3:new Pawn(3,"p48",1),
                    4:new Pawn(4,"p48",1),
                }
            }
        case 2:
            return {
                nickname:playerName,
                pawns:{
                    1:new Pawn(1,"p17",2),
                    2:new Pawn(2,"p17",2),
                    3:new Pawn(3,"p17",2),
                    4:new Pawn(4,"p17",2),
                }
            }
        case 3:
            return{
                nickname:playerName,
                pawns:{
                    1:new Pawn(1,"p27",3),
                    2:new Pawn(2,"p27",3),
                    3:new Pawn(3,"p27",3),
                    4:new Pawn(4,"p27",3),
                }
            }
        case 4:
            return{
                nickname:playerName,
                pawns:{
                    1:new Pawn(1,"p37",4),
                    2:new Pawn(2,"p37",4),
                    3:new Pawn(3,"p37",4),
                    4:new Pawn(4,"p37",4),
                }
            }
    }
}