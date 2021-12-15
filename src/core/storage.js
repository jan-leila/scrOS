
class Storage {
    constructor(){
        this.wrote = false;
        let mem = RawMemory.segments[0] || "{}";
        this.memory = JSON.parse(mem);
    }

    readJSON(path, _default){
        let data = this.read(path);

        try {
            return JSON.parse(data);
        }
        catch {
            this.write(path, JSON.stringify(_default));
            return _default;
        }
    }

    // read a target file
    read(path){
        let sections = path.split('/');

        let head = this.memory;
        let section;
        while(head !== undefined && (section = sections.shift()) !== undefined){
            head = head[section];
        }
        return head;
    }

    // write to a target file creating its directory if needed
    write(path, data){
        let sections = path.split('/');

        let file = sections.pop();

        let head = this.memory;
        let section;
        while(head !== undefined && (section = sections.shift()) !== undefined){
            if(head[section] === undefined){
                head[section] = {};
            }
            head = head[section];
        }

        if(head[file] !== data){
            head[file] = data;
            this.wrote = true;
        }
    }

    delete(path){
        if(path === ''){
            this.memory = {};
            this.wrote = true;
            return;
        }

        let sections = path.split('/');

        let file = sections.pop();

        let head = this.memory;
        let section;

        while(head !== undefined && (section = sections.shift()) !== undefined){
            // if we cant find the file then we are all good
            if(head[section] === undefined){
                return;
            }
            head = head[section];
        }

        delete head[file];
        this.wrote = true;
    }

    close(){
        if(this.wrote){
            RawMemory.segments[0] = JSON.stringify(this.memory);
        }
    };
}

module.exports = new Storage();