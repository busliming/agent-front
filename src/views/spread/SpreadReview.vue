<template>
  <el-tabs id="profitConfBox" v-model="activeName">
          <el-tab-pane  name="Unlimited" >
              <Unlimited v-if="activeName=='Unlimited'"></Unlimited>
          </el-tab-pane>
          <el-tab-pane  name="SThree">
                 三级返利无推广审核
                <!-- <SThree v-if="activeName=='SThree'"></SThree> -->
          </el-tab-pane>
           <el-tab-pane  name="Everys">
                <Everys v-if="activeName=='Everys'"></Everys>
          </el-tab-pane>
    </el-tabs>
</template>

<script>
const Unlimited = () => import('../spread/components/SpreadReportNewUnlimited'); //无限代理
const Everys = () => import('../spread/components/SpreadReportNewEvert');  //无限税收
    export default {
        name: 'SpreadReview',
        components: {
            // SThree,
            Unlimited,
            Everys
        },
        data() {
            return {
              activeName:''
            }
        },
        created() {
             this.activeName=this.$store.getters.gettreba
        }
    }
</script>

<style lang="scss">
 #profitConfBox{
     overflow: auto;
     width: 100%;
     .el-tabs__header{
         display: none;
     }
 }
</style>