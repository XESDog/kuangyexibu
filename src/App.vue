<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App',
    mounted() {
      const self = this;

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
</style>
