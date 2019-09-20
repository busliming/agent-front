<template>
    <el-card class="bet-details" >
        <el-button size="medium" type="info" plain icon="el-icon-caret-left"
                   id="go-back-btn"
                   @click="goBack">
            返回
        </el-button>
        <benChiBaoMa v-if="gameId===1"></benChiBaoMa>
        <feiQinZouShou v-if="gameId===2"></feiQinZouShou>
        <jinChanBuYu v-if="gameId===3 || gameId===13 || gameId===19 || gameId===29"></jinChanBuYu>
        <douDiZhu v-if="gameId===4"></douDiZhu>
        <baiRenNiuNiu v-if="gameId===5"></baiRenNiuNiu>
        <hongHeiDaZhan v-if="gameId===6"></hongHeiDaZhan>
        <erRenPinShi v-if="gameId===7"></erRenPinShi>
        <huanLe30s v-if="gameId===8"></huanLe30s>
        <qiangZhuangNiuNiu v-if="gameId===9"></qiangZhuangNiuNiu>
        <yaoYiYao v-if="gameId===12"></yaoYiYao>
        <deZhou v-if="gameId===15"></deZhou>
        <shiSanShui v-if="gameId===17"></shiSanShui>
        <zhaJinHua v-if="gameId===11"></zhaJinHua>
        <tongBiNiuNiu v-if="gameId===20"></tongBiNiuNiu>
        <yaZhuangLongHu v-if="gameId===21"></yaZhuangLongHu>
        <erShiYiDian v-if="gameId===22"></erShiYiDian>
        <qiangZhuangPaiJiu v-if="gameId===23"></qiangZhuangPaiJiu>
        <erBaGang v-if="gameId===24"></erBaGang>
        <sanGong v-if="gameId===25"></sanGong>
        <senLinWuHui v-if="gameId === 26"></senLinWuHui>
    </el-card>
</template>
<script>
    import benChiBaoMa from './components/BenChiBaoMa'
    import erRenPinShi from './components/ErRenPinShi'
    import qiangZhuangNiuNiu from './components/qiangZhuangNiuNiu'
    import shiSanShui from './components/shiSanShui'
    import hongHeiDaZhan from './components/HongHeiDaZhan'
    import baiRenNiuNiu from './components/BaiRenNiuNiuDetails'
    import yaoYiYao from './components/YaoYiYao'
    import huanLe30s from './components/HuanLe30s'
    import deZhou from './components/deZhou'
    import douDiZhu from './components/DouDiZhuDetails'
    import feiQinZouShou from './components/FeiQinZouShou'
    import jinChanBuYu from './components/JinChanBuYu'
    import zhaJinHua from './components/zhaJinHua'
    import tongBiNiuNiu from './components/tongBiNiuNiu' 
    import yaZhuangLongHu from './components/yaZhuangLongHu'
    import erShiYiDian from './components/erShiYiDian'
    import qiangZhuangPaiJiu from './components/qiangZhuangPaiJiu'
    import erBaGang from './components/erBaGang'
    import sanGong from './components/sanGong'
    import SenLinWuHui from './components/SenLinWuHui'
    export default {
        name: 'betDetails',
        data() {
            return {
                gameId: null,
            }
        },
        components: {
            benChiBaoMa,
            erRenPinShi,
            qiangZhuangNiuNiu,
            shiSanShui,
            hongHeiDaZhan,
            baiRenNiuNiu,
            yaoYiYao,
            huanLe30s,
            deZhou,
            douDiZhu,
            feiQinZouShou,
            jinChanBuYu,
            zhaJinHua,
            tongBiNiuNiu,
            yaZhuangLongHu,
            erShiYiDian,
            qiangZhuangPaiJiu,
            erBaGang,
            sanGong,
            SenLinWuHui,
        },
        methods: {
            goBack() {
                this.$store.dispatch('navGoBack', {
                    name: '投注详情',
                });
            },
        },
        created() {
            this.gameId = this.$route.params.gameId;
        },
        activated() {
            this.gameId = this.$route.params.gameId;
        },
        beforeRouteLeave (to, from , next) { 
          this.$store.dispatch('closeItem',{name:'投注详情'}) //离开页面  关闭页面
          next();
        }
    }
</script>
<style lang="scss" scoped>
    .bet-details {
        position: relative;
        #go-back-btn {
            position: absolute;
            top: 15px;
            right: 50px;
            z-index: 999;
        }
    }
</style>
