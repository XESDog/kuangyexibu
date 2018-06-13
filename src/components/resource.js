import BackGround from './BackGround';
import Train from './Train';
import Title from "./Title";
import Selector from "./Selector";
import Pass from "./Pass";

const PIXI = require('pixi.js')
const PIXI_SPINE = require('pixi-spine');
const PATH = './static/animation/$/animate/$.json';
const data = require('../assets/data.json');


function animationRealPath(replaceStr) {
  return PATH.replace(/\$/ig, replaceStr)
}

PATH.replace(/\$/ig, 'hero');
export default function () {
  return new Promise((resolve, reject) => {
    PIXI.loader
      .add('startscreen', animationRealPath('startscreen'))
      .add('hero', animationRealPath('hero'))
      .add('train', animationRealPath('train'))
      .add('trainfinish', './static/animation/trainfinish/animate/powerup-ess.json')
      .add('background', './static/background.png')
      .add('title_jump', './static/title_jump.png')
      .add('pushhand', './static/pushhand.png')
      .add('timesign', './static/timesign.png')
      .add('left_normal', './static/left_normal.png')
      .add('left_select', './static/left_select.png')
      .add('right_select', './static/right_select.png')
      .add('right_normal', './static/right_normal.png')
      .add('submit_normal', './static/submit_normal.png')
      .add('submit_select', './static/submit_select.png')
      .add('reset_normal', './static/reset_normal.png')
      .add('reset_select', './static/reset_select.png')
      .add('table', './static/table.png')
      .add('box', './static/box.png')
      .add('jump_img', './static/jump_img.png')
      .add('jump_light', './static/jump_light.png')
      .add('hand1', './static/hand1.png')
      .add('hand2', './static/hand2.png')
      // .add('click', './static/sound/click.mp3')
      // .add('lily_help', './static/sound/hand2.mp3')
      // .add('lily_ya', './static/sound/lily_ya.mp3')
      // .add('train_ground', './static/sound/hand2.mp3')
      // .add('train_pupu', './static/sound/hand2.mp3')
      // .add('victory', './static/sound/hand2.mp3')
      .load((loader, resources) => {
        resolve({
          hero: new PIXI.spine.Spine(resources.hero.spineData),
          startscreen: new PIXI.spine.Spine(resources.startscreen.spineData),
          background: new BackGround(resources.background.texture),
          train: new Train(resources.train.spineData, data.questions.length),
          trainfinish: new PIXI.spine.Spine(resources.trainfinish.spineData),
          title: new Title(resources, data.totalTime, data),
          selector: new Selector(resources),
          pass: new Pass(resources),
          hand1: resources.hand1.texture,
          hand2: resources.hand2.texture,
          // leftBtn: new Button(resources.left_normal.texture, resources.left_select.texture),
          // rightBtn: new Button(resources.right_normal.texture, resources.right_select.texture),
          levelInfo: data,
        });
      })
  })
}
