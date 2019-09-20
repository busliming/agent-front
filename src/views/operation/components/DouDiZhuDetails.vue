<template>
    <el-row :gutter="20" class="douDiZhu">
        <el-col :xl="8" :lg="8" :md="8" :sm="10" :xs="24">
            <h3>对局信息</h3>
            <el-card :v-loading="isLoading">
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
                    <el-form-item label="当局底分：">
                       <!-- {{ formData.baseScore ? formData.baseScore.toFixed(2) : '无' }}-->
                        {{ formData.baseScore | betNumberFormatter }}
                    </el-form-item>
                    <el-form-item label="初始倍数：">
                        {{ formData.initMul ? formData.initMul.toFixed(2) : '无' }}
                    </el-form-item>
                    <el-form-item label="地主座位：">
                        {{ formData.landLord }}
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
                        <el-tag v-if="formData.winOrLose > 0" type="success">{{ formData.winOrLose | betNumberFormatter}}</el-tag>
                        <el-tag v-else-if="formData.winOrLose < 0" type="danger">{{ formData.winOrLose | betNumberFormatter}}</el-tag>
                        <el-tag v-else>0元</el-tag>
                    </el-form-item>
                    <el-form-item label="当局税收：">
                        <el-tag>{{ formData.taxValue | betNumberFormatter }}元</el-tag>
                    </el-form-item>
                </el-form>
            </el-card>
        </el-col>

        <el-col :xl="16" :lg="16" :md="16" :sm="14" :xs="24">
            <h3>{{formData.createBy}}</h3>
            <el-card :v-loading="isLoading">
                <div slot="header">翻倍信息</div>
                <el-row>
                    炸弹：
                    <el-tag>{{ (formData.boom ? formData.boom : '0') + '倍' }}</el-tag>
                </el-row>
                <el-row>
                    春天：
                    <el-tag>{{ (formData.spring ? formData.spring : '0') + '倍' }}</el-tag>
                </el-row>
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
                operationRequest.getDouDiZhuDetails({id: this.recordId}).then(res => {
                    this.isLoading = false;
                    if (res.code == 200) {
                        this.formData = res.data;
                    }
                    else {
                        this.$notify.error(res.msg);
                    }
                });
            },
        },
        created() {
            this.gameId = this.$route.params.gameId;
            this.recordId = this.$route.params.recordId;
            this.queryRecords()
        }
    }
</script>

<style lang="scss" scoped>
    .douDiZhu{
        margin-top:24px ;
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
        .el-col:nth-child(2) {
            .el-card{
                padding: 20px;
                .el-row{ margin: 10px}
            }
        }
    }
</style>
