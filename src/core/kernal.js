
const UID = require('util_uid');
const storage = require('core_storage');
const scheduler = require('core_scheduler');

class Kernal {

    // setup everything we need
    constructor(){
        this._init();
    }

    _init(){
        // list of constructors for processes
        this._registered_processes = {};
        
        // load process types from memory
        this._process_types = storage.readJSON('kernal/process_types', {})

        // load last process type id from memory
        let last_ptid = storage.readJSON('kernal/last_ptid', 0);
        // process type identifier
        this._next_ptid = new UID(last_ptid);

        // load types for all of the processes
        this._pid_types = storage.readJSON('kernal/pid_types', {});
        
        // cache of running processes
        this._process_cache = {};

        // load last process id from memory
        let last_ptd = storage.readJSON('kernal/last_ptd', 0);
        // id that we are going to give the next process
        this._next_pid = new UID(last_ptd);
    }

    // run the main loop of the kernal
    run(){
        // TODO: save some memory for dump
        while(Game.cpu.getUsed() < Game.cpu.tickLimit){
            let pid = scheduler.next();
            if(pid === undefined){
                break;
            }
            let process = this.get_process(pid);
            if(process !== undefined){
                try {
                    process.tick()
                }
                catch(err){
                    console.log(err);
                }
            }
        }

        for(let process_id in this._process_cache){
            let process = this._process_cache[process_id];
            let dump = process.dump();
            if(dump !== undefined){
                this.write(`proc/${process_id}`, dump);
            }
        }

        scheduler.close();
        this._close();

        storage.close();
    }

    // get a ptid from a process identifier
    get_process_type(identifier){
        return this._process_types[identifier];
    }

    // register a process type if it doesnt already exist
    register(identifier, process){
        if(this.get_process_type(identifier) === undefined){
            let ptid = this._next_ptid.next();
            this._process_types[identifier] = ptid;
            this._registered_processes[ptid] = process;
        }
        else {
            let ptid = this._process_types[identifier];
            this._registered_processes[ptid] = process;
        }
    }

    // unregister a process type
    unregister(identifier){
        let ptid = this.get_process_type(identifier);
        delete this._registered_processes[ptid];
        delete this._process_types[identifier];
    }

    // create a process and return its id
    create_process(ptid, memory){
        let pid = this._next_pid.next();
        this._pid_types[pid] = [ptid];
        let Process = this._registered_processes[ptid];
        let process = new Process(pid, memory);
        this._process_cache[pid] = process;

        storage.write(`proc/${pid}`, memory);

        scheduler.schedule(pid);

        return pid;
    }

    get_process(pid){
        try {
            let process = this._process_cache[pid];
            if(process === undefined){
                // TODO: try and load process from disk and then cache it
                let memory = storage.read(`proc/${pid}`);
                let ptid = this._pid_types[pid];
                let Process = this._registered_processes[ptid];
                try {
                    process = new Process(pid, memory);
                    this._process_cache[pid] = process;
                }
                catch(err){
                    console.log(err);
                }
            }
            return process;
        }
        catch {
            this._close_process(pid);
        }
    }

    // kill a running process
    kill_process(pid){
        let process = this.get_process(pid);
        process.cleanup();
        this._close_process(process_id);
    }

    // close a process, remove it from the schedualer, and free up the memory it was using
    _close_process(pid){
        delete this._process_cache[pid];
        delete this._pid_types[pid];
        storage.delete(`proc/${pid}`);
        scheduler.remove(pid);
    }

    // save all data to file
    _close(){
        storage.write('kernal/process_types', JSON.stringify(this._process_types));
        storage.write('kernal/last_ptid', JSON.stringify(this._next_ptid.dump()));
        storage.write('kernal/pid_types', JSON.stringify(this._pid_types));
        storage.write('kernal/last_ptd', JSON.stringify(this._next_pid.dump()));
    }
}


module.exports = new Kernal();