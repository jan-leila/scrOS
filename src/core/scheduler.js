
const storage = require('core_storage');

class Scheduler {

    constructor(){
        this._init();
    }

    _init(){
        // load schedualed processes from memory
        this._queue = storage.readJSON('sched/queue', []);

        // load schedualed processes from memory
        this._pointer = storage.readJSON('sched/pointer', 0);
        
        this._pointer_start = this._pointer;
        this._started = false;
    }

    increment(){
        this._pointer++;
        if(this._pointer >= this._queue.length){
            this._pointer = 0;
        }
    }

    // get the next process that we are going to tick
    next(){
        if(this._pointer === this._pointer_start){
            if(this._started){
                return;
            }

            this._started = true;
        }
        
        let next = this._queue[this._pointer];
        this.increment();
        return next;
    }

    schedule(pid){
        this._queue.push(pid);
    }

    // remove a process from the scheduler
    remove(pid){
        let index = this._queue.indexOf(pid);
        if(index === -1){
            return;
        }
        if(index > this._pointer){
            this._pointer--;
            this._pointer_start--;
        }
        this._queue.splice(index, 1);
    }

    close(){
        storage.write('sched/queue', JSON.stringify(this._queue));
        storage.write('sched/pointer', JSON.stringify(this._pointer));
    }
}

module.exports = new Scheduler();