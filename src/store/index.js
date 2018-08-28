import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
const state = {
  levelInfo: null,
  levelIndex: 0,
  totalLevel: null,
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
  /**
   * data 仅在第一次赋值一次
   * @param level
   * @param data
   */
  init(level, data = null) {
    if (data) {
      this.levelInfo = data;
      this.totalLevel = data.questions.length;
    }
    if (level >= this.totalLevel) throw new Error(`总计${this.totalLevel}关，level值${level}超过范围`);
    this.levelIndex = level;
    this.answers = this.levelInfo.questions[this.levelIndex].answers.concat();
    let total = this.levelInfo.questions[this.levelIndex].optionCount;
    let temp = [];
    for (let i = 0; i < total; i++) {
      temp.push(i);
    }
    this.userAnswers = [[], [], [], temp];
    this.lastUserAnswers = [[], [], [], temp];
    // this.isRight = [];
  },
  get totalTime() {
    return this.levelInfo.totalTime;
  },
  get optionCount() {
    return this.levelInfo.questions[this.levelIndex].optionCount;
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
  },
};
const actions = {
  /**
   * 记录用户答题情况
   * @param state
   * @param commit
   * @param value
   */
  record: ({state, commit}, value) => {
    commit('addToIsRight', value)
  },
};
const getters = {

  /**
   * 用户答对的个数
   * @param state
   * @return {number}
   */
  rightNum: state => {
    let count = 0;
    state.isRight.forEach(value => {
      if (value) count++;
    });
    return count;
  },
  stem: state => {
    return state.levelInfo.questions[state.levelIndex].stem;
  }
};
const mutations = {
  addToIsRight(state, value) {
    if (state.isRight.length >= state.totalLevel) return;
    state.isRight.push(value)
  },
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
