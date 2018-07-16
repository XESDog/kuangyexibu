import {Container} from 'pixi.js'
import {getAnimation} from "../resource";

class PowerUp extends Container {
  animate;
  slot;

  constructor() {
    super();
    this.animate = getAnimation('animation_powerup_json');
    this.slot = this.animate.skeleton.findSlot('text');
    this.addChild(this.animate);
    this.animate.state.setAnimation(0, 'bounce').loop = true;
    this.animate.x = 1920 >> 1;
    this.animate.y = 1080 >> 1;


  }

  _performAnimate(str) {
    let txtAttach = this.animate.skeleton.getAttachment(this.slot.data.index, str);
    this.slot.setAttachment(txtAttach);
  }

  timeOver() {
    this._performAnimate('')
  }

  success() {

  }

  falit() {

  }

}

export {PowerUp}
