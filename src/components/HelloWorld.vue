<template>
  <div>
    <audio id="bgSound" loop="loop"></audio>
    <audio id="effectSound"></audio>
  </div>

</template>

<script>

  import {TimelineMax, TweenLite} from 'gsap';
  import {BOX_SELECTED, CLICK, MyEvent, SUBMIT, TIME_OVER} from './MyEvent';
  import Box from "./Box";
  import {Application, Container, Graphics, Rectangle, Sprite} from 'pixi.js';
  import Stem from "./Stem";
  import MatterWorld from "./MatterWorld";

  const pixelRatio = window.devicePixelRatio || 1;
  const RenderPixi = require('./RenderPixi.js');
  const resource = require('./resource');
  let beginBgSound = false;


  export default {
    name: 'HelloWorld',
    data() {
      return {
        width: null,
        height: null,
        bgSound: null,
        effectSound: null,
      }
    },
    methods: {
      playEffect(src) {
        this.effectSound.src = src;
        this.effectSound.play();
      },
      playBg(src) {
        if (!beginBgSound) {
          this.bgSound.src = src;
          this.bgSound.play();
          beginBgSound = true;
        }

      }
    },
    mounted: function () {
      const self = this;
      this.width = this.$el.clientWidth;
      this.height = this.$el.clientHeight;

      this.effectSound = document.getElementById('effectSound');
      this.bgSound = document.getElementById('bgSound');

      const app = new Application({
        width: 1920,
        height: 1080,
        autoSize: true,
        // antialias: true,
        // transparent: false,
        backgroundColor: 0x000000,
        // resolution: pixelRatio
      })
      app.view.style.width = '19.2rem';
      app.view.style.height = '10.8rem';
      self.$el.appendChild(app.view);


      const stage = app.stage;
      const uiContainer = new Container();
      const matterContainer = new Container();
      const dragContainer = new Container();
      const mouseContainer = new Container();
      const stemContainer = new Container();
      const finishContainer = new Container();
      const boxContainer = new Container();
      const stem = new Stem();

      let mouseCursor;

      stage.addChild(uiContainer);
      stage.addChild(matterContainer);
      stage.addChild(boxContainer);
      stage.addChild(stemContainer);
      stage.addChild(finishContainer);
      stage.addChild(dragContainer);
      stage.addChild(mouseContainer);

      stemContainer.addChild(stem);
      stem.visible = false;


      resource.default()
        .then(value => {
          uiContainer.addChild(value.background);
          uiContainer.addChild(value.startscreen);
          uiContainer.interactive = true;
          value.startscreen.state.setAnimation(0, 'startscreen');
          value.startscreen.x = 1920 >> 1;
          value.startscreen.y = 1080 >> 1;
          value.background.visible = false;

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

          let matter = new MatterWorld(app.renderer);
          matterContainer.addChild(matter);
          hideMatter();

          //拖拽
          {
            let dragObj = null;
            let dragStart = false;
            let dragValue = null;
            uiContainer.on('pointerdown', (e) => {

              // self.playEffect('./static/sound/click.mp3');

              self.playBg('./static/sound/train_ground.mp3');
              if (!dragStart) {
                let newP = e.data.getLocalPosition(uiContainer)
                let body = matter.queryPoint(newP.x, newP.y);
                if (body && body.length > 0 && body[0].render) {
                  dragStart = true;
                  let [level, boxIndex, frameIndex] = body[0].render.userInfo
                  let i = userAnswers[frameIndex].indexOf(boxIndex);
                  if (i !== -1) {
                    userAnswers[frameIndex].splice(i, 1);
                  }

                  console.log(userAnswers)

                  matter.removeBox(body[0]);
                  dragObj = new Box(body[0].render.userInfo[0], body[0].render.userInfo[1]);
                  dragValue = body[0].render.userInfo.concat();
                  dragContainer.addChild(dragObj);
                }
              }
            });
            MyEvent.on(BOX_SELECTED, (data) => {
              dragStart = true;
              dragObj = new Box(data[0], data[1]);
              dragValue = data.concat();
              dragContainer.addChild(dragObj);

            });
            uiContainer.on('pointermove', (e) => {
              if (dragStart && dragObj) {
                let newP = e.data.getLocalPosition(uiContainer)
                dragObj.x = newP.x - dragObj.width / 2;
                dragObj.y = newP.y - dragObj.height / 2;
              }
            });
            uiContainer.on('pointerup', (e) => {

              if (dragStart && dragObj) {
                let newP = e.data.getLocalPosition(uiContainer);
                let {result: rect, index} = dragTargetRectangle(newP.x, newP.y);
                if (rect) {
                  matter.addBox(dragValue[0], dragValue[1], index, newP.x, newP.y);
                  userAnswers[index].push(dragValue[1]);
                  console.log(userAnswers)
                }
              }

              dragStart = false;
              dragObj = null;
              while (dragContainer.children[0]) {
                dragContainer.children[0].destroy();
              }
            })
          }


          let startscreenPlayOver = false;
          let ticker = PIXI.ticker.shared;
          let levelIndex = 0;
          let totalLevel = value.levelInfo.questions.length;
          let firstSelector = true;
          let mask = new Graphics();

          mask.beginFill(0x000000, 1);
          mask.drawCircle(0, 0, 800);
          mask.endFill();
          mask.x = 1050;
          mask.y = 620;

          let userAnswers = [[], [], []];
          let answers = value.levelInfo.questions[levelIndex].answers;
          let rectangles = [new Rectangle(192, 324, 500, 420),
            new Rectangle(721, 324, 500, 420),
            new Rectangle(1242, 324, 500, 420),
          ];


          function dragTargetRectangle(x, y) {
            let result = null;
            let index = null;
            rectangles.some((value, i) => {
              if (value.contains(x, y)) {
                result = value;
                index = i
                return true;
              }

            });
            return {result, index};
          }

          function hideMatter() {
            matter.visible = false;
            matter.removeAllBox();
          }

          function showMatter() {
            matter.visible = true;
          }

          /**
           * 判断正误
           */
          function check() {
            let answerLen = answers.length;
            let userLen = userAnswers.length;
            if (answerLen !== userLen) return false;


            userAnswers.forEach((value) => {
              value.sort();
            });
            answers.forEach(value => {
              value.sort();
            });
            if (JSON.stringify(userAnswers) === JSON.stringify(answers)) {
              return true
            }
            return false;
          }

          ticker.add(() => {
            if (startscreenPlayOver) {
              value.startscreen.destroy();
            }
          });

          value.startscreen.state.addListener({
            complete: startscreenComplete
          });

          /**
           *
           * 点击提交之后
           */
          MyEvent.on(SUBMIT, () => {
            if (check()) {
              showFinish('text1');
              value.title.changeDotState(levelIndex, 1);
            } else {
              showFinish('text2');
              value.title.changeDotState(levelIndex, 2);
            }
            passLevel();
          });
          /**
           * 时间到了之后
           */
          MyEvent.on(TIME_OVER, () => {
            value.title.changeDotState(levelIndex, 2);
            showFinish('text3');
            passLevel();
          });

          MyEvent.on(CLICK, () => {
            self.playEffect('./static/sound/click.mp3');
          });

          function passLevel() {
            levelIndex++;
            hideMatter();
            if (levelIndex < totalLevel) {
              nextLevel();
            } else {
              value.background.speed = 20;
              heroFast();
              stem.visible = false;
              let duration = 2;
              TweenLite.to(value.background, duration, {speed: 0});
              TweenLite.to(value.train, duration, {
                x: -800, onComplete: () => {
                  heroStay();
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
            answers = value.levelInfo.questions[levelIndex].answers;
            userAnswers = [[], [], []];
            value.background.speed = 20;
            heroFast();
            stem.visible = false;
            value.train.gotoTrain(totalLevel - levelIndex - 1, 2)
              .then(() => {
                value.background.speed = 10;
                heroSlow();
                showStem(levelIndex);
                showMatter();
              });

            initSelector(levelIndex);
            value.title.resetTicker();
          }

          /**
           * 开场动画播放完成
           */
          function startscreenComplete(entry) {

            uiContainer.addChild(mask);
            //播放圆圈动画
            value.startscreen.mask = mask;

            TweenLite.to(mask.scale, 1, {
              x: 0.2, y: 0.2, onUpdate: () => {
              }, onComplete: () => {
                startscreenPlayOver = true;
                value.background.visible = true;
                value.startscreen.mask = null;

                // mask = null;

                uiContainer.addChild(value.train);
                uiContainer.addChild(value.hero);
                uiContainer.addChild(value.title);

                uiContainer.addChild(mask);
                mask.clear();
                mask.scale.set(1, 1);
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
                heroSlow();

                self.playEffect('./static/sound/train_pupu.mp3');
                value.train.gotoTrain(value.levelInfo.questions.length - 1, 3)
                  .then(() => {
                    uiContainer.addChild(value.selector);
                    initSelector(levelIndex);
                    showStem(levelIndex);
                    showMatter();
                  });
              }
            });


          }

          /**
           * 控制stem显示
           */
          function showStem(levelIndex) {
            var info = value.levelInfo.questions[levelIndex].stem;
            stem.initLevel(info)
            stem.visible = true;
          }

          function heroSlow() {
            value.hero.state.setAnimation(0, 'run_slow').loop = true;
          }

          function heroFast() {
            value.hero.state.setAnimation(0, 'run_fast').loop = true;
          }

          function heroStay() {
            value.hero.state.setAnimation(0, 'stay');
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


          /**
           * 控制Selector显示
           * @param index
           */
          function initSelector(index) {
            let question = value.levelInfo.questions[index];
            let optionCount = question.optionCount;

            if (firstSelector) {
              firstSelector = false;
              TweenLite.from(value.selector, 1, {y: value.selector.y + 220})
              value.selector.initOptions(0, index, optionCount)
            } else {
              let tl = new TimelineMax({repeat: 1, yoyo: true,});
              tl.add(TweenLite.to(value.selector, 1, {y: value.selector.y + 220})).yoyo();
              value.selector.initOptions(0, index, optionCount)
            }
          }
        });
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
