import {Container} from 'pixi.js';

export default class Pass extends Container {
  constructor(resources) {
    super();
    // this.light = new PIXI.Sprite(resources.jump_light.texture);
    // this.addChild(this.light);
    this.bg = new PIXI.Graphics;
    this.bg.beginFill(0x000000);
    this.bg.drawRect(0, 0, 1920, 1080);
    this.bg.endFill();
    this.bg.alpha = 0.8;
    this.addChild(this.bg);
    this.addChild(new PIXI.Sprite(resources.jump_img.texture));
  }
}
