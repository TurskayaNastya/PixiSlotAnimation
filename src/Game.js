import PIXI from 'pixi.js';

export default class Game {
  constructor(config) {
    const Renderer = (config.webgl) ? PIXI.autoDetectRenderer : PIXI.CanvasRenderer;
    this.renderer = new Renderer(config.width || 800, config.height || 600, config.rendererOptions);
    document.body.appendChild(this.renderer.view);
    this.stage = new PIXI.Container();
    this.stage.interactive = true;
    this.animate.bind(this)
    this.animate();
  }

  animate() {
    this.renderer.render(this.stage);
    requestAnimationFrame(this.animate.bind(this));
  }
}