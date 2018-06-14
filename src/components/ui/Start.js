import {Container} from 'pixi.js';
import Button from "./Button";
import {MyEvent, START_GAME} from "../MyEvent";

export default class Start extends Container {
  constructor(resources) {
    super();
    this.addChild(new PIXI.Sprite(resources.start_game.texture));
    const btn = new Button(resources.btn_normal.texture, resources.btn_select.texture)
    btn.on('pointerdown', () => {
      MyEvent.emit(START_GAME);
    });
    this.addChild(btn);
    btn.x = 1920 - btn.width>>1;
    btn.y = 1080 - 300;
  }
}
