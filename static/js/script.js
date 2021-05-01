class RoomManager{
    constructor() {
        this.id = document.querySelector(".id").innerText
        this.startGame = false
        this.divs = document.querySelectorAll(".box")
        this.checkbox = document.querySelector('input[name = "ready"]')
        this.checkbox.addEventListener("click",this.updateStatus.bind(this))
        this.interval = setInterval(this.getPlayers.bind(this),1000)
        this.getPlayers()
    }

    getPlayers(){
        fetch("/getPlayers",{
            method:"POST",
            headers:{"content-type": "application/json"},
            body:JSON.stringify({roomId:this.id})
        })
        .then(res => res.json())
        .then(res => {
            let playerReady = 0
        
            this.divs = Array.from(this.divs)
        
            this.divs.forEach(el => {
                el.innerText = ""
            })
            for(let key in res){
                if(res[key] != null){
                    const div = document.querySelector(`.player-${res[key].playerId}`)
                    div.innerText = res[key].nickname
                    
                    if(res[key].status == 1){
                        playerReady++
                        div.classList.add(`ready-${res[key].playerId}`)
                    }
                    if(playerReady > 1){
                        this.startGame = true
                    }
                    if(res[key].status == 0 && !playerReady){
                        div.classList.remove(`ready-${res[key].playerId}`)
                    }  
                    
                        
            }
        }
        })
        .catch(err => console.error(err))
            
        if(this.startGame){
            this.divs = this.divs.filter(el => el.innerText != "")
            const playerCount = this.divs.length
            clearInterval(this.interval)
            this.checkbox.removeEventListener("click",this.updateStatus)
            new GameRender(playerCount)
        }  
    }
    updateStatus(){
        fetch("/updateStatus",{
            method:"POST",
            headers:{"content-type":"application/json"},
            body:JSON.stringify({roomId:this.id})
        })
        .catch(err => console.error(err))
    }
}

new RoomManager()


class GameRender{
    constructor(playerCount) {
        this.interval = setInterval(this.followGameProgress.bind(this),1000)
        this.playerCount = playerCount
        this.dice = document.querySelector(".dice > img")
        this.diceThrow = document.querySelector(".dice-throw")
        this.div1 = false
        this.div2 = false
        this.div3 = false
        this.div4 = false
        this.divEv1 = null
        this.divEv2 = null
        this.divEv3 = null
        this.divEv4 = null
        this.init()
    }

    init(){
        // Sprawdzić czy gra się nie toczy
        fetch("/gameReady",{
            method:"POST"
        })
        //coloruje divy
        this.colorDivs()
        //coloruje ready playerów
        let fields = 1
        for(let i=1; i<this.playerCount+1; i++){
            for(let j=0; j<4; j++){
                document.querySelector(`.p${fields}`).classList.add(`ready-${i}`)
                fields++
            }
        }
        //pozwala rzucić kostką
        this.diceThrow.addEventListener("click",this.diceRoll.bind(this))

        this.followGameProgress()
    }

    diceRoll(){
        const diceMapper = {
            1:"Jeden",
            2:"Dwa",
            3:"Trzy",
            4:"Cztery",
            5:"Pięć",
            6:"Sześć",
        }
        const rolledValue = parseInt(Math.random()*6+1)
        this.dice.src = `/static/img/${rolledValue}.png`
        
        const synth = window.speechSynthesis
        const utter = new SpeechSynthesisUtterance(diceMapper[rolledValue])
        synth.speak(utter)

        fetch("/throwDice",{
            headers:{"content-type":"application/json"},
            method:"POST",
            body:JSON.stringify({value:rolledValue})
        })
        .then(res => console.log(res))
    }

    colorDivs(){
        setTimeout(function(){
            Array.from(document.querySelectorAll(".box")).forEach((el,index) => {
                if(el.innerText != ""){
                    el.classList.add(`ready-${index+1}`)
                }
            })
        },200)
        
    }

    followGameProgress(){
        
        fetch("/getData",{
            method:"POST"
        })
        .then(res => res.json())
        .then(res => {

            if(res.forCurrent){
                //render
                
                
                const render = res.forAll
                const current = res.forCurrent

                if(parseInt(current.timer)>0){
                    document.querySelector(".dice-throw").classList.remove("hide")
                }

                for(let key in render.pawnPositions){
                    for(let index in render.pawnPositions[key].pawns){
                        if(render.pawnPositions[key].pawns[index].currentDiv != null){
                            const divToRender = document.querySelector(`.${render.pawnPositions[key].pawns[index].currentDiv}`)
                            divToRender.classList.add("test")
                        }
                    }
                }

                document.querySelector(".timer").innerText = current.timer
                document.querySelector(".dice-throw").classList.remove("hide")
                if(current.hideButton){
                    document.querySelector(".dice-throw").classList.add("hide")
                }

                try{
                    if(!this.div1){
                        if(current.legalMoves[0].start){
                           this.divEv1 =  document.querySelector(`#${current.legalMoves[0].color}1`)
                           this.divEv1.addEventListener("click",this.movePawn.bind(this,current.legalMoves[0]),{once:true})
                        }
                        this.div1 = true
                    }
                }
                catch{

                }
                try{
                    if(!this.div2){
                        if(current.legalMoves[1].start){
                            this.divEv2 =  document.querySelector(`#${current.legalMoves[1].color}2`)
                            this.divEv2.addEventListener("click",this.movePawn.bind(this,current.legalMoves[1]),{once:true})
                        }
                        this.div2 = true
                    }
                }
                catch{
                    
                }
                    
                try{
                    if(!this.div3){
                        if(current.legalMoves[2].start){
                            this.divEv3 = document.querySelector(`#${current.legalMoves[2].color}3`)
                            this.divEv3.addEventListener("click",this.movePawn.bind(this,current.legalMoves[2]),{once:true})
                        }
                        this.div3 = true
                    }
                }
                catch{
                }
                    
                try{
                    if(!this.div4){
                        if(current.legalMoves[3].start){
                            this.divEv4 =  document.querySelector(`#${current.legalMoves[3].color}4`)
                            this.divEv4.addEventListener("click",this.movePawn.bind(this,current.legalMoves[3]),{once:true})
                        }
                        this.div4 = true
                    }
                }
            
                catch{

                }
                

            } else{
                document.querySelector(".dice-throw").classList.add("hide")
                for(let key in res.pawnPositions){
                    for(let index in res.pawnPositions[key].pawns){
                        if(res.pawnPositions[key].pawns[index].currentDiv != null){
                            const divToRender = document.querySelector(`.${res.pawnPositions[key].pawns[index].currentDiv}`)
                            divToRender.classList.add("test")
                        }
                    }
                }
            }
                
                
                            
            
        })
        .catch(err => console.error(err))
    }
    movePawn(howToMove){
        this.divEv1.removeEventListener("click",this.movePawn)
        this.divEv2.removeEventListener("click",this.movePawn)
        this.divEv3.removeEventListener("click",this.movePawn)
        this.divEv4.removeEventListener("click",this.movePawn)
        

       fetch("/movePawn",{
           headers:{"content-type":"application/json"},
           method:"POST",
           body:JSON.stringify(howToMove)
       })
    }
}