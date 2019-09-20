<template>
    <el-row :gutter="20" class="yaoyao">
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
                        {{ (formData.isDealer == 'true') ? '是' : '否' }}
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
                        <el-tag v-if="formData.win > 0" type="success">{{ formData.win | betNumberFormatter}}</el-tag>
                        <el-tag v-else-if="formData.win < 0" type="danger">{{ formData.win | betNumberFormatter}}</el-tag>
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
            <el-col :lg="18" :md="18" :sm="24" :xs="24">
                <el-card v-loading="isLoading">
                    <div slot="header">摇一摇</div>
                    <el-table :cell-style="{textAlign:'center'}"
                              :header-cell-style="{textAlign:'center'}"
                              :data="table1Data">
                        <el-table-column label="盘口" prop="chipPoolIndex"
                                         :formatter="displayChipPoolIndex"></el-table-column>
                        <el-table-column label="赔率" prop="odd"></el-table-column>
                        <el-table-column label="金币数量" prop="me"></el-table-column>
                        <el-table-column label="结果" prop="result">
                            <template slot-scope="scope">
                                <el-tag type="success" v-if="scope.row.result=='true'">中</el-tag>
                                <el-tag type="danger" v-else>未中</el-tag>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
            <el-col :lg="6" :md="6" :sm="24" :xs="24">
                <el-card>
                    <el-table
                            :cell-style="{textAlign:'center'}"
                            :header-cell-style="{textAlign:'center'}"
                            :data="table2Data">
                        <el-table-column align="center" label="开奖情况" prop="data"></el-table-column>
                    </el-table>
                </el-card>
            </el-col>
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
                table1Data: [],
                table2Data: [{data: ''}],
                isLoading: false,

                chipPoolIndexExp:  [
                    '单', '111', '222', '333', '444', '555', '666', '双', '小', '任意豹子', '大', '总和4',
                    '总和5', '总和6', '总和7', '总和8', '总和9', '总和10', '总和11', '总和12', '总和13', '总和14',
                    '总和15', '总和16', '总和17', '出现1', '出现2', '出现3', '出现4', '出现5', '出现6'
                ]
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
                operationRequest.getShakeOneShakeDetails({id: this.recordId}).then(res => {
                    this.isLoading = false;
                    if (res.code == 200) {
                        this.formData = res.data;
                        this.table1Data = res.data.detailList;
                        for (let i in res.data.openLotteryInfo) {
                            if (i > 0) {
                                this.table2Data[0].data += ', '
                            }
                            this.table2Data[0].data += res.data.openLotteryInfo[i];
                        }
                    }
                    else {
                        this.$notify.error(res.msg);
                    }
                });
            },
            displayChipPoolIndex(row) {
                let str = this.chipPoolIndexExp;
                for (let i in str) {
                    if (row.chipPoolIndex == i) {
                        return str[i];
                    }
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
    .yaoyao {
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
