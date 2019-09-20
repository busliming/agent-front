<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app',
  created () { 
  }
}
</script>

<style>
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
a{
  color: inherit;
  text-decoration: none;
}
#app{
  height: 100vh;
}
#app>.el-container{
  height: 100%;
}
.beforeHover{
  box-shadow: none;
  transition: all .3s;
}
.isHover{
  box-shadow: 0 0 5px rgba(0,0,0,.8) inset !important;
}
</style>
