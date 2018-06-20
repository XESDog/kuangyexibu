import {Container} from 'pixi.js';
import {createSprite} from "../resource";
import {BACKGROUND_PNG} from "../RES";

export default class BackGround extends Container {
  constructor() {
    super();
    this.pool = [createSprite(BACKGROUND_PNG), createSprite(BACKGROUND_PNG)];
    this.speed = 10;
    this.viewPortWidth = 1920;
    this.textureWidth = this.pool[0].width;
    this.addChild(this.pool[0]);
    this.addChild(this.pool[1]);
    this.pool[0].x = -this.textureWidth - 100;
    this.pool[1].x = -100;

    this._ticker = this._createTicker();

    this.on('added', () => {
      this._createTicker()
    });
    this.on('removed', () => {
      this._destroyTicker();
    })
  }

  _createTicker() {
    let ticker = new PIXI.ticker.Ticker();
    ticker.stop();
    ticker.add(() => {
      this.pool[0].x += this.speed;
      this.pool[1].x += this.speed;
      if (this.pool[0].x >= this.viewPortWidth + 100) {
        this.pool[0].x -= this.textureWidth * 2;
      }
      if (this.pool[1].x >= this.viewPortWidth + 100) {
        this.pool[1].x -= this.textureWidth * 2;
      }
    });
    ticker.start();
    return ticker;
  }

  _destroyTicker() {
    this._ticker.destroy();
  }
}
