
const shell = require('shell');
const kernal = require('core_kernal');
const RoomManager = require('process_room_manager');

module.exports.loop = () => {
    
    Game.shell = shell;

    kernal.register('room_manager', RoomManager);
    // run the kernal
    kernal.run();

    // if we have extra cpu after execution and it could go over our limit then just dump it into pixels
    if(Game.cpu.bucket > 10000 - Game.cpu.limit){
        Game.cpu.generatePixel();
    }
}