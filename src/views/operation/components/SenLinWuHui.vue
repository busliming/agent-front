<template>
  <el-row :gutter="20" class="erRen">
    <el-col :xl="8" :lg="8" :md="8" :sm="10" :xs="24">
      <h3>对局信息</h3>
      <el-card v-loading="isLoading">
        <el-form label-width="100px">
            <el-form-item label="会员账号">{{ formData.account }}</el-form-item>
            <el-form-item label="游戏名称">{{ formData.createBy }}</el-form-item>
            <el-form-item label="游戏房间">{{ formData.roomName }}</el-form-item>
            <el-form-item label="当局桌号">{{ formData.tableNumber}}</el-form-item>
            <el-form-item label="当局编号">{{ formData.gameCode}}</el-form-item>
            <el-form-item label="开始时间">{{ formData.startTime }}</el-form-item>
            <el-form-item label="结束时间">{{ formData.endTime }}</el-form-item>
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
                <el-tag v-if="formData.changeAmount > 0" type="success">{{ formData.changeAmount | betNumberFormatter}}</el-tag>
                <el-tag v-else-if="formData.changeAmount < 0" type="danger">{{ formData.changeAmount | betNumberFormatter}}</el-tag>
                <el-tag v-else>0元</el-tag>
            </el-form-item>
            <el-form-item label="当局税收：">
                <el-tag>{{ formData.chargeValue | betNumberFormatter }}元</el-tag>
            </el-form-item>
        </el-form>
      </el-card>
    </el-col>

    <el-col :xl="16" :lg="16" :md="16" :sm="14" :xs="24">
      <h3>{{formData.createBy}}</h3>
      <el-card v-loading="isLoading">
        <div slot="header">下注信息</div>
        <el-table
          :cell-style="{textAlign:'center'}"
          :header-cell-style="{textAlign:'center'}"
          :data="tableData"
          highlight-current-row
        >
            <el-table-column prop="targetName" label="盘口"></el-table-column>
            <el-table-column prop="odds" label="赔率"></el-table-column>
            <el-table-column prop="allTargetBet" label="总下注"></el-table-column>
            <el-table-column prop="myTargetBet" label="我的下注"></el-table-column>
            <el-table-column prop="myTargetWin" label="我的输赢">
                <template slot-scope="{row}">
                    <el-tag type="success" v-if="row.myTargetWin > 0">{{row.myTargetWin}}</el-tag>
                    <el-tag type="danger" v-else-if="row.myTargetWin < 0">{{row.myTargetWin}}</el-tag>
                    <el-tag type="info" v-else>{{row.myTargetWin}}</el-tag>
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
  },
  methods: {
    queryRecords() {
      this.isLoading = true;
      operationRequest
        .getForestDanceDetails({ id: this.recordId })
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
