<template>
    <el-row :gutter="20" class="buYu">
        <el-col :xl="8" :lg="8" :md="8" :sm="10" :xs="24">
            <h3>对局信息</h3>
            <el-card v-loading="isLoading">
                <el-form label-width="100px">
                    <el-form-item label="会员账号：">
                        {{formData.account}}
                    </el-form-item>
                    <el-form-item label="游戏名称：">
                        {{formData.createBy}}
                    </el-form-item>
                    <el-form-item label="当局桌号：">
                        {{formData.tableNumber}}
                    </el-form-item>
                    <el-form-item label="局号：">
                        {{formData.gameCode}}
                    </el-form-item>
                    <el-form-item label="游戏房间：">
                        {{ formData.roomName }}
                    </el-form-item>
                    <el-form-item label="开始时间：">
                        {{ formData.startTime }}
                    </el-form-item>
                    <el-form-item label="结束时间：">
                        {{ formData.endTime }}
                    </el-form-item>
                    <el-form-item label="下注金额：">
                        <el-tag>
                            {{ formData.betMoney | betNumberFormatter }}
                        </el-tag>
                    </el-form-item>
                    <el-form-item label="中奖总金额：">
                        <el-tag>
                            {{ formData.lotteryMoney | betNumberFormatter}}
                        </el-tag>
                    </el-form-item>
                    <el-form-item label="当局输赢：">
                        <el-tag v-if="formData.changeAmount > 0" type="success">-{{ formData.changeAmount | betNumberFormatter}}</el-tag>
                        <el-tag v-else-if="formData.changeAmount < 0" type="danger">{{ formData.changeAmount | transToPos | betNumberFormatter}}</el-tag>
                        <el-tag v-else>0元</el-tag>
                    </el-form-item>
                    <el-form-item label="当局税收：">
                        <el-tag>{{ formData.changeValue | betNumberFormatter }}元</el-tag>
                    </el-form-item>
                </el-form>
            </el-card>
        </el-col>

        <el-col :xl="16" :lg="16" :md="16" :sm="14" :xs="24">
            <h3>{{formData.createBy}}</h3>
            <el-card v-loading="isLoading">
                <div slot="header">投注信息</div>
                <el-table
                        :cell-style="{textAlign:'center'}"
                        :header-cell-style="{textAlign:'center'}"
                        :data="tableData"
                        >
                    <el-table-column label="射击时间" prop="launchTimeStr"></el-table-column>
                    <el-table-column label="炮弹消耗" prop="consumeCoin">
                      <template slot-scope="{row}">
                        {{row.consumeCoin | betNumberFormatter}}
                      </template>
                    </el-table-column>
                    <el-table-column label="鱼名称" prop="fishName"></el-table-column>
                    <el-table-column label="鱼倍数" prop="score"></el-table-column>
                    <el-table-column label="盈利" prop="profitCoin">
                      <template slot-scope="{row}">
                        {{row.profitCoin | betNumberFormatter}}
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
                            layout="total, sizes, prev, next"
                            :total="total">
                    </el-pagination>
                </el-row>
            </el-card>
        </el-col>
    </el-row>
</template>

<script>
    import buYuRequest from '@/request/operation/jinchanbuyu'

    export default {
        data() {
            return {
                queryParams: {},
                formData: [],
                tableData: [],
                isLoading: false,

                // pagination
                pageNum: 1,
                pageSize: 10,
                total: 0,
            }
        },
        filters: {
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
          transToPos(val){  //捕鱼类对局信息从投注记录带过来   正负号需要互转
            return Math.abs(val) //负转正
          }
        },
        methods: {
            getBulletRecordList() {
                this.isLoading = true;
                let data = {
                    index: this.queryParams.index,
                    timeStamp: this.queryParams.timeStamp,
                    gameId: this.formData.gameId,
                    page: this.pageNum,
                    pageSize: this.pageSize,
                    tableNumber: this.formData.tableNumber,
                    uniqueId: this.queryParams.uniqueId
                };
                buYuRequest.getBulletRecordList(data).then(res => {
                    if (res.code == 200) {
                        this.total = res.data.totalCount;
                        this.tableData = res.data.datas;
                    } else {
                        this.$notify.error(res.msg)
                    }
                    this.isLoading = false;
                }).catch(err => {
                    // console.log(err)
                    this.isLoading = false;
                })
            },
            sizeChangeHandle(size) {  //表格显示条数改变
                this.pageSize = size;
                this.queryParams.index = '';
                this.queryParams.timeStamp = '';
                this.getBulletRecordList();
            },
            currentChangeHandle(crtpage) { //表格显示页数改变
                if (crtpage - this.pageNum == 1) {
                    this.queryParams.index = 1;
                    this.queryParams.timeStamp = this.tableData[this.pageSize-1].launchTime;
                }
                else if (crtpage - this.pageNum == -1) {
                    this.queryParams.index = 0;
                    this.queryParams.timeStamp = this.tableData[0].launchTime;
                }
                else {
                    return;
                }
                this.pageNum = crtpage;
                this.getBulletRecordList();
            },
        },
        created() {
            this.formData = window.sessionStorage.getItem('buYuData');
            console.log(this.formData);
            this.formData = JSON.parse(this.formData);
            this.queryParams = JSON.parse(this.formData.dataDetails);
            this.getBulletRecordList();
        }
    }
</script>

<style lang="scss" scoped>
    .buYu {
        padding: 10px;
        height: 100%;
        .el-card {
            margin: 20px auto;
        }
        .el-row:first-child {
            height: 40%;
        }
        .el-row:nth-child(2) {
            height: 60%
        }
        .el-col {
            .el-card {
                margin: 20px auto;
                .el-form-item {
                    overflow-x: auto;
                    margin-bottom: 0;
                }
            }
        }
    }
</style>
