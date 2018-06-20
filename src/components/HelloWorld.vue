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
  import {END_DRAG,dragEvent} from "./Event";


  const stageWidth = 1920;
  const stageHeight = 1080;

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
    }
    ,
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
      /*dragTargetRectangle(x, y) {
        let result = null;
        let index = null;
        this.rectangles.some((value, i) => {
          if (value.contains(x, y)) {
            result = value;
            index = i;
            return true;
          }

        });
        return {result, index};
      }*/
    },
    mounted: function () {
      const self = this;
      this.width = this.$el.clientWidth;
      this.height = this.$el.clientHeight;

      const app = this.createApp();
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
      Box = require('./ui/Box').default;

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
          matter = new MatterWorld(app.renderer);
          uiContainer.addChild(selector);
          uiContainer.addChild(title);
          uiContainer.addChild(stem);
          matterContainer.addChild(matter);
          title.showQuestion(self.levelIndex);
          selector.init(self.levelIndex, self.optionCount);

          dragEvent.on(END_DRAG, (e) => {
            const box = new Box(this.levelIndex, e.index, 0.5, 0.5);
            matter.addBox(box, this.levelIndex, e.index, 1, e.x, e.y);
          })
        })
      /* .then(value => {
         this.levelIndex = -1;
         this.totalLevel = value.levelInfo.questions.length;
         this.answers = null;



         passLevel();
         createDrag(uiContainer, dragContainer, matter);

         function createDrag(target, dragContainer, matter) {
           let dragObj = null;
           let dragStart = false;
           let dragBoxEvent = null;
           target.on('pointerdown', (e) => {

             if (!dragStart) {
               let newP = e.data.getLocalPosition(target);
               let body = matter.queryPoint(newP.x, newP.y);
               if (body && body.length > 0 && body[0].render) {
                 dragStart = true;
                 let [level, boxIndex, frameIndex] = body[0].render.userInfo;
                 let i = self.userAnswers[frameIndex].indexOf(boxIndex);

                 if (i !== -1) {
                   self.userAnswers[frameIndex].splice(i, 1);
                 }

                 matter.removeBox(body[0]);
                 dragObj = new Box(body[0].render.userInfo[0], body[0].render.userInfo[1], 0.5, 0.5);
                 dragObj.x = newP.x;
                 dragObj.y = newP.y;
                 dragBoxEvent = new DragBoxEvent();
                 dragBoxEvent.boxIndex = boxIndex;
                 dragBoxEvent.boxPosition = newP;
                 dragBoxEvent.from = DragBoxEvent.FROM_TRAIN;
                 dragContainer.addChild(dragObj);

               }
             }
           });
           //从selector中选择箱子
           MyEvent.on(BOX_SELECTED, (boxEvent) => {
             dragStart = true;
             dragObj = new Box(self.levelIndex, boxEvent.boxIndex, 0.5, 0.5);
             dragObj.x = boxEvent.boxPosition.x;
             dragObj.y = boxEvent.boxPosition.y;

             dragBoxEvent = boxEvent;

             dragContainer.addChild(dragObj);
             value.selector.liftUp(boxEvent.boxIndex);

           });
           target.on('pointermove', (e) => {
             if (dragStart && dragObj) {
               let newP = e.data.getLocalPosition(target);
               dragObj.x = newP.x;
               dragObj.y = newP.y;
             }
           });
           target.on('pointerup', (e) => {

             if (dragStart && dragObj) {
               let newP = e.data.getLocalPosition(target);
               let {result: rect, index} = self.dragTargetRectangle(newP.x, newP.y);
               //箱子放下到火车
               if (rect) {
                 matter.addBox(self.levelIndex, dragBoxEvent.boxIndex, index, newP.x, newP.y);
                 self.userAnswers[index].push(dragBoxEvent.boxIndex);
                 value.selector.remove(dragBoxEvent.boxIndex);
                 value.selector.liftUpIndex = -1;
               }
               //箱子放下到火车外
               else {
                 //从selector拿箱子
                 if (dragBoxEvent.from === 0) {
                   value.selector.liftUpIndex = -1;
                   value.selector._update();
                 }
                 //从火车上拿箱子
                 else if (dragBoxEvent.from === 1) {
                   value.selector.add(dragBoxEvent.boxIndex);
                 }
               }
             }

             dragStart = false;
             dragObj = null;
             while (dragContainer.children[0]) {
               dragContainer.children[0].destroy();
             }
           })
         }

         /!**
          * 判断正误
          *!/
         function check() {
           let answerLen = self.answers.length;
           let userLen = self.userAnswers.length;
           if (answerLen !== userLen) return false;


           self.userAnswers.forEach((value) => {
             value.sort();
           });
           self.answers.forEach(value => {
             value.sort();
           });
           if (JSON.stringify(self.userAnswers) === JSON.stringify(self.answers)) {
             return true
           }
           return false;
         }


         /!**
          *
          * 点击提交之后
          *!/
         MyEvent.on(SUBMIT, () => {
           let success = check();
           this.isRight[this.levelIndex] = success;
           if (success) {
             showFinish('text1');
             value.title._changeDotState(self.levelIndex, 1);
           } else {
             showFinish('text2');
             value.title._changeDotState(self.levelIndex, 2);
           }

           TweenLite.delayedCall(2, () => {
             passLevel();
           });
         });
         MyEvent.on(RESET, () => {
           const question = value.levelInfo.questions[self.levelIndex];
           const optionCount = question.optionCount;
           self.userAnswers = [[], [], []];
           value.selector.init(self.levelIndex, optionCount);
           matter.removeAllBox();
         });
         MyEvent.on(REMOVE_EXCEPT, (index) => {
           value.selector.removeExcept(index)
         });
         /!**
          * 时间到了之后
          *!/
         MyEvent.on(TIME_OVER, () => {
           value.title._changeDotState(self.levelIndex, 2);
           showFinish('text3');
           TweenLite.delayedCall(2, () => {
             passLevel();
           });
         });

         MyEvent.on(CLICK, () => {
           value.click.play();
         });

         function passLevel() {
           self.levelIndex++;
           self.hideMatter(matter);
           if (self.levelIndex < self.totalLevel) {
             nextLevel();
           } else {
             let duration = 2;
             let rightNum = 0;
             self.isRight.forEach(value => {
               if (value) rightNum++;
             });
             value.background.speed = 20;
             self.heroState(value.hero, 'run_fast');
             stem.visible = false;
             value.title.stopTicker();
             TweenLite.to(value.background, duration, {speed: 0});
             TweenLite.to(value.train, duration, {
               x: -800, onComplete: () => {
                 self.heroState(value.hero, 'stay', false);
               }
             });
             TweenLite.to(value.selector, duration, {
               y: 220, onComplete: () => {

                 overContainer.addChild(value.pass);
                 value.pass.showResult(rightNum, self.totalLevel);
                 value.pass.alpha = 0.2;
                 value.pass.interactive = true;

                 TweenLite.to(value.pass, 1, {alpha: 1});

               }
             });
           }
         }

         function nextLevel() {
           self.answers = value.levelInfo.questions[self.levelIndex].answers;
           self.userAnswers = [[], [], []];
           value.background.speed = 20;
           if (self.levelIndex === 0) {
             // self.heroState(value.hero, 'run_slow');
           } else {
             self.heroState(value.hero, 'run_fast');
           }

           stem.visible = false;
           value.train.gotoTrain(self.totalLevel - self.levelIndex - 1, 2)
             .then(() => {
               value.background.speed = 10;
               self.heroState(value.hero, 'run_slow');
               self.showStem(stem, value.levelInfo, self.levelIndex);
               self.showMatter(matter);
             });

           self.initSelector(value.selector, value.levelInfo, self.levelIndex, self.levelIndex === 0);
           value.title._resetTicker();
           value.title.init(self.levelIndex);
         }


         /!**
          * 控制完成情况的显示
          * @param str text1答对了 text2答错了 text3时间到
          *!/
         function showFinish(str) {
           const animate = value.trainfinish;
           value.victory.play();
           finishContainer.addChild(animate);
           animate.state.setAnimation(0, 'bounce');
           animate.x = 1920 >> 1;
           animate.y = 1080 >> 1;
           let slot = animate.skeleton.findSlot('text');
           let txtAttach = animate.skeleton.getAttachment(slot.data.index, str);
           slot.setAttachment(txtAttach);
           animate.state.addListener({
             complete: () => {
             }
           })
         }
       })*/
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
