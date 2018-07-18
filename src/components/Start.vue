<template>
  <div></div>
</template>

<script>
  import {Application, Container, Graphics} from 'pixi.js'
  import {getAnimation, load} from './resource';
  import {TweenLite} from 'gsap';
  import {appEvent, GAME_START} from "./Event";

  let app;
  let resource;
  let Start, RES, start, uiContainer, mouseContainer, mask, MouseCursor;

  export default {
    name: "start",
    methods: {
      createApp() {
        return new Application({
          width: 1920,
          height: 1080,
          autoSize: true,
          backgroundColor: 0x000000,
        })
      },
    },
    destroyed() {
      app.destroy();
    },
    mounted() {

      app = this.createApp();
      const stage = app.stage;
      const self = this;

      app.view.style.width = '19.2rem';
      app.view.style.height = '10.8rem';
      self.$el.appendChild(app.view);
      stage.interactive = true;

      uiContainer = new Container();
      mouseContainer = new Container();

      stage.addChild(uiContainer);
      stage.addChild(mouseContainer);

      //考虑到从别的路由跳转回来的情况，资源会导致多次加载。因此通过这里的判断来区分一下
      new Promise(resolve => {
        if (resource) {
          resolve();
        } else {
          resolve(load());
        }
      })

        .then(res => {
          resource = res;
          Start = require('./ui/Start').default;
          RES = require('./RES');
          MouseCursor=require('./ui/MouseCursor').default
          start = new Start();
          uiContainer.addChild(start);

          mouseContainer.addChild(new MouseCursor());

          return new Promise(resolve => {
            appEvent.once(GAME_START, () => {
              uiContainer.removeChild(start);
              start.destroy();
              resolve(res);
            })
          })
        })
        //开场动画
        .then(res => {
          return new Promise(resolve => {
            let startAnimation = getAnimation('animation_startscreen_json');

            RES.SOUND_LILY_HELP_MP3.play();
            uiContainer.addChild(startAnimation);
            startAnimation.state.setAnimation(0, 'startscreen');
            startAnimation.x = 1920 >> 1;
            startAnimation.y = 1080 >> 1;

            startAnimation.state.addListener({
              complete: () => {
                return resolve(res);
              }
            })
          })
        })
        //遮罩动画
        .then(res => {
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
                resolve(res);
              }
            });
          })
        })
        .then(() => {
          self.$router.push('/gameing')
        })
    }
  }
</script>

<style scoped>
  div {
    width: 19.2rem;
    height: 10.8rem;
  }

</style>
