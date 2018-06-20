import {Container} from 'pixi.js';
import {getAnimation} from "../resource";

export default class Hero extends Container{
  constructor(){
    super();
    this.hero = getAnimation('animation_hero_json');
    this.addChild(this.hero);
  }
  setState(stateStr,loop=true){
    this.hero.state.setAnimation(0,stateStr).loop=loop;
  }
}
