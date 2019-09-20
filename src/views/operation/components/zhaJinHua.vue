<template>
  <el-row :gutter="20" class="erRen">
    <el-col :xl="8" :lg="8" :md="8" :sm="10" :xs="24">
      <h3>对局信息</h3>
      <el-card v-loading="isLoading">
        <el-form label-width="100px">
          <el-form-item label="会员账号">{{ formData.account }}</el-form-item>
          <el-form-item label="会员id">{{ formData.accountId }}</el-form-item>
          <el-form-item label="游戏名称">{{ formData.gameName }}</el-form-item>
          <el-form-item label="游戏房间">{{ formData.name }}</el-form-item>
          <el-form-item label="当局编号">{{ formData.gameCode}}</el-form-item>
          <el-form-item label="开始时间">{{ formData.startTime }}</el-form-item>
          <el-form-item label="结束时间">{{ formData.endTime }}</el-form-item>
          <el-form-item label="当局底分">{{ formData.base | betNumberFormatter }}</el-form-item>
          <el-form-item label="当局输赢">{{ formData.win | betNumberFormatter }}元</el-form-item>
          <el-form-item label="当局税收">{{ formData.tax | betNumberFormatter }}元</el-form-item>
          <el-form-item label="喜钱">{{ xiqian | betNumberFormatter }}元</el-form-item>
        </el-form>
      </el-card>
    </el-col>

    <el-col :xl="16" :lg="16" :md="16" :sm="14" :xs="24">
      <h3>{{formData.gameName}}</h3>
      <el-card v-loading="isLoading">
        <div slot="header">对局详情</div>
        <el-table
          :cell-style="{textAlign:'center'}"
          :header-cell-style="{textAlign:'center'}"
          :data="tableData"
          highlight-current-row
        >
          <el-table-column label="玩家名称" width="190" prop="name"></el-table-column>
          <el-table-column label="牌型" width="200px">
            <template slot-scope="{row}">
              {{row.cards | cardsFilter}}
            </template>
          </el-table-column>
          <el-table-column label="喜钱">
            <template slot-scope="{row}">
              {{ row.openMoney | betNumberFormatter}}
            </template>
          </el-table-column>
          <el-table-column label="底分" prop="base">
            <template slot-scope="{row}">
              {{ row.base | betNumberFormatter}}
            </template>
          </el-table-column>
          <el-table-column label="跟注金额" prop="coin">
            <template slot-scope="{row}">
              {{ row.coin | betNumberFormatter}}
            </template>
          </el-table-column>
          <el-table-column label="输赢结果" prop="result">
            <template slot-scope="{row}">
              {{ row.result | betNumberFormatter}}
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="{row}">
              {{row.state | tableState}}
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
      isLoading: false,
      xiqian:0, //用于记录对局详情中所有喜钱记录的和
    };
  },
  filters:{
    tableState(val){
      switch(val){
        case 1: return "大赢家"
        break;
        case 2: return "比牌失败"
        break;
        case 3: return "弃牌"
      }
    },
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
        var num1 =num[item[1]]!=undefined?num[item[1]]:'未知';
        arr.push(color[item[0]]+num1);
      })
        console.log(arr);
      return arr.join(',');
    }
  },
  methods: {
    queryRecords() {
      this.isLoading = true;
      operationRequest
        .getZJHDetails({ id: this.recordId })
        .then(res => {
          this.isLoading = false;
          if (res.code == 200) {
              if(res.data!=null) {
                  this.formData = res.data;
                  this.tableData = res.data.players;
                  let money1 = 0;
                  if (this.tableData.length > 0) {
                      for (var i = 0; i < this.tableData.length; i++) {
                          money1 += this.tableData[i].openMoney != null ? this.tableData[i].openMoney : 0;
                      }
                  }
                  this.xiqian = money1;
              }
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
