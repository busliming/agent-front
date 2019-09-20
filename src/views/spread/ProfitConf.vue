<template>
    <div id="profitConfBox"><component :is="activeName"></component></div>
</template>

<script>
const SThree = () => import('../spread/components/ProfitConfThree');
const Unlimited = () => import('../spread/components/ProfitConfUnlimited'); //无限代理
const Everys = () => import('../spread/components/ProfitConfEvery');  //无限税收
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
             this.activeName=this.$store.getters.gettreba
        }
    }
</script>

<style lang="scss">
 #profitConfBox{
     overflow: auto;
     width: 100%;
 }
</style>

