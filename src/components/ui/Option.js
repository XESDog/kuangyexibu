import {Container} from 'pixi.js';

export default class Option extends Container {
  constructor(resources) {
    super();
    this.box = new PIXI.Sprite(resources.box.texture);
    this.addChild(this.box);
  }
}
