const uuid = require('uuid');

module.exports = class CreateRoom {
    constructor(playerName) {
        this.roomId = uuid.v1()
        this.players ={
            1:{nickname:playerName,
                status: 0,
                playerId:1},
            2:null,
            3:null,
            4:null,
        }
        this.roomStatus = 0
        this.playerCount = 1
        this.game = null
    }

    addPlayer(playerName){
        this.playerCount ++
        this.players[this.playerCount] = {
            nickname:playerName,
            status:0,
            playerId:this.playerCount
        }
    }

    
}