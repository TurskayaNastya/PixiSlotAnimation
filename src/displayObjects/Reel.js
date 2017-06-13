import PIXI from 'pixi.js';
import {TweenLite, Power1, Linear} from 'gsap';
import Symbol from './Symbol.js';
import config  from '../config';

export default class Reel extends PIXI.Container {

    constructor(reelData, resources) {
        super();

        this.reelData = reelData;
        this.resources = resources;
        this.from = 0;
        this.to = config.shiftAmount - 1;

        this.animationSpeed = this.getAnimationSpeed();

        this.createReelCells();
    }

    getDataInRange(from, to) {
        let result = [];

        if (to > from) {
            for (let i = from; i <= to; i++) {
                result.push(this.reelData[i]);
            }
        }else{
            for (let i = from, len = this.reelData.length; i < len; i++) {
                result.push(this.reelData[i]);
            }

            for (let i = 0; i <= to; i++) {
                result.push(this.reelData[i]);
            }
        }

        return result;
    }

    updateRange() {
        this.from += config.shiftAmount;
        if (this.from > this.reelData.length - 1) {
            this.from -= this.reelData.length;
        }

        this.to += config.shiftAmount;
        if (this.to > this.reelData.length - 1) {
            this.to -= this.reelData.length;
        }
    }

    updateTextures() {
        let dataInRange = this.getDataInRange(this.from, this.to);

        for (let i = 0, len = dataInRange.length; i < len; i++) {
            this.spinTrickSymbols[i].updateSymbol(this.resources[`symb${dataInRange[i] + 1}`].texture);
        }
        this.y = 0;
    }

    createReelCells(){
        this.reelHeight = config.symbHeight * config.symbolsAmount;

        var xp = 0;
        var yp = -(config.symbHeight * config.symbolsAmount);

        this.symbolsPosOriginal = [];

        var symbol;

        this.spinTrickSymbols = [];
        for(let i = 0; i < config.symbolsAmount; i++) {
            symbol = new Symbol();
            this.addChild(symbol);
            this.spinTrickSymbols.push(symbol);
            symbol.x = xp;
            symbol.y = yp;
            this.symbolsPosOriginal.push({x: xp, y: yp});
            symbol.updateSymbol(this.resources[`symb${this.reelData[i+config.symbolsAmount]+1}`].texture);
            yp += config.symbHeight;
        }

        this.symbols = [];
        for(let i = 0; i < config.symbolsAmount; i++){
            symbol = new Symbol();
            this.addChild(symbol);
            this.symbols.push(symbol);
            symbol.x = xp;
            symbol.y = yp;
            this.symbolsPosOriginal.push({x: xp, y: yp});
            symbol.updateSymbol(this.resources[`symb${this.reelData[i]+1}`].texture);
            yp += config.symbHeight;
        }
    }

    spin(){
        this.reelStopped = false;
        this.startSpin();
    }

    startSpin(){

        let dataInRange = this.getDataInRange(this.from, this.to);
        this.updateRange();

        for(var i = 0; i < config.symbolsAmount; i++) {
            this.spinTrickSymbols[i].y = this.symbolsPosOriginal[i].y;
            this.symbols[i].y=this.symbolsPosOriginal[i+config.symbolsAmount].y;

            this.symbols[i].updateSymbol(this.resources[`symb${dataInRange[i]+1}`].texture);
        }

        dataInRange = this.getDataInRange(this.from, this.to);
        this.updateRange();
        for(var i = 0; i < config.symbolsAmount; i++) {
            this.spinTrickSymbols[i].updateSymbol(this.resources[`symb${dataInRange[i]+1}`].texture);
        }

        var easeType = Power1.easeIn;
        for(var i = 0; i < config.symbolsAmount; i++){
            TweenLite.to(
                this.spinTrickSymbols[i],
                this.animationSpeed,
                {
                    y: this.spinTrickSymbols[i].y + config.symbHeight * config.symbolsAmount,
                    ease: easeType
                }
            );
            // Tween onComplete callback to be added only to one Symbol.
            var callback = (i === config.symbolsAmount - 1) ? this.continueSpin.bind(this) : null;
            TweenLite.to(
                this.symbols[i],
                this.animationSpeed,
                {
                    y: this.symbols[i].y + config.symbHeight * config.symbolsAmount,
                    ease: easeType,
                    onComplete: callback
                }
            );
        }
    }

    continueSpin(){
        if(this.reelStopped){
            return;
        }
        var offScreenSymbols = this.getOffScreenSymbols();
        var easeType = Linear.easeNone;

        for(var i = 0; i < config.symbolsAmount; i++) {
            this.symbols[i]=this.spinTrickSymbols[i];
            if (offScreenSymbols[i]) {
                this.spinTrickSymbols[i] = offScreenSymbols[i];
                this.spinTrickSymbols[i].y = this.symbolsPosOriginal[i].y;
            }
        }

        this.updateTextures();
        for(var i = 0; i < config.symbolsAmount; i++){
            TweenLite.to(
                this.spinTrickSymbols[i],
                this.animationSpeed,
                {
                    y: this.spinTrickSymbols[i].y + config.symbHeight * config.symbolsAmount,
                    ease: easeType
                }
            );
            // Tween onComplete callback to be added only to one Symbol.
            var callback = (i === config.symbolsAmount - 1) ? this.continueSpin.bind(this) : null;
            TweenLite.to(
                this.symbols[i],
                this.animationSpeed,
                {
                    y: this.symbols[i].y + config.symbHeight * config.symbolsAmount,
                    ease: easeType,
                    onComplete: callback
                }
            );
        }
    }

    getOffScreenSymbols(){
        let offScreenSymbols = [];

        for(let i = 0; i < config.symbolsAmount; i++){
            if(this.spinTrickSymbols[i].y >= this.reelHeight ){
                offScreenSymbols.push(this.spinTrickSymbols[i]);
            }
            if(this.symbols[i].y >= this.reelHeight){
                offScreenSymbols.push(this.symbols[i]);
            }
        }
        return offScreenSymbols;
    }

    getAnimationSpeed(){
        var value = Math.random();
        if (value >= 0.3 && value <= 0.7){
            return value;
        }else if (value < 0.3){
            return 0.3;
        }else{
            return 0.7;
        }
    }

}
