module.exports = class Pawn{
    constructor(pawnId,baseDiv,playerId) {
        this.playerId = playerId
        this.home = true
        this.moved = 0
        this.canMove = false
        this.pawnId = pawnId
        this.divClassFromHome = baseDiv
        this.currentDiv = null
        this.color = this.determineColor()
    }
    //wersja naiwna
    canIMove(thrownNumber){
        if(thrownNumber == 1 || thrownNumber == 6 ){
            if(this.home){
                return {legalMove: "fromHome", start:this.divClassFromHome,color:this.color,pawnId:this.pawnId}
            }
            else{
                return {legalMove: this.moved + thrownNumber}
            }
        }
        else if(this.home && (thrownNumber != 1 || thrownNumber != 6)){
            return false
        }
        else{
            return {legalMove: this.moved + thrownNumber}
        }
    }

    determineColor() {
        switch (this.playerId) {
            case 1:
                return "r"
            case 2:
                return "b"
            case 3:
                return "g"
            case 4:
                return "y"
        }
    }
    
    updatePosition(howToMove){
        if(howToMove.legalMove == "fromHome"){
            this.currentDiv = this.divClassFromHome
        }
        else{
            let helper = parseInt(this.currentDiv.substring(1))

            console.log(helper);
        }
    }
}