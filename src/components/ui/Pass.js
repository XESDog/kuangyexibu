import {Container, Sprite, Text} from 'pixi.js';
import Button from "./Button";
import {
  CLOSE_PNG,
  ENDSCREEN_END_NORMAL_PNG,
  ENDSCREEN_END_SELECT_PNG,
  ENDSCREEN_ENDSCREEN1_JPG,
  ENDSCREEN_ENDSCREEN2_JPG
} from "../RES";
import {CLOSE, levelEvent, REPLAY} from "../Event";


export default class Pass extends Container {
  constructor(state) {
    super();
    this.state = state;
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
      levelEvent.emit(REPLAY);
    });

    this.closeBtn = new Button(CLOSE_PNG, CLOSE_PNG);


    this.addChild(this.bg);
    this.addChild(this.btn);
    this.addChild(this.successTxt);
    this.addChild(this.totalTxt);
    this.addChild(this.closeBtn);

    this.closeBtn.x = 980;
    this.closeBtn.y = 350;
    this.closeBtn.on('pointerdown',()=>{
      levelEvent.emit(CLOSE);
    })

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
