<template>
  <div class="global_components_copy_wrapper">
    <div :class="['global_components_copy_disable_mask',{disable:disable}]"></div>
    <input type="text" v-model="content" ref="INPUT" class="inputsss">
    <button class="global_components_copy_button"
      @click.stop.prevent="copyHandle"
    >
      <i class="iconfont icon-fuzhi"></i>
    </button>
  </div>
</template>

<script>
/**
 * 点击复制组件,将传入的值写入操作系统剪贴板
 * @author Nathan
 * @augments content:需要复制的值
 */
export default {
  name: "clickToCopy",
  props: [
    'content'
  ],
  created(){
    if((!this.content) || this.content == null || this.content == undefined){
      this.disable = true 
    }else{
      this.disable = false;
    }
  },
  updated() {
    if((!this.content) || this.content == null || this.content == undefined){
      this.disable = true 
    }else{
      this.disable = false;
    }
  },
  data() {
    return {
      disable: false // 禁用组件true   启用组件false
    };
  },
  methods: {
    copyHandle(){
      let input = this.$refs.INPUT;
      try {
        input.select(); // 选中文本
        document.execCommand("copy"); // 复制
        this.$message.success('复制成功');
      }catch(e){
        this.$message.warning('复制失败');
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.global_components_copy_wrapper {
  position: relative;
  >input{
    position: absolute;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    opacity: 0;
  }
  .global_components_copy_button {
    position: relative;
    background: none;
    border: none;
    outline: none;
    cursor: pointer;
    z-index: 2;
    user-select: none;
    >i{
      font-size: 20px;
      color: deepskyblue;
    }
    &:hover {
      >i{
        font-size: 20px;
        color: blueviolet;
      }
    }
  }
  .global_components_copy_disable_mask {
    position: absolute;
    z-index: 1;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.5);
    cursor: not-allowed;
    &.disable {
      z-index: 3;
    }
  }
}
</style>

