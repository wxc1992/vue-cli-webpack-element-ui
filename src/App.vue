<template>
  <div id="app">
    <transition name="slide">
        <router-view></router-view>
      </transition>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
*{
  margin:0;
  padding:0;
  list-style:none;
}
body,html{
  width: 100%;
  height:100%;

}
#app {
 width: 100%;
 height:100%;
  overflow: hidden;
}
</style>
