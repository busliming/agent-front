<template>
    <el-row :gutter="20" class="niuniu">
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
                        {{ (formData.isBanker == 'true') ? '是' : '否' }}
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
                        <el-tag v-if="formData.myAmount > 0" type="success">{{ formData.myAmount | betNumberFormatter}}</el-tag>
                        <el-tag v-else-if="formData.myAmount < 0" type="danger">{{ formData.myAmount | betNumberFormatter}}</el-tag>
                        <el-tag v-else>0元</el-tag>
                    </el-form-item>
                    <el-form-item label="当局税收：">
                        <el-tag>{{ formData.dutyAmount | betNumberFormatter }}元</el-tag>
                    </el-form-item>
                </el-form>
            </el-card>
        </el-col>

        <el-col :xl="16" :lg="16" :md="16" :sm="14" :xs="24">
            <h3>{{formData.createBy}}</h3>
            <el-row :gutter="30">
                <el-col :lg="16" :md="16" :sm="24" :xs="24">
                    <el-card>
                        <div slot="header">下注信息</div>
                        <el-table stripe fit
                                  v-loading="isLoading"
                                  :cell-style="{textAlign:'center'}"
                                  :header-cell-style="{textAlign:'center'}"
                                  :data="table1Data"
                        >
                            <el-table-column
                                    label="天"
                                    prop="1"
                            >
                              <template slot-scope="{row}">
                                {{row[1] | betNumberFormatter}}
                              </template>
                            </el-table-column>
                            <el-table-column
                                    label="地"
                                    prop="2"
                            >
                              <template slot-scope="{row}">
                                {{row[2] | betNumberFormatter}}
                              </template>
                            </el-table-column>
                            <el-table-column
                                    label="玄"
                                    prop="3"
                            >
                              <template slot-scope="{row}">
                                {{row[3] | betNumberFormatter}}
                              </template>
                            </el-table-column>
                            <el-table-column
                                    label="黄"
                                    prop="4"
                            >
                              <template slot-scope="{row}">
                                {{row[4] | betNumberFormatter}}
                              </template>
                            </el-table-column>
                        </el-table>
                    </el-card>
                </el-col>

                <el-col :lg="8" :md="8" :sm="24" :xs="24">
                    <el-card>
                        备注：百人牛牛存在倍场分组情况，游戏房间会出现如下情况，例如4倍场-体验1，10倍场-体验2
                    </el-card>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="24">
                    <el-card>
                        <div slot="header">开奖信息</div>
                        <el-table
                                :cell-style="{textAlign:'center'}"
                                :header-cell-style="{textAlign:'center'}"
                                :data="table2Data"
                                v-loading="isLoading">
                            <el-table-column label="开奖源" prop="" :formatter="displayLotteryType">
                            </el-table-column>
                            <el-table-column label="牌型" prop="cards"
                            >
                              <template slot-scope="{row}">
                                {{row.cards | cardsFilter}}
                              </template>
                            </el-table-column>
                            <el-table-column label="倍数" prop="fold"></el-table-column>
                            <el-table-column label="结果" prop="win">
                                <template slot-scope="scope">
                                    <el-tag v-if="scope.row.win === true" type="success">赢</el-tag>
                                    <el-tag v-else-if="scope.row.win === false" type="danger">输</el-tag>
                                    <el-tag v-else>{{scope.row.win}}</el-tag>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-card>
                </el-col>
            </el-row>
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
                table2Data: [],
                isLoading: false
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
                operationRequest.getBaiRenNiuNiuDetails({id: this.recordId}).then(res => {
                    this.isLoading = false;
                    if (res.code == 200) {
                        let tmp = {};
                        this.formData = res.data;
                        this.table1Data = [];
                        this.table2Data = res.data.openLotteryDayList;
                        for (let item in this.table2Data) {
                            this.table2Data[item].id = item;
                            if (item > 0) {
                                tmp[item] = this.table2Data[item].myBet
                            }
                        }
                        this.table1Data.push(tmp);
                    }
                    else {
                        this.$notify.error(res.msg);
                    }
                });
            },
            displayLotteryType(row) {
                if (row.id == 0) return '庄';
                if (row.id == 1) return '天';
                if (row.id == 2) return '地';
                if (row.id == 3) return '玄';
                if (row.id == 4) return '黄'
            },
            displayCards(row) {
                let cards = '';
                for (let k in row.cards) {
                    if (k > 0) {
                        cards += ', '
                    }
                    //花色
                    if (row.cards[k][0] == 0) {
                        cards += '黑桃'
                    }
                    else if (row.cards[k][0] == 1) {
                        cards += '红桃'
                    }
                    else if (row.cards[k][0] == 2) {
                        cards += '梅花'
                    }
                    else if (row.cards[k][0] == 3) {
                        cards += '方块'
                    }
                    // A ~ K
                    if (row.cards[k][1] == 0) {
                        cards += 'A';
                    }
                    else if (row.cards[k][1] == 10) {
                        cards += 'J';
                    }
                    else if (row.cards[k][1] == 11) {
                        cards += 'Q';
                    }
                    else if (row.cards[k][1] == 12) {
                        cards += 'K';
                    } else {
                        cards += row.cards[k][1] + 1
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
    .niuniu {
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
