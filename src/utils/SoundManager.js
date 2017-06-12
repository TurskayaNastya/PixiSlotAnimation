import Sound from 'pixi-sound';

let SoundManager = {};

SoundManager.resources = {};
SoundManager.setResources = function (resources){
    SoundManager.resources = resources;
}

SoundManager.sounds = [];
SoundManager.play = function(sound){
    SoundManager.sounds.push(SoundManager.resources[sound].sound);
    SoundManager.resources[sound].sound.play();
}

SoundManager.stopAll = function(){
    SoundManager.sounds.forEach(sound => sound.stop());
}

SoundManager.stop = function(sound){
    SoundManager.resources[sound].sound.stop();
}

export {SoundManager};
