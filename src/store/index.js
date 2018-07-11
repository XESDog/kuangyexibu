import Vue from 'vue';
import Vuex from 'vuex';

let data = require('../assets/data');

Vue.use(Vuex);
const state = {
  levelInfo: data,
  levelIndex: 0,
  totalLevel: data.questions.length,
  /**
   * 用户答题信息
   * 0,1,2为3个框中箱子信息
   * 3为selector中箱子信息
   */
  lastUserAnswers: [[], [], [], []],
  userAnswers: [[], [], [], []],
  answers: null,//答案
  isRight: [],//用户对错情况
  mouseX: 0,
  mouseY: 0,
  init(level) {
    this.levelIndex = level;
    this.answers = data.questions[this.levelIndex].answers.concat();
    let total = this.levelInfo.questions[this.levelIndex].optionCount;
    let temp = [];
    for (let i = 0; i < total; i++) {
      temp.push(i);
    }
    this.userAnswers = [[], [], [], temp];
    this.lastUserAnswers = [[], [], [], temp];
    this.isRight = [];
  },
  /**
   * 检测用户答案是否正确
   * @return {boolean}
   */
  check() {
    let self = this;
    let answers = JSON.parse(JSON.stringify(self.answers));
    let userAnswers = JSON.parse(JSON.stringify(self.userAnswers));
    return answers.every((value, index) => {
      return JSON.stringify(value.sort()) === JSON.stringify(userAnswers[index].sort());
    })
  }
};
const actions = {};
const getters = {
  optionCount: state => {
    return state.levelInfo.questions[state.levelIndex].optionCount;
  },

};
const mutations = {
  moveAnswerTo(state, {index, value, mouseX, mouseY}/*index:0,1,2代表火车中的框,3代表selector*/) {

    state.lastUserAnswers = JSON.parse(JSON.stringify(state.userAnswers));

    //找到value所在位置并删除
    state.userAnswers.some((v1, index, arr) => {
      arr[index] = v1.filter(v2 => {
        return value !== v2
      })
    });
    state.mouseX = mouseX;
    state.mouseY = mouseY;
    //放置到指定位置，从前插入，selector有这样的要求
    state.userAnswers[index].unshift(value);
    state.userAnswers = state.userAnswers.concat();
  }
};

export default new Vuex.Store({
  state,
  actions,
  getters,
  mutations,
})
