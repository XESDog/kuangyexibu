import {Sprite} from 'pixi.js';

export default class Button extends Sprite {
  constructor(normal, select) {
    super();
    this.normal = normal;
    this.select = select;
    this.texture = this.normal;
    this.interactive = true;
    this.on('mouseover', () => {
      this.texture = this.select;
    });
    this.on('mouseout', () => {
      this.texture = this.normal;
    })
  }
}
