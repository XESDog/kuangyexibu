import {Container, Graphics} from 'pixi.js';
import Button from "./Button";
import Box from "./Box";
import DragBoxEvent from "../type/DragBoxEvent";
import {createSprite} from "../resource";
import * as RES from "../RES";
import {DragManager} from "../manager/DragManager";
import {dragEvent, END_DRAG, LEVEL_PASS, levelEvent, RESET, storeEvent, SUBMIT, USER_ANSWERS} from "../Event";

export default class Selector extends Container {

  constructor(state) {
    super();

    this.state = state;
    this.table = createSprite(RES.SELECTOR_TABLE_PNG);
    this.submit = new Button(RES.SELECTOR_SUBMIT_NORMAL_PNG, RES.SELECTOR_SUBMIT_SELECT_PNG);
    this.reset = new Button(RES.SELECTOR_RESET_NORMAL_PNG, RES.SELECTOR_RESET_SELECT_PNG);
    this.boxContainer = new Container();
    this.maskMc = new Graphics();


    this.addChild(this.table);
    this.addChild(this.submit);
    this.addChild(this.reset);
    this.addChild(this.boxContainer);

    this.maskMc.beginFill(0x000000);
    this.maskMc.drawRect(50, 0, this.table.width - 100, this.table.height);
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

    this._createEvent();

    storeEvent.on(USER_ANSWERS, this._update, this);

  }

  _clearBox() {
    this.boxs.forEach(value => {
      DragManager.instance.unregister(value);
      value.destroy();
    });
    this.boxs = [];
  }

  init(levelIndex, optionCount) {
    this._clearBox();

    this.currentIndex = 0;//当前指针位置
    this.levelIndex = levelIndex;//关卡
    this.optionCount = optionCount;//选项总数
    this.liftUpIndex = -1;//当前抬起
    this.boxs = [];//所有box显示对象，一次创建
    this.queue = [];//队列

    this._update();
  }

  _createEvent() {
    this.submit.on('pointerdown', () => {
      levelEvent.emit(LEVEL_PASS)
    });
    this.reset.on('pointerdown', () => {
      levelEvent.emit(RESET)
    })
  }

  _createBox(index) {
    let box = Box.getBox();
    let dragBoxEvent = DragBoxEvent.create(this.levelIndex, index, DragBoxEvent.FROM_SELECTOR);
    box.y = 900;
    box.scale.set(0.8, 0.8);
    box.interactive = true;
    box.index = index;
    box.changeOption(this.levelIndex, index);

    this.boxs.push(box);
    DragManager.instance.register(box, dragBoxEvent);

    box.on('pointerdown', () => {
      box.alpha = 0.5;

      dragEvent.on(END_DRAG, onEndDrag);

      function onEndDrag() {
        box.alpha = 1;
        dragEvent.off(END_DRAG, onEndDrag);
      }
    });
    return box;
  }


  _update() {

    this._clearBox();

    let queue = this.state.userAnswers[3];
    let len = queue.length >= 4 ? 4 : queue.length;
    for (let i = 0; i < len; i++) {
      let index = queue[i];
      let box = this._createBox(index);
      box.x = 130 + 250 * i;
      this.boxContainer.addChild(box)
    }
  }
}
