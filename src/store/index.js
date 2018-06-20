import Vue from 'vue';
import Vuex from 'vuex';

let data = require('../assets/data');

Vue.use(Vuex);
const state = {
  levelInfo: data,
  levelIndex: 0,
  totalLevel: data.questions.length,
  userAnswers: [[], [], []],//用户答题信息
  answers: null,//答案
  isRight: [],//用户对错情况
};
const actions = {};
const getters = {
  optionCount:state=>{
    return state.levelInfo.questions[state.levelIndex].optionCount;
  }
};
const mutations = {};

export default new Vuex.Store({
  state,
  actions,
  getters,
  mutations
})
