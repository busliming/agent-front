<template>
    <el-row :gutter="20" class="hongHei">
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
                        {{ formData.isDealer === true ? '是' : '否' }}
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
                        <el-tag v-if="formData.mylose > 0" type="success">{{ formData.mylose | betNumberFormatter}}</el-tag>
                        <el-tag v-else-if="formData.mylose < 0" type="danger">{{ formData.mylose | betNumberFormatter}}</el-tag>
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
                          :data="table1Data">
                    <el-table-column label="王子战士" prop="">
                        <template slot-scope="scope">{{ formData.playerInCaptian | betNumberFormatter }}元</template>
                    </el-table-column>
                    <el-table-column label="公主战士" prop="">
                        <template slot-scope="scope">{{ formData.playerInPrinces | betNumberFormatter  }}元</template>
                    </el-table-column>
                    <el-table-column label="幸运一击" prop="">
                        <template slot-scope="scope">{{  formData.playerInLucky | betNumberFormatter  }}元</template>
                    </el-table-column>
                </el-table>
            </el-card>
            <el-card v-loading="isLoading">
                <div slot="header">开奖信息</div>
                <el-table :cell-style="{textAlign:'center'}"
                          :header-cell-style="{textAlign:'center'}"
                          :data="table2Data">
                    <el-table-column label="开奖源" prop="type"></el-table-column>
                    <el-table-column label="牌型" prop="cards">
                      <template slot-scope="{row}">
                        {{row.cards | cardsFilter}}
                      </template>
                    </el-table-column>
                    <el-table-column label="倍数" prop="">
                        <template slot-scope="scope">
                            <template v-if="scope.row.type === '王子战士' || scope.row.type === '公主战士'">
                                1
                            </template>
                            <template v-else>
                                {{formData.cardType}}
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column label="结果" prop="result">
                        <template slot-scope="scope">
                            <el-tag type="success" v-if="scope.row.result">中</el-tag>
                            <el-tag type="danger" v-else>未中</el-tag>
                        </template>
                    </el-table-column>
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
                table1Data: [{}],
                table2Data: [
                    {type: '王子战士', cards: [], result: ''},
                    {type: '公主战士', cards: [], result: ''},
                    {type: '幸运一击', cards: [], result: ''}
                ],
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
          cardsFilter(value){ //普通牌型
            let color = {
              0:'方块',
              1:'梅花',
              2:'红桃',
              3:'黑桃',
            }
            let num = {
              1:'A',
              2:'2',
              3:'3',
              4:'4',
              5:'5',
              6:'6',
              7:'7',
              8:'8',
              9:'9',
              10:'10',
              11:'J',
              12:'Q',
              13:'K',
            }
            let arr = [];
            value.map( item => {
              arr.push(color[item[0]]+num[item[1]]);
            })
            return arr.join(',');
          }
        },
        methods: {
            queryRecords() {
                this.isLoading = true;
                operationRequest.getRedBlackWarDetails({id: this.recordId}).then(res => {
                    this.isLoading = false;
                    if (res.code == 200) {
                        this.formData = res.data;
                        this.table2Data[0].cards = res.data.cardList.princeCard;
                        this.table2Data[1].cards = res.data.cardList.princessCard;
                        this.table2Data[2].cards = res.data.cardList.luckyCardList;
                        for (let i in this.table2Data) {
                            this.table2Data[i].result = res.data.hitBetArea.indexOf(parseInt(i)+1) !== -1;
                        }
                        if (res.data.hitBetArea.length < 2) {
                            this.table2Data.splice(2,1)
                        }
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
    .hongHei{
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
