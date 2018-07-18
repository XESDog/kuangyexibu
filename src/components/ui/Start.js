import {Container} from 'pixi.js';
import Button from "./Button";
import {appEvent, GAME_START} from "../Event";
import {createSprite} from "../resource";
import {START_NORMAL_PNG, START_SELECT_PNG, STARTSCREEN_JPG} from "../RES";

export default class Start extends Container {
  constructor() {
    super();
    this.addChild(createSprite(STARTSCREEN_JPG));
    this.btn = new Button(START_NORMAL_PNG, START_SELECT_PNG);
    this.btn.on('pointerdown', () => {
      appEvent.emit(GAME_START);
    });
    this.addChild(this.btn);
    this.btn.x = 1920 - this.btn.width >> 1;
    this.btn.y = 1080 - 300;
  }
}
