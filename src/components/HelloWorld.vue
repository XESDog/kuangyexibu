<template>
  <div>
  </div>

</template>

<script>

  import {Application, Container, Graphics} from 'pixi.js';
  import {TweenLite} from 'gsap'
  import {mapGetters, mapState} from 'vuex';
  import {DragManager} from "./manager/DragManager";
  import {DragContainer} from "./ui/DragContainer";
  import MatterWorld from "./matter/MatterWorld";
  import {load} from './resource.js'
  import {
    appEvent, CLOSE,
    dragEvent,
    END_DRAG,
    GAME_START,
    LEVEL_PASS,
    levelEvent,
    REPLAY,
    RESET,
    storeEvent,
    TIME_OVER,
    USER_ANSWERS
  } from "./Event";
  import {getAnimation} from "./resource";


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
      ...mapState(['levelInfo', 'levelIndex', 'totalLevel', 'optionCount',
        'lastUserAnswers', 'userAnswers', 'answers', 'isRight']),
      ...mapGetters([, 'rightNum', 'stem']),
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
      /**
       * 侦测userAnswers变化，抛出box的from...to信息
       */
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
      let config = null;
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
        mouseContainer,
        heroContainer,
      } = this.createContainerAndLayout(stage);

      let mask, matter, powerup, BackGround, RES, Start, Selector, Stem, Title, pass, Hero, Train,
        hero, train, background, selector, stem, title, MouseCursor, PowerUp, Pass, start;
      let store = self.$store;
      let state = store.state;

      DragManager.instance.init(stage);

      app.view.style.width = '19.2rem';
      app.view.style.height = '10.8rem';
      self.$el.appendChild(app.view);

      stage.interactive = true;

      /**
       * 加载配置文件
       */
      import(/*webpackChunkName:data*/'../../static/data.json')
        .then(value => {
          config = value;
        })
        /**
         * 加载资源
         */
        .then(() => {
          return load();
        })
        /**
         * 开始页面
         */
        .then(() => {
          RES = require('./RES');
          BackGround = require('./ui/BackGround').default;
          Selector = require('./ui/Selector').default;
          Stem = require('./ui/Stem').default;
          Title = require('./ui/Title').default;
          MouseCursor = require('./ui/MouseCursor').default;
          PowerUp = require('./ui/PowerUp').PowerUp;
          Pass = require('./ui/Pass').default;
          Hero = require("./ui/Hero").default;
          Train = require("./ui/Train").default;
          Start = require('./ui/Start').default;
          RES = require('./RES');
          MouseCursor = require('./ui/MouseCursor').default
          start = new Start();
          uiContainer.addChild(start);

          mouseContainer.addChild(new MouseCursor());

          return new Promise(resolve => {
            appEvent.once(GAME_START, () => {
              uiContainer.removeChild(start);
              start.destroy();
              resolve();
            })
          })
        })
        //开场动画
        .then(() => {
          return new Promise(resolve => {
            let startAnimation = getAnimation('animation_startscreen_json');

            RES.SOUND_LILY_HELP_MP3.play();
            uiContainer.addChild(startAnimation);
            startAnimation.state.setAnimation(0, 'startscreen');
            startAnimation.x = 1920 >> 1;
            startAnimation.y = 1080 >> 1;

            startAnimation.state.addListener({
              complete: () => {
                return resolve();
              }
            })
          })
        })
        //遮罩动画
        .then(() => {
          return new Promise(resolve => {
            RES.SOUND_LILY_YA_MP3.play();

            //圆形遮罩
            mask = new Graphics();
            mask.beginFill(0x000000, 1);
            mask.drawCircle(0, 0, 800);
            mask.endFill();
            mask.x = 1050;
            mask.y = 620;

            stage.addChild(mask);
            stage.mask = mask;

            TweenLite.to(mask.scale, 1, {
              x: 0.2, y: 0.2, onComplete: () => {
                stage.mask = null;
                stage.removeChild(mask);
                mask.destroy();
                uiContainer.removeChildren();
                resolve();
              }
            });
          })
        })
        //火车开入
        .then(() => {

          state.init(0, config);

          //以下对象的初始化依赖state的初始化
          selector = new Selector(state);
          stem = new Stem();
          title = new Title(state);
          matter = new MatterWorld(state);
          powerup = new PowerUp();
          pass = new Pass(state);

          RES.SOUND_TRAIN_GROUND_MP3.loop = true;
          RES.SOUND_TRAIN_GROUND_MP3.play();
          RES.SOUND_TRAIN_PUPU_MP3.play();

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
          uiContainer.addChild(selector);
          uiContainer.addChild(title);
          stemContainer.addChild(stem);
          matterContainer.addChild(matter);
          finishContainer.addChild(powerup);


          title.update();
          title.createTicker();
          stem.update(self.stem);
          selector.init();

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
          levelEvent.on(REPLAY, () => {
            background.play();
            hero.slow();
            train.gotoTrain(0, 2)
              .then(() => {
                uiContainer.addChild(selector);
                uiContainer.addChild(title);
                title.update();
                title.createTicker();
                title.resetDot();
                stem.update(self.stem);
                selector.init();

              });
            train.play();


            uiContainer.addChild(background);
            uiContainer.addChild(train);
            heroContainer.addChild(hero);
            stemContainer.addChild(stem);
            matterContainer.addChild(matter);
            finishContainer.addChild(powerup);

            passContainer.removeChild(pass);

            state.isRight = [];
            state.init(0);

          });
          levelEvent.on(CLOSE,()=>{
            console.log('close');

          })

          //触发通关
          levelEvent.on(LEVEL_PASS, () => {
            let isSuccess = state.check();
            store.dispatch('record', isSuccess);
            title.destroyTicker();
            stem.visible = false;

            RES.SOUND_VICTORY_MP3.play();

            //通过全部关卡
            if (this.isLastLevel) {
              hero.fast();
              train.gotoHead()
                .then(() => {
                  hero.stay();
                  train.stop();
                  background.stop();


                  uiContainer.removeChild(selector);
                  uiContainer.removeChild(title);
                  uiContainer.removeChild(background);
                  uiContainer.removeChild(train);
                  heroContainer.removeChild(hero);
                  stemContainer.removeChild(stem);
                  matterContainer.removeChild(matter);
                  finishContainer.removeChild(powerup);


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
    width: 19.2rem;mai
    height: 10.8rem;
  }

</style>
