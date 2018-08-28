<template>
  <div id="app">
    <div id="goldPage" v-show="showGold">
      <img src="../static/result.png">
      <img src="../static/resultAn.png">
      <div style="position: absolute; top: 6.05rem;left: 9.76rem;
       font-family: '方正粗圆_GBK' ;
       font-size: 0.9rem;
       color: #ffff00;
">{{goldNum}}</div>
    </div>
    <router-view/>
  </div>
</template>

<script>

  // const VConsole = require('vconsole');
  export default {
    name: 'App',
    data(){
      return {
        showGold:true,
        goldNum:0,
        countDown:3,
      }
    },
    watch(){

    },
    mounted() {
      const self = this;
      const ONLOAD = 'onload';
      const SUBMIT_ANSWER = 'submitAnswer';
      const ANSWER_RESULT = 'answerResult';
      const RESUBMIT_ANSWER = "resubmitAnswer";


      // let vConsole=new VConsole();

      function resize() {
        var docEl = document.documentElement;
        window.clientWidth = docEl.clientWidth;
        window.clientHeight = docEl.clientHeight;
        if (!window.clientWidth) return;
        var aspectRatio = window.clientWidth / window.clientHeight;
        if (aspectRatio > 1920 / 1080) {
          docEl.style.fontSize = 100 * (window.clientHeight / 1080) + 'px';
          window.base = 100 * (window.clientHeight / 1080);
          window.appLeft = ((window.clientWidth - 19.2 * window.base) >> 1) + 'px';
          window.appTop = '0px';
        } else {
          docEl.style.fontSize = 100 * (window.clientWidth / 1920) + 'px';
          window.base = 100 * (window.clientWidth / 1920);
          window.appLeft = '0px';
          window.appTop = ((window.clientHeight - 10.8 * window.base) >> 1) + 'px';
        }
        self.$el.style.left = window.appLeft;
        self.$el.style.top = window.appTop;
      }

      window.addEventListener('resize', resize);
      resize();

      window.parent.postMessage({type: ONLOAD}, '*');
      window.parent.addEventListener('message', e => {
        //php反馈金币信息
        if (e.data.type === ANSWER_RESULT) {
          //1.e.data.data.goldnum//为php端返回金币数
          //2.在此处显示金币页
          self.showGold=true;
          self.goldNum=e.data.data.goldnum;

        } //php主动收卷
        else if (e.data.type === RESUBMIT_ANSWER) {
          //此处数据为当前玩过游戏次数中的最佳成绩
          let jsonArr = [];
          let arr = {
            "id": 0,//题目id
            "useranswer": '',//游戏没有标准答案的，此处为''
            "answer": '',//游戏没有标准答案的，此处为''
            "isright": 1,//1：完成，2：未完成
            "times": 1,//游戏中此处为默认值:1
            "type": 0,//0：操作类或单选，1：多选，2：填空(游戏中此处为0)
            "rightnum": 1,//答对的个数，
            "wrongnum": 0//答错的个数
          };
          jsonArr.push(arr);
          let data = {
            type: SUBMIT_ANSWER,
            data: {
              testAnswer: jsonArr,
              testNum: testNum//题数
            }
          };
          window.parent.postMessage(data, '*');
        }
      })

    }
  }
</script>

<style>
  html, body {
    width: 100%;
    height: 100%;
    margin: 0;
    background-color: black;
  }

  #app {
    overflow: hidden;
    position: absolute;
    width: 19.2rem;
    height: 10.8rem;
    cursor: none;
  }

  img {
    position: absolute;
    width: 100%;
    height: 100%;
  }
</style>
