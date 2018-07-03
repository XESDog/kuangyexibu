import {Sprite} from 'pixi.js';

export default class Button extends Sprite {
  constructor(normal, select) {
    super();
    this.normal = normal;
    this.select = select;
    this.texture = this.normal;
    this.interactive = true;
    this.on('pointerover', () => {
      this.texture = this.select;
    });
    this.on('pointerout', () => {
      this.texture = this.normal;
    })
  }
}
