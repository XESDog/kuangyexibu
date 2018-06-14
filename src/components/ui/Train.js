import {Container} from 'pixi.js'
import {TweenLite} from 'gsap';


export default class Train extends Container {
  constructor(spineData, trainNum) {
    super();

    const Spine = PIXI.spine.Spine;
    this.spineData = spineData;
    this.y = 550;
    this.x = 500;
    this.head = new Spine(this.spineData);
    this.head.state.setAnimation(0, 'train_top').loop = true;
    this.head.pivot.set(this.head.getLocalBounds().x, 0);
    this.girl = new Spine(this.spineData);
    this.girl.state.setAnimation(0, 'train_lily').loop = true;
    this.girl.x = this.head.width;
    this.girl.pivot.set(this.girl.getLocalBounds().x, 0);
    this.addChild(this.head);
    this.addChild(this.girl);

    this.trains = [];
    this.trainStartX = this.girl.x + this.girl.width;
    this.trainWidth = null;
    for (let i = 0; i < trainNum; i++) {
      let train = new Spine(this.spineData);
      train.state.setAnimation(0, 'train_normal').loop = true;
      if (this.trainWidth === null) {
        this.trainWidth = train.width;
      }
      train.pivot.set(train.getLocalBounds().x, 0);
      train.x = this.trainStartX + this.trainWidth * i;
      this.addChild(train);
      this.trains.push(train);

    }

    this.gotoTrain(this.trains.length - 2, 5)

  }

  gotoTrain(index, duration) {
    return new Promise(resolve => {
      TweenLite.to(this, duration, {x: -this.trains[index].x, onComplete: resolve});
    })

  }

}