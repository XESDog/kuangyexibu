import {Container} from 'pixi.js'
import {DRAG_MOVE, dragEvent, END_DRAG, START_DRAG} from "../Event";

class DragContainer extends Container {
  _icon = null;

  constructor() {
    super();
    dragEvent.on(START_DRAG, (data) => {
      if (data && data.icon) {
        this._icon = data.icon;
        this.addChild(this._icon);
      }
    });
    dragEvent.on(DRAG_MOVE, (p) => {
      this._icon.x = p.x;
      this._icon.y = p.y;
    });
    dragEvent.on(END_DRAG, (data) => {
      this.removeChild(this._icon);
      this._icon = null;
    });
  }
}

export {DragContainer}
