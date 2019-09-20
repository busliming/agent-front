<template>
    <el-card class="bet-record">
        <el-form label-width="70px">
          <el-row
            type="flex" justify="space-between"
          >
            <el-col :span="8">
              <el-form-item label="时间：" label-width="60px">
                  <el-date-picker
                      value-format="yyyy-MM-dd"
                      type="daterange"
                      v-model="daterange"
                      range-separator="~"
                      align="center"
                      clearable
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      :picker-options="datePickerOption"
                      style="width: 300px;"
                  ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="游戏名称：" label-width="100px">
                  <el-select v-model="gameId" clearable>
                      <el-option value="" label="全部"></el-option>
                      <el-option
                          v-for="game in gameList"
                          :key="game.gameId"
                          :label="game.gameName"
                          :value="game.gameId"
                      ></el-option>
                  </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="游戏房间：" label-width="100px">
                  <el-select v-model="roomName" clearable>
                      <el-option value="" label="全部"></el-option>
                      <template v-for="room in roomList">
                          <el-option :value="room.roomName" :label="room.gameName" :key="room.$index"></el-option>
                      </template>
                  </el-select>
              </el-form-item>
            </el-col>

          </el-row>
          <el-row
            type="flex" justify="space-between"
          >
              <el-col :span="5">
                  <el-form-item label="会员账号：" label-width="90px">
                      <el-input v-model="account" clearable style="width:200px;" maxlength="16"></el-input>
                  </el-form-item>
              </el-col>
            <el-col :span="5">
              <el-form-item label="会员id：" label-width="90px">
                  <el-input v-model.trim="playId" style="width:200px;" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="手机号码：" label-width="90px">
                  <el-input v-model="phone" clearable style="width: 200px;"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="3">
              <el-row type="flex" justify="end">
                <el-button type="primary" size="medium" icon="el-icon-search" @click="searchHandle">查询</el-button>
              </el-row>
            </el-col>
          </el-row>
        </el-form>
        <el-table
            :data="tableData"
            border=""
            fit
            stripe
            :cell-style="{textAlign:'center'}"
            :header-cell-style="{textAlign:'center'}"
            style="margin-top:15px"
            v-loading="tableLoading"
        >
            <el-table-column prop="startTime" label="开始时间" min-width="160px" sortable></el-table-column>
            <el-table-column prop="endTime" label="结束时间" min-width="160px" sortable></el-table-column>
            <el-table-column prop="account" label="会员账号" sortable></el-table-column>
            <el-table-column prop="createBy" label="游戏名称" sortable></el-table-column>
            <el-table-column prop="roomName" label="游戏房间" sortable></el-table-column>
            <el-table-column prop="betMoney" label="投注" sortable>
                <template slot-scope="scope">{{ scope.row.betMoney | betNumberFormatter }}</template>
            </el-table-column>
            <el-table-column prop="lotteryMoney" label="中奖金额" sortable>
                <template slot-scope="scope">{{ scope.row.lotteryMoney | betNumberFormatter }}</template>
            </el-table-column>
            <el-table-column prop="changeAmount" label="盈亏" sortable>
                <template slot-scope="scope">{{ scope.row.changeAmount | betNumberFormatter }}</template>
            </el-table-column>
            <el-table-column prop="changeValue" label="税收" sortable>
                <template slot-scope="scope">{{ scope.row.changeValue | betNumberFormatter }}</template>
            </el-table-column>
            <el-table-column prop="pumping" label="抽水" sortable>
                <template slot-scope="scope">{{ scope.row.pumping | betNumberFormatter }}</template>
            </el-table-column>
            <el-table-column label="操作" sortable>
                <template slot-scope="scope">
                    <el-button type="text" @click="getBetDetails(scope.row)">详细</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-row style="margin-top:30px">
            <el-col :lg="24" :md="24">
                <el-pagination
                    @size-change="sizeChangeHandle"
                    @current-change="currentChangeHandle"
                    :current-page="pageNum"
                    :page-sizes="[10,20,50,100,200]"
                    :page-size.sync="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                ></el-pagination>
            </el-col>

        </el-row>
        <el-row style="margin-top:10px">
            <el-col :lg="24" :md="24">
                <template v-if="summaryData !== null">
                    <el-form :inline="true">
                        <el-form-item label="总下注金额">
                            <el-tag>{{summaryData.totalBetMoney | betNumberFormatter}}元</el-tag>
                        </el-form-item>
                        <el-form-item label="总中奖金额">
                            <el-tag>{{summaryData.totalLotteryMoney | betNumberFormatter}}元</el-tag>
                        </el-form-item>
                        <el-form-item label="总盈亏金额">
                            <el-tag>{{summaryData.totalChangeAmount | betNumberFormatter}}元</el-tag>
                        </el-form-item>
                        <el-form-item label="总税收金额">
                            <el-tag>{{summaryData.totalChangeValue | betNumberFormatter}}元</el-tag>
                        </el-form-item>
                    </el-form>
                </template>
                <template v-else>
                    <el-form :inline="true">
                        <el-form-item label="总下注金额">
                            <el-tag>0元</el-tag>
                        </el-form-item>
                        <el-form-item label="总中奖金额">
                            <el-tag>0元</el-tag>
                        </el-form-item>
                        <el-form-item label="总盈亏金额">
                            <el-tag>0元</el-tag>
                        </el-form-item>
                        <el-form-item label="总税收金额">
                            <el-tag>0元</el-tag>
                        </el-form-item>
                    </el-form>
                </template>
            </el-col>
        </el-row>
    </el-card>
</template>

<script>
import operationRequest from "@/request/operation";
import tableHeight from "@/tool/tableHeight";
import times from "@/tool/times";

export default {
  data() {
    return {
      gameList: [],
      roomList: [],
      //查询条件
      daterange: null,
      datePickerOption: {
        disabledDate(time) {
          //不让选择2018年11月24日之前的日期
          return time.getTime() < 1542988800000;
        }
      },

      account: "",
      gameId: "",
      gameType: "",
      createDate: "",
      roomName: "",
      playId:'',
      phone:'',

      pageNum: 1,
      pageSize: 10,
      total: 0,
      TABLEMAXHEIGHT: 0,

      tableLoading: false, //表格的加载状态
      tableData: [],
      buYuData: {},
      summaryData: {
        totalBetMoney: null,
        totalLotteryMoney: null,
        totalChangeAmount: null,
        totalChangeValue: null
      },
     // isActivated:false,//默认不执行
    };
  },
  watch: {
    gameId(val) {
      this.getRoomTypeList(val);
    },
  },
  filters: {
    moneyFormatter(val) {
      if (!val) return "0";
      val = parseFloat(val).toFixed(2);
      if (val == "0.00") val = "0";
      return val.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
  },
  methods: {
    init(){
      let params = this.$store.getters.betParams;
      if(params.account){
        //时间  游戏名称   游戏房间   会员账号
        let time = params.time.split(' ');
        this.account = params.account;
        this.daterange = [time[0],time[0]];
        if(params.game != null && params.game != ''){
          this.gameId = parseInt(params.game);
        }else{
          this.gameId = ''
        }
        this.roomName = "";   //需求更改为全部房间
        this.pageNum = 1;
        this.$store.dispatch('clearBetParams'); //清除
      }
      console.log(params);
      this.queryHandle();
    },
    searchHandle() {
      this.pageNum = 1;
      this.queryHandle();
    },
    queryHandle() {
        if(this.playId!=null&&this.playId!=''){
            if(this.playId.toString().length>9){
                this.$message.warning({message: "会员ID长度不能大于9位"});
                return;
            }
            let reg = new RegExp(/^\d+$/);//包含0 和大于0的整数
            if (!reg.test(this.playId)) {
                this.$message.warning({message: "会员ID请输入有效格式(非负整数)"});
                return;
            }
        }
      let data = {
        startTime: this.daterange ? this.daterange[0] : "",
        endTime: this.daterange ? this.daterange[1] : "",
        account: this.account,
        gameId: this.gameId,
        playId:this.playId!=''? Number(this.playId):null,
        phone: this.phone,
        createDate: this.createDate,
        roomName: this.roomName,
        limit: this.pageSize,
        offset: (this.pageNum - 1) * this.pageSize
      };
      this.tableLoading = true;
      operationRequest.getGameRecord(data).then(res => {
        this.tableLoading = false;
        this.tableData = res.rows;
        this.summaryData = res.params;
        this.total = res.total;
        this.isActivated = true;//第一次初始化的时候 不执行activated,等isActivated变成true以后 再执行
      });
      window.sessionStorage.setItem(
        "queryParams",
        JSON.stringify(this.queryParams)
      );
    },
    getGameType() {
      operationRequest.getGameType().then(res => {
        this.gameList = res.data;
      });
    },
    // getGameRecordSummary() { //prod_new 作废
    //   let data = {
    //     startTime: this.daterange ? this.daterange[0] : "",
    //     endTime: this.daterange ? this.daterange[1] : "",
    //     account: this.account,
    //     gameId: this.gameId,
    //     createDate: this.createDate,
    //     roomName: this.roomName,
    //     limit: this.pageSize,
    //     offset: (this.pageNum - 1) * this.pageSize
    //   };
    //   operationRequest
    //     .getGameRecordSummary(data)
    //     .then(res => {
    //       if (res.code == 200) {
    //         this.summaryData = res.data;
    //       } else {
    //         this.$notify({
    //           type: "warning",
    //           title: res.msg
    //         });
    //       }
    //     })
    //     .catch(e => console.log(e));
    // },
    getRoomTypeList(val) {
      operationRequest.getRoomTypeList({ gameId: val }).then(res => {
          let arrList=[];

          var hash = {};
          arrList = res.data.reduce(function(item, next) {
              hash[next.roomName] ? '' : hash[next.roomName] = true && item.push(next);
              return item
          }, [])

          this.roomList = arrList;//顶部搜索游戏列表赋值
      });
    },
    getBetDetails(row) {
      if (row.gameId == "3" || row.gameId == "13" || row.gameId == "19" || row.gameId == "29") {
        window.sessionStorage.setItem("buYuData", JSON.stringify(row));
      }
      this.$router.push({
        name: "投注详情",
        params: {
          gameId: row.gameId,
          recordId: row.detailsId
        }
      });
    },
    sizeChangeHandle(size) {
      //表格显示条数改变
      this.pageSize = size;
      this.queryHandle();
    },
    currentChangeHandle(crtpage) {
      //表格显示页数改变
      this.pageNum = crtpage;
      this.queryHandle();
    }
  },
  created() {
    this.daterange = [];
    this.daterange.push(times.DateToYMD(new Date()));
    this.daterange.push(times.DateToYMD(new Date()));
    this.getGameType();
    this.getRoomTypeList();
    this.init();
  },
    activated(){
        if(this.isActivated) {
            this.init();
        }
  },
  /* beforeRouteLeave (to, from, next) {
        // 导航离开该组件的对应路由时调用
        // 可以访问组件实例 `this`
        this.daterange = [];
        this.daterange.push(times.DateToYMD(new Date()));
        this.daterange.push(times.DateToYMD(new Date()));
        next();
    }*/
};
</script>

<style lang="scss" scoped>
.bet-record {
  .el-col {
    text-align: center;
  }
}
</style>
