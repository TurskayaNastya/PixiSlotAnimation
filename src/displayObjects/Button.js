import PIXI from 'pixi.js';

export default class Button extends PIXI.Sprite {

  constructor(clickHandler) {
    super();

    this.textureButton = PIXI.Texture.fromImage('./assets/btn_spin_normal.png');
    this.textureButtonDown = PIXI.Texture.fromImage('./assets/btn_spin_pressed.png');
    this.textureButtonOver = PIXI.Texture.fromImage('./assets/btn_spin_hover.png');
    this.textureButtonDisable = PIXI.Texture.fromImage('./assets/btn_spin_disable.png');

    this.texture = this.textureButton;
    this.anchor.set(0.5);
    this.interactive = true;
    this.buttonMode = true;

    this.onClick = clickHandler;
    this
      .on('mousedown', this.onButtonDown.bind(this))
      .on('mouseup', this.onButtonUp.bind(this))
      .on('mouseupoutside', this.onButtonUp.bind(this))
      .on('mouseover', this.onButtonOver.bind(this))
      .on('mouseout', this.onButtonOut.bind(this));

    this.enabled = true;

    return this;
  }

  onButtonDown() {
    if (!this.enabled) return;
      this.isDown = true;
      this.texture = this.textureButtonDown;
      this.alpha = 1;
    }

    onButtonUp() {
      if (!this.enabled) return;
      this.isDown = false;
      if (this.isOver) {
        this.texture = this.textureButtonOver;
        this.onClick();
      }
      else {
        this.texture = this.textureButton;
      }
    }

    onButtonOver() {
      if (!this.enabled) return;
      this.isOver = true;
      if (this.isDown) {
        return;
      }
      this.texture = this.textureButtonOver;
    }

    onButtonOut() {
      if (!this.enabled) return;
      this.isOver = false;
      if (this.isDown) {
        return;
      }
      this.texture = this.textureButton;
    }

    disable(){
      this.enabled = false;
      this.texture = this.textureButtonDisable;
    }

    enable(){
      this.enabled = true;
      this.texture = this.textureButton;
    }
}
