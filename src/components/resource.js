import BackGround from './ui/BackGround';
import Train from './ui/Train';
import Title from "./ui/Title";
import Selector from "./ui/Selector";
import Pass from "./ui/Pass";
import Start from "./ui/Start";

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
      .add('pushhand', './static/pushhand.png')
      .add('timesign', './static/timesign.png')
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
      .add('btn_normal', './static/btn_normal.png')
      .add('btn_select', './static/btn_select.png')
      .add('start_game', './static/startscreen.jpg')

      .add('click', './static/sound/click.mp3')
      .add('lily_help', './static/sound/lily_help.mp3')
      .add('lily_ya', './static/sound/lily_ya.mp3')
      .add('train_ground', './static/sound/train_ground.mp3')
      .add('train_pupu', './static/sound/train_pupu.mp3')
      .add('victory', './static/sound/victory.mp3')
      .add('title1', './static/title_text1.png')
      .add('title2', './static/title_text2.png')
      .add('title3', './static/title_text3.png')
      .add('title4', './static/title_text4.png')
      .add('title5', './static/title_text5.png')
      .add('title6', './static/title_text6.png')
      .add('title7', './static/title_text7.png')
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
          start: new Start(resources),
          hand1: resources.hand1.texture,
          hand2: resources.hand2.texture,
          levelInfo: data,
          click: resources.click.data,
          lily_help: resources.lily_help.data,
          lily_ya: resources.lily_ya.data,
          train_ground: resources.train_ground.data,
          train_pupu: resources.train_pupu.data,
          victory: resources.victory.data

        });
      })
  })
}
