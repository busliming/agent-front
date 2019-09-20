<template>
    <el-card>
        <el-form
                label-width="100px"
                @submit.native.prevent
        >
            <el-row
                    type="flex"
                    justify="space-between"
            >
                <el-col :span="6">
                    <el-form-item label="会员账号：">
                        <el-input
                                v-model="account"
                                maxlength="16"
                                clearable
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="会员ID：">
                        <el-input
                                v-model="playId"
                                clearable
                                maxlength="9"
                        ></el-input>
                    </el-form-item>
                </el-col>
                <!--<el-col :span="8">-->
                    <!--<el-form-item label="查询日期：">-->
                        <!--<el-date-picker-->
                                <!--v-model="daterange"-->
                                <!--type="datetimerange"-->
                                <!--align="center"-->
                                <!--value-format="yyyy-MM-dd HH:mm:ss"-->
                                <!--range-separator="~"-->
                                <!--clearable-->
                        <!--&gt;</el-date-picker>-->
                    <!--</el-form-item>-->
                <!--</el-col>-->
                <el-form-item label-width="0">
                    <el-button
                            size="medium"
                            type="primary"
                            icon="el-icon-search"
                            @click="searchHandle"
                    >搜索
                    </el-button>
                </el-form-item>
            </el-row>
        </el-form>
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
                    label="会员账号"
                    prop="account"
            >
            </el-table-column>
            <el-table-column
                    label="会员ID"
                    prop="playId"
            ></el-table-column>
            <el-table-column
                    label="推广等级"
                    prop="level"
            ></el-table-column>
            <el-table-column
                    label="首充"
                    prop="firstRechargeAmount"
            ></el-table-column>
            <el-table-column
                    label="二充"
                    prop="secondRechargeAmount"
            ></el-table-column>
            <el-table-column
                    label="注册累计"
                    prop="registerNumber">
            </el-table-column>
            <el-table-column
                    label="充值金额"
                    prop="rechargeAmount"
            ></el-table-column>
            <el-table-column
                    label="IOS下载"
                    prop="iosNumber"
            ></el-table-column>
            <el-table-column
                    label="安卓下载"
                    prop="androidNumber"
            ></el-table-column>
            <el-table-column
                    label="提现金额"
                    prop="withdrawAmount"
            ></el-table-column>
            <el-table-column
                    label="返利"
                    prop="rebate"
            >
              <template slot-scope="{row}">
                {{ row.rebate | betNumberFormatter}}
              </template>
            </el-table-column>
            <el-table-column
                    label="总税收"
                    prop="tax"
            >
              <template slot-scope="{row}">
                {{ row.tax | betNumberFormatter}}
              </template>
            </el-table-column>
            <el-table-column
                    label="总盈亏"
                    prop="changeAmount"
            >
              <template slot-scope="{row}">
                {{ row.changeAmount | betNumberFormatter}}
              </template>
            </el-table-column>
            <el-table-column
                    label="下级人数"
                    prop="subordinateNumber"
            ></el-table-column>
            <el-table-column
                    label="操作"
                    width="280px"
            >
                <div class="btn-group" slot-scope="scope">
                    <el-button plain size="mini"
                               @click="checkSup(scope.row)"
                    >查看上级
                    </el-button>
                    <el-button plain size="mini"
                               @click="checkSub(scope.row)"
                    >查看下级
                    </el-button>
                    <el-button type="primary" size="mini"
                               @click="viewDailyReportHandler(scope.row)">
                        每日记录
                    </el-button>
                </div>
            </el-table-column>
        </el-table>

        <el-row type="flex" justify="center">
            <el-pagination
                    @size-change="sizeChangeHandle"
                    @current-change="currentChangeHandle"
                    :current-page="pageNum"
                    :page-sizes="[10,20,50,100,200]"
                    :page-size.sync="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-row>
    </el-card>
</template>

<script>
    import spreadRequest from '@/request/spread'
    import time from '@/tool/times'

    export default {
        name: 'SpreadReport',
        data() {
            return {
                queryType: 'search', //查询类型
                isFirstPage: true,   //是否一级账号
                lastQueryParams: {},    //上次传的参数

                account: '',   //会员账号
                playId: '',   //会员id
                id: '', //账号自己的id
                checkId: '', //, 搜索返回的playId的值复制过来, 点击上级下级不变

                // daterange: [],   //bug单5928产品说不要

                pageNum: 1,
                pageSize: 10,
                total: 0,

                tableData: [],
                loading: false,
            }
        },
        computed: {
            viewSuperior() {    //点击上级传0，下级传1，搜索不传
                if (this.queryType === 'search') return '';
                if (this.queryType === 'sup') return 0;
                if (this.queryType === 'sub') return 1;
            },
            queryParams() { //查询条件
                return {
                    limit: this.pageSize,
                    offset: (this.pageNum - 1) * this.pageSize, //页数
                    sort: "createDate",
                    sortOrder: "desc",
                    // startTime: this.daterange ? this.daterange[0] : '',  //bug单5928产品说不要
                    // endTime: this.daterange ? this.daterange[1] : '',    //bug单5928产品说不要
                    account: this.queryType === 'search' ? this.account : '',   //用来搜索，除了搜索就不传
                    playId: this.queryType === 'search' ? this.playId : '',     //用来搜索，除了搜索就不传
                    id: this.queryType !== 'search' ? this.id : '',             //点击上级下级才传，搜索不传
                    checkId: this.queryType === 'sub' ? this.checkId : '',   //点击下级才传, 是一级账号的,不变
                    viewSuperior: this.viewSuperior
                };
            }
        },
        filters:{
          betNumberFormatter(val){
            if (!val) return "0";
            let str = String(val/1000);
            let idx = str.indexOf('.') + 3;
            if(str.indexOf('.') > -1){
              if(str.length>4){
                return str.slice(0,idx);
              }else{
                return str
              }
            }else{
              return str
            }
          },
        },
        methods: {
            queryHandle() { //获取列表的数据


                this.loading = true;
                spreadRequest.getPromotionReport(this.queryParams).then(res => {
                    if (res.rows) {
                        this.pageNum = res.offset / res.limit + 1;
                        this.pageSize = res.limit;
                        this.total = res.total;
                        this.tableData = res.rows;
                        if (this.queryType === 'search') {
                            this.isFirstPage = true;
                        } else {
                            this.playId = '';
                            this.account = '';
                        }
                    } else {
                        this.queryType = 'search';
                        this.$notify({
                            type: 'warning',
                            title: res.msg
                        })
                    }
                    this.loading = false;
                }).catch(err => {
                    console.log(err);
                    this.loading = false;
                })
            },
            searchHandle() { //搜索
                this.queryType = 'search';
                this.checkId = '';
                this.pageNum = 1;
                let paly_id = this.queryParams.playId;
                let reg = new RegExp(/^[0-9]+$/);
                if (!paly_id) {
                    this.queryHandle();
                    return;
                }
                else if (!reg.test(paly_id)) {
                    this.$message.warning({message: "会员ID输入格式有误!"});
                    return
                }
                this.queryHandle();
            },
            checkSub(row) { //查看下级
                this.queryType = 'sub';
                this.id = row.id;
                if (this.isFirstPage) {
                    this.checkId = row.playId;
                }
                this.queryHandle();
            },
            checkSup(row) { //查看上级
                this.queryType = 'sup';
                this.id = row.id;
                this.queryHandle();
            },
            viewDailyReportHandler(row) {  //每日记录
                console.log(row);
                this.$router.push({
                    path: '/spread/spreadReport/dailyReport',
                    name: '每日记录',
                    params: {
                        account: row.account,
                        playId: row.playId,
                        id: row.id
                    }
                })
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
        created() {
            // this.daterange.push(time.DateToYMD(new Date()) + ' 00:00:00');
            // this.daterange.push(time.DateToYMDHMS(new Date()));
            this.queryHandle();
        }
    }
</script>

<style lang="scss" scoped>
    // .btn-group {
    //     .el-button {
    //         margin: 0 0 5px 0
    //     }
    // }
</style>
