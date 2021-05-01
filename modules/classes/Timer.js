module.exports = class Timer{
    constructor(params) {
        this.sek = 20
        this.interval = setInterval(this.goDown.bind(this),1000)
    }

    goDown(){
        this.sek--
    }
}