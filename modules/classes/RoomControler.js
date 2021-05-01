const CreateRoom = require("./CreateRoom")

module.exports = class RoomManipulation extends CreateRoom{
    constructor(playerName){
        super(playerName)
    }
    getPlayers(){
        return this.players
    }
    getId(){
        return this.roomId
    }
    changePlayerStatus(playerId,status){
        this.players[`${playerId}`].status = status
    }
}