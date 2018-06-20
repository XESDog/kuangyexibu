import {Sprite} from 'pixi.js';

const PIXI_SPINE = require('pixi-spine');
const PATH = './static/animation/$/$.json';
const data = require('../assets/data.json');
const resourceData = require('../assets/resource');

export let res = null;

export function load() {
  return new Promise((resolve, reject) => {

    let loader = PIXI.loader;
    resourceData.map(value => {
      loader = loader.add(value.key, value.path);
    });
    loader.load((l, r) => {
      res = r;
      resolve(r)
    });
    loader.onProgress.add((e) => {
      // console.log(e.progress)
    })
  })
}

export function getAnimation(animationStr) {
  return new PIXI.spine.Spine(res[animationStr].spineData)
}

export function getSound(resourceStr) {
  return res[resourceStr].data;
}

export function createSprite(texture) {
  return new Sprite(texture);
}

export function getTexture(resourceStr) {
  return res[resourceStr].texture;
}
