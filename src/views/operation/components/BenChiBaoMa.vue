<template>
    <el-row :gutter="20" class="bmv">
        <el-col :xl="8" :lg="8" :md="8" :sm="10" :xs="24">
            <h3>对局信息</h3>
            <el-card v-loading="isLoading">
                <el-form label-width="100px">
                    <el-form-item label="会员账号：">
                        {{ formData.account }}
                    </el-form-item>
                    <el-form-item label="游戏名称：">
                        {{ formData.createBy }}
                    </el-form-item>
                    <el-form-item label="游戏房间：">
                        {{ formData.roomName }}
                    </el-form-item>
                    <el-form-item label="当局桌号：">
                        {{ formData.tableNumber}}
                    </el-form-item>
                    <el-form-item label="局号：">
                        {{ formData.gameCode }}
                    </el-form-item>
                    <el-form-item label="开始时间：">
                        {{ formData.startTime }}
                    </el-form-item>
                    <el-form-item label="结束时间：">
                        {{ formData.endTime }}
                    </el-form-item>
                    <el-form-item label="是否上庄：">
                        {{ (formData.isHost == 'true') ? '是' : '否' }}
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
                        <el-tag v-if="formData.selfResult > 0" type="success">{{ formData.selfResult | betNumberFormatter}}</el-tag>
                        <el-tag v-else-if="formData.selfResult < 0" type="danger">{{ formData.selfResult | betNumberFormatter}}</el-tag>
                        <el-tag v-else>0元</el-tag>
                    </el-form-item>
                    <el-form-item label="当局税收：">
                        <el-tag>{{ formData.tax | betNumberFormatter }}元</el-tag>
                    </el-form-item>
                </el-form>
            </el-card>
        </el-col>

        <el-col :xl="16" :lg="16" :md="16" :sm="14" :xs="24">
            <h3>{{formData.createBy}}</h3>
            <el-card v-loading="isLoading">
                <div slot="header">下注信息</div>
                <el-table :cell-style="{textAlign:'center'}"
                          :header-cell-style="{textAlign:'center'}"
                          :data="tableData">
                    <el-table-column label="保时捷x40" prop="0">
                      <template slot-scope="{row}">
                        {{row[0] | betNumberFormatter}}
                      </template>
                    </el-table-column>
                    <el-table-column label="保时捷x5" prop="1">
                      <template slot-scope="{row}">
                        {{row[1] | betNumberFormatter}}
                      </template>
                    </el-table-column>
                    <el-table-column label="宝马x30" prop="2">
                      <template slot-scope="{row}">
                        {{row[2] | betNumberFormatter}}
                      </template>
                    </el-table-column>
                    <el-table-column label="宝马x5" prop="3">
                      <template slot-scope="{row}">
                        {{row[3] | betNumberFormatter}}
                      </template>
                    </el-table-column>
                    <el-table-column label="奔驰x20" prop="4">
                      <template slot-scope="{row}">
                        {{row[4] | betNumberFormatter}}
                      </template>
                    </el-table-column>
                    <el-table-column label="奔驰x5" prop="5">
                      <template slot-scope="{row}">
                        {{row[5] | betNumberFormatter}}
                      </template>
                    </el-table-column>
                    <el-table-column label="大众x10" prop="6">
                      <template slot-scope="{row}">
                        {{row[6] | betNumberFormatter}}
                      </template>
                    </el-table-column>
                    <el-table-column label="大众x5" prop="7">
                      <template slot-scope="{row}">
                        {{row[7] | betNumberFormatter}}
                      </template>
                    </el-table-column>
                    <el-table-column label="开奖情况" prop="" :formatter="displayReward"></el-table-column>
                </el-table>
            </el-card>
        </el-col>
    </el-row>
</template>

<script>
    import operationRequest from '@/request/operation'

    export default {
        data() {
            return {
                gameId: '',
                recordId: '',
                formData: [],
                tableData: [],
                isLoading: false
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
            queryRecords() {
                this.isLoading = true;
                operationRequest.getBenzBmwDetails({id: this.recordId}).then(res => {
                    this.isLoading = false;
                    if (res.code == 200) {
                        let tmp = {};
                        let dataList = res.data.betInfoList;
                        this.formData = res.data;
                        this.tableData = [];
                        for (let k in dataList) {
                            tmp[k] = dataList[k].selfBet;
                        }
                        this.tableData.push(tmp);
                    }
                    else {
                        this.$notify.error(res.msg);
                    }
                });
            },
            displayReward(row) {
                if (this.formData.reward == 0) {
                    return '保时捷x40'
                }
                if (this.formData.reward == 1) {
                    return '保时捷x5'
                }
                if (this.formData.reward == 2) {
                    return '宝马x30'
                }
                if (this.formData.reward == 3) {
                    return '宝马x5'
                }
                if (this.formData.reward == 4) {
                    return '奔驰x20'
                }
                if (this.formData.reward == 5) {
                    return '奔驰x5'
                }
                if (this.formData.reward == 6) {
                    return '大众x10'
                }
                if (this.formData.reward == 7) {
                    return '大众x5'
                }
            }
        },
        created() {
            this.gameId = this.$route.params.gameId;
            this.recordId = this.$route.params.recordId;
            this.queryRecords()
        }
    }
</script>

<style lang="scss" scoped>
    .bmv {
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
