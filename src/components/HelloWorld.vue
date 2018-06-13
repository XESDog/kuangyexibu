<template>
  <div>
    <audio id="bgSound" loop="loop"></audio>
    <audio id="effectSound"></audio>
  </div>

</template>

<script>

  import {Application, Container, Graphics, Rectangle, Sprite} from 'pixi.js';
  import {TimelineMax, TweenLite} from 'gsap'
  import Stem from "./Stem";
  import MatterWorld from "./MatterWorld";
  import {ADD_EXCEPT, BOX_SELECTED, CLICK, MyEvent, REMOVE_EXCEPT, SUBMIT, TIME_OVER} from './MyEvent'
  import Box from "./Box";

  const pixelRatio = window.devicePixelRatio || 1;
  const RenderPixi = require('./RenderPixi.js');
  const resource = require('./resource').default;


  export default {
    name: 'HelloWorld',
    data() {
      return {
        width: null,
        height: null,
        bgSound: null,
        effectSound: null,
        levelIndex: 0,
        totalLevel: 0,
        userAnswers: [[], [], []],
        answers: null,
        rectangles: [new Rectangle(192, 324, 500, 420),
          new Rectangle(721, 324, 500, 420),
          new Rectangle(1242, 324, 500, 420),
        ],
        beginBgSound: false
      }
    },
    methods: {
      playEffect(src) {
        this.effectSound.src = src;
        this.effectSound.play();
      },
      playBg(src) {
        if (!this.beginBgSound) {
          this.bgSound.src = src;
          this.bgSound.play();
          this.beginBgSound = true;
        }
      },
      createApp() {
        return new Application({
          width: 1920,
          height: 1080,
          autoSize: true,
          backgroundColor: 0x000000,
        })
      },
      createMask() {
        const mask = new Graphics();
        mask.beginFill(0x000000, 1);
        mask.drawCircle(0, 0, 800);
        mask.endFill();
        mask.x = 1050;
        mask.y = 620;
        return mask;
      },
      layout(stage) {
        const uiContainer = new Container();
        const matterContainer = new Container();
        const dragContainer = new Container();
        const mouseContainer = new Container();
        const stemContainer = new Container();
        const finishContainer = new Container();
        const boxContainer = new Container();

        stage.addChild(uiContainer);
        stage.addChild(matterContainer);
        stage.addChild(boxContainer);
        stage.addChild(stemContainer);
        stage.addChild(finishContainer);
        stage.addChild(dragContainer);
        stage.addChild(mouseContainer);

        return {
          uiContainer,
          matterContainer,
          boxContainer,
          stemContainer,
          finishContainer,
          dragContainer,
          mouseContainer
        };
      },
      heroState(hero, state = 'stay', loop = true) {
        hero.state.setAnimation(0, state).loop = loop;
      },
      initSelector(selector, levelInfo, levelIndex, first) {
        const question = levelInfo.questions[levelIndex];
        const optionCount = question.optionCount;

        if (first) {
          TweenLite.from(selector, 1, {y: selector.y + 220});
          selector.init(levelIndex, optionCount);
        } else {
          let tl = new TimelineMax();
          tl.add(TweenLite.to(selector, 1, {
            y: selector.y + 220, onComplete: () => {
              selector.init(levelIndex, optionCount);
            }
          }))
          tl.add(TweenLite.to(selector, 1, {y: selector.y}));

        }
      },
      showStem(stem, levelInfo, levelIndex) {
        var info = levelInfo.questions[levelIndex].stem;
        stem.initLevel(info);
        stem.visible = true;
      },
      showMatter(matter) {
        matter.visible = true;
      },
      hideMatter(matter) {
        matter.visible = false;
        matter.removeAllBox();
      },
      createDrag(target, dragContainer, matter) {
        let dragObj = null;
        let dragStart = false;
        let dragValue = null;
        target.on('pointerdown', (e) => {

          // self.playBg('./static/sound/train_ground.mp3');
          if (!dragStart) {
            let newP = e.data.getLocalPosition(target);
            let body = matter.queryPoint(newP.x, newP.y);
            if (body && body.length > 0 && body[0].render) {
              dragStart = true;
              let [level, boxIndex, frameIndex] = body[0].render.userInfo;
              let i = this.userAnswers[frameIndex].indexOf(boxIndex);
              if (i !== -1) {
                this.userAnswers[frameIndex].splice(i, 1);
              }

              matter.removeBox(body[0]);
              dragObj = new Box(body[0].render.userInfo[0], body[0].render.userInfo[1], 0.5, 0.5);
              dragObj.x = newP.x;
              dragObj.y = newP.y;
              dragValue = body[0].render.userInfo.concat();
              dragContainer.addChild(dragObj);

              // MyEvent.emit(REMOVE_EXCEPT, dragValue[1]);
            }
          }
        });
        MyEvent.on(BOX_SELECTED, (data) => {
          dragStart = true;
          dragObj = new Box(data[0], data[1], 0.5, 0.5);
          dragObj.x = data[2].x;
          dragObj.y = data[2].y;
          dragValue = data.concat();
          dragContainer.addChild(dragObj);
          MyEvent.emit(ADD_EXCEPT, data[1]);

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
            let {result: rect, index} = this.dragTargetRectangle(newP.x, newP.y);
            if (rect) {
              matter.addBox(dragValue[0], dragValue[1], index, newP.x, newP.y);
              this.userAnswers[index].push(dragValue[1]);
              console.log(this.userAnswers)
            } else {
              if (dragValue) {
                MyEvent.emit(REMOVE_EXCEPT, dragValue[1]);
              }
            }
          }

          dragStart = false;
          dragObj = null;
          while (dragContainer.children[0]) {
            dragContainer.children[0].destroy();
          }
        })
      },
      dragTargetRectangle(x, y) {
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
      }
    },
    mounted: function () {
      const self = this;
      this.width = this.$el.clientWidth;
      this.height = this.$el.clientHeight;

      this.effectSound = document.getElementById('effectSound');
      this.bgSound = document.getElementById('bgSound');

      const app = this.createApp();
      const stage = app.stage;
      const stem = new Stem();
      const {
        uiContainer,
        matterContainer,
        boxContainer,
        stemContainer,
        finishContainer,
        dragContainer,
        mouseContainer
      } = this.layout(stage);

      let mask = this.createMask();
      let matter = null;
      stemContainer.addChild(stem);
      stem.visible = false;

      app.view.style.width = '19.2rem';
      app.view.style.height = '10.8rem';
      self.$el.appendChild(app.view);


      resource()
      //开场动画
        .then(value => {
          return new Promise(resolve => {
            uiContainer.addChild(value.background);
            uiContainer.addChild(value.startscreen);
            uiContainer.interactive = true;
            value.startscreen.state.setAnimation(0, 'startscreen');
            value.startscreen.x = 1920 >> 1;
            value.startscreen.y = 1080 >> 1;
            value.background.visible = false;

            value.startscreen.state.addListener({
              complete: () => {
                return resolve(value);
              }
            })
          })
        })
        //遮罩动画
        .then(value => {
          return new Promise(resolve => {

            uiContainer.addChild(mask);
            //播放圆圈动画
            value.startscreen.mask = mask;

            TweenLite.to(mask.scale, 1, {
              x: 0.2, y: 0.2, onComplete: () => {
                value.background.visible = true;
                value.startscreen.mask = null;
                value.startscreen.parent.removeChild(value.startscreen);

                uiContainer.addChild(value.train);
                uiContainer.addChild(value.hero);
                uiContainer.addChild(value.title);

                uiContainer.addChild(mask);
                mask.clear();
                mask.scale.set(1, 1);
                resolve(value);
              }
            });
          })
        })
        //火车开入
        .then(value => {
          return new Promise(resolve => {
            //方块遮罩
            mask.beginFill(0x000000);
            mask.drawRect(0, 0, 1920, 1080);
            mask.endFill();
            mask.x = 0;
            mask.y = 0;
            mask.alpha = 0.8;

            TweenLite.to(mask, 2, {
              alpha: 0, onComplete: () => {
                uiContainer.removeChild(mask);
                mask = null;
              }
            });


            value.hero.x = 1700;
            value.hero.y = 1000;
            this.heroState(value.hero, 'run_slow');

            self.playEffect('./static/sound/train_pupu.mp3');
            value.train.gotoTrain(value.levelInfo.questions.length - 1, 3)
              .then(() => {
                uiContainer.addChild(value.selector);
                this.initSelector(value.selector, value.levelInfo, this.levelIndex, true);
                this.showStem(stem, value.levelInfo, this.levelIndex);

                matter = new MatterWorld(app.renderer);
                matterContainer.addChild(matter);
                this.showMatter(matter);
                resolve(value);
              });
          })
        })
        .then(value => {
          let mouseCursor;
          mouseCursor = new Sprite(value.hand1);
          mouseContainer.addChild(mouseCursor);
          uiContainer.on('pointermove', (e) => {
            let newP = e.data.getLocalPosition(mouseContainer);
            mouseCursor.x = newP.x;
            mouseCursor.y = newP.y;
          });
          uiContainer.on('pointerdown', () => {
            mouseCursor.texture = value.hand2
          });
          uiContainer.on('pointerup', () => {
            mouseCursor.texture = value.hand1
          });

          this.createDrag(uiContainer, dragContainer, matter);

          this.levelIndex = 0;
          this.totalLevel = value.levelInfo.questions.length;
          this.answers = value.levelInfo.questions[this.levelIndex].answers;


          /**
           * 判断正误
           */
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


          /**
           *
           * 点击提交之后
           */
          MyEvent.on(SUBMIT, () => {
            if (check()) {
              showFinish('text1');
              value.title.changeDotState(self.levelIndex, 1);
            } else {
              showFinish('text2');
              value.title.changeDotState(self.levelIndex, 2);
            }
            passLevel();
          });
          MyEvent.on(ADD_EXCEPT, (index) => {
            value.selector.addExcept(index)
          });
          MyEvent.on(REMOVE_EXCEPT, (index) => {
            value.selector.removeExcept(index)
          });
          /**
           * 时间到了之后
           */
          MyEvent.on(TIME_OVER, () => {
            value.title.changeDotState(self.levelIndex, 2);
            showFinish('text3');
            passLevel();
          });

          MyEvent.on(CLICK, () => {
            self.playEffect('./static/sound/click.mp3');
          });

          function passLevel() {
            self.levelIndex++;
            self.hideMatter(matter);
            if (self.levelIndex < self.totalLevel) {
              nextLevel();
            } else {
              value.background.speed = 20;
              self.heroState(value.hero, 'run_fast')
              stem.visible = false;
              let duration = 2;
              TweenLite.to(value.background, duration, {speed: 0});
              TweenLite.to(value.train, duration, {
                x: -800, onComplete: () => {
                  self.heroState(value.hero, 'stay', false);
                }
              });
              TweenLite.to(value.selector, duration, {
                y: 220, onComplete: () => {
                  uiContainer.addChild(value.pass);
                  value.pass.alpha = 0.2;
                  TweenLite.to(value.pass, 1, {alpha: 1});
                }
              });
            }
          }

          function nextLevel() {
            self.answers = value.levelInfo.questions[self.levelIndex].answers;
            self.userAnswers = [[], [], []];
            value.background.speed = 20;
            self.heroState(value.hero, 'run_fast')
            stem.visible = false;
            value.train.gotoTrain(self.totalLevel - self.levelIndex - 1, 2)
              .then(() => {
                value.background.speed = 10;
                self.heroState(value.hero, 'run_slow');
                self.showStem(stem, value.levelInfo, self.levelIndex);
                self.showMatter(matter);
                value.title.init(self.levelIndex)
              });

            self.initSelector(value.selector, value.levelInfo, self.levelIndex, false);
            value.title.resetTicker();
          }


          /**
           * 控制完成情况的显示
           * @param str text1答对了 text2答错了 text3时间到
           */
          function showFinish(str) {
            self.playEffect('./static/sound/victory.mp3');
            finishContainer.addChild(value.trainfinish);
            value.trainfinish.state.setAnimation(0, 'bounce').loop = true;
            value.trainfinish.x = 1920 >> 1;
            value.trainfinish.y = 1080 >> 1;
            let slot = value.trainfinish.skeleton.findSlot('text')
            let txtAttach = value.trainfinish.skeleton.getAttachment(slot.data.index, str);
            slot.setAttachment(txtAttach);
            TweenLite.delayedCall(2, () => {
              finishContainer.removeChild(value.trainfinish);
            })
          }
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
