import {Container, Text, TextStyle} from 'pixi.js'

export default class Stem extends Container {
  constructor() {
    super();
    this.textStyle = new TextStyle(new TextStyle({
      fontSize: 45,
      fill: '0xf0b416',
      align: 'center'
    }));
    this.txt1 = new Text("", this.textStyle);
    this.txt2 = new Text("", this.textStyle);
    this.txt3 = new Text("", this.textStyle);
    this.addChild(this.txt1);
    this.addChild(this.txt2);
    this.addChild(this.txt3);

    this.txt1.anchor.set(0.5, 0.5);
    this.txt2.anchor.set(0.5, 0.5);
    this.txt3.anchor.set(0.5, 0.5);

    this.txt1.x = 280 + 100;
    this.txt2.x = 820 + 100;
    this.txt3.x = 1360 + 100;
    this.txt1.y = 250;
    this.txt2.y = 250;
    this.txt3.y = 250;
  }

  update(stem) {
    var stems = stem.split(',');
    this.txt1.text = stems[0];
    this.txt2.text = stems[1];
    this.txt3.text = stems[2];
  }
}
