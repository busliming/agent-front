<template>
  <el-row :gutter="20" class="erRen">
    <el-col :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
      <h3>对局信息</h3>
      <el-card v-loading="isLoading">
        <el-form label-width="100px">
          <el-form-item label="会员账号">{{ formData.account }}</el-form-item>
          <el-form-item label="游戏名称">{{ formData.createBy }}</el-form-item>
          <el-form-item label="游戏房间">{{ formData.roomName }}</el-form-item>
          <el-form-item label="当局桌号">{{ formData.tableNumber}}</el-form-item>
          <el-form-item label="局号">{{ formData.gameCode}}</el-form-item>
          <el-form-item label="开始时间">{{ formData.startTime }}</el-form-item>
          <el-form-item label="结束时间">{{ formData.endTime }}</el-form-item>
          <el-form-item label="当局输赢">{{ formData.result | betNumberFormatter}}元</el-form-item>
          <el-form-item label="当局税收">{{ formData.chargeValue | betNumberFormatter}}元</el-form-item>
        </el-form>
      </el-card>
    </el-col>

    <el-col :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
      <h3>{{formData.createBy}}</h3>
      <el-card v-loading="isLoading">
        <div slot="header">对局详情</div>
        <el-table
          :cell-style="{textAlign:'center',borderBottom:'1px solid #ebeef5'}"
          :header-cell-style="{textAlign:'center'}"
          :data="tableData"
          :stripe="false"
          :row-class-name = "tableRowClassName"
          :highlight-current-row="false"
        >
          <el-table-column label="玩家" width="190" >
            <template slot-scope="{row}"  >
              <template v-if="row.type == 'BANKER'">
                 庄家
              </template>
                <template v-if="row.type == 'PLAYER'">
                        {{ row.playerName}} ({{row.status | statusFormatter}})
                </template>
            </template>
          </el-table-column>
           <el-table-column label="牌型">
             <template slot-scope="{row}">
               {{row.cards | cardsFilter}}
             </template>
           </el-table-column>
            <el-table-column label="初始注">
                <template slot-scope="{row}">
                    {{ row.bet | betNumberFormatter  }}
                </template>
            </el-table-column>
            <el-table-column label="加倍">
                <template slot-scope="{row}">
                    {{ row.addDouble | betNumberFormatter  }}
                </template>
            </el-table-column>
            <el-table-column label="保险">
                <template slot-scope="{row}">
                    {{ row.buyBenefits | betNumberFormatter  }}
                </template>
            </el-table-column>
            <el-table-column label="合计投注额">
                <template slot-scope="{row}">
                    {{ row.countBet | betNumberFormatter  }}
                </template>
            </el-table-column>
            <el-table-column label="牌型倍数">
                <template slot-scope="{row}">
                    {{ row.cardPre }}
                </template>
            </el-table-column>
            <el-table-column label="胜负结算">
                <template slot-scope="{row}">
                        {{ row.win | betNumberFormatter  }}
                </template>
            </el-table-column>
          <!-- <el-table-column label="下注">
             <template slot-scope="{row}">
               {{ row.bet | betNumberFormatter  }}
             </template>
           </el-table-column>
           <el-table-column label="倍数" prop="cardPre"></el-table-column>
           <el-table-column  label="胜负结算">
             <template slot-scope="{row}">
               {{ row.win | betNumberFormatter  }}
             </template>
           </el-table-column>
           <el-table-column  label="分牌">
             <template slot-scope="{row}" v-if="row.fenpai == 1">
               {{'分牌'}}
             </template>
           </el-table-column>
           <el-table-column  label="牌型">
             <template slot-scope="{row}" v-if="row.fenpai == 1">
               {{ row.cards_| cardsFilter  }}
             </template>
           </el-table-column>
           <el-table-column  label="下注">
             <template slot-scope="{row}" v-if="row.fenpai == 1">
               {{ row.bet_ | betNumberFormatter  }}
             </template>
           </el-table-column>
           <el-table-column  label="倍数">
             <template slot-scope="{row}" v-if="row.fenpai == 1">
               {{ row.cardPre_ }}
             </template>
           </el-table-column>
           <el-table-column label="胜负结算">
             <template slot-scope="{row}" v-if="row.fenpai == 1">
               {{ row.win_ | betNumberFormatter }}
             </template>
           </el-table-column>-->
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
      tableData: [{myself:false,card:null,bet:0,cardPre:0,win:0,fenpai:0,cards_:null,bet_:0,cardPre_:0,win_:0}],
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
    statusFormatter(val){
        let str ="";
        switch(val){
            case 1:
                str = "本家";
                break;
            case 2:
                str = "分牌";
                break;
            case 3:
                str = "多门";
                break;
            default:
                break;
        }
        return str;
    },
    cardsFilter(value){
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
      if(value!=null&&value!=undefined&&value!='') {
          value.map( item => {
          if(item!=null) {
              arr.push(color[item[0]] + num[item[1]]);
          }
      })
      }
      return arr.join(',');
    }
  },
  methods: {
      tableRowClassName(row) {

          let rowmyself =row.row.myself;
          if (rowmyself==true) {
              console.log(row);
              return 'info-row';
          }
      },
      queryRecords() {
          this.isLoading = true;
          operationRequest
              .getBlackJackDetails({id: this.recordId})
              .then(res => {
                  this.isLoading = false;
                  if (res.code == 200) {
                      this.formData = res.data!=null?res.data:{};
                      this.tableData = res.data!=null&&res.data.players!=null?res.data.players:[];// res.data.players.concat(arr); //玩家数据
                  } else {
                      this.$notify.error({title: res.msg});
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

<style lang="scss" >
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
    .el-table .el-table__body-wrapper.is-scrolling-none .el-table__body tbody .info-row{
        background-color:#aa95e4;

    }
    .el-table .el-table__body-wrapper.is-scrolling-none .el-table__body tbody .info-row:hover>td{
        background-color:#aa95e4;
    }

}

</style>
