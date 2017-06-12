import {Sprite} from 'pixi.js';

export default class Symbol extends Sprite {

    constructor() {
        super();
    }

    updateSymbol(texture) {
        this.texture = texture;
    }
}
