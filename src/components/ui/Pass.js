import {Container, Sprite, Text} from 'pixi.js';
import Button from "./Button";
import {
  ENDSCREEN_END_NORMAL_PNG,
  ENDSCREEN_END_SELECT_PNG,
  ENDSCREEN_ENDSCREEN1_JPG,
  ENDSCREEN_ENDSCREEN2_JPG
} from "../RES";


export default class Pass extends Container {
  constructor() {
    super();
    this.btn = new Button(ENDSCREEN_END_NORMAL_PNG,
      ENDSCREEN_END_SELECT_PNG);
    this.bg = new Sprite();
    this.successTxt = new Text("", {
      fontSize: 68,
      fill: 0x678a12
    });
    this.totalTxt = new Text("", {
      fontSize: 68,
      fill: 0xb52535
    });
    this.btn.on('pointerdown', () => {
      window.location.reload();
    });


    this.addChild(this.bg);
    this.addChild(this.btn);
    this.addChild(this.successTxt);
    this.addChild(this.totalTxt);
    this.successTxt.y = this.totalTxt.y = 440;
    this.successTxt.x = 800;
    this.totalTxt.x = 380;
    this.btn.x = 443;
    this.btn.y = 600;
  }

  success() {
    this.bg.texture = ENDSCREEN_ENDSCREEN1_JPG
  }

  fail() {
    this.bg.texture = ENDSCREEN_ENDSCREEN2_JPG
  }

  showResult(rightNum, totalLevel) {
    if (rightNum / totalLevel > 0.5) {
      this.success()
    } else {
      this.fail();
    }

    this.successTxt.text = rightNum;
    this.totalTxt.text = totalLevel
  }
}
