import {Container} from 'pixi.js'
import {getAnimation} from "../resource";
class PowerUp extends Container{
    constructor() {
      super();
      this.powerup = getAnimation('animation_train_json');
      this.powerup.state.setAnimation(0, 'train_top').loop = true;
    }
}

export {PowerUp}
