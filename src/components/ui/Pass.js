import {Container, Sprite, Texture} from 'pixi.js';
import {Linear, TimelineMax} from 'gsap';

export default class Pass extends Container {
  constructor(resources) {
    super();

    this.bg = new PIXI.Graphics;
    this.bg.beginFill(0x000000);
    this.bg.drawRect(0, 0, 1920, 1080);
    this.bg.endFill();
    this.bg.alpha = 0.8;
    this.addChild(this.bg);

    let light = new Sprite(Texture.fromImage('./static/jump_light.png'));
    let tl = new TimelineMax({repeat: -1});
    light.anchor.set(0.5, 0.5);
    light.scale.set(3, 3);
    light.x = 1920 >> 1;
    light.y = 400;
    tl.to(light, 20, {rotation: Math.PI * 10, ease: Linear.easeNone});
    this.addChild(light);

    this.addChild(new Sprite(resources.jump_img.texture));
  }
}
