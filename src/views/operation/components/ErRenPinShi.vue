<template>
    <el-row :gutter="20" class="erRen">
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
                    <el-form-item label="当局底分：">
                        {{ formData.antBets | betNumberFormatter }}
                    </el-form-item>
                    <el-form-item label="叫庄倍数：">
                        {{ formData.betOdd }}
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
                </el-form>
            </el-card>
        </el-col>

        <el-col :xl="16" :lg="16" :md="16" :sm="14" :xs="24">
            <h3>{{formData.createBy}}</h3>
            <el-card v-loading="isLoading">
                <div slot="header">牌型信息</div>
                <el-table :cell-style="{textAlign:'center'}"
                          :header-cell-style="{textAlign:'center'}"
                          :data="tableData">
                    <el-table-column label="开奖源" prop="isDealer">
                        <template slot-scope="scope">
                          {{ (scope.row.origin === 'other') ? '对家' : '我的' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="牌型" prop="pokers">
                      <template slot-scope="{row}">
                        {{row.pokers | cardsFilter}}
                      </template>
                    </el-table-column>
                    <el-table-column label="倍数" prop="odds"></el-table-column>
                    <el-table-column label="结果" prop="win">
                        <template slot-scope="scope">
                            <el-tag type="success" v-if="scope.row.win === true">赢</el-tag>
                            <el-tag type="danger" v-else>输</el-tag>
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
                operationRequest.getTwoPeopleTenDetails({id: this.recordId}).then(res => {
                    this.isLoading = false;
                    if (res.code == 200) {
                        this.formData = res.data;
                        this.tableData = [];
                        res.data.myPokerList.origin = 'my';
                        res.data.otherPokerList.origin = 'other';
                        this.tableData.push(res.data.myPokerList);
                        this.tableData.push(res.data.otherPokerList);
                    }
                    else {
                        this.$notify.error(res.msg);
                    }
                });
            },
            displayCards(row) {
                let cards = '';
                for (let k in row.pokers) {
                    if (k > 0) {
                        cards += ', '
                    }
                    //花色
                    if (row.pokers[k][0] == 0) {
                        cards += '黑桃'
                    }
                    else if (row.pokers[k][0] == 1) {
                        cards += '红桃'
                    }
                    else if (row.pokers[k][0] == 2) {
                        cards += '梅花'
                    }
                    else if (row.pokers[k][0] == 3) {
                        cards += '方块'
                    }
                    //A ~ K
                    if (row.pokers[k][1] == 0) {
                        cards += 'A';
                    }
                    else if (row.pokers[k][1] == 10) {
                        cards += 'J';
                    }
                    else if (row.pokers[k][1] == 11) {
                        cards += 'Q';
                    }
                    else if (row.pokers[k][1] == 12) {
                        cards += 'K';
                    } else {
                        cards += row.pokers[k][1] + 1
                    }
                }
                return cards;
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
    .erRen {
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
