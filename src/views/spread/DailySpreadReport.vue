<template>
    <el-card>
        <el-form
                :inline="true"
                label-width="100px"
                @submit.native.prevent
        >
            <el-row
                    type="flex"
                    justify="space-between"
            >
                <el-col :span="12">
                    <el-form-item label="查询日期：">
                        <el-date-picker
                                v-model="daterange"
                                type="datetimerange"
                                align="center"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                range-separator="~"
                                clearable
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item label-width="0">
                        <el-button
                                size="medium"
                                type="primary"
                                icon="el-icon-search"
                                @click="searchHandle"
                        >搜索
                        </el-button>
                    </el-form-item>
                </el-col>

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
                    label="日期"
                    prop="createDate">
            </el-table-column>
            <el-table-column
                    label="会员账号"
                    prop="account"
            >
            </el-table-column>
            <el-table-column
                    label="会员ID"
                    prop="playId"
            ></el-table-column>
            <el-table-column label="注册" prop="registerNumber">
                <template slot-scope="scope">
                    {{!scope.row.registerNumber ? 0 : scope.row.registerNumber}}
                </template>
            </el-table-column>
            <el-table-column
                    label="IOS下载"
                    prop="iosNumber"
            ></el-table-column>
            <el-table-column
                    label="安卓下载"
                    prop="androidNumber"
            ></el-table-column>
            <el-table-column
                    label="充值金额"
                    prop="rechargeAmount"
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
                {{row.rebate | betNumberFormatter}}
              </template>
            </el-table-column>
            <el-table-column
                    label="税收"
                    prop="tax"
            >
              <template slot-scope="{row}">
                {{row.tax | betNumberFormatter}}
              </template>
            </el-table-column>
            <el-table-column
                    label="下注"
                    prop="betMoney"
            >
              <template slot-scope="{row}">
                {{row.betMoney | betNumberFormatter}}
              </template>
            </el-table-column>
            <el-table-column
                    label="盈亏"
                    prop="changeAmount"
            >
              <template slot-scope="{row}">
                {{row.changeAmount | betNumberFormatter}}
              </template>
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
                account: '',   //会员账号
                playId: '',   //会员id
                id: '',
                daterange: [],

                tableData: [],
                loading: false,

                pageNum: 1,
                pageSize: 10,
                total: 0,
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
            searchHandle() {
                this.pageNum = 1;
                this.queryHandle();
            },
            goBackHandle() {
                this.$router.push('/spread/spreadReport')
            },
            queryHandle() { //搜索列表
                this.loading = true;
                let data = {
                    limit: this.pageSize,
                    offset: (this.pageNum - 1) * this.pageSize,
                    sort: "createDate",
                    sortOrder: "desc",
                    account: this.account,
                    playId: this.playId,
                    startTime: this.daterange ? this.daterange[0] : '',
                    endTime: this.daterange ? this.daterange[1] : '',
                    id: this.id
                };
                spreadRequest.dailyRecord(data).then(res => {
                    if (res.rows) {
                        this.pageNum = res.offset / res.limit + 1;
                        this.pageSize = res.limit;
                        this.total = res.total;
                        this.tableData = res.rows;
                    } else {
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
            this.playId = this.$route.params.playId;
            this.account = this.$route.params.account;
            this.id = this.$route.params.id;
            this.daterange.push(time.DateToYMD(new Date()) + ' 00:00:00');
            this.daterange.push(time.DateToYMDHMS(new Date()));
            this.queryHandle();
        },
    }
</script>
