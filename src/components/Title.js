import {Container, Graphics, Text, TextStyle} from 'pixi.js';
import {TimelineMax, TweenLite} from 'gsap';
import {MyEvent, TIME_OVER} from "./MyEvent";

export default class Title extends Container {
  constructor(resources, totalTime, levelInfo) {
    super();
    this.levelInfo = levelInfo;
    this.titleContainer = new Container();
    this.title = new PIXI.Sprite(PIXI.Texture.fromImage('./static/title_text1.png'));
    this.addChild(this.title);
    this.pushhand = new PIXI.Sprite(resources.pushhand.texture);
    this.pushhand.interactive = true;
    this.pushhand.cursor = 'pointer';
    this.addChild(this.pushhand);
    this.pushhand.x = 1358;
    this.pushhand.y = -80;
    this.timesign = new PIXI.Sprite(resources.timesign.texture);
    this.addChild(this.timesign);
    this.timesign.x = 1598;
    this.totalTime = totalTime;
    this.remaindTime = totalTime;
    this.timeTxt = new Text(this.remaindTime, new TextStyle({
      fontSize: 60,
      fill: '0xfed055'
    }));
    this.addChild(this.timeTxt);
    this.timeTxt.x = 1750;
    this.timeTxt.y = 40;

    this.titleContainer.addChild(this.title);
    this.addChild(this.titleContainer);

    this.on('added', () => {
      TweenLite.to(this.titleContainer, 1, {y: -500, delay: 5});
    })

    this.pushhand.on('click', () => {
      var tl = new TimelineMax();
      tl.add(TweenLite.to(this.titleContainer, 1, {y: 0}))
      tl.add(TweenLite.to(this.titleContainer, 1, {y: -500, delay: 5}));
    })

    let ticker = PIXI.ticker.shared;
    this.passedTime = 0;
    this.stopTick = false;
    let self = this;
    ticker.add((time) => {
      if (this.stopTick) return;
      self.passedTime += time;
      if (self.passedTime > 60) {
        self.remaindTime--;
        if (self.remaindTime <= 0) {
          self.stopTick = true;
          MyEvent.emit(TIME_OVER);

        } else {
          self.passedTime = 0;
        }
        self.timeTxt.text = self.remaindTime;
      }
    })

    this.createDot();
  }

  init(levelIndex) {
    this.title.texture = PIXI.Texture.fromImage('./static/title_text' + levelIndex + '.png');
  }


  resetTicker() {
    this.remaindTime = this.totalTime;
    this.stopTick = false;
    this.passedTime = 0;
    this.timeTxt.text = this.remaindTime;
  }

  createDot() {
    let total = this.levelInfo.questions.length;
    for (var i = 0; i < total; i++) {
      let dot = new Dot(i + 1);
      dot.x = 500 + 100 * i;
      dot.y = 150;
      dot.name = 'dot' + i;
      this.titleContainer.addChild(dot);
    }
  }

  changeDotState(index, state) {
    let dot = this.titleContainer.getChildByName('dot' + index);
    dot.changeState(state);
  }
}

class Dot extends Container {
  constructor(index) {
    super();
    this.circle = new Graphics();
    this.addChild(this.circle);
    this.changeState(0);
    this.txt = new Text();
    this.txt.anchor.set(0.5, 0.5);
    this.addChild(this.txt)
    this.txt.text = index;
  }

  /**
   * 0:未答
   * 1:答对
   * 2:打错
   */
  changeState(state) {

    switch (state) {
      case 0:
        this.circle.clear();
        this.circle.beginFill(0xffffff);
        this.circle.drawCircle(0, 0, 30);
        this.circle.endFill();
        break;
      case 1:
        this.circle.clear();
        this.circle.beginFill(0x00ff00);
        this.circle.drawCircle(0, 0, 30);
        this.circle.endFill();
        break;
      case 2:
        this.circle.clear();
        this.circle.beginFill(0xff0000);
        this.circle.drawCircle(0, 0, 30);
        this.circle.endFill();
        break;
    }
  }
}
