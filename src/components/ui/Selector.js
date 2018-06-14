import {Container} from 'pixi.js';
import Button from "./Button";
import Box from "./Box";
import {BOX_SELECTED, MyEvent, RESET, SUBMIT} from "../MyEvent";
import DragBoxEvent from "../type/DragBoxEvent";

export default class Selector extends Container {
  constructor(resources) {
    super();

    this.table = new PIXI.Sprite(resources.table.texture);
    this.submit = new Button(resources.submit_normal.texture, resources.submit_select.texture)
    this.reset = new Button(resources.reset_normal.texture, resources.reset_select.texture)
    this.addChild(this.table);
    this.addChild(this.submit);
    this.addChild(this.reset);
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

    this._createEvent();
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
        console.log(box.index);
      });
      this.boxs.push(box);
    }
  }

  liftUp(index) {
    this.liftUpIndex = index;
    this._update();
  }

  remove(index) {
    let i = this.queue.indexOf(index);
    if (i !== -1) this.queue.splice(i, 1);
    console.log(this.queue);
    this._update();
  }

  add(index) {
    let i = this.queue.indexOf(index)
    if (i === -1) this.queue.unshift(index);
    console.log(this.queue);
    this._update();
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
      box.x = 130 + 250 * i;
      if (this.liftUpIndex === index) {
        box.visible = false;
      } else {
        box.visible = true;
      }
      this.addChild(box)
    }
  }
}
