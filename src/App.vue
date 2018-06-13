<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App',
    created() {
      var docEl = document.documentElement;
      window.clientWidth = docEl.clientWidth;
      window.clientHeight = docEl.clientHeight;
      if (!window.clientWidth) return;
      var aspectRatio = window.clientWidth / window.clientHeight;
      if (aspectRatio > 1920 / 1080) {
        docEl.style.fontSize = 100 * (window.clientHeight / 1080) + 'px';
        window.base = 100 * (window.clientHeight / 1080);
      } else {
        docEl.style.fontSize = 100 * (window.clientWidth / 1920) + 'px';
        window.base = 100 * (window.clientWidth / 1920);
        // 判断是否为移动设备，提示旋转屏幕
      }
    }
  }
</script>

<style>
  html, body {
    width: 100%;
    height: 100%;
    margin: 0;
  }

  #app {
    width: 100%;
    height: 100%;
  }
</style>
