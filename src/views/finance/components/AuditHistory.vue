<template>
  <div>
    <el-form
      label-width="100px"
      size="medium"
    >
      <el-row
        type="flex" justify="space-between"
      >
        <el-form-item label="会员账号">
          <el-input v-model="account" placeholder="会员账号" maxlength="16"></el-input>
        </el-form-item>
        <el-form-item label="会员ID">
          <el-input v-model.trim="id" placeholder="会员id"></el-input>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker 
            v-model="dateRange"
            type="datetimerange"
            align="center"
            value-format="yyyy-MM-dd HH:mm:ss"
            clearable
          ></el-date-picker>
        </el-form-item>
        <el-form-item label-width="0">
          <el-button type="primary" size="medium"
            @click='searchHandle'
          >查询</el-button>
        </el-form-item>
      </el-row>
    </el-form>

    <el-table
      :data="tableData"
      v-loading='loading'
      :border="true"
      :fit="true"
      size="medium"
      stripe
      :cell-style="{textAlign:'center'}"
      :header-cell-style="{textAlign:'center'}"
    >
      <el-table-column label="操作者">
        <template slot-scope="{row}">
          {{row.checkBy}}
          <span
            v-if="row.automaticDraw == 1"
          >：自动出款</span>
          <span
            v-if="row.automaticDraw == 2"
          >：手动出款({{row.drawState | drawStateFilter}})</span>
        </template>
      </el-table-column>
      <el-table-column label="内容" width="500px">
        <template slot-scope="{row}">
          <p>会员：{{row.account}}</p>
          <p>充值稽核：{{row.subAmountPay + row.charge > 0 ?'不通过':'通过'}}，需要扣除行政费 {{row.subAmountPay}}+手续费：{{row.charge}}</p>
          <p>优惠稽核：{{row.subAmountCheck > 0?'不通过':'通过'}}，需要扣除优惠总和：{{row.subAmountCheck}}</p>
          <p>总扣除金额：充值稽核+优惠稽核，总共需扣除{{row.totalCharge}}</p>
          <p>提出金额：{{row.orderAmount}}   实际出款：{{row.finalAmount}} </p>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button type="primary" size="small"
            @click='checkRow(row)'
          >查看详情</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作时间" prop="checkDate"></el-table-column>
    </el-table>
    <el-row type="flex" justify="center">
      <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageNum"
        :page-sizes="[10,20,50,100,200]"
        :page-size.sync="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-row>

    <!-- 查看详情 -->
    <el-dialog title="稽核详情"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <el-table
        :data="dialogTable"
        v-loading="dialogLoading"
        fit
        border
        stripe
        size='medium'
        :cell-style="{textAlign:'center'}"
        :header-cell-style="{textAlign:'center'}"
      >
        <el-table-column label="订单号" prop="orderNumber"></el-table-column>
        <el-table-column label="存款时间" prop="orderDate"></el-table-column>
        <el-table-column label="金额">
          <template slot-scope="{row}">
            <span>
              {{row.receiptType | myCurrenc}}{{row.orderAmount}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="存款已打码量" prop="betedAmount"></el-table-column>
        <el-table-column label="应打码量">
          <template slot-scope="{row}">
            <span
              v-if="row.unCheck == 1"
            >
              免稽核
            </span>
            <span
              v-else
            >{{row.betAmountWill}}</span>
          </template>
        </el-table-column>
        <el-table-column label="剩余打码量" prop="checkedResult"></el-table-column>
        <el-table-column label="是否通过">
          <template slot-scope="{row}">
            <span
              v-if="row.unCheck == 1"
            >
              免稽核
            </span>
            <span
              v-else
            >
              <template
                v-if="row.checkedResult < 0"
              >
                <el-tag type="danger">
                  <i class="el-icon-error"></i> 否
                </el-tag>
              </template>
              <template
                v-else
              >
                <el-tag type="success">
                  <i class="el-icon-success"></i> 是
                </el-tag>
              </template>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="扣除费用"  width="150">
                <template slot-scope="{row}">
          <span
            v-if="row.unCheck == 1"
          >
            免稽核
          </span>
          <template
            v-else
          >
            <span
              v-if="row.receiptType == 1"
            >
              行政费用：{{row.subAmountCheck}}
            </span>
            <span
              v-if="row.receiptType == 2"
            >
              优惠扣除：{{row.subAmountCheck}}
            </span>
            <span
              v-if="row.receiptType == 3"
            >
              扣除首充送：{{row.subAmountCheck}}
            </span>
            <span
              v-if="row.receiptType == 4"
            >
              扣除注册送：{{row.subAmountCheck}}
            </span>
            <span
              v-if="row.receiptType == 5"
            >
              扣除试玩金：{{row.subAmountCheck}}
            </span>
            <span v-if="
              row.receiptType != 1 &&
              row.receiptType != 2 &&
              row.receiptType != 3 &&
              row.receiptType != 4 &&
              row.receiptType != 5
            " >
              优惠扣除：{{row.subAmountCheck}}
            </span>
          </template>
        </template>
        </el-table-column>
      </el-table>
      <el-row
        slot="footer"
        type="flex" justify="end"
      >
        <el-button type="primary" size="medium"
          @click='dialogVisible = false'
        >关闭</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import financeRequest from '@/request/finance'
import time from '@/tool/times'

export default {
  name:'AuditHistory',
  created(){
    console.log('历史稽核created');
    this.$nextTick(() => {
      this.init(); //初始化
    })
  },
  activated(){
    console.log('历史稽核activated');
    this.$nextTick(() => {
      this.init(); //初始化
    })
  },
  data(){
    return {
      account:'',//条件查询 会员账号
      id:'',//条件查询 会员id
      dateRange:null,//条件查询 日期

      tableData:[//列表数据
      ], 
      loading:false,

      pageNum:1,
      pageSize:10,
      total:0,

      dialogVisible:false,
      dialogLoading:false,
      dialogTable:[ //稽核详情表格数据
      ],
    }
  },
  filters:{
    drawStateFilter(val){
      let arr = {
        1:'出款未完成/申请中',
        2:'已出款',
        3:'已拒绝',
        4:'出款失败'
      }
      return arr[val]
    },
    myCurrenc:function(val){
           if(val>=70 && val<=80){
               return "幸运转盘："
           }else{
                switch(val){
                   case 1:
                   return "存款："
                   break;
                   case 2:
                   return "优惠："
                   break;
                   case 3:
                   return "首充送："
                   break;
                   case 4:
                   return "注册送："
                   break;
                   case 5:
                   return "试玩金："
                   break;
                   case 6:
                   return "签到："
                   break;
                   // case 700:
                   // return "幸运转盘："
                   // break;
                   case 8:
                   return "VIP："
                   break;
                   case 9:
                   return "实名认证："
                   break;
                   case 11:
                   return "任务-游戏局数："
                   break;
                   case 12:
                   return "任务-有效下注："
                   break;
                } 
           }
      }
  },
  methods:{
    init(){
      let drawnumber1 = this.$store.getters.auditParams.drawnumber;
      let account1 = this.$store.getters.auditParams.account;
      let orderState = this.$store.getters.auditParams.state;
      console.log('进入历史稽核');
      console.log('从出款审核带过来的drawnumber为：'+drawnumber1);
      console.log('从出款审核带过来的account为：'+account1);
      console.log('从出款审核带过来的orderState为：'+orderState);
      if(drawnumber1&&account1&&(orderState == 2 || orderState == 6)){ //从审核跳转过来 走弹框逻辑 已出款 已拒绝
        let row = {
          account:account1,
          drawNumber:drawnumber1,
        }
        this.checkRow(row);
        this.$store.dispatch('clearAuditParams') //清空store
      }else if(drawnumber1&&account1&&(orderState == 1 || orderState == 4)){ //从审核跳转过来 跳即时稽核
        console.log('应该跳转即时稽核');
        this.$emit('tabChange',1,'AuditNow')
      }else{  //菜单进入  走列表查询逻辑
        this.dateRange = [];
        this.dateRange.push(time.DateToYMD(new Date()) +' 00:00:00');
        this.dateRange.push(time.DateToYMDHMS(new Date()));
        this.queryHandle();
      }
    },
    searchHandle(){
      this.pageNum = 1;
      this.queryHandle();
    },
    queryHandle(){ //获取列表数据
        if (this.id != null&&this.id!='') {
            if (this.id.toString().length > 9) {
                this.$message.warning({message: "会员ID长度不能大于9位"});
                return;
            }
            let reg = new RegExp(/^\d+$/);//包含0 和大于0的整数
            if (!reg.test(this.id)) {
                this.$message.warning({message: "会员ID请输入有效格式(非负整数)"});
                return;
            }
        }
      let data = {
        account:this.account,
        playId:this.id,
        startDate:this.dateRange?this.dateRange[0]:'',
        endDate:this.dateRange?this.dateRange[1]:'',
        limit:this.pageSize,
        offset:(this.pageNum -1) * this.pageSize,
      }
      financeRequest.getHistoryCheckRecordList(data).then(res => {
        if(res.code == 200){
            this.tableData = res.data.rows;
            this.total = res.data.total;
            this.pageSize = res.data.limit;
            this.pageNum = res.data.offset / res.data.limit + 1;
        }else{
          this.$notify.warning({title:res.msg})
        }
      }).catch(e => {
        console.log(e);
      })
    },
    checkRow(row){ //查看详情
      this.dialogVisible = true;
      this.dialogLoading = true;
      let data = {
        account:row.account,
        checkStatus:1,  //历史
        orderNumber:row.drawNumber,
      }
      financeRequest.getCurrentCheckRecordDetail(data).then(res => {
        if(res.code == 200){
          this.dialogTable = res.data.chResultList;
        }else{
          this.$notify.warning({title:res.msg})
        }
        this.dialogLoading = false;
      }).catch(e => {
        console.log(e)
        this.dialogLoading = false;
      })
    },
    sizeChangeHandle(size) {
      //切换表格显示条数
      this.pageSize = size;
      this.queryHandle();
    },
    currentChangeHandle(crtpage) {
      //切换表格当前页
      this.pageNum = crtpage;
      this.queryHandle();
    },
  },
}
</script>

