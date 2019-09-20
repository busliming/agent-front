<template>
   <div id="SpreadReportBox"><component :is="activeName"></component></div>
</template>

<script>
const SThree = () => import('../spread/components/SpreadReportThree.vue'); //三级报表
const Unlimited = () => import('../spread/components/SpreadReportUnlimited'); //无限极报表
const Everys = () => import('../spread/components/SpreadReportEvery'); //无限极报表
    export default {
        name: 'SpreadReportBox',
        components: {
            SThree,
            Unlimited,
            Everys
        },
        data() {
            return {
              activeName:''
            }
        },
        created() {
          this.activeName =  this.$store.getters.gettreba  
        }
    }
</script>

<style lang="scss">
 #SpreadReportBox{
     overflow: auto;
     width: 100%;
 }

</style>