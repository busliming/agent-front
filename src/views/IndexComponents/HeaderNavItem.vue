<template>
  <div :class="['headernavitem',{'crt':item.name === crtitem.name}]"
    @click="clickHandle(item)"
  >
    <span v-if="item.name == '官方充值'" class="finance_count">{{countinfo.offCount}}</span>
    <!-- <span v-if="item.name == '线上支付'" class="finance_count">{{countinfo.lineCount}}</span> -->
    <span v-if="item.name == '支付宝出款审核'" class="finance_count">{{countinfo.zfbCount}}</span>
    <span v-if="item.name == '银行卡出款审核'" class="finance_count">{{countinfo.bankCount}}</span>
    <span v-if="item.name == '自动出款交易记录'" class="finance_count">{{countinfo.autoCount}}</span>
    <span>{{item.name}}</span>
    <div class="closeBtn"
      @click.stop="closeBtnHandle(item)"
      v-if="index != 0"
    >
      <i class="el-icon-circle-close"></i>
    </div>
  </div>
</template>

<script>
export default {
  name:'HeaderNavItem',
  props:['item','index','countinfo'],
  data () {
    return {
    }
  },
  computed:{
    crtitem(){
      return this.$store.getters.crtitem
    }
  },
  methods:{
    clickHandle(item){
      this.$router.push({
        path:item.path
      })
      this.$store.dispatch('navAddItem',item);
    },
    closeBtnHandle(item){
      this.$store.dispatch('navRemoveItem',item)
    }
  }
}
</script>


