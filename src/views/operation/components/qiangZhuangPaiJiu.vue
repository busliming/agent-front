<template>
  <el-row :gutter="20" class="erRen">
    <el-col :xl="8" :lg="8" :md="8" :sm="10" :xs="24">
      <h3>对局信息</h3>
      <el-card v-loading="isLoading">
        <el-form label-width="100px">
          <el-form-item label="会员账号：">{{ formData.account }}</el-form-item>
          <el-form-item label="游戏名称：">{{ formData.createBy }}</el-form-item>
          <el-form-item label="游戏桌号：">{{ formData.tableNumber }}</el-form-item>
          <el-form-item label="当局局号：">{{ formData.gameCode}}</el-form-item>
          <el-form-item label="开始时间：">{{ formData.startTime }}</el-form-item>
          <el-form-item label="结束时间：">{{ formData.endTime }}</el-form-item>
          <el-form-item label="下注金额：">{{ formData.betMoney | betNumberFormatter }}</el-form-item>
          <el-form-item label="中奖总金额：">{{ formData.lotteryMoney | betNumberFormatter }}</el-form-item>
          <el-form-item label="当局输赢：">{{ formData.result | betNumberFormatter }}</el-form-item>
          <el-form-item label="当局税收：">{{ formData.chargeValue | betNumberFormatter }}</el-form-item>
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
          <el-table-column label="玩家昵称" prop="playerName"></el-table-column>
          <el-table-column label="牌型">
            <template slot-scope="{row}">
              <span
                v-for="(poker,index) in row.pokers"
                :key="index"
              >{{poker.name}}&nbsp;&nbsp;</span>
            </template>
          </el-table-column>
          <el-table-column label="底分" prop="roomField">
            <template slot-scope="{row}">
              {{row.roomField | betNumberFormatter}}
            </template>
          </el-table-column>
          <el-table-column label="抢庄倍数">
            <template slot-scope="{row}">
              <template v-if="row.dealer === true">
                {{row.multiple}}
              </template>
              <template v-else>
                -
              </template>
            </template>
          </el-table-column>
          <el-table-column label="下注倍数">
            <template slot-scope="{row}">
              <template v-if="row.dealer === false">
                {{row.multiple}}
              </template>
              <template v-else>
                -
              </template>
            </template>
          </el-table-column>
          <el-table-column label="输赢结果" prop="result">
            <template slot-scope="{row}">
              {{row.result | betNumberFormatter}}
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
  },
  methods: {
    queryRecords() {
      this.isLoading = true;
      operationRequest
        .getQZPJDetails({ id: this.recordId })
        .then(res => {
          this.isLoading = false;
          if (res.code == 200) {
            this.formData = res.data;
            this.tableData = [];
            this.tableData.push(res.data.selfInfo);
            this.tableData = this.tableData.concat(res.data.otherInfos);
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
