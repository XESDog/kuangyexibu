import {Container} from 'pixi.js';
import {createSprite, getTexture} from "../resource";
import {BOX_PNG} from "../RES";


let _boxs = [];
let _batchCount = 10;

function createBatchBox() {
  let i = 0;
  while (i < _batchCount) {
    _boxs.push(new Box(0, 0, 0, 0));
    i++;
  }
}

export default class Box extends Container {

  static create(x = 0, y = 0, angle = 0, anchorX, anchorY, levelIndex, boxIndex) {
    let b = this.getBox();
    b.x = x;
    b.y = y;
    b.rotation = angle;
    b.changeOption(levelIndex, boxIndex);
    b.setAnchor(anchorX, anchorY);
    return b;
  }

  static getBox() {
    if (_boxs.length <= 0) {
      createBatchBox();
    }
    return _boxs.shift();
  }

  static recycleBox(box) {
    box.x = 0;
    box.y = 0;
    box.scale.set(1, 1);
    box.setAnchor(0, 0);
    _boxs.push(box);
  }

  constructor(level, index, anchorX = 0, anchorY = 0) {
    super();

    this.option = createSprite(getTexture(`options_${level + 1}_${index + 1}_png`));
    this.box = createSprite(BOX_PNG);
    this.setAnchor(anchorX, anchorY);

    this.addChild(this.box);
    this.addChild(this.option);
  }

  changeOption(level, index) {
    this.option.texture = getTexture(`options_${level + 1}_${index + 1}_png`);
  }

  setAnchor(anchorX, anchorY) {
    this.box.anchor.set(anchorX, anchorY);
    this.option.anchor.set(anchorX, anchorY);
  }
}
