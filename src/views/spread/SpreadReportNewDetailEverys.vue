<template>
    <el-card id="srd_info">
        <el-form
                :inline="true"
                label-width="100px"
                @submit.native.prevent
        >
            <el-row
                    type="flex"
                    justify="space-between"
            >
                <el-col
                        :span="11"
                >
                    <el-row
                            type="flex" justify="space-between"
                    >
                        <el-col
                                :span="3"
                        >
                            <el-button
                                    size="medium"
                                    @click="todayBtn"
                            >
                                今天
                            </el-button>
                        </el-col>
                        <el-col
                                :span="3"
                        >
                            <el-button
                                    size="medium"
                                    @click="yesterdayBtn"
                            >
                                昨天
                            </el-button>
                        </el-col>
                        <el-col
                                :span="3"
                        >
                            <el-button
                                    size="medium"
                                    @click="thisWeekBtn"
                            >
                                本周
                            </el-button>
                        </el-col>
                        <el-col
                                :span="3"
                        >
                            <el-button
                                    size="medium"
                                    @click="prevWeekBtn"
                            >
                                上周
                            </el-button>
                        </el-col>
                        <el-col
                                :span="3"
                        >
                            <el-button
                                    size="medium"
                                    @click="thisMonthBtn"
                            >
                                本月
                            </el-button>
                        </el-col>
                        <el-col
                                :span="3"
                        >
                            <el-button
                                    size="medium"
                                    @click="prevMonthBtn"
                            >
                                上月
                            </el-button>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col
                        :span='9'
                >
                    <el-form-item
                            label="选择日期"
                    >
                        <el-date-picker
                                type="daterange"
                                v-model="daterange"
                                range-separator='~'
                                align="center"
                                value-format="yyyy-MM-dd"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                style="width:100%"
                        ></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col
                        :span="2"
                >
                    <el-button
                            type="primary"
                            size="medium"
                            icon="el-icon-search"
                            @click='searchHandle'
                            style="width:100%"
                    >搜索</el-button>
                </el-col>
            </el-row>

                <el-form-item
                        label-width="0"
                >
                    <el-button
                            size="medium"
                            icon="el-icon-d-arrow-left"
                            @click="goBackHandle"
                    >返回上一页
                    </el-button>
                </el-form-item>

        </el-form>
        <el-row
                style="margin-top:10px;"
        >
            <h4 style="margin-bottom: 10px;">会员基本信息</h4>
            <ul
                    class="first_page_count_wrapper"
            >
                <li><span>会员账号：</span><span>{{this.$store.getters.spreadParams.account}}</span></li>
                <li><span>会员ID：</span><span>{{this.$store.getters.spreadParams.id}}</span></li>
                <!-- <li><span>推广等级：</span><span>{{this.userInfo.level}}</span></li> -->
            </ul>
        </el-row>
        <el-row :xl="24" :lg="24" :md="24" :sm="24" :xs="24" style="margin-top:40px;">
            <h4 style="margin-bottom: 10px;">会员团队报表</h4>
            <el-table
                    border
                    :data='tableData'
                    :cell-style="{textAlign:'center'}"
                    :header-cell-style="{textAlign:'center'}"
                    v-loading='loading'
            >
                <el-table-column
                        label="名称" 
                        prop="title"

                >
                   <template slot-scope="{row}">
                          <div v-for='value,index in nameList' class="template_list">
                             {{value}}
                          </div>
                   </template>
                </el-table-column>
                <el-table-column 
                        label="直属代理"
                        prop="title">
                            <template slot-scope="{row}">
                            <div class="template_list">{{subordinate2List.firstRechargeAmount}}元/{{subordinate2List.firstRechargeCount}}人</div>
                            <div class="template_list">{{subordinate2List.secondRechargeAmount}}元/{{subordinate2List.secondRechargeCount}}人</div>
                            <div class="template_list">{{subordinate2List.recharge}}元/{{subordinate2List.rechargeCount}}人</div>
                            <div class="template_list">{{subordinate2List.activityAmount | Upper}}元/{{subordinate2List.activityCount}}人</div>
                            <div class="template_list">{{subordinate2List.drawAmount}}元/{{subordinate2List.drawCount}}人</div>
                            <div class="template_list">{{subordinate2List.rebate | Upper}}元</div>
                            <div class="template_list">{{subordinate2List.tax | Upper}}元/{{subordinate2List.taxCount}}人</div>
                            <div class="template_list">{{subordinate2List.pump | Upper}}元/{{subordinate2List.pumpCount}}人</div>
                            <div class="template_list">{{subordinate2List.betAmount | Upper }}元/{{subordinate2List.betCount}}人</div>
                            <div class="template_list">{{subordinate2List.payOut | Upper}}元/{{subordinate2List.payOutCount}}人</div>
                            <div class="template_list">{{subordinate2List.registerNumber}}</div>
                            <div class="template_list">{{subordinate2List.iosNumber}}</div>
                            <div class="template_list">{{subordinate2List.androidNumber}}</div>
                       </template>
                </el-table-column>
                <el-table-column 
                        label="其他下级"
                        prop="title">
                           <template slot-scope="{row}">
                            <div class="template_list">{{subordinate1List.firstRechargeAmount}}元/{{subordinate1List.firstRechargeCount}}人</div>
                            <div class="template_list">{{subordinate1List.secondRechargeAmount}}元/{{subordinate1List.secondRechargeCount}}人</div>
                            <div class="template_list">{{subordinate1List.recharge}}元/{{subordinate1List.rechargeCount}}人</div>
                            <div class="template_list">{{subordinate1List.activityAmount | Upper}}元/{{subordinate1List.activityCount}}人</div>
                            <div class="template_list">{{subordinate1List.drawAmount}}元/{{subordinate1List.drawCount}}人</div>
                            <div class="template_list">{{subordinate1List.rebate | Upper}}元</div>
                            <div class="template_list">{{subordinate1List.tax | Upper}}元/{{subordinate1List.taxCount}}人</div>
                            <div class="template_list">{{subordinate1List.pump | Upper}}元/{{subordinate1List.pumpCount}}人</div>
                            <div class="template_list">{{subordinate1List.betAmount | Upper }}元/{{subordinate1List.betCount}}人</div>
                            <div class="template_list">{{subordinate1List.payOut | Upper}}元/{{subordinate1List.payOutCount}}人</div>
                            <div class="template_list">{{subordinate1List.registerNumber}}</div>
                            <div class="template_list">{{subordinate1List.iosNumber}}</div>
                            <div class="template_list">{{subordinate1List.androidNumber}}</div>
                       </template>
                </el-table-column>
                <el-table-column 
                        label="汇总"
                        prop="title">
                         <template slot-scope="{row}">
                            <div class="template_list">{{subordinate2List.firstRechargeAmount+subordinate1List.firstRechargeAmount}}元/{{subordinate2List.firstRechargeCount+subordinate1List.firstRechargeCount}}人</div>
                            <div class="template_list">{{subordinate2List.secondRechargeAmount+subordinate1List.secondRechargeAmount}}元/{{subordinate2List.secondRechargeCount+subordinate1List.secondRechargeCount}}人</div>
                            <div class="template_list">{{subordinate2List.recharge+subordinate1List.recharge}}元/{{subordinate2List.rechargeCount+subordinate1List.rechargeCount}}人</div>
                            <div class="template_list">{{(subordinate2List.activityAmount+subordinate1List.activityAmount) | Upper}}元/{{subordinate2List.activityCount+subordinate1List.activityCount}}人</div>
                            <div class="template_list">{{subordinate2List.drawAmount+subordinate1List.drawAmount}}元/{{subordinate2List.drawCount+subordinate1List.drawCount}}人</div>
                            <div class="template_list">{{(subordinate2List.rebate+subordinate1List.rebate) | Upper}}元</div>
                            <div class="template_list">{{(subordinate2List.tax+subordinate1List.tax) | Upper}}元/{{subordinate2List.taxCount+subordinate1List.taxCount}}人</div>
                            <div class="template_list">{{(subordinate2List.pump+subordinate1List.pump ) | Upper}}元/{{subordinate2List.pumpCount+subordinate1List.pumpCount}}人</div>
                            <div class="template_list">{{(subordinate2List.betAmount+subordinate1List.betAmount) | Upper }}元/{{subordinate2List.betCount+subordinate1List.betCount}}人</div>
                            <div class="template_list">{{(subordinate2List.payOut+subordinate1List.payOut) | Upper }}元/{{subordinate2List.payOutCount+subordinate1List.payOutCount}}人</div>
                             <div class="template_list">{{subordinate2List.registerNumber+subordinate1List.registerNumber}}</div>
                            <div class="template_list">{{subordinate2List.iosNumber+subordinate1List.iosNumber}}</div>
                            <div class="template_list">{{subordinate2List.androidNumber+subordinate1List.androidNumber}}</div>
                       </template>
                </el-table-column>

            </el-table>
        </el-row>
    </el-card>
</template>

<script>
    import spreadRequest from '@/request/spread'
    import times from '@/tool/times'

    export default {
        name: 'SpreadReportNewDetailEverys',
        data() {
            return {
                accountId: '',//会员ID
                type: '',//记录是推广团队列表 还是 推广个人列表过来的数据
                daterange: [],

                subordinateLevel: null,
                subordinateTopId: null,

                userInfo: {account: null, play2Id: null, level: null},//会员基本信息
                loading: false,
                subordinate1List: [1,1,2,3,4,5,6,7,8,9,10,11,12],//一级下级代理
                subordinate2List: [1,1,2,3,4,5,6,7,8,9,10,11,12],//二级下级代理
                subordinate3List: [],//三级下级代理
                subordinateSummarizingList: [],//汇总
                nameList: ["首充/人数", "二充/人数", "充值金额/人数", "优惠活动/人数", "提现金额/人数", "贡献返利", "税收金额/人数", "抽水金额/人数", "有效投注/人数", "派彩金额/人数", "注册累计", "IOS下载", "安卓下载"],
               
               tableData: [{
         
                }],//表格数据
            }
        },
        filters: {
            betNumberFormatter(val) {
                if (!val) return "0";
                let str = String(val / 1000);
                let idx = str.indexOf('.') + 4;
                if (str.indexOf('.') > -1) {
                    if (str.length > 4) {
                        return str.slice(0, idx);
                    } else {
                        return str
                    }
                } else {
                    return str
                }
            },
        },
        methods: {
            // filter(i){
            //     let data=['']
            // //    if(i){

            // //    }
            // },
            searchHandle() {
                this.pageNum = 1;
                this.queryHandle();
            },
            goBackHandle() {
                if (this.type == "Single") {
                    this.$router.push({
                        path: '/spread/spreadReport/SpreadReportPersonal',
                        name: '个人推广报表',
                        params: {
                            subordinateTopId: this.subordinateTopId,
                            subordinateLevel: this.subordinateLevel
                        }
                    })
                } else {
                    this.$router.push('/spread/spreadReport')
                }
            },
            queryHandle() { //搜索列表
                this.loading = true;
                let data = {
                    startTime:this.daterange ? this.daterange[0] : '',
                    endTime: this.daterange ? this.daterange[1] : '',
                    id:this.$store.getters.spreadParams.accountId
                   };
                spreadRequest.infinitetaxreportinfo(data).then(res => { // 
                    if (res.code=='200') {
                        this.subordinate1List = res.data.others
                        this.subordinate2List = res.data.ratio1

                    } else {
                        this.$notify.warning({title: res.msg})
                    }
                    this.loading = false;
                }).catch(err => {
                    console.log(err);
                    this.loading = false;
                })
            },
            todayBtn() { //今天按钮
                this.daterange = [];
                this.daterange.push(times.DateToYMD(new Date()));
                this.daterange.push(times.DateToYMD(new Date()));
                this.queryHandle();
            },
            yesterdayBtn() { //昨天按钮
                this.daterange = [];
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
                end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
                this.daterange.push(times.DateToYMD(start));
                this.daterange.push(times.DateToYMD(end));
                this.queryHandle();
            },
            thisWeekBtn() {  //本周按钮
                this.daterange = [];
                let benznow = new Date();
                let day = benznow.getDay();
                let benzMondayTime;
                if (day == 0) {
                    benzMondayTime = benznow.getTime() - 6 * 3600 * 1000 * 24;
                } else {
                    benzMondayTime = benznow.getTime() - (day - 1) * 3600 * 1000 * 24;
                }
                this.daterange.push(times.DateToYMD(new Date(benzMondayTime)));
                this.daterange.push(times.DateToYMD(benznow));
                this.queryHandle();
            },
            prevWeekBtn() {  //上周按钮
                this.daterange = [];
                let shangznow = new Date();
                let shangzday = shangznow.getDay();
                let shangzMondayTime;
                if (shangzday == 0) {
                    shangzMondayTime = shangznow.getTime() - 6 * 3600 * 1000 * 24;  //本周一
                } else {
                    shangzMondayTime = shangznow.getTime() - (shangzday - 1) * 3600 * 1000 * 24;  //本周一
                }
                let prevMondayTime = shangzMondayTime - 7 * 3600 * 1000 * 24; //上周一
                let prevSundayTime = shangzMondayTime - 1 * 3600 * 1000 * 24; //上周日
                this.daterange.push(times.DateToYMD(new Date(prevMondayTime)));
                this.daterange.push(times.DateToYMD(new Date(prevSundayTime)));
                this.queryHandle();
            },
            thisMonthBtn() { //本月按钮
                this.daterange = [];
                const end = new Date();
                const start = new Date();
                const firstDay = start.getTime() - (start.getDate() - 1) * 3600 * 1000 * 24;//本月一号
                this.daterange.push(times.DateToYMD(new Date(firstDay)));
                this.daterange.push(times.DateToYMD(end));
                this.queryHandle();
            },
            prevMonthBtn() {  //上月按钮
                this.daterange = [];
                const start = new Date();
                const prevLastDay = start.getTime() - (start.getDate()) * 3600 * 1000 * 24;//上月最后一天
                const prevFirstDay = prevLastDay - (new Date(prevLastDay).getDate() - 1) * 3600 * 1000 * 24//上月第一天
                this.daterange.push(times.DateToYMD(new Date(prevFirstDay)));
                this.daterange.push(times.DateToYMD(new Date(prevLastDay)));
                this.queryHandle();
            },
            sizeChangeHandle(size) {
                this.pageSize = size;
                this.queryHandle();
            },
            currentChangeHandle(crt) {
                this.pageNum = crt;
                this.queryHandle();
            },
        },
        activated() {
            this.daterange = [];
            this.accountId = this.$store.getters.spreadParams.id; //this.$route.params.accountId;
            this.type = this.$store.getters.spreadParams.type;//是团队还是个人
            this.daterange = this.$store.getters.spreadParams.createDate
            // this.subordinateLevel = this.$store.getters.spreadParams.subordinateLevel ? this.$store.getters.spreadParams.subordinateLevel : null;
            // this.subordinateTopId = this.$store.getters.spreadParams.subordinateTopId ? this.$store.getters.spreadParams.subordinateTopId : null;
            this.queryHandle();
        },
         filters: {　　　　
             Upper(val){//当不需要返回加减号 需要除以1000 需要截取保留2位小数
                //console.log(val);
                if (!val) return "0";
                let str = String(val);
                let mathdata = Math.floor(str) / 1000
                let s = mathdata +''
                if (s.indexOf(".")==-1){
                    console.log(s)
                    return s
                }else{
                    return s.substring(0,s.indexOf(".") + 3) 
                }
                
            },
　　   }
    }
</script>
<style lang="scss">
    .first_page_count_wrapper {
        background-color: #fff;
        width: 100%;
        list-style: none;
        display: flex;
        justify-content: start;
        align-content: center;
        flex-flow: row wrap;
        border: 1px solid #ddd;
        border-bottom: none;
        border-right: none;
        > li {
            width: 50%;
            height: 40px;
            line-height: 40px;
            font-size: 14px;
            border-bottom: 1px solid #ddd;
            border-right: 1px solid #ddd;
            font-weight: bold;
            > span {
                float: left;
                width: 33.33%;
                text-align: right;
                margin-right: 5px;
                font-weight: normal;
            }
        }
    }
    .template_list{
            background: #fff;
            border-bottom: solid 1px #ebeef5;
            height:40px;
            line-height: 40px;
            border-left: solid 1px #ebeef5;
             border-right: solid 1px #ebeef5;
    }
</style>
