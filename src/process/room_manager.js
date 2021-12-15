
const Process = require('lib_process');

class RoomManager extends Process {
    constructor(pid, memory){
        super(pid, memory);
        this.memory = JSON.parse(this._memory);
    }

    tick(){
        // console.log("test?");
    }
}

module.exports = RoomManager;