import {Container} from 'pixi.js';
import {getAnimation} from "../resource";

export default class Hero extends Container {
  constructor() {
    super();
    this.hero = getAnimation('animation_hero_json');
    this.addChild(this.hero);
  }

  _setState(stateStr, loop = true) {
    this.hero.state.setAnimation(0, stateStr).loop = loop;
  }

  fast() {
    this._setState('run_fast')
  }

  slow() {
    this._setState('run_slow')
  }

  stay() {
    this._setState('stay')
  }

  stop() {
    this._setState('run_stop')
  }
}
