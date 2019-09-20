<template>
  <el-card>
    <el-form
      label-width="90px"
    >
      <el-row
        type="flex"
        justify="space-between"
      >
        <el-col
          :span="11"
        >
          <el-row
            type="flex" justify="space-between"
          >
            <el-col
              :span="3"
            >
              <el-button
                size="medium"
                @click="todayBtn"
              >
                今天
              </el-button>
            </el-col>
            <el-col
              :span="3"
            >
              <el-button
                size="medium"
                @click="yesterdayBtn"
              >
                昨天
              </el-button>
            </el-col>
            <el-col
              :span="3"
            >
              <el-button
                size="medium"
                @click="thisWeekBtn"
              >
                本周
              </el-button>
            </el-col>
            <el-col
              :span="3"
            >
              <el-button
                size="medium"
                @click="prevWeekBtn"
              >
                上周
              </el-button>
            </el-col>
            <el-col
              :span="3"
            >
              <el-button
                size="medium"
                @click="thisMonthBtn"
              >
                本月
              </el-button>
            </el-col>
            <el-col
              :span="3"
            >
              <el-button
                size="medium"
                @click="prevMonthBtn"
              >
                上月
              </el-button>
            </el-col>
          </el-row>
        </el-col>
        <el-col
          :span='9'
        >
          <el-form-item
            label="选择日期"
          >
            <el-date-picker
              type="daterange"
              v-model="daterange"
              range-separator='~'
              align="center"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width:100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col
          :span="2"
        >
          <el-button
            type="primary"
            size="medium"
            icon="el-icon-search"
            @click='searchHandle'
            style="width:100%"
          >搜索</el-button>
        </el-col>
      </el-row>
    </el-form>

    <!-- <el-row
      type="flex" justify="start" 
      style="height:100px;background:#eee;"
    >
      <el-col
        :span="6"
      >
        <div class="reportItem">
          <h3>娱乐税收</h3>
          <h2>{{chargeValue}}</h2>
        </div>
      </el-col>
      <el-col
        :span="6"
      >
        <div class="reportItem">
          <h3>系统输赢</h3>
          <h2>{{systemProfit}}</h2>
        </div>
      </el-col>
      <el-col
        :span="6"
      >
        <div class="reportItem">
          <h3>总下注</h3>
          <h2>{{betSum}}</h2>
        </div>
      </el-col>
      <el-col
        :span="6"
      >
        <div class="reportItem">
          <h3>在线玩家数</h3>
          <h2>{{onLineAccountNumber}}</h2>
        </div>
      </el-col>
    </el-row> -->

    <el-table
      :data='tableData'
      border
      fit
      stripe
      :cell-style="{textAlign:'center'}"
      :header-cell-style="{textAlign:'center'}"
      style="margin-top:15px"
      v-loading="tableLoading"
    >
      <el-table-column
        prop="gameName"
        label="游戏名称"
      ></el-table-column>
      <!-- <el-table-column
        prop="gameType"
        label="游戏类型"
      ></el-table-column> -->
      <el-table-column
        prop="betSum"
        label="总下注"
      >
        <template slot-scope="{row}">
          {{row.betSum | betNumberFormatter}}
        </template>
      </el-table-column>
      <el-table-column
        prop="chargeValue"
        label="服务税收"
      >
        <template slot-scope="{row}">
          {{row.chargeValue | betNumberFormatter}}
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="systemProfit"
        label="系统盈亏"
      ></el-table-column> -->
      <!-- <el-table-column
        label="操作"
      >
        <template
          slot-scope="props"
        >
          <el-button
            size="mini"
            @click="detailBtnhandle(props.row)"
          >详情</el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <el-row type="flex" justify="center">
      <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle" 
        :current-page="pageNum"
        :page-sizes="[10,20,50,100,200]"
        :page-size.sync="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-row>
  </el-card>
</template>

<script>
import operationRequest from '@/request/operation'
import times from '@/tool/times'


export default {
  name:'GameReport',
  data () {
    return {
      daterange:null,  

      pageNum:1,
      pageSize:10,
      total:0,

      tableLoading:false, //表格的加载状态
      tableData:[],
      betSum : '',
      chargeValue : '',  //娱乐税收？
      onLineAccountNumber : '',  
      systemProfit : '',  //系统输赢？
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
  },
  methods:{
    searchHandle(){
      this.pageNum = 1;
      this.findSumQuery()
    },
    findSumQuery(){  //获取报表及表格数据
      this.tableLoading = true;
      let data = {
        conditionsMap:{
          startDate:((this.daterange)?(this.daterange[0]) : times.DateToYMD(new Date())),
          endDate:((this.daterange)?(this.daterange[1]) : times.DateToYMD(new Date())),
        },
        limit:this.pageSize,
        offset:(this.pageNum -1)*this.pageSize,
        sort:'createDate',
        sortOrder:'desc',
      }
      operationRequest.findSumQuery(data).then(res => {
        if(res.rows){
          this.tableData = res.rows;
          this.pageNum = res.offset/res.limit +1; 
          this.pageSize = res.limit; 
          this.total = res.total; 

          // this.betSum = data.betSum;
          // this.chargeValue = data.chargeValue;
          // this.onLineAccountNumber = data.onLineAccountNumber;
          // this.systemProfit = data.systemProfit;
        }else{
          this.$notify({
            type:'warning',
            title:res.msg
          })
        }
        this.tableLoading = false;
      }).catch(err => {
        console.log(err);
        this.tableLoading = false;
      });
    },
    todayBtn(){ //今天按钮
      this.daterange = [];
      this.daterange.push(times.DateToYMD(new Date()));
      this.daterange.push(times.DateToYMD(new Date()));
      this.findSumQuery();
    },
    yesterdayBtn(){ //昨天按钮
      this.daterange = [];
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
      end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
      this.daterange.push(times.DateToYMD(start));
      this.daterange.push(times.DateToYMD(end));
      this.findSumQuery();
    },
    thisWeekBtn(){  //本周按钮
      this.daterange = [];
      let benznow = new Date(); 
      let day = benznow.getDay();
      let benzMondayTime;
      if(day == 0){
        benzMondayTime = benznow.getTime() - 6*3600 * 1000 * 24 ;
      }else{
        benzMondayTime = benznow.getTime() - (day-1)*3600 * 1000 * 24 ;
      }
      this.daterange.push(times.DateToYMD(new Date(benzMondayTime)));
      this.daterange.push(times.DateToYMD(benznow));
      this.findSumQuery();
    }, 
    prevWeekBtn(){  //上周按钮
      this.daterange = [];
      let shangznow = new Date(); 
      let shangzday = shangznow.getDay();
      let shangzMondayTime;
      if(shangzday == 0){
        shangzMondayTime = shangznow.getTime() - 6*3600 * 1000 * 24 ;  //本周一
      }else{
        shangzMondayTime = shangznow.getTime() - (shangzday-1)*3600 * 1000 * 24 ;  //本周一
      }
      let prevMondayTime = shangzMondayTime - 7*3600 * 1000 * 24; //上周一
      let prevSundayTime = shangzMondayTime - 1*3600 * 1000 * 24; //上周日
      this.daterange.push(times.DateToYMD(new Date(prevMondayTime)));
      this.daterange.push(times.DateToYMD(new Date(prevSundayTime)));
      this.findSumQuery();
    },
    thisMonthBtn(){ //本月按钮
      this.daterange = [];
      const end = new Date();
      const start = new Date();
      const firstDay = start.getTime()-(start.getDate()-1)*3600*1000*24;//本月一号
      this.daterange.push(times.DateToYMD(new Date(firstDay)));
      this.daterange.push(times.DateToYMD(end));
      this.findSumQuery();
    },
    prevMonthBtn(){  //上月按钮
      this.daterange = [];
      const start = new Date();
      const prevLastDay = start.getTime()-(start.getDate())*3600*1000*24;//上月最后一天
      const prevFirstDay = prevLastDay-(new Date(prevLastDay).getDate()-1)*3600*1000*24//上月第一天
      this.daterange.push(times.DateToYMD(new Date(prevFirstDay)));
      this.daterange.push(times.DateToYMD(new Date(prevLastDay)));
      this.findSumQuery();
    },
    sizeChangeHandle(size){
      this.pageSize = size;
      this.findSumQuery();
    },
    currentChangeHandle(crt){
      this.pageNum = crt;
      this.findSumQuery();
    },
  },
  created:function () {
    this.findSumQuery();
  }
}
</script>

<style lang="scss">
.reportItem{
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  flex-flow: column wrap;
  border-top:2px solid #fff;
  border-bottom:2px solid #fff;
  border-left:1px solid #fff;
  border-right:1px solid #fff;
  >h3{
    color: #999;
  }
  >h2{
    margin-top: 10px;
    color: #666
  }
}
</style>

