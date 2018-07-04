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
  import {ADD_BOX, dragEvent, END_DRAG, matterEvent, REMOVE_BOX} from "./Event";


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
      ...mapState(['levelInfo', 'levelIndex', 'totalLevel', 'userAnswers', 'answers', 'isRight']),
      ...mapGetters(['optionCount'])
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

        stage.addChild(uiContainer);
        stage.addChild(stemContainer);
        stage.addChild(matterContainer);
        stage.addChild(heroContainer);
        stage.addChild(finishContainer);
        stage.addChild(dragContainer);
        stage.addChild(mouseContainer);

        return {
          uiContainer,
          matterContainer,
          stemContainer,
          finishContainer,
          dragContainer,
          mouseContainer,
          heroContainer,
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
        uiContainer,
        matterContainer,
        stemContainer,
        finishContainer,
        dragContainer,
        mouseContainer,
        heroContainer,
      } = this.createContainerAndLayout(stage);

      let mask, matter, BackGround, RES, Selector, Stem, Title, Box,
        hero, train, background, selector, stem, title, MouseCursor;

      RES = require('./RES');
      BackGround = require('./ui/BackGround').default;
      Selector = require('./ui/Selector').default;
      Stem = require('./ui/Stem').default;
      Title = require('./ui/Title').default;
      MouseCursor = require('./ui/MouseCursor').default;

      DragManager.instance.init(stage);

      app.view.style.width = '19.2rem';
      app.view.style.height = '10.8rem';
      self.$el.appendChild(app.view);

      stage.interactive = true;

      mouseContainer.addChild(new MouseCursor());


      Promise.resolve()
      //火车开入
        .then(() => {

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
          hero.setState('run_slow');

          background = new BackGround();
          uiContainer.addChild(background);

          train = new Train(this.totalLevel);
          uiContainer.addChild(train);

          return new Promise(resolve => {

            train.gotoTrain(this.totalLevel - 1, 3)
              .then(() => {
                resolve();
              });
          })
        })
        .then(() => {
          selector = new Selector();
          stem = new Stem();
          title = new Title(self.totalLevel, self.totalTime);
          matter = new MatterWorld();
          uiContainer.addChild(selector);
          uiContainer.addChild(title);
          uiContainer.addChild(stem);
          matterContainer.addChild(matter);
          title.showQuestion(self.levelIndex);
          selector.init(self.levelIndex, self.optionCount);

          window.matter = matter;

          self.$store.state.init(this.levelIndex);

          dragEvent.on(END_DRAG, (e) => {
            //todo:放到指定的框中
            let i = matter.getWhichRectangle(e.x, e.y);
            //指定框存在，且框中没有该箱子
            if (i !== -1 && !self.$store.state.hasUserAnswer({index: i, value: e.boxIndex})) {
              matter.addBox(e.x, e.y, 200, 162, false, e.levelIndex, e.boxIndex, i);
              self.$store.commit('addUserAnswer', {index: i, value: e.boxIndex});
            }
          });

          matterEvent.on(ADD_BOX, e => {
            self.$store.commit('addUserAnswer', {index: e.index, value: e.value});
          });
          matterEvent.on(REMOVE_BOX, e => {
            self.$store.commit('removeUserAnswer', {index: e.index, value: e.value});
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
