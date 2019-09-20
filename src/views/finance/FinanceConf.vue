<template>
  <el-card class="finance-conf">
    <el-tabs
            v-model="activeName"
            type="border-card"
            @tab-click="handleClick"
            @before-leave="handleLeave"
    >
      <el-tab-pane label="代理充值配置" name="first" ref="first">
        <AgentChargeConf
                v-if="index == 0"
                :levels="levels"
                :labels="labels"
                :displayLevels="displayLevels"
        ></AgentChargeConf>
      </el-tab-pane>
      <el-tab-pane label="官方入款配置" name="second">
        <OfficialChargeConf
                v-if="index == 1"
                :levels="levels"
                :labels="labels"
                :displayLevels="displayLevels"
        ></OfficialChargeConf>
      </el-tab-pane>
      <el-tab-pane label="线上入款配置" name="third">
        <OnlinePayConf
                v-if="index == 2"
                :levels="levels"
                :labels="labels"
                :displayLevels="displayLevels"
        ></OnlinePayConf>
      </el-tab-pane>
      <el-tab-pane label="出入款配置" name="fourth">
        <WithdrawConf v-if="index == 3"></WithdrawConf>
      </el-tab-pane>
      <el-tab-pane label="线上出款配置" name="fifth">
        <OnlineWithdrawConf
                v-if="index == 4"
                :levels="levels"
                :displayLevels="displayLevels"
        ></OnlineWithdrawConf>
      </el-tab-pane>
      <el-tab-pane label="固码入款配置" name="sixth">
        <QrCodeConf
                v-if="index == 5"
                :levels="levels"
                :labels="labels"
                :displayLevels="displayLevels"
        ></QrCodeConf>
      </el-tab-pane>
      <el-tab-pane label="微信公众号入款配置" name="seventh">
        <WxCodeWithdrawConf
                v-if="index == 6"
                :levels="levels"
                :labels="labels"
                :displayLevels="displayLevels"
        ></WxCodeWithdrawConf>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
    import member from "@/request/member";
    import depositsConf from "@/request/finance/depositsConf";

    const AgentChargeConf = () =>
        import("@/views/finance/components/AgentChargeConf.vue");
    const OfficialChargeConf = () =>
        import("@/views/finance/components/OfficialChargeConf.vue");
    const OnlinePayConf = () =>
        import("@/views/finance/components/OnlinePayConf.vue");
    const WithdrawConf = () =>
        import("@/views/finance/components/WithdrawConf.vue");
    const OnlineWithdrawConf = () =>
        import("@/views/finance/components/OnlineWithdrawConf.vue");
    const QrCodeConf = () => import("@/views/finance/components/QrCodeConf");
    const WxCodeWithdrawConf = () =>
        import("@/views/finance/components/WxCodeWithdrawConf");

    export default {
        name: "FinanceConf",
        data() {
            return {
                activeName: "first",
                index: 0,
                levels: [],
                labels: []
            };
        },
        components: {
            AgentChargeConf,
            OfficialChargeConf,
            OnlinePayConf,
            WithdrawConf,
            OnlineWithdrawConf,
            QrCodeConf,
            WxCodeWithdrawConf
        },
        methods: {
            handleClick(tab, event) {
                this.index = tab.index;
                // console.log(tab.index, this.activeName);
            },
            handleLeave(activeName, oldActiveName) {
                console.log("1", activeName, "2", oldActiveName);
            },
            displayLevels(row) {
                let levelList = "";
                let tmp = "";
                if (row.userLevel !== undefined && row.userLevel !== null) {
                    if (row.userLevel.length > 0) {
                        var charcode=  row.userLevel.substr(row.userLevel.length-1,1)
                        if(charcode==","){
                            row.userLevel=row.userLevel.slice(0,-1);
                        }
                        tmp = JSON.parse("[" + row.userLevel + "]").map(x => {
                            return parseInt(x, 10);
                        });
                    }
                }
                if (
                    this.levels !== "" &&
                    this.levels !== null &&
                    this.levels !== undefined
                ) {
                    this.levels.forEach((value, idx2) => {
                        if (tmp.length) {
                            tmp.forEach((item, idx1) => {
                                if (item == value.id) {
                                    if (idx1 > 0) {
                                        levelList += ",";
                                    }
                                    levelList += value.levelName;
                                }
                            });
                        } else {
                            levelList += "";
                        }
                    })
                }
                return levelList;
            },
            // 获取会员等级
            initUserLevel() {
                this.levels = [];
                depositsConf.getUserLevel().then(res => {
                    if (res.data && res.data !== null && res.data !== '') {
                        console.log('get this.levels');
                        this.levels = res.data;
                        console.log(this.levels);
                        this.$store.dispatch('clearLevelParams');
                        var arrlist =[];
                        for(var i=0;i<res.data.length;i++){
                            arrlist.push(res.data[i].id);
                        }
                        this.$store.dispatch('setLevelParams',arrlist);

                        /* this.$store.dispatch('clearLevelParams1');
                         this.$store.dispatch('setLevelParams1',res.data);*/
                    }
                })
            },
            // 获取会员标签
            initUserLabel() {
                this.labels = [];
                depositsConf.getUserLabelList().then(res => {
                    if (res && res !== null && res !== '') {
                        this.labels = res;
                        console.log(this.labels);
                        this.$store.dispatch('clearLabelParams');
                        var arrlist =[];
                        for(var i=0;i<res.length;i++){
                            arrlist.push(res[i].id);
                        }
                        this.$store.dispatch('setLabelParams',arrlist);
                    }
                })
            }
        },
        activated() {
            this.initUserLevel();
            this.initUserLabel();
        }
    };
</script>

<style lang="scss" scoped>
  .bottom {
    height: auto;
  }
</style>
