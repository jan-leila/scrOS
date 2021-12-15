
class UID {
    // TODO: make id's store in a more utf-8 dence format
    constructor(last_id = 0){
        this.last_id = last_id;
    }

    next(){
        return this.last_id++;
    }

    dump(){
        return this.last_id;
    }
}

module.exports = UID;