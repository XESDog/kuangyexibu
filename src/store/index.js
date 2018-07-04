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
  hasUserAnswer({index,value}){
    let arr=this.userAnswers[index];
    let i = arr.indexOf(value);
    return i!==-1;
  },
  init(level){
    this.levelIndex=level;
    this.userAnswers = [[], [], []];
    this.isRight = [];
    this.answers=data.questions[this.levelIndex].answers.concat();
  },
  check(){

  }
};
const actions = {

};
const getters = {
  optionCount:state=>{
    return state.levelInfo.questions[state.levelIndex].optionCount;
  },

};
const mutations = {
  addUserAnswer(state,{index,value}){
    let arr=state.userAnswers[index];
    let i=arr.indexOf(value)
    if(i===-1){
      arr.push(value);
    }
  },
  removeUserAnswer(state,{index,value}){
    let arr=state.userAnswers[index];
    let i=arr.indexOf(value)
    if(i!==-1){
      arr.splice(i, 1);
    }
  }
};

export default new Vuex.Store({
  state,
  actions,
  getters,
  mutations,
})
