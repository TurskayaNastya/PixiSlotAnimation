import plugins from './plugins';
import config  from './config';
import Game from './Game';
import SlotsMachine from './displayObjects/SlotsMachine.js';
import {DataStorage} from './DataStorage';
import {SoundManager} from './utils/SoundManager.js';
import PIXI from 'pixi.js';

let game = new Game(config);

let loader = new PIXI.loaders.Loader();

loader.add('symb1', './assets/01.png');
loader.add('symb2', './assets/02.png');
loader.add('symb3', './assets/03.png');
loader.add('symb4', './assets/04.png');
loader.add('symb5', './assets/05.png');
loader.add('symb6', './assets/06.png');
loader.add('symb7', './assets/07.png');
loader.add('symb8', './assets/08.png');
loader.add('symb9', './assets/09.png');
loader.add('symb10', './assets/10.png');
loader.add('symb11', './assets/11.png');
loader.add('symb12', './assets/12.png');
loader.add('symb13', './assets/13.png');
loader.add('overlay', './assets/slotOverlay.png');
loader.add('bg', './assets/slotBackground.jpg');
loader.add('reelSpinSound', './assets/Reel_Spin.mp3');
loader.add('endSpinSound', './assets/Landing_1.mp3');

loader.once('complete',onAssetsLoaded);

loader.load();

function onAssetsLoaded(loader, resources) {

    let gameData = DataStorage.generateReels(config.reelsAmount, config.symbolsResourcesAmount);

    let slotsMachine = new SlotsMachine(gameData, resources);
    slotsMachine.position.set(100, 100);
    game.stage.addChild(slotsMachine);

    SoundManager.setResources(resources);
}