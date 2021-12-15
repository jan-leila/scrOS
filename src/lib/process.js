
class Process {
    constructor(pid, memory){
        this._pid = pid;
        this._memory = memory;
    }

    // code that gets ran every tick
    tick(){

    }

    // get the data that is going to be stored in memory
    // returns undefined if it didnt change
    dump(){
        
    }

    // 
    cleanup(){

    }
}

module.exports = Process;