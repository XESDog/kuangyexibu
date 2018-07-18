import {Container} from 'pixi.js'
import {getAnimation} from "../resource";

class PowerUp extends Container {
  animate;
  slot;
  static SUCCESS = 'text1';
  static FALIT = 'text2';
  static TIME_OVER = 'text3';

  constructor() {
    super();
    this.animate = getAnimation('animation_powerup_json');
    this.slot = this.animate.skeleton.findSlot('text');
    this.addChild(this.animate);
    //todo:如何控制一个动画的开始与结束
    this.animate.x = 1920 >> 1;
    this.animate.y = 1080 >> 1;
    this.animate.visible=false;
  }

  _performAnimate(str) {
    let txtAttach = this.animate.skeleton.getAttachment(this.slot.data.index, str);
    this.animate.visible=true;
    this.animate.state.setAnimation(0, 'bounce');
    this.animate.state.tracks[0].trackTime = 0;
    this.animate.state.tracks[0].timeScale=1;
    this.slot.setAttachment(txtAttach);
  }

  timeOver() {
    this._performAnimate(PowerUp.TIME_OVER)
  }

  success() {
    this._performAnimate(PowerUp.SUCCESS)
  }

  falit() {
    this._performAnimate(PowerUp.FALIT)
  }

}

export {PowerUp}
