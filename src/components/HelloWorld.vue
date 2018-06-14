<template>
  <div>
  </div>

</template>

<script>

  import {Application, Container, Graphics, Rectangle, Sprite} from 'pixi.js';
  import {TimelineMax, TweenLite} from 'gsap'
  import Stem from "./ui/Stem";
  import MatterWorld from "./matter/MatterWorld";
  import {BOX_SELECTED, CLICK, MyEvent, REMOVE_EXCEPT, RESET, START_GAME, SUBMIT, TIME_OVER} from './MyEvent'
  import Box from "./ui/Box";
  import DragBoxEvent from "./type/DragBoxEvent";

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
        const heroContainer = new Container();
        const overContainer = new Container();

        stage.addChild(uiContainer);
        stage.addChild(matterContainer);
        stage.addChild(boxContainer);
        stage.addChild(stemContainer);
        stage.addChild(heroContainer);
        stage.addChild(finishContainer);
        stage.addChild(dragContainer);
        stage.addChild(overContainer);
        stage.addChild(mouseContainer);

        return {
          uiContainer,
          matterContainer,
          boxContainer,
          stemContainer,
          finishContainer,
          dragContainer,
          mouseContainer,
          heroContainer,
          overContainer
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
        mouseContainer,
        heroContainer,
        overContainer
      } = this.layout(stage);

      let mask = this.createMask();
      let matter = null;
      stemContainer.addChild(stem);
      stem.visible = false;

      app.view.style.width = '19.2rem';
      app.view.style.height = '10.8rem';
      self.$el.appendChild(app.view);

      stage.interactive = true;

      resource()
        .then(value => {

          let mouseCursor;
          mouseCursor = new Sprite(value.hand1);
          mouseContainer.addChild(mouseCursor);
          stage.on('pointermove', (e) => {
            let newP = e.data.getLocalPosition(stage);
            mouseCursor.x = newP.x;
            mouseCursor.y = newP.y;
          });
          stage.on('pointerdown', () => {
            mouseCursor.texture = value.hand2
          });
          stage.on('pointerup', () => {
            mouseCursor.texture = value.hand1;
            value.click.play();
          });

          return new Promise(resolve => {
            uiContainer.addChild(value.start);
            MyEvent.on(START_GAME, () => {
              resolve(value);
            })
          })

        })
        //开场动画
        .then(value => {
          return new Promise(resolve => {
            uiContainer.removeChild(value.start);
            value.lily_help.play();
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
            value.lily_ya.play();
            uiContainer.addChild(mask);
            //播放圆圈动画
            value.startscreen.mask = mask;

            TweenLite.to(mask.scale, 1, {
              x: 0.2, y: 0.2, onComplete: () => {
                value.background.visible = true;
                value.startscreen.mask = null;
                value.startscreen.parent.removeChild(value.startscreen);

                uiContainer.addChild(value.train);
                uiContainer.addChild(value.title);
                heroContainer.addChild(value.hero);

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
          value.train_ground.loop = true;
          value.train_ground.play();
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

            value.train_pupu.play();
            value.train.gotoTrain(value.levelInfo.questions.length - 1, 3)
              .then(() => {
                uiContainer.addChild(value.selector);
                // this.initSelector(value.selector, value.levelInfo, this.levelIndex, true);
                this.showStem(stem, value.levelInfo, this.levelIndex);
                value.title.loopSway();

                matter = new MatterWorld(app.renderer);
                matterContainer.addChild(matter);
                this.showMatter(matter);
                resolve(value);
              });
          })
        })
        .then(value => {
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
          MyEvent.on(RESET, () => {
            const question = value.levelInfo.questions[self.levelIndex];
            const optionCount = question.optionCount;
            self.userAnswers = [[], [], []];
            value.selector.init(self.levelIndex, optionCount)
            matter.removeAllBox();
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
            value.click.play();
          });

          function passLevel() {
            self.levelIndex++;
            self.hideMatter(matter);
            if (self.levelIndex < self.totalLevel) {
              nextLevel();
            } else {
              let duration = 2;
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
            value.title.resetTicker();
            value.title.init(self.levelIndex);
          }


          /**
           * 控制完成情况的显示
           * @param str text1答对了 text2答错了 text3时间到
           */
          function showFinish(str) {
            value.victory.play();
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
