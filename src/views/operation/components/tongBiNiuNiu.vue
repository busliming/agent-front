<template>
  <el-row :gutter="20" class="erRen">
    <el-col :xl="8" :lg="8" :md="8" :sm="10" :xs="24">
      <h3>对局信息</h3>
      <el-card v-loading="isLoading">
        <el-form label-width="100px">
          <el-form-item label="会员账号">{{ formData.account }}</el-form-item>
          <el-form-item label="游戏名称">{{ formData.createBy }}</el-form-item>
          <el-form-item label="游戏桌号">{{ formData.tableNumber }}</el-form-item>
          <el-form-item label="当局局号">{{ formData.gameCode}}</el-form-item>
          <el-form-item label="开始时间">{{ formData.startTime }}</el-form-item>
          <el-form-item label="结束时间">{{ formData.endTime }}</el-form-item>

          <el-form-item label="下注金额">{{ formData.betMoney | betNumberFormatter }}</el-form-item>
          <el-form-item label="中奖总金额">{{ formData.lotteryMoney | betNumberFormatter }}</el-form-item>
          <el-form-item label="当局输赢">{{ formData.changeAmount | betNumberFormatter }}元</el-form-item>
          <el-form-item label="当局税收">{{ formData.chargeValue | betNumberFormatter }}元</el-form-item>
        </el-form>
      </el-card>
    </el-col>

    <el-col :xl="16" :lg="16" :md="16" :sm="14" :xs="24">
      <h3>{{formData.createBy}}</h3>
      <el-card v-loading="isLoading">
        <div slot="header">对局详情</div>
        <el-table
          :cell-style="{textAlign:'center'}"
          :header-cell-style="{textAlign:'center'}"
          :data="tableData"
          highlight-current-row
        >
          <el-table-column label="玩家名称" width="190" prop='nickName'></el-table-column>
          <el-table-column label="牌型">
            <template slot-scope="{row}">
              {{row.pokers | cardsFilter}}
            </template>
          </el-table-column>
          <el-table-column label="牌型倍数" prop="odds"></el-table-column>
          <el-table-column label="底分" prop="roomField">
            <template slot-scope="{row}">
              {{row.roomField | betNumberFormatter}}
            </template>
          </el-table-column>
          <el-table-column label="下注倍数" prop="betOdds"></el-table-column>
          <el-table-column label="输赢结果" prop="winCoins">
            <template slot-scope="{row}">
              {{row.winCoins | betNumberFormatter}}
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
      gameId: '',
      recordId: '',
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
        .getTBNNDDetails({ id: this.recordId })
        .then(res => {
          this.isLoading = false;
          if (res.code == 200) {
            this.formData = res.data;
            this.tableData = res.data.details;
          } else {
            this.$notify.error({title:res.msg});
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
