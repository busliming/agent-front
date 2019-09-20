<template>
  <el-container style=";width:100%;height:100%;position:relative;overflow:hidden">
    <transition name="fade" mode="out-in">
      <keep-alive :exclude="['betDetails','MemberDetail']">
        <router-view></router-view>
      </keep-alive>
    </transition>
  </el-container>
</template>

<script>
export default {
}
</script>

<style lang="scss">
.el-container .el-card{
  width: 100%;
}
</style>

<style scoped>
.fade-enter-active,.fade-leave-active{
  opacity: 1;
  transform: translateX(0);
  transform: scale(1);
  transition: all .2s linear;
}
.fade-enter{
  transform: translateX(20px);
  opacity: 0;
}
.fade-leave-to{
  transform: translateX(20px);
  /* transform: scale(.5); */
  opacity: 0;
}
</style>


