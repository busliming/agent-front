<template>
    <el-row :gutter="20" class="feiQin">
        <el-col :xl="8" :lg="8" :md="8" :sm="10" :xs="24">
            <h3>对局信息</h3>
            <el-card>
                <el-form label-width="100px" v-loading="isLoading">
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
                        {{ (formData.isBank == 'true') ? '是' : '否' }}
                    </el-form-item>
                    <el-form-item label="下注金额：">
                        <el-tag>
                            {{ formData.betMoney | betNumberFormatter }}
                        </el-tag>
                    </el-form-item>
                    <el-form-item label="中奖总金额：">
                        <el-tag>
                            {{ formData.lotterMoney | betNumberFormatter}}
                        </el-tag>
                    </el-form-item>
                    <el-form-item label="当局输赢：">
                        <el-tag v-if="formData.selfWinScore > 0" type="success">{{ formData.selfWinScore | betNumberFormatter}}</el-tag>
                        <el-tag v-else-if="formData.selfWinScore < 0" type="danger">{{ formData.selfWinScore | betNumberFormatter}}</el-tag>
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
                    <div slot="header">下注信息</div>
                    <el-table
                            :cell-style="{textAlign:'center'}"
                            :header-cell-style="{textAlign:'center'}"
                            :data="tableData"
                            >
                        <el-table-column label="盘口" prop="betTarget" :formatter="displayBetTarget"></el-table-column>
                        <el-table-column label="倍数" prop="odd"></el-table-column>
                        <el-table-column label="金币数量" prop="selfAmount">
                          <template slot-scope="{row}">
                            {{row.selfAmount | betNumberFormatter}}
                          </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
            <el-col :lg="6" :md="6" :sm="24" :xs="24">
                <el-card align="center">
                    <el-form>
                        <el-form-item label="开奖情况：">
                            <strong>{{ formData.rewardPosition | rewardPositionFilter }}</strong>
                        </el-form-item>
                    </el-form>
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
            rewardPositionFilter(val){
                let arr = {
                    0:'孔雀',
                    1:'鸽子',
                    2:'燕子',
                    3:'老鹰',
                    4:'熊猫',
                    5:'猴子',
                    6:'兔子',
                    7:'狮子',
                    8:'蓝鲨鱼',
                    9:'金鲨鱼',
                    10:'通赔',
                    11:'通吃',
                }
                return arr[val]
            }
        },
        methods: {
            queryRecords() {
                this.isLoading = true;
                operationRequest.getBirdsAndBeastsDetails({id: this.recordId}).then(res => {
                    this.isLoading = false;
                    if (res.code == 200) {
                        this.formData = res.data;
                        this.tableData = res.data.betInfoList
                    }
                    else {
                        this.$notify.error(res.msg);
                    }
                })
            },
            displayBetTarget(obj) {
                if (obj) {
                    if (obj.betTarget == 1 || obj == 1) return '孔雀';
                    if (obj.betTarget == 2 || obj == 2) return '鸽子';
                    if (obj.betTarget == 3 || obj == 3) return '燕子';
                    if (obj.betTarget == 4 || obj == 4) return '老鹰';
                    if (obj.betTarget == 5 || obj == 5) return '熊猫';
                    if (obj.betTarget == 6 || obj == 6) return '猴子';
                    if (obj.betTarget == 7 || obj == 7) return '兔子';
                    if (obj.betTarget == 8 || obj == 8) return '狮子';
                    if (obj.betTarget == 9 || obj == 9) return '飞禽';
                    if (obj.betTarget == 10 || obj == 10) return '走兽';
                    if (obj.betTarget == 11 || obj == 11) return '鲨鱼';
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
    .feiQin {
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
