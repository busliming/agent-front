<template>
  <el-card>
    <el-tabs  type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="历史稽核查询" name="AuditHistory">
        <AuditHistory
          v-if="index == 0"
          @tabChange = 'tabChangeHandle'
        ></AuditHistory>
      </el-tab-pane>
      <el-tab-pane label="即时稽核查询" name="AuditNow">
        <AuditNow
          v-if="index == 1"
          @tabChange = 'tabChangeHandle'
        ></AuditNow>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
const AuditHistory = () => import('@/views/finance/components/AuditHistory.vue');
const AuditNow = () => import('@/views/finance/components/AuditNow.vue');

export default {
  name:'AuditRecord',
  components: {
      AuditHistory,
      AuditNow,
  },
  created(){
    console.log('稽核查询created');
    this.index = 0;
    this.activeName = 'AuditHistory';
  },
  // activated(){
  //   console.log('稽核查询activated');
  //   this.$nextTick(() => {
  //     let drawnumber = this.$store.getters.auditParams.drawnumber;  //出款审核订单号
  //     let orderState = this.$store.getters.auditParams.state;  //出款审核订单状态
  //     console.log('从出款审核带过来的drawnumber为：'+drawnumber);
  //     console.log('从出款审核带过来的orderState为：'+orderState);
  //     if(!drawnumber){  //根据store.state判断是从菜单进入还是跳转进入
  //       this.index = 0;
  //       this.activeName = 'AuditHistory';
  //     }else{ //从出款审核跳转过来
  //       if(orderState == 1 || orderState == 4){
  //         console.log('跳转即时稽核')
  //         this.index = 1;
  //         this.activeName = 'AuditNow';
  //       }else{
  //         console.log('跳转历史稽核')
  //         this.index = 0;
  //         this.activeName = 'AuditHistory';
  //       }
  //     }
  //   })
  // },
  data(){
    return{
      activeName:'AuditHistory',
      index:0,
    }
  },
  methods:{
    handleClick(tab, event) {
      this.index = tab.index;
    },
    tabChangeHandle(index,name){
      this.index = index;
      this.activeName = name;
    }
  }
}
</script>

