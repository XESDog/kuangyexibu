import {Container} from 'pixi.js';

export default class BackGround extends Container {
  constructor(texture) {
    super();
    this.pool = [new PIXI.Sprite(texture), new PIXI.Sprite(texture)];
    this.speed = 10;
    this.viewPortWidth = 1920;
    this.textureWidth = this.pool[0].width;
    this.addChild(this.pool[0]);
    this.addChild(this.pool[1]);
    this.pool[0].x = -this.textureWidth - 100;
    this.pool[1].x = -100;

    this.ticker = new PIXI.ticker.Ticker();
    this.ticker.stop();

    new Promise(resolve => {
      this.on('added', function () {
        resolve();
      })
    })
      .then(() => {
        this.ticker.add(() => {
          this.pool[0].x += this.speed;
          this.pool[1].x += this.speed;
          if (this.pool[0].x >= this.viewPortWidth + 100) {
            this.pool[0].x -= this.textureWidth * 2;
          }
          if (this.pool[1].x >= this.viewPortWidth + 100) {
            this.pool[1].x -= this.textureWidth * 2;
          }
        });
        this.ticker.start();
      })
  }
}
