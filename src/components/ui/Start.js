import {Container} from 'pixi.js';
import Button from "./Button";
import {GAME_START, appEvent} from "../Event";
import {createSprite} from "../resource";
import {START_NORMAL_PNG, START_SELECT_PNG, STARTSCREEN_JPG} from "../RES";

export default class Start extends Container {
  constructor() {
    super();
    this.addChild(createSprite(STARTSCREEN_JPG));
    const btn = new Button(START_NORMAL_PNG, START_SELECT_PNG);
    btn.on('pointerdown', () => {
      appEvent.emit(GAME_START);
    });
    this.addChild(btn);
    btn.x = 1920 - btn.width >> 1;
    btn.y = 1080 - 300;
  }
}
