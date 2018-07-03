import {Sprite} from 'pixi.js';
import {HAND_DOWN_PNG, HAND_UP_PNG, SOUND_CLICK_MP3} from "../RES";

export default class MouseCursor extends Sprite {

  constructor() {
    super();
    const self = this;
    this.on('added', () => {
      this.texture = HAND_UP_PNG;
      this.stage.on('pointerdown', e => {
        self.texture = HAND_DOWN_PNG
      })
      this.stage.on('pointermove', e => {
        self.x = e.data.global.x;
        self.y = e.data.global.y
      })
      this.stage.on('pointerup', e => {
        self.texture = HAND_UP_PNG;
        SOUND_CLICK_MP3.play();
      })

    })
  }

  get stage() {
    let p = this.parent;
    let root = null;
    while (p) {
      p = p.parent;
      if (p) root = p;
    }
    return root;
  }
}
