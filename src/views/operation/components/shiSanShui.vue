<template>
  <el-row :gutter="20" class="erRen">
    <el-col :xl="8" :lg="8" :md="8" :sm="10" :xs="24">
      <h3>对局信息</h3>
      <el-card v-loading="isLoading">
        <el-form label-width="100px">
          <el-form-item label="会员账号：">{{ formData.account }}</el-form-item>
          <el-form-item label="游戏名称：">{{ formData.createBy }}</el-form-item>
          <el-form-item label="游戏房间：">{{ formData.roomName }}</el-form-item>
          <el-form-item label="当局桌号：">{{ formData.tableNumber}}</el-form-item>
          <el-form-item label="局号：">{{ formData.gameCode }}</el-form-item>
          <el-form-item label="开始时间：">{{ formData.startTime }}</el-form-item>
          <el-form-item label="结束时间：">{{ formData.endTime }}</el-form-item>
          <el-form-item label="底分：">
            {{ formData.bottomScore | betNumberFormatter }}
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
        <div slot="header">牌型</div>
        <el-table
          :cell-style="{textAlign:'center'}"
          :header-cell-style="{textAlign:'center'}"
          :data="tableData"
          highlight-current-row
        >
          <el-table-column label="开奖源">
            <template slot-scope="{row,$index}">
                {{$index === 0?'我的':'玩家'}}
            </template>
          </el-table-column>
          <!-- <el-table-column label="开奖牌型" prop="pokers" :formatter="displayCards"></el-table-column> -->
          <el-table-column label="开奖牌型">
              <template slot-scope="{row}">
                <template
                  v-if="row.specialCombination > -1"
                >
                  <el-row>
                    {{row.specialCombination | displayCards}}
                  </el-row>
                  <el-row>
                    {{row.totalScore}}
                  </el-row>
                </template>
                <template
                  v-else
                >
                  <el-row>
                    头墩{{row.headCards.totalScore}}：{{row.headCards.cards | cardsFilter}}
                  </el-row>
                  <el-row>
                    中头墩{{row.middleCards.totalScore}}：{{row.middleCards.cards | cardsFilter}}
                  </el-row>
                  <el-row>
                    尾墩{{row.lastCards.totalScore}}：{{row.lastCards.cards | cardsFilter}}
                  </el-row>
                  <el-row>
                    总计{{row.totalScore}}
                  </el-row>
                </template>
              </template>
          </el-table-column>
          <el-table-column label="结果">
            <template slot-scope="{row,$index}">
                <template
                  v-if="$index > 0"
                >
                  {{row.result}}
                </template>
                <template
                  v-else
                >
                  {{formData.selfResult}}
                </template>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import operationRequest from "@/request/operation";

export default {
  data() {
    return {
      gameId: "",
      recordId: "",
      formData: [],
      tableData: [],
      isLoading: false
    };
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
    displayCards(value) {  //特殊牌型
      let num = {
        0:'三顺子',
        1:'三同花',
        2:'六对半',
        3:'五对四冲',
        4:'四套冲三',
        5:'全黑',
        6:'全红',
        7:'全小',
        8:'全大',
        9:'三套炸弹',
        10:'一条龙',
        11:'十二皇族',
        12:'一条龙',
        13:'清龙',
      }
      return num[value];
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
      operationRequest
        .getThirteenDetails({ id: this.recordId })
        .then(res => {
          this.isLoading = false;
          if (res.code == 200) {
            this.formData = res.data;
            this.tableData = [];
            this.tableData.push(res.data.myPokerInf);
            this.tableData = this.tableData.concat(res.data.otherInfo);
          } else {
            this.$notify.error(res.msg);
          }
        });
    },
  },
  created() {
    this.gameId = this.$route.params.gameId;
    this.recordId = this.$route.params.recordId;
    this.queryRecords();
  }
};
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
    height: 60%;
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
