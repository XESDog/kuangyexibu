import {Container} from 'pixi.js';
import {createSprite} from "../resource";
import {BACKGROUND_PNG} from "../RES";

export default class BackGround extends Container {
  constructor() {
    super();
    this.isPlaying=false;
    this.pool = [createSprite(BACKGROUND_PNG), createSprite(BACKGROUND_PNG)];
    this.speed = 10;
    this.viewPortWidth = 1920;
    this.textureWidth = this.pool[0].width-2;//这里减了2像素，不然会有一点缝隙
    this.addChild(this.pool[0]);
    this.addChild(this.pool[1]);
    this.pool[0].x = -this.textureWidth - 100;
    this.pool[1].x = -100;

    this._ticker = this._createTicker();

    this.on('added', () => {
      this._createTicker()
    });
  }

  _createTicker() {
    let ticker = new PIXI.ticker.Ticker();
    ticker.stop();
    ticker.add(() => {
      if(!this.isPlaying)return;
      this.pool[0].x += this.speed;
      this.pool[1].x += this.speed;
      if (this.pool[0].x >= this.viewPortWidth + 100) {
        this.pool[0].x -= this.textureWidth * 2;
      }
      if (this.pool[1].x >= this.viewPortWidth + 100) {
        this.pool[1].x -= this.textureWidth * 2;
      }
    });
    this.isPlaying=true;
    ticker.start();
    return ticker;
  }

  play(){
    this.isPlaying=true;
  }
  stop(){
    this.isPlaying=false;
  }

  _destroyTicker() {
    this._ticker.stop();
    this._ticker.destroy();
  }
  destroy(){
    this._destroyTicker();
    super.destroy()
  }
}
