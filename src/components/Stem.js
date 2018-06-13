import {Container, Text, TextStyle} from 'pixi.js'

export default class Stem extends Container {
  constructor() {
    super();
    this.textStyle = new TextStyle(new TextStyle({
      fontSize: 60,
      fill: '0xE04B27'
    }))
    this.txt1 = new Text("", this.textStyle);
    this.txt2 = new Text("", this.textStyle);
    this.txt3 = new Text("", this.textStyle);
    this.addChild(this.txt1);
    this.addChild(this.txt2);
    this.addChild(this.txt3);
    this.txt1.text = 'a';
    this.txt2.text = 'a';
    this.txt3.text = 'a';
    this.txt1.x = 280;
    this.txt1.y = 220;
    this.txt2.x = 800;
    this.txt2.y = 220;
    this.txt3.x = 1360;
    this.txt3.y = 220;
  }

  initLevel(stem) {
    var stems = stem.split(',');
    this.txt1.text = stems[0];
    this.txt2.text = stems[1];
    this.txt3.text = stems[2];
  }
}
