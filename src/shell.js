
const kernal = require('core_kernal');
const storage = require('core_storage');
const scheduler = require('core_scheduler');

module.exports = {
    run(identifier, memory){
        let ptid = kernal.get_process_type(identifier);
        if(memory !== undefined){
            memory = JSON.stringify(memory);
        }
        return kernal.create_process(ptid, memory);
    },
    dump(){
        return RawMemory.segments[0];
    },
    reset(){
        storage.delete('');
        scheduler._init();
        kernal._init();
        console.log(0);
    }
};