import {Container} from 'pixi.js'
import {DRAG_MOVE, dragEvent, END_DRAG, START_DRAG} from "../Event";

class DragContainer extends Container {
  _icon = null;

  constructor() {
    super();

    dragEvent.on(START_DRAG, this._onStartDrag = (data) => {
      if (data && data.icon) {
        this._icon = data.icon;
        this.addChild(this._icon);
        this._icon.x = data.x;
        this._icon.y = data.y;
      }
    });
    dragEvent.on(DRAG_MOVE, this._onDragMove = (p) => {
      this._icon.x = p.x;
      this._icon.y = p.y;
    });
    dragEvent.on(END_DRAG, this._onEndDrag = (data) => {
      this.removeChild(this._icon);
    });
  }

  destroy() {
    dragEvent.off(START_DRAG, this._onStartDrag)
    dragEvent.off(DRAG_MOVE, this._onDragMove)
    dragEvent.off(END_DRAG, this._onEndDrag)
    super.destroy()
  }
}

export {DragContainer}
