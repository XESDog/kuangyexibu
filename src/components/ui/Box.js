import {Container} from 'pixi.js';
import {createSprite, getTexture} from "../resource";
import {BOX_PNG} from "../RES";

export default class Box extends Container {
  constructor(level, index, anchorX = 0, anchorY = 0) {
    super();

    let option = createSprite(getTexture(`options_${level + 1}_${index + 1}_png`));
    let box = createSprite(BOX_PNG);
    box.anchor.set(anchorX, anchorY);
    option.anchor.set(anchorX, anchorY);

    this.addChild(box);
    this.addChild(option);
  }
}
