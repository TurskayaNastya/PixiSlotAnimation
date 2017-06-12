import PIXI from 'pixi.js';
import Reel from './Reel.js';
import config  from '../config';
import Button from './Button.js';
import {SoundManager} from '../utils/SoundManager.js';

export default class SlotsMachine extends PIXI.Container {

    constructor(gameData, resources) {
        super();

        const HOR_REEL_OFFSET = 10;

        let width = (config.symbWidth + HOR_REEL_OFFSET) * config.reelsAmount + 2 * HOR_REEL_OFFSET;
        let height = config.symbHeight * config.symbolsAmount;

        let reelsContainer = new PIXI.Container();
        let bg = new  PIXI.extras.TilingSprite(
            resources['bg'].texture,
            width,
            height);

        reelsContainer.addChild(bg);

        let reelsData = gameData;
        this.reels = [];

        for (let i = 0, length = reelsData.length; i < length; i++) {
            let reel = new Reel(reelsData[i], resources);

            reel.position.x = HOR_REEL_OFFSET + i * (reel.width + HOR_REEL_OFFSET);
            reel.position.y = 0;
            this.reels.push(reel);

            reelsContainer.addChild(reel);
        }

        reelsContainer.mask = this.createMaskObject(0, 0, width, height);
        this.addChild(reelsContainer);

        let overlay = new PIXI.Sprite();
        overlay.texture = resources['overlay'].texture;
        overlay.position.set(-30, -30);
        overlay.height = height + 45;
        this.addChild(overlay);

        let clickHandler = function () {
            SoundManager.play("reelSpinSound");
            this.spin();
            this.btn.disable();
        }

        this.btn = new Button(clickHandler.bind(this));
        this.btn.position.x = (this.width - this.btn.width) / 2;
        this.btn.position.y = reelsContainer.y + height + 100;
        this.addChild(this.btn);
    }

    createMaskObject(x, y, w, h){
        var mask = new PIXI.Graphics();
        mask.beginFill(0xFFFFFF);
        mask.drawRoundedRect(x, y, w, h, 15);
        this.addChild(mask);
        return mask;
    }

    spin(){
        if(this.isSpinning) {
            throw(new Error("Cannot start new spin. Already spinning."));
        }
        this.isSpinning = true;

        this.reels.forEach(reel => reel.reelStopped=false);

        for(var i = 0; i < config.reelsAmount; i++){
            setTimeout(
                 this.reels[i].spin.bind(this.reels[i]),
                i * config.reelSpinDelay * 1000
            );
        }
        setTimeout(this.elapseMinSpinDuration.bind(this), config.minSpinDuration * 1000);
    }

    elapseMinSpinDuration(){
        for(var i = 0; i < config.reelsAmount; i++){
            this.reels[i].reelStopped = true;
        }
        this.isSpinning = false;
        setTimeout(this.reelStopped.bind(this), 500); //TODO: implement with custom event emitter
    }

    reelStopped(){
        this.btn.enable();
        SoundManager.stop("reelSpinSound");
        SoundManager.play("endSpinSound");
    }
}
