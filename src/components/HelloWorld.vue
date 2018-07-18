<template>
  <div>
  </div>

</template>

<script>

  import {Application, Container, Graphics} from 'pixi.js';
  import {TweenLite} from 'gsap'
  import Hero from "./ui/Hero";
  import Train from "./ui/Train";
  import {mapGetters, mapState} from 'vuex';
  import {DragManager} from "./manager/DragManager";
  import {DragContainer} from "./ui/DragContainer";
  import MatterWorld from "./matter/MatterWorld";
  import {dragEvent, END_DRAG, LEVEL_PASS, levelEvent, RESET, storeEvent, TIME_OVER, USER_ANSWERS} from "./Event";


  const stageWidth = 1920;
  const stageHeight = 1080;

  let app;

  export default {
    name: 'HelloWorld',
    data() {
      return {
        width: null,
        height: null,
      }
    },
    computed: {
      totalTime: {
        get() {
          return this.levelInfo.totalTime;
        }
      },
      ...mapState(['levelInfo', 'levelIndex', 'totalLevel',
        'lastUserAnswers', 'userAnswers', 'answers', 'isRight']),
      ...mapGetters(['optionCount', 'rightNum', 'stem']),
      /**
       * 是否最后一关
       * @return {boolean}
       */
      isLastLevel: {
        get() {
          return this.levelIndex >= this.totalLevel - 1;
        }
      },
    },
    watch: {
      userAnswers: function () {
        let result = [];
        let from, to;
        for (let i = 0; i < this.optionCount; i++) {
          this.lastUserAnswers.forEach((v1, index) => {
            v1.forEach(v2 => {
              if (v2 === i) {
                from = index;
              }
            })
          });
          this.$store.state.userAnswers.forEach((v1, index) => {
            v1.forEach(v2 => {
              if (v2 === i) {
                to = index;
              }
            })
          });
          if ((from !== undefined && from !== null) && from !== to) {
            result.push({from, to, value: i});
          }
        }
        storeEvent.emit(USER_ANSWERS, result);
      }
    },
    destroyed() {
      let RES = require('./RES');
      app.destroy();
      RES.SOUND_TRAIN_GROUND_MP3.stop();
      RES.SOUND_TRAIN_PUPU_MP3.stop();

    },
    methods: {
      createApp() {
        return new Application({
          width: stageWidth,
          height: stageHeight,
          autoSize: true,
          backgroundColor: 0x000000,
        })
      },

      createContainerAndLayout(stage) {
        //背景，火车
        const uiContainer = new Container();
        //箱子
        const dragContainer = new DragContainer();
        //鼠标手形
        const mouseContainer = new Container();
        //每题的题干
        const stemContainer = new Container();
        //物理引擎
        const matterContainer = new Container();
        //每关答题完成效果
        const finishContainer = new Container();
        //英雄
        const heroContainer = new Container();
        //结果页
        const passContainer = new Container();

        stage.addChild(uiContainer);
        stage.addChild(stemContainer);
        stage.addChild(matterContainer);
        stage.addChild(heroContainer);
        stage.addChild(finishContainer);
        stage.addChild(dragContainer);
        stage.addChild(passContainer);
        stage.addChild(mouseContainer);

        return {
          uiContainer,
          matterContainer,
          stemContainer,
          finishContainer,
          dragContainer,
          mouseContainer,
          heroContainer,
          passContainer,
        };
      },
    },
    mounted: function () {
      const self = this;
      this.width = this.$el.clientWidth;
      this.height = this.$el.clientHeight;

      app = this.createApp();
      const stage = app.stage;
      const {
        passContainer,
        uiContainer,
        matterContainer,
        stemContainer,
        finishContainer,
        dragContainer,
        mouseContainer,
        heroContainer,
      } = this.createContainerAndLayout(stage);

      let mask, matter, powerup, BackGround, RES, Selector, Stem, Title, Box, pass,
        hero, train, background, selector, stem, title, MouseCursor, PowerUp, Pass;
      let store = self.$store;
      let state = store.state;

      RES = require('./RES');
      BackGround = require('./ui/BackGround').default;
      Selector = require('./ui/Selector').default;
      Stem = require('./ui/Stem').default;
      Title = require('./ui/Title').default;
      MouseCursor = require('./ui/MouseCursor').default;
      PowerUp = require('./ui/PowerUp').PowerUp;
      Pass = require('./ui/Pass').default;

      DragManager.instance.init(stage);

      app.view.style.width = '19.2rem';
      app.view.style.height = '10.8rem';
      self.$el.appendChild(app.view);

      stage.interactive = true;

      mouseContainer.addChild(new MouseCursor());


      import(/*webpackChunkName:data*/'../../static/data.json')
        .then(value => {
          return value;
        })
        //火车开入
        .then((value) => {

          state.init(this.levelIndex, value);

          RES.SOUND_TRAIN_GROUND_MP3.loop = true;
          // RES.SOUND_TRAIN_GROUND_MP3.play();
          // RES.SOUND_TRAIN_PUPU_MP3.play();

          //方块遮罩
          mask = new Graphics();
          mask.clear();
          mask.beginFill(0x000000);
          mask.drawRect(0, 0, 1920, 1080);
          mask.endFill();
          mask.scale.set(1, 1);
          mask.x = 0;
          mask.y = 0;
          mask.alpha = 0.8;
          stage.addChild(mask);
          TweenLite.to(mask, 2, {
            alpha: 0, onComplete: () => {
              stage.removeChild(mask);
              mask = null;
            }
          });

          hero = new Hero();
          heroContainer.addChild(hero);
          hero.x = 1700;
          hero.y = 1080;
          hero.slow();

          background = new BackGround();
          uiContainer.addChild(background);

          train = new Train(this.totalLevel);
          uiContainer.addChild(train);

          return new Promise(resolve => {

            train.gotoTrain(0, 3)
              .then(() => {
                resolve();
              });
          })
        })
        .then(() => {

          selector = new Selector(state);
          stem = new Stem();
          title = new Title(state);
          matter = new MatterWorld(state);
          powerup = new PowerUp();
          pass = new Pass(state);

          uiContainer.addChild(selector);
          uiContainer.addChild(title);
          uiContainer.addChild(stem);
          matterContainer.addChild(matter);
          finishContainer.addChild(powerup);

          title.update(self.levelIndex);
          stem.update(self.stem);
          selector.init(self.levelIndex, self.optionCount);
          title.createTicker();

          dragEvent.on(END_DRAG, (e) => {
            //放到指定的框中
            let i = matter.getWhichRectangle(e.x, e.y);
            store.commit('moveAnswerTo', {index: i, value: e.boxIndex, mouseX: e.x, mouseY: e.y});
          });

          //点击重置按钮
          levelEvent.on(RESET, () => {
            state.init(self.levelIndex);
          });

          //关卡时间到
          levelEvent.on(TIME_OVER, () => {
            levelEvent.emit(LEVEL_PASS);
          });

          //触发通关
          levelEvent.on(LEVEL_PASS, () => {
            let isSuccess = state.check();
            store.dispatch('record', isSuccess);
            title.destroyTicker();
            stem.visible = false;
            //通过全部关卡
            if (this.isLastLevel) {
              hero.fast();
              train.gotoHead()
                .then(() => {
                  hero.stay();
                  passContainer.addChild(pass);
                  pass.success();
                  pass.showResult(self.rightNum, self.totalLevel)
                });
            }
            //通过一个关卡
            else {
              state.init(self.levelIndex + 1);
              train.gotoTrain(self.levelIndex)
                .then(() => {
                  stem.visible = true;
                  stem.update(self.stem);
                  title.update(self.levelIndex)
                  hero.slow();
                  title.createTicker();
                });
              hero.fast();
              selector.init(self.levelIndex, self.optionCount)
            }
            matter.removeAllBox();

            if (isSuccess) {
              powerup.success();
            } else {
              powerup.falit();
            }
          })
        })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  div {
    width: 19.2rem;
    height: 10.8rem;
  }

</style>
