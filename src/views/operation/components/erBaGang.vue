<template>
  <el-row :gutter="20" class="erRen">
    <el-col :xl="8" :lg="8" :md="8" :sm="10" :xs="24">
      <h3>对局信息</h3>
      <el-card v-loading="isLoading">
        <el-form label-width="100px">
          <el-form-item label="会员账号">{{ formData.account }}</el-form-item>
          <el-form-item label="会员id">{{ formData.accountId }}</el-form-item>
          <el-form-item label="游戏名称">{{ formData.createBy }}</el-form-item>
          <el-form-item label="游戏房间">{{ formData.roomName }}</el-form-item>
          <el-form-item label="当局编号">{{ formData.gameCode}}</el-form-item>
          <el-form-item label="开始时间">{{ formData.startTime }}</el-form-item>
          <el-form-item label="结束时间">{{ formData.endTime }}</el-form-item>
          <el-form-item label="当局底分">{{ formData.bottomScore | betNumberFormatter}}</el-form-item>
          <el-form-item label="当局输赢">{{ formData.result | betNumberFormatter }}元</el-form-item>
          <el-form-item label="当局税收">{{ formData.chargeValue | betNumberFormatter }}元</el-form-item>
        </el-form>
      </el-card>
    </el-col>

    <el-col :xl="16" :lg="16" :md="16" :sm="14" :xs="24">
      <h3>{{formData.createBy}}</h3>
      <el-card v-loading="isLoading">
        <div slot="header">开奖信息</div>
        <el-table
          :cell-style="{textAlign:'center'}"
          :header-cell-style="{textAlign:'center'}"
          :data="tableData"
          highlight-current-row
        >
          <el-table-column label="玩家" width="190">
            <template slot-scope="{row}">
              {{(row.isDealer?'庄家:':'玩家:') + (row.playerName) }}
            </template>
          </el-table-column>
          <el-table-column label="牌型">
            <template slot-scope="{row}">
              {{row.cards | cardsFilter}}
            </template>
          </el-table-column>
          <el-table-column prop="callAmount" label="抢庄倍数" sortable>
            <template slot-scope="{row}">
              <span v-if="row.isDealer">
                {{row.callAmount | betNumberFormatter}}
              </span>
              <span v-else> - </span>
            </template>
          </el-table-column>
          <el-table-column prop="betAmount" label="下注倍数" sortable>
            <template slot-scope="{row}">
              <span v-if="row.isDealer"> - </span>
              <span v-else>
                {{row.betAmount | betNumberFormatter}}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="winLose" label="输赢结果" sortable>
            <template slot-scope="{row}">
              {{row.winLose | betNumberFormatter}}
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
    cardsFilter(value){
      let num = {
          0:'白板',
          1:'一筒',
          2:'二筒',
          3:'三筒',
          4:'四筒',
          5:'五筒',
          6:'六筒',
          7:'七筒',
          8:'八筒',
          9:'九筒',
      }
      let str = num[value[0]]+','+num[value[1]]
      return str
    },
  },
  methods: {
    queryRecords() {
      this.isLoading = true;
      operationRequest
        .getEBGDetails({ id: this.recordId })
        .then(res => {
          this.isLoading = false;
          if (res.code == 200) {
            this.formData = res.data;
            for(var item of res.data.details[0].playerInfo){
                if(item.betAmount == -1){
                    item.betAmount = '-'
                }
                if(item.callAmount == -1){
                    item.callAmount = '-'
                }
            }
            this.tableData = res.data.details[0].playerInfo;
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
