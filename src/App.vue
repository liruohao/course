<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
#app {
  width: 100%;
  height: 100%;
  position: relative;
&>div{
   position: absolute;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
 }
}
</style>
