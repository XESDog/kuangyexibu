import {Container, Graphics, Sprite, Text, TextStyle} from 'pixi.js';
import {LEVEL_PASS, levelEvent, TIME_OVER} from "../Event";
import {TITLE_PUSHHAND_PNG, TITLE_TIMESIGN_PNG} from "../RES";
import {getTexture} from "../resource";

export default class Title extends Container {
  static TimeTextStyle = new TextStyle(
    {
      fontSize: 60,
      fill: '0xfed055',
      align: 'center'
    }
  );

  /**
   *
   * @param state
   */
  constructor(state) {
    super();
    this.state = state;
    this.totalLevel = state.totalLevel;
    this.titleContainer = new Container();
    this.title = new Sprite();
    this.title.x = 100;

    this.pushhand = new Sprite(TITLE_PUSHHAND_PNG);
    this.pushhand.interactive = true;
    this.pushhand.anchor.set(0.5, 0);
    this.pushhand.x = 1428;
    this.pushhand.y = -80;

    this.timesign = new Sprite(TITLE_TIMESIGN_PNG);
    this.timesign.x = 1580;

    this._totalTime = state.totalTime;
    this._remaindTime = state.totalTime;

    this.timeTxt = new Text(this._remaindTime, Title.TimeTextStyle);
    this.timeTxt.x = 1670;
    this.timeTxt.y = 40;
    this.timeTxt.text = "00:00";

    this.tl = null;
    this.isTween = false;
    // this.titleContainer.y = -500;

    this._ticker = null;

    this.addChild(this.pushhand);
    this.addChild(this.timesign);
    this.addChild(this.timeTxt);
    this.addChild(this.titleContainer);
    this.titleContainer.addChild(this.title);

    this.pushhand.on('click', () => {
      // this._showTitle();
    });

    this._createDot();

    levelEvent.on(LEVEL_PASS, () => {
      this.timeTxt.text = this._getTime(this._totalTime);
    }, this)

  }

  createTicker() {
    const self = this;
    this._passedTime = 0;
    this._remaindTime = this._totalTime;

    if (this._ticker === null) {
      this._ticker = new PIXI.ticker.Ticker();
      this._ticker.add((time) => {
        self._passedTime += time;
        if (self._passedTime > 60) {
          self._remaindTime--;
          if (self._remaindTime <= 0) {
            levelEvent.emit(TIME_OVER);
          } else {
            self._passedTime = 0;
          }
          this._refreshTimeTxt();
        }
      });

    }
    this._ticker.start();
  }

  destroyTicker() {
    this._ticker.stop();
  }

  _refreshTimeTxt() {
    this.timeTxt.text = this._getTime(this._remaindTime);
  }

  _getTime(time) {
    let minuter = Math.floor(time / 60);
    let second = time % 60;
    minuter = minuter < 10 ? "0" + minuter : minuter;
    second = second < 10 ? "0" + second : second;
    return minuter + ":" + second;

  }

  /**
   * 显示关卡题目
   */
  update() {
    this.title.texture = getTexture(`title_title_${this.state.levelIndex + 1}_png`);
    this.state.isRight.forEach((value, index) => {
      this._changeDotState(index, value ? 1 : 2);
    })
  }

  resetDot() {

    let total = this.totalLevel;
    for (let i = 0; i < total; i++) {
      this._changeDotState(i, 0)
    }
  }

  _createDot() {
    let total = this.totalLevel;
    const offsetX = 400;
    const spaceX = 70;
    const offsetY = 170;
    for (let i = 0; i < total; i++) {
      let dot = new Dot(i + 1);
      dot.x = offsetX + spaceX * i;
      dot.y = offsetY;
      dot.name = 'dot' + i;
      this.titleContainer.addChild(dot);
    }
  }

  _changeDotState(index, state) {
    let dot = this.titleContainer.getChildByName('dot' + index);
    dot.changeState(state);
  }
}

class Dot extends Container {
  static DotTextStyle = new TextStyle({
    fill: '0x9f815a',
    fontSize: 32,
    align: 'center'
  });

  constructor(index) {
    super();
    this.circle = new Graphics();
    this.addChild(this.circle);
    this.changeState(0);
    this.txt = new Text("", Dot.DotTextStyle);
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
