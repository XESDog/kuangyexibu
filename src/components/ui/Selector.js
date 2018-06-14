import {Container, Graphics,Sprite,Texture} from 'pixi.js';
import Button from "./Button";
import Box from "./Box";
import {BOX_SELECTED, MyEvent, RESET, SUBMIT} from "../MyEvent";
import DragBoxEvent from "../type/DragBoxEvent";
import {TweenLite} from 'gsap';

export default class Selector extends Container {
  constructor(resources) {
    super();

    this.table = new PIXI.Sprite(resources.table.texture);
    this.submit = new Button(resources.submit_normal.texture, resources.submit_select.texture)
    this.reset = new Button(resources.reset_normal.texture, resources.reset_select.texture)
    this.boxContainer = new Container();
    this.maskMc = new Graphics();


    this.addChild(this.table);
    this.addChild(this.submit);
    this.addChild(this.reset);
    this.addChild(this.boxContainer);

    this.maskMc.beginFill(0x000000);
    this.maskMc.drawRect(50, 0, this.table.width-100, this.table.height);
    this.maskMc.endFill();
    this.maskMc.y = 865;
    this.addChild(this.maskMc);

    this.boxContainer.mask = this.maskMc;

    this.table.y = 865;
    this.submit.x = 1173;
    this.submit.y = 880;
    this.reset.x = 1173;
    this.reset.y = 980;
    this.x = 100;

    this.currentIndex = 0;//当前指针位置
    this.levelIndex = 0;//关卡
    this.optionCount = 0;//选项总数
    this.liftUpIndex = -1;//当前抬起
    this.boxs = [];//所有box显示对象，一次创建
    this.queue = [];

    this._createEvent();

  }

  init(levelIndex, optionCount) {

    this.boxs.forEach(value => {
      value.destroy();
    });

    this.currentIndex = 0;//当前指针位置
    this.levelIndex = levelIndex;//关卡
    this.optionCount = optionCount;//选项总数
    this.liftUpIndex = -1;//当前抬起
    this.boxs = [];//所有box显示对象，一次创建
    this.queue = [];//队列

    this._createBoxs();
    this._initQueue();
    this._update();
  }

  _createEvent() {
    this.submit.on('pointerdown', () => {
      MyEvent.emit(SUBMIT)
    });
    this.reset.on('pointerdown', () => {
      MyEvent.emit(RESET);
    })
  }

  _initQueue() {
    for (let i = 0; i < this.optionCount; i++) {
      this.queue.push(i);
    }
  }

  _createBoxs() {
    for (let i = 0; i < this.optionCount; i++) {
      let box = new Box(this.levelIndex, i);
      box.y = 900;
      box.x = 130 + 250 * i;
      box.scale.set(0.8, 0.8);
      box.interactive = true;
      box.index = i;
      box.on('pointerdown', (e) => {
        /**
         * 0:关卡
         * 1:箱子编号
         * 2:全局坐标
         * 3:0表示从selector选择箱子，1表示从火车选择箱子
         */
        let dragBoxEvent = new DragBoxEvent();
        dragBoxEvent.boxIndex = box.index;
        dragBoxEvent.boxPosition = e.data.global;
        dragBoxEvent.from = DragBoxEvent.FROM_SELECTOR;
        MyEvent.emit(BOX_SELECTED, dragBoxEvent);
      });
      this.boxs.push(box);
    }
  }

  liftUp(index) {
    this.liftUpIndex = index;
    this._update3();
  }

  remove(index) {
    let i = this.queue.indexOf(index);
    if (i !== -1) this.queue.splice(i, 1);
    this._update();
  }

  add(index) {
    let i = this.queue.indexOf(index);
    if (i === -1) this.queue.unshift(index);
    this._update2();
  }

  _update3() {

    let len = this.queue.length >= 4 ? 4 : this.queue.length;
    for (let i = 0; i < len; i++) {
      let index = this.queue[i];
      let box = this.boxs[index];
      if (this.liftUpIndex === index) {
        box.visible = false;
      } else {
        box.visible = true;
      }
    }

  }

  _update2() {
    this.boxs.forEach(value => {
      value.visible = false;
      if (value.parent) value.parent.removeChild(value);
    });
    let len = this.queue.length >= 4 ? 4 : this.queue.length;
    for (let i = 0; i < len; i++) {
      let index = this.queue[i];
      let box = this.boxs[index];
      box.interaction = false;

      if (i === 0) {
        box.alpha = 0.2;
        box.x = 130;
        TweenLite.to(box, 1, {
          alpha: 1, onComplete: () => {
            box.interaction = true;
          }
        })
      } else {
        TweenLite.to(box, 0.5, {
          x: 130 + 250 * i, onComplete: () => {
            box.interaction = true;
          }
        });
      }
      if (this.liftUpIndex === index) {
        box.visible = false;
      } else {
        box.visible = true;
      }
      this.boxContainer.addChild(box)
    }
  }

  _update() {
    this.boxs.forEach(value => {
      value.visible = false;
      if (value.parent) value.parent.removeChild(value);
    });
    let len = this.queue.length >= 4 ? 4 : this.queue.length;
    for (let i = 0; i < len; i++) {
      let index = this.queue[i];
      let box = this.boxs[index];
      box.interaction = false;
      TweenLite.to(box, 0.5, {
        x: 130 + 250 * i, onComplete: () => {
          box.interaction = true;
        }
      });
      box.visible = true;
      this.boxContainer.addChild(box)
    }
  }
}
