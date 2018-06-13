import {Container} from 'pixi.js';
import Button from "./Button";
import Box from "./Box";
import {BOX_SELECTED, MyEvent, SUBMIT} from "./MyEvent";

export default class Selector extends Container {
  constructor(resources) {
    super();

    this.table = new PIXI.Sprite(resources.table.texture);
    this.left = new Button(resources.left_normal.texture, resources.left_select.texture);
    this.right = new Button(resources.right_normal.texture, resources.right_select.texture);
    this.submit = new Button(resources.submit_normal.texture, resources.submit_select.texture)
    this.reset = new Button(resources.reset_normal.texture, resources.reset_select.texture)
    this.addChild(this.table);
    this.addChild(this.left);
    this.addChild(this.right);
    this.addChild(this.submit);
    this.addChild(this.reset);
    this.table.y = 865;
    this.left.x = 24;
    this.left.y = 950;
    this.right.x = 1084;
    this.right.y = 950;
    this.submit.x = 1173;
    this.submit.y = 880;
    this.reset.x = 1173;
    this.reset.y = 980;

    this.x = 200;

    this.currentIndex = 0;//当前指针位置
    this.levelIndex = 0;
    this.totalOption = 0;
    this.boxs = [];
    this.excepts = new Set();

    let self = this;

    this.left.on('pointerdown', () => {
      self.currentIndex -= 4;
      if (self.currentIndex < 0) {
        self.currentIndex = 0;
      }
      self.createPage(self.currentIndex, self.levelIndex, self.totalOption);
      this.refreshBox()
      this.refreshLeftAndRight();
    });
    this.right.on('pointerdown', () => {
      self.currentIndex += 4;
      if (self.currentIndex > self.totalOption - 1) {
        self.currentIndex = self.totalOption - 4;//倒数第四个
      }
      self.createPage(self.currentIndex, self.levelIndex, self.totalOption);
      this.refreshBox()
      this.refreshLeftAndRight();
    })

    this.submit.on('pointerdown', () => {
      MyEvent.emit(SUBMIT)
    })
  }

  addExcept(index) {
    this.excepts.add(index);
    this.refreshBox();
  }

  removeExcept(index) {
    if (this.excepts.has(index)) {
      this.excepts.delete(index);

    }
    this.refreshBox();
  }

  refreshLeftAndRight() {
    if (this.currentIndex <= 0) {
      this.left.visible = false;
    } else {
      this.left.visible = true;
    }
    if (this.totalOption - this.currentIndex <= 4) {
      this.right.visible = false;
    } else {
      this.right.visible = true;
    }
  }

  refreshBox() {
    this.boxs.forEach((box) => {
      if (this.excepts.has(box.index)) {
        box.visible = false;
      } else {
        box.visible = true;
      }
    })
  }

  init(levelIndex, optionCount) {
    this.createPage(0, levelIndex, optionCount)
    this.excepts = new Set();
    this.currentIndex = 0;
    this.refreshLeftAndRight();
    this.refreshBox();
  }

  /**
   *
   * @param currentIndex
   * @param levelIndex
   * @param totalOption
   */
  createPage(currentIndex, levelIndex, totalOption) {
    this.currentIndex = currentIndex;
    this.levelIndex = levelIndex;
    this.totalOption = totalOption;
    {
      let box;
      while (box = this.boxs.shift()) {
        this.removeChild(box);
      }
    }
    for (let i = 0; i < 4; i++) {
      if (currentIndex + i >= totalOption) break;
      let box = new Box(levelIndex, currentIndex + i);
      box.x = 130 + 250 * i;
      box.y = 900;
      box.scale.set(0.8, 0.8);
      box.interactive = true;
      box.index = currentIndex + i;
      box.on('pointerdown', (e) => {
        MyEvent.emit(BOX_SELECTED, [levelIndex, currentIndex + i, e.data.global])
      });
      this.addChild(box);
      this.boxs.push(box);
    }
  }

}
