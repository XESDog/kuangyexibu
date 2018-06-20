import {Container, Sprite, Text, Texture} from 'pixi.js';
import Button from "./Button";

export default class Pass extends Container {
  constructor(resources) {
    super();

    this.url = './static/endscreen/';
    this.btn = new Button(Texture.fromImage(this.url + 'end_normal.png'),
      Texture.fromImage(this.url + 'end_select.png')
    );
    this.bg = new Sprite();
    this.successTxt = new Text("", {
      fontSize: 68,
      fill: 0x678a12
    });
    this.totalTxt = new Text("", {
      fontSize: 68,
      fill: 0xb52535
    });
    this.btn.on('pointerdown',()=>{
      window.location.reload();
    })


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
    this.bg.texture = Texture.fromImage(this.url + 'endscreen1.jpg');
  }

  fail() {
    this.bg.texture = Texture.fromImage(this.url + 'endscreen2.jpg');
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
