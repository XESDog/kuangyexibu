import {DRAG_MOVE, dragEvent, END_DRAG, START_DRAG} from "../Event";

class DragManager {
  _instance;
  _stage;
  _targets = new Map();
  _isStartDrag = false;//开始拖拽
  _targetData = null;//当前拖拽对象的数据
  _pointerGlobalP = null;//鼠标位置

  constructor(single) {
    if (!!single && single instanceof Single) {

    } else {
      throw new Error('不能创建DragManager实例')
    }
  }

  static get instance() {
    if (this._instance) return this._instance;
    return this._instance = new DragManager(new Single())
  }

  init(stage) {
    this._stage = stage;
    this._stage.on('pointermove', (e) => {
      if (this._isStartDrag&&this._targetData) {
        this._pointerGlobalP = e.data.global;
        dragEvent.emit(DRAG_MOVE, this._pointerGlobalP);
      }
    }, this);
    this._stage.on('pointerup', (e) => {
      if (!this._targetData) return;
      this._targetData.x = e.data.global.x;
      this._targetData.y = e.data.global.y;
      dragEvent.emit(END_DRAG, this._targetData);

      this._isStartDrag = false;
      this._pointerGlobalP = null;
      this._targetData = null;


    }, this)
  }

  register(target, data) {
    this._targets.set(target, data);
    target.on('pointerdown', this._onPointerDown, this)
  }

  _onPointerDown(e) {
    this._isStartDrag = true;
    this._pointerGlobalP = e.data.global;
    this._targetData = this._targets.get(e.target)
    dragEvent.emit(START_DRAG, this._targetData)
  }

  unregister(target) {
    target.off('pointerdown', this._onPointerDown, this);
    this._targets.delete(target);
  }
}

class Single {
}

export {DragManager}
