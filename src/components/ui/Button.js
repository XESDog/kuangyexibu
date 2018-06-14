import {Sprite} from 'pixi.js';
import {CLICK, MyEvent} from "../MyEvent";

export default class Button extends Sprite {
  constructor(normal, select) {
    super();
    // this.cursor = 'pointer';
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
    // this.on('mousedown', () => {
    //   MyEvent.emit(CLICK);
    // })
  }
}
