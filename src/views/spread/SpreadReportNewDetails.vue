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
                <li><span>会员账号：</span><span>{{this.userInfo.account}}</span></li>
                <li><span>会员ID：</span><span>{{this.userInfo.play2Id}}</span></li>
                <li><span>推广等级：</span><span>{{this.userInfo.level}}</span></li>
            </ul>
        </el-row>
        <el-row :xl="24" :lg="24" :md="24" :sm="24" :xs="24" style="margin-top:40px;">
            <h4 style="margin-bottom: 10px;">会员团队报表</h4>
            <el-table
                    border
                    fit
                    stripe
                    :data='tableData'
                    :cell-style="{textAlign:'center'}"
                    :header-cell-style="{textAlign:'center'}"
                    v-loading='loading'
            >
                <el-table-column
                        label="名称"
                        prop="title"
                >
                </el-table-column>
               <el-table-column
                        label="一级下级代理"
                >
                   <template slot-scope="scope" >
                       <div v-show="scope.row.onecount!=-1" >
                           <div v-if="scope.$index==0 || scope.$index==1 ||scope.$index==2 ||scope.$index==4 ||scope.$index==10 || scope.$index==11||scope.$index==12 ">
                               {{ scope.row.one }} / {{scope.row.onecount}}
                           </div>
                           <div v-else>
                               {{ scope.row.one | betNumberFormatter}} / {{scope.row.onecount}}
                           </div>
                       </div>
                       <div v-show="scope.row.onecount==-1">
                           <div v-if="scope.$index==0 || scope.$index==1 ||scope.$index==2 ||scope.$index==4 ||scope.$index==10 || scope.$index==11||scope.$index==12 ">
                               {{ scope.row.one }}
                           </div>
                           <div v-else>
                               {{ scope.row.one | betNumberFormatter}}
                           </div>
                       </div>
                   </template>
                </el-table-column>
                 <el-table-column
                         label="二级下级代理"
                 >
                     <template slot-scope="scope">
                         <div v-show="scope.row.twocount!=-1" >
                             <div v-if="scope.$index==0 || scope.$index==1 ||scope.$index==2 ||scope.$index==4 ||scope.$index==10 || scope.$index==11||scope.$index==12 ">
                                {{ scope.row.two }} / {{scope.row.twocount}}
                             </div>
                             <div v-else>
                                 {{ scope.row.two | betNumberFormatter}} / {{scope.row.twocount}}
                             </div>
                         </div>
                         <div v-show="scope.row.twocount==-1" >
                             <div v-if="scope.$index==0 || scope.$index==1 ||scope.$index==2 ||scope.$index==4 ||scope.$index==10 || scope.$index==11||scope.$index==12 ">
                                 {{ scope.row.two }}
                             </div>
                             <div v-else>
                                 {{ scope.row.two | betNumberFormatter}}
                             </div>
                         </div>
                     </template>
                 </el-table-column>
                  <el-table-column
                          label="三级下级代理"
                  >
                      <template slot-scope="scope">
                          <div v-show="scope.row.threecount!=-1">
                              <div v-if="scope.$index==0 || scope.$index==1 ||scope.$index==2 ||scope.$index==4 ||scope.$index==10 || scope.$index==11||scope.$index==12 ">
                                  {{ scope.row.three }} / {{scope.row.threecount}}
                              </div>
                              <div v-else>
                                  {{ scope.row.three | betNumberFormatter}} / {{scope.row.threecount}}
                              </div>
                          </div>
                          <div v-show="scope.row.threecount==-1" >
                              <div v-if="scope.$index==0 || scope.$index==1 ||scope.$index==2 ||scope.$index==4 ||scope.$index==10 || scope.$index==11||scope.$index==12 ">
                                  {{ scope.row.three }}
                              </div>
                              <div v-else>
                                  {{ scope.row.three | betNumberFormatter}}
                              </div>
                          </div>
                      </template>
                  </el-table-column>
                 <el-table-column
                         label="汇总"
                 >
                     <template slot-scope="scope">
                         <div v-show="scope.row.totalcount!=-1" >
                             <div v-if="scope.$index==0 || scope.$index==1 ||scope.$index==2 ||scope.$index==4 ||scope.$index==10 || scope.$index==11||scope.$index==12 ">
                                 {{ scope.row.total }} / {{scope.row.totalcount}}
                             </div>
                             <div v-else>
                                 {{ scope.row.total | betNumberFormatter}} / {{scope.row.totalcount}}
                             </div>
                         </div>
                         <div v-show="scope.row.totalcount==-1">
                             <div v-if="scope.$index==0 || scope.$index==1 ||scope.$index==2 ||scope.$index==4 ||scope.$index==10 || scope.$index==11||scope.$index==12 ">
                                 {{ scope.row.total }}
                             </div>
                             <div v-else>
                                 {{ scope.row.total | betNumberFormatter}}
                             </div>
                         </div>
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
        name: 'SpreadReportNewDetails',
        data() {
            return {
                accountId: '',//会员ID
                type: '',//记录是推广团队列表 还是 推广个人列表过来的数据
                daterange: [],

                subordinateLevel: null,
                subordinateTopId: null,

                userInfo: {account: null, play2Id: null, level: null},//会员基本信息
                loading: false,
                subordinate1List: [],//一级下级代理
                subordinate2List: [],//二级下级代理
                subordinate3List: [],//三级下级代理
                subordinateSummarizingList: [],//汇总
                nameList: ["首充/笔数", "充值金额/笔数", "二次充值/笔数", "活动优惠", "提现金额/笔数", "返利金额", "税收金额", "抽水", "有效投注", "派彩金额", "注册累计", "IOS下载", "安卓下载"],
                tableData: [{
                    title: '',
                    one: null,
                    onecount: -1,
                    two: null,
                    twocount: -1,
                    three: null,
                    threecount: -1,
                    total: null,
                    totalcount: -1
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
                    accountId: this.accountId,
                    startTime: this.daterange ? this.daterange[0] : '',
                    endTime: this.daterange ? this.daterange[1] : '',

                };
                spreadRequest.getPromotionGroupReportDetails(data).then(res => {
                    if (res.account!=null) {
                        //console.log(res);
                        this.userInfo.account = res.account;
                        this.userInfo.play2Id = res.play2Id;
                        this.userInfo.level = res.level;


                        this.subordinate1List[0] = {
                            firstRechargeAmount: res.subordinate1 != null && res.subordinate1.firstRechargeAmount != null ? res.subordinate1.firstRechargeAmount : 0,
                            firstRechargeAmountCount: res.subordinate1 != null && res.subordinate1.firstRechargeAmountCount != null ? res.subordinate1.firstRechargeAmountCount : 0
                        };//一级下级代理 首充/笔数
                        this.subordinate1List[1] = {
                            rechargeAmount: res.subordinate1 != null && res.subordinate1.rechargeAmount != null ? res.subordinate1.rechargeAmount : 0,
                            rechargeAmountCount: res.subordinate1 != null && res.subordinate1.rechargeAmountCount != null ? res.subordinate1.rechargeAmountCount : 0
                        };//一级下级代理
                        this.subordinate1List[2] = {
                            secondRechargeAmount: res.subordinate1 != null && res.subordinate1.secondRechargeAmount != null ? res.subordinate1.secondRechargeAmount : 0,
                            secondRechargeAmountCount: res.subordinate1 != null && res.subordinate1.secondRechargeAmountCount != null ? res.subordinate1.secondRechargeAmountCount : 0
                        };//一级下级代理
                        this.subordinate1List[3] = {activityAmount: res.subordinate1 != null && res.subordinate1.activityAmount != null ? res.subordinate1.activityAmount : 0};
                        this.subordinate1List[4] = {
                            withdrawAmount: res.subordinate1 != null && res.subordinate1.withdrawAmount != null ? res.subordinate1.withdrawAmount : 0,
                            withdrawAmountCount: res.subordinate1 != null && res.subordinate1.withdrawAmountCount != null ? res.subordinate1.withdrawAmountCount : 0
                        };//一级下级代理
                        this.subordinate1List[5] = {rebate: res.subordinate1 != null && res.subordinate1.rebate != null ? res.subordinate1.rebate : 0};
                        this.subordinate1List[6] = {tax: res.subordinate1 != null && res.subordinate1.tax != null ? res.subordinate1.tax : 0};
                        this.subordinate1List[7] = {pump: res.subordinate1 != null && res.subordinate1.pump != null ? res.subordinate1.pump : 0};
                        this.subordinate1List[8] = {betAmount: res.subordinate1 != null && res.subordinate1.betAmount != null ? res.subordinate1.betAmount : 0};
                        this.subordinate1List[9] = {changeAmount: res.subordinate1 != null && res.subordinate1.changeAmount != null ? res.subordinate1.changeAmount : 0};
                        this.subordinate1List[10] = {registerCount: res.subordinate1 != null && res.subordinate1.registerCount != null ? res.subordinate1.registerCount : 0};
                        this.subordinate1List[11] = {iosNumber: res.subordinate1 != null && res.subordinate1.iosNumber != null ? res.subordinate1.iosNumber : 0};
                        this.subordinate1List[12] = {androidNumber: res.subordinate1 != null && res.subordinate1.androidNumber != null ? res.subordinate1.androidNumber : 0};

                        this.subordinate2List[0] = {
                            firstRechargeAmount: res.subordinate2 != null && res.subordinate2.firstRechargeAmount != null ? res.subordinate2.firstRechargeAmount : 0,
                            firstRechargeAmountCount: res.subordinate2 != null && res.subordinate2.firstRechargeAmountCount != null ? res.subordinate2.firstRechargeAmountCount : 0
                        };//二级下级代理
                        this.subordinate2List[1] = {
                            rechargeAmount: res.subordinate2 != null && res.subordinate2.rechargeAmount != null ? res.subordinate2.rechargeAmount : 0,
                            rechargeAmountCount: res.subordinate2 != null && res.subordinate2.rechargeAmountCount != null ? res.subordinate2.rechargeAmountCount : 0
                        };//二级下级代理
                        this.subordinate2List[2] = {
                            secondRechargeAmount: res.subordinate2 != null && res.subordinate2.secondRechargeAmount != null ? res.subordinate2.secondRechargeAmount : 0,
                            secondRechargeAmountCount: res.subordinate2 != null && res.subordinate2.secondRechargeAmountCount != null ? res.subordinate2.secondRechargeAmountCount : 0
                        };//二级下级代理
                        this.subordinate2List[3] = {activityAmount: res.subordinate2 != null && res.subordinate2.activityAmount != null ? res.subordinate2.activityAmount : 0};
                        this.subordinate2List[4] = {
                            withdrawAmount: res.subordinate2 != null && res.subordinate2.withdrawAmount != null ? res.subordinate2.withdrawAmount : 0,
                            withdrawAmountCount: res.subordinate2 != null && res.subordinate2.withdrawAmountCount != null ? res.subordinate2.withdrawAmountCount : 0
                        };//二级下级代理
                        this.subordinate2List[5] = {rebate: res.subordinate2 != null && res.subordinate2.rebate != null ? res.subordinate2.rebate : 0};
                        this.subordinate2List[6] = {tax: res.subordinate2 != null && res.subordinate2.tax != null ? res.subordinate2.tax : 0};
                        this.subordinate2List[7] = {pump: res.subordinate2 != null && res.subordinate2.pump != null ? res.subordinate2.pump : 0};
                        this.subordinate2List[8] = {betAmount: res.subordinate2 != null && res.subordinate2.betAmount != null ? res.subordinate2.betAmount : 0};
                        this.subordinate2List[9] = {changeAmount: res.subordinate2 != null && res.subordinate2.changeAmount != null ? res.subordinate2.changeAmount : 0};
                        this.subordinate2List[10] = {registerCount: res.subordinate2 != null && res.subordinate2.registerCount != null ? res.subordinate2.registerCount : 0};
                        this.subordinate2List[11] = {iosNumber: res.subordinate2 != null && res.subordinate2.iosNumber != null ? res.subordinate2.iosNumber : 0};
                        this.subordinate2List[12] = {androidNumber: res.subordinate2 != null && res.subordinate2.androidNumber != null ? res.subordinate2.androidNumber : 0};

                        this.subordinate3List[0] = {
                            firstRechargeAmount: res.subordinate3 != null && res.subordinate3.firstRechargeAmount != null ? res.subordinate3.firstRechargeAmount : 0,
                            firstRechargeAmountCount: res.subordinate3 != null && res.subordinate3.firstRechargeAmountCount != null ? res.subordinate3.firstRechargeAmountCount : 0
                        };//三级下级代理
                        this.subordinate3List[1] = {
                            rechargeAmount: res.subordinate3 != null && res.subordinate3.rechargeAmount != null ? res.subordinate3.rechargeAmount : 0,
                            rechargeAmountCount: res.subordinate3 != null && res.subordinate3.rechargeAmountCount != null ? res.subordinate3.rechargeAmountCount : 0
                        };//三级下级代理
                        this.subordinate3List[2] = {
                            secondRechargeAmount: res.subordinate3 != null && res.subordinate3.secondRechargeAmount != null ? res.subordinate3.secondRechargeAmount : 0,
                            secondRechargeAmountCount: res.subordinate3 != null && res.subordinate3.secondRechargeAmountCount != null ? res.subordinate3.secondRechargeAmountCount : 0
                        };//三级下级代理
                        this.subordinate3List[3] = {activityAmount: res.subordinate3 != null && res.subordinate3.activityAmount != null ? res.subordinate3.activityAmount : 0};
                        this.subordinate3List[4] = {
                            withdrawAmount: res.subordinate3 != null && res.subordinate3.withdrawAmount != null ? res.subordinate3.withdrawAmount : 0,
                            withdrawAmountCount: res.subordinate3 != null && res.subordinate3.withdrawAmountCount != null ? res.subordinate3.withdrawAmountCount : 0
                        };//三级下级代理
                        this.subordinate3List[5] = {rebate: res.subordinate3 != null && res.subordinate3.rebate != null ? res.subordinate3.rebate : 0};
                        this.subordinate3List[6] = {tax: res.subordinate3 != null && res.subordinate3.tax != null ? res.subordinate3.tax : 0};
                        this.subordinate3List[7] = {pump: res.subordinate3 != null && res.subordinate3.pump != null ? res.subordinate3.pump : 0};
                        this.subordinate3List[8] = {betAmount: res.subordinate3 != null && res.subordinate3.betAmount != null ? res.subordinate3.betAmount : 0};
                        this.subordinate3List[9] = {changeAmount: res.subordinate3 != null && res.subordinate3.changeAmount != null ? res.subordinate3.changeAmount : 0};
                        this.subordinate3List[10] = {registerCount: res.subordinate3 != null && res.subordinate3.registerCount != null ? res.subordinate3.registerCount : 0};
                        this.subordinate3List[11] = {iosNumber: res.subordinate3 != null && res.subordinate3.iosNumber != null ? res.subordinate3.iosNumber : 0};
                        this.subordinate3List[12] = {androidNumber: res.subordinate3 != null && res.subordinate3.androidNumber != null ? res.subordinate3.androidNumber : 0};

                        this.subordinateSummarizingList[0] = {
                            firstRechargeAmount: res.subordinateSummarizing != null && res.subordinateSummarizing.firstRechargeAmount != null ? res.subordinateSummarizing.firstRechargeAmount : 0,
                            firstRechargeAmountCount: res.subordinateSummarizing != null && res.subordinateSummarizing.firstRechargeAmountCount != null ? res.subordinateSummarizing.firstRechargeAmountCount : 0
                        };//汇总
                        this.subordinateSummarizingList[1] = {
                            rechargeAmount: res.subordinateSummarizing != null && res.subordinateSummarizing.rechargeAmount != null ? res.subordinateSummarizing.rechargeAmount : 0,
                            rechargeAmountCount: res.subordinateSummarizing != null && res.subordinateSummarizing.rechargeAmountCount != null ? res.subordinateSummarizing.rechargeAmountCount : 0
                        };//汇总
                        this.subordinateSummarizingList[2] = {
                            secondRechargeAmount: res.subordinateSummarizing != null && res.subordinateSummarizing.secondRechargeAmount != null ? res.subordinateSummarizing.secondRechargeAmount : 0,
                            secondRechargeAmountCount: res.subordinateSummarizing != null && res.subordinateSummarizing.secondRechargeAmountCount != null ? res.subordinateSummarizing.secondRechargeAmountCount : 0
                        };//汇总
                        this.subordinateSummarizingList[3] = {activityAmount: res.subordinateSummarizing != null && res.subordinateSummarizing.activityAmount != null ? res.subordinateSummarizing.activityAmount : 0};
                        this.subordinateSummarizingList[4] = {
                            withdrawAmount: res.subordinateSummarizing != null && res.subordinateSummarizing.withdrawAmount != null ? res.subordinateSummarizing.withdrawAmount : 0,
                            withdrawAmountCount: res.subordinateSummarizing != null && res.subordinateSummarizing.withdrawAmountCount != null ? res.subordinateSummarizing.withdrawAmountCount : 0
                        };//汇总
                        this.subordinateSummarizingList[5] = {rebate: res.subordinateSummarizing != null && res.subordinateSummarizing.rebate != null ? res.subordinateSummarizing.rebate : 0};
                        this.subordinateSummarizingList[6] = {tax: res.subordinateSummarizing != null && res.subordinateSummarizing.tax != null ? res.subordinateSummarizing.tax : 0};
                        this.subordinateSummarizingList[7] = {pump: res.subordinateSummarizing != null && res.subordinateSummarizing.pump != null ? res.subordinateSummarizing.pump : 0};
                        this.subordinateSummarizingList[8] = {betAmount: res.subordinateSummarizing != null && res.subordinateSummarizing.betAmount != null ? res.subordinateSummarizing.betAmount : 0};
                        this.subordinateSummarizingList[9] = {changeAmount: res.subordinateSummarizing != null && res.subordinateSummarizing.changeAmount != null ? res.subordinateSummarizing.changeAmount : 0};
                        this.subordinateSummarizingList[10] = {registerCount: res.subordinateSummarizing != null && res.subordinateSummarizing.registerCount != null ? res.subordinateSummarizing.registerCount : 0};
                        this.subordinateSummarizingList[11] = {iosNumber: res.subordinateSummarizing != null && res.subordinateSummarizing.iosNumber != null ? res.subordinateSummarizing.iosNumber : 0};
                        this.subordinateSummarizingList[12] = {androidNumber: res.subordinateSummarizing != null && res.subordinateSummarizing.androidNumber != null ? res.subordinateSummarizing.androidNumber : 0};


                        this.tableData[0] = {//拼接表格 将1-3级下级代理以及汇总数据 按行拼接
                            title: this.nameList[0],
                            one: this.subordinate1List[0].firstRechargeAmount,
                            onecount: this.subordinate1List[0].firstRechargeAmountCount,
                            two: this.subordinate2List[0].firstRechargeAmount,
                            twocount: this.subordinate2List[0].firstRechargeAmountCount,
                            three: this.subordinate3List[0].firstRechargeAmount,
                            threecount: this.subordinate3List[0].firstRechargeAmountCount,
                            total: this.subordinateSummarizingList[0].firstRechargeAmount,
                            totalcount: this.subordinateSummarizingList[0].firstRechargeAmountCount
                        }
                        this.tableData[1] = {
                            title: this.nameList[1],
                            one: this.subordinate1List[1].rechargeAmount,
                            onecount: this.subordinate1List[1].rechargeAmountCount,
                            two: this.subordinate2List[1].rechargeAmount,
                            twocount: this.subordinate2List[1].rechargeAmountCount,
                            three: this.subordinate3List[1].rechargeAmount,
                            threecount: this.subordinate3List[1].rechargeAmountCount,
                            total: this.subordinateSummarizingList[1].rechargeAmount,
                            totalcount: this.subordinateSummarizingList[1].rechargeAmountCount
                        }
                        this.tableData[2] = {
                            title: this.nameList[2],
                            one: this.subordinate1List[2].secondRechargeAmount,
                            onecount: this.subordinate1List[2].secondRechargeAmountCount,
                            two: this.subordinate2List[2].secondRechargeAmount,
                            twocount: this.subordinate2List[2].secondRechargeAmountCount,
                            three: this.subordinate3List[2].secondRechargeAmount,
                            threecount: this.subordinate3List[2].secondRechargeAmountCount,
                            total: this.subordinateSummarizingList[2].secondRechargeAmount,
                            totalcount: this.subordinateSummarizingList[2].secondRechargeAmountCount
                        }
                        this.tableData[3] = {
                            title: this.nameList[3],
                            one: this.subordinate1List[3].activityAmount,
                            onecount: -1,
                            two: this.subordinate2List[3].activityAmount,
                            twocount: -1,
                            three: this.subordinate3List[3].activityAmount,
                            threecount: -1,
                            total: this.subordinateSummarizingList[3].activityAmount,
                            totalcount: -1
                        }
                        this.tableData[4] = {
                            title: this.nameList[4],
                            one: this.subordinate1List[4].withdrawAmount,
                            onecount: this.subordinate1List[4].withdrawAmountCount,
                            two: this.subordinate2List[4].withdrawAmount,
                            twocount: this.subordinate2List[4].withdrawAmountCount,
                            three: this.subordinate3List[4].withdrawAmount,
                            threecount: this.subordinate3List[4].withdrawAmountCount,
                            total: this.subordinateSummarizingList[4].withdrawAmount,
                            totalcount: this.subordinateSummarizingList[4].withdrawAmountCount
                        }
                        this.tableData[5] = {
                            title: this.nameList[5],
                            one: this.subordinate1List[5].rebate,
                            onecount: -1,
                            two: this.subordinate2List[5].rebate,
                            twocount: -1,
                            three: this.subordinate3List[5].rebate,
                            threecount: -1,
                            total: this.subordinateSummarizingList[5].rebate,
                            totalcount: -1
                        }
                        this.tableData[6] = {
                            title: this.nameList[6],
                            one: this.subordinate1List[6].tax,
                            onecount: -1,
                            two: this.subordinate2List[6].tax,
                            twocount: -1,
                            three: this.subordinate3List[6].tax,
                            threecount: -1,
                            total: this.subordinateSummarizingList[6].tax,
                            totalcount: -1
                        }
                        this.tableData[7] = {
                            title: this.nameList[7],
                            one: this.subordinate1List[7].pump,
                            onecount: -1,
                            two: this.subordinate2List[7].pump,
                            twocount: -1,
                            three: this.subordinate3List[7].pump,
                            threecount: -1,
                            total: this.subordinateSummarizingList[7].pump,
                            totalcount: -1
                        }
                        this.tableData[8] = {
                            title: this.nameList[8],
                            one: this.subordinate1List[8].betAmount,
                            onecount: -1,
                            two: this.subordinate2List[8].betAmount,
                            twocount: -1,
                            three: this.subordinate3List[8].betAmount,
                            threecount: -1,
                            total: this.subordinateSummarizingList[8].betAmount,
                            totalcount: -1
                        }
                        this.tableData[9] = {
                            title: this.nameList[9],
                            one: this.subordinate1List[9].changeAmount,
                            onecount: -1,
                            two: this.subordinate2List[9].changeAmount,
                            twocount: -1,
                            three: this.subordinate3List[9].changeAmount,
                            threecount: -1,
                            total: this.subordinateSummarizingList[9].changeAmount,
                            totalcount: -1
                        }
                        this.tableData[10] = {
                            title: this.nameList[10],
                            one: this.subordinate1List[10].registerCount,
                            onecount: -1,
                            two: this.subordinate2List[10].registerCount,
                            twocount: -1,
                            three: this.subordinate3List[10].registerCount,
                            threecount: -1,
                            total: this.subordinateSummarizingList[10].registerCount,
                            totalcount: -1
                        }
                        this.tableData[11] = {
                            title: this.nameList[11],
                            one: this.subordinate1List[11].iosNumber,
                            onecount: -1,
                            two: this.subordinate2List[11].iosNumber,
                            twocount: -1,
                            three: this.subordinate3List[11].iosNumber,
                            threecount: -1,
                            total: this.subordinateSummarizingList[11].iosNumber,
                            totalcount: -1
                        }
                        this.tableData[12] = {
                            title: this.nameList[12],
                            one: this.subordinate1List[12].androidNumber,
                            onecount: -1,
                            two: this.subordinate2List[12].androidNumber,
                            twocount: -1,
                            three: this.subordinate3List[12].androidNumber,
                            threecount: -1,
                            total: this.subordinateSummarizingList[12].androidNumber,
                            totalcount: -1
                        }
                        console.log(this.tableData)

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
            this.accountId = this.$store.getters.spreadParams.accountId; //this.$route.params.accountId;
            this.type = this.$store.getters.spreadParams.type;//是团队还是个人
            this.subordinateLevel = this.$store.getters.spreadParams.subordinateLevel ? this.$store.getters.spreadParams.subordinateLevel : null;
            this.subordinateTopId = this.$store.getters.spreadParams.subordinateTopId ? this.$store.getters.spreadParams.subordinateTopId : null;
            this.queryHandle();
        },
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
            width: 33.33%;
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
</style>
