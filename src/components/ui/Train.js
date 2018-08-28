import {Container} from 'pixi.js'
import {TweenLite} from 'gsap';
import {getAnimation} from "../resource";


export default class Train extends Container {
  constructor(trainNum) {
    super();

    this.y = 550;
    this.x = 500;
    this.head = getAnimation('animation_train_json');
    this.head.state.setAnimation(0, 'train_top').loop = true;
    this.head.pivot.set(this.head.getLocalBounds().x, 0);
    this.girl = getAnimation('animation_train_json');
    this.girl.state.setAnimation(0, 'train_lily').loop = true;
    this.girl.x = this.head.width;
    this.girl.pivot.set(this.girl.getLocalBounds().x, 0);
    this.addChild(this.head);
    this.addChild(this.girl);

    this.trains = [];
    this.trainStartX = this.girl.x + this.girl.width;
    this.trainWidth = null;
    for (let i = 0; i < trainNum; i++) {
      let train = getAnimation('animation_train_json');
      train.state.setAnimation(0, 'train_normal').loop = true;
      if (this.trainWidth === null) {
        this.trainWidth = train.width;
      }
      train.pivot.set(train.getLocalBounds().x, 0);
      train.x = this.trainStartX + this.trainWidth * i;
      this.addChild(train);
      this.trains.push(train);
    }
    this.trains.reverse();
  }

  gotoTrain(index, duration = 2) {
    return new Promise(resolve => {
      TweenLite.to(this, duration, {x: -this.trains[index].x, onComplete: resolve});
    })

  }

  gotoHead(duration = 2) {
    return new Promise(resolve => {
      TweenLite.to(this, duration, {x: -500, onComplete: resolve});
    })
  }

  stop() {
    this.head.state.setAnimation(0, 'train_top').loop = false;
    this.girl.state.setAnimation(0, 'train_lily').loop = false;
    this.trains.forEach(value => {
      value.state.setAnimation(0, 'train_normal').loop = false;
    })
  }

  play() {
    this.head.state.setAnimation(0, 'train_top').loop = true;
    this.girl.state.setAnimation(0, 'train_lily').loop = true;
    this.trains.forEach(value => {
      value.state.setAnimation(0, 'train_normal').loop = true;
    })
  }

}
