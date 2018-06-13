import {Container, Graphics, Text, TextStyle} from 'pixi.js';
import {TimelineMax, TweenLite} from 'gsap';
import {MyEvent, TIME_OVER} from "./MyEvent";

export default class Title extends Container {
  constructor(resources, totalTime, levelInfo) {
    super();

    this.resources = resources;
    this.levelInfo = levelInfo;
    this.titleContainer = new Container();
    this.title = new PIXI.Sprite();
    this.title.x = 100;

    this.pushhand = new PIXI.Sprite(resources.pushhand.texture);
    this.pushhand.interactive = true;
    // this.pushhand.cursor = 'pointer';
    this.pushhand.anchor.set(0.5, 0);
    this.pushhand.x = 1428;
    this.pushhand.y = -80;

    this.timesign = new PIXI.Sprite(resources.timesign.texture);

    this.addChild(this.pushhand);
    this.addChild(this.timesign);

    this.timesign.x = 1580;
    this.totalTime = totalTime;
    this.remaindTime = totalTime;
    this.timeTxt = new Text(this.remaindTime, new TextStyle({
      fontSize: 60,
      fill: '0xfed055',
      align: 'center'
    }));

    this.addChild(this.timeTxt);
    this.timeTxt.x = 1720;
    this.timeTxt.y = 40;
    this.tl = null;
    this.isTween = false;

    this.titleContainer.y = -500;
    this.addChild(this.titleContainer);
    this.titleContainer.addChild(this.title);

    this.pushhand.on('click', () => {
      this.showTitle();
    });

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
    });

    this.createDot();
  }

  init(levelIndex) {
    this.title.texture = this.resources['title' + (levelIndex + 1)].texture;
    this.showTitle();
  }

  showTitle() {
    if (!this.isTween) {
      this.isTween = true;
      this.tl = new TimelineMax();
      this.tl.add(TweenLite.to(this.titleContainer, 1, {y: 0}));
      this.tl.add(TweenLite.to(this.titleContainer, 1, {
        y: -500, delay: 3, onComplete: () => {
          this.isTween = false;
        }
      }));
    }
  }

  resetTicker() {
    this.remaindTime = this.totalTime;
    this.stopTick = false;
    this.passedTime = 0;
    this.timeTxt.text = this.remaindTime;
  }

  stopTicker() {
    this.stopTick = true;
  }

  createDot() {
    let total = this.levelInfo.questions.length;
    for (var i = 0; i < total; i++) {
      let dot = new Dot(i + 1);
      dot.x = 400 + 70 * i;
      dot.y = 170;
      dot.name = 'dot' + i;
      this.titleContainer.addChild(dot);
    }
  }

  changeDotState(index, state) {
    let dot = this.titleContainer.getChildByName('dot' + index);
    dot.changeState(state);
  }

  loopSway() {
    const tl = new TimelineMax({repeat: -1});
    tl.to(this.pushhand, 1, {rotation: Math.PI / 10})
      .to(this.pushhand, 2, {rotation: -Math.PI / 10})
      .to(this.pushhand, 2, {rotation: Math.PI / 10})
      .to(this.pushhand, 1, {rotation: 0})
      .to(this.pushhand, 1, {delay: 5})
  }
}

class Dot extends Container {
  constructor(index) {
    super();
    this.circle = new Graphics();
    this.addChild(this.circle);
    this.changeState(0);
    this.txt = new Text("", new TextStyle({
      fill: '0x9f815a',
      fontSize: 32,
      align: 'center'
    }));
    this.txt.anchor.set(0.5, 0.5);
    this.addChild(this.txt);
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
        this.circle.beginFill(0xfdf0d1);
        this.circle.drawCircle(0, 0, 25);
        this.circle.endFill();
        break;
      case 1:
        this.circle.clear();
        this.circle.beginFill(0x53a821);
        this.circle.drawCircle(0, 0, 25);
        this.circle.endFill();
        break;
      case 2:
        this.circle.clear();
        this.circle.beginFill(0xf66248);
        this.circle.drawCircle(0, 0, 25);
        this.circle.endFill();
        break;
    }
  }
}
