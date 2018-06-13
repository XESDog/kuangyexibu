import {Container, Sprite, Texture} from 'pixi.js';

export default class Box extends Container {
  constructor(level, index, anchorX = 0, anchorY = 0) {
    super();
    let option = new Sprite(Texture.fromImage('./static/options/' + (level + 1) + '/box_imgs' + (index + 1) + '.png'))
    let box = new Sprite(Texture.fromImage('./static/box.png'));
    box.anchor.set(anchorX, anchorY);
    option.anchor.set(anchorX, anchorY);
    this.addChild(box);
    this.addChild(option);
  }
}
