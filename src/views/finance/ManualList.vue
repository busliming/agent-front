<template>
  <el-card>
    <el-form
      label-width="70px"
    >
      <el-row
        type="flex"
        justify="space-between"
      >
        <el-col
          :span='5'
        >
          <el-form-item
            label="会员账号"
          >
            <el-input
              placeholder="会员账号"
              v-model="account"
              clearable
            ></el-input>
          </el-form-item>
        </el-col> 
        <el-col
          :span='8'
        >
          <el-form-item
            label="金额范围"
          >
            <el-row
              type="flex"
              justify="space-between"
            >
              <el-col
                :span="11"
              >
                <el-input
                  type="number"
                  placeholder="金额下限"
                  v-model.number="startAmount"
                  clearable
                ></el-input>
              </el-col>
              <el-col
                :span="1"
                style="color:#000;text-align:center"
              >~</el-col>
              <el-col
                :span="11"
              >
                <el-input
                  type="number"
                  placeholder="金额上限"
                  v-model.number="endAmount"
                  clearable
                ></el-input>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            label="处理日期"
          >
            <el-row type="flex" justify="space-between">
              <el-date-picker
                type="daterange"
                value-format="yyyy-MM-dd"
                v-model="daterange"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                clearable
                style="width:100%"
              >
              </el-date-picker>
              <short-cuts
                :_value="{_date:'jint'}"
                :currentContext='this'
                currentModelName='daterange'
                currentQueryHandle='searchHandle'
              ></short-cuts>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row
        type="flex"
        justify="space-between"
      >
        <el-col :span="5">
          <el-form-item label="操作人">
            <el-input v-model="createBy" placeholder="操作人" clearable ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="13">
          <el-form-item label="提款类型" v-if="state == 'withdrawal'">
            <el-select v-model.number="drawType" placeholder="全部" clearable style="width:200px;">
              <el-option label="人工提款" :value="3"></el-option>
              <el-option label="误存提款" :value="4"></el-option>
              <el-option label="行政提款" :value="5"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-row type="flex" justify="space-between">
            <el-form-item label-width="0">
              <el-button 
                size="medium"
                type="primary"
                @click="exportHandle"
              >导出</el-button>
              <a v-if="src" :href="src" :download="downloadname" @click="downloadHandle">
                <el-tag type="">导出成功，点击下载</el-tag>
              </a>
            </el-form-item>
            <el-form-item label-width="0">
              <el-button 
                size="medium"
                icon="el-icon-search"
                type="primary"
                @click="searchHandle"
                style="width:100%"
              >查询</el-button>
            </el-form-item>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      :data="tableData"
      v-loading="isloading"
      style="width: 100%;margin-top:10px;"
      :border='true'
      :fit='true'
      size="medium"
      stripe
      :cell-style='{textAlign:"center"}'
      :header-cell-style='{textAlign:"center"}'
      highlight-current-row
      :default-sort = "{prop: 'createDate', order: 'descending'}"
    >
      <el-table-column
        prop="createDate"
        label="处理时间"
        width="">
      </el-table-column>
      <el-table-column
        prop="orderNumber"
        label="订单编号" 
        width="">
      </el-table-column>
      <el-table-column
        prop="account"
        label="会员账号"
        width="">
      </el-table-column>
      <el-table-column
        :prop="state==='deposit'?'receiptsType':'drawType'"
        :label="state==='deposit'?'存款类型':'提款类型'"
        width="">
        <template slot-scope="scope">
          <span v-if="scope.row.receiptsType == 1">人工存款</span>
          <span v-if="scope.row.receiptsType == 2">优惠活动(彩金)</span>
          <span v-if="scope.row.receiptsType == 3">官方充值</span>
          <span v-if="scope.row.receiptsType == 4">第三方入款</span>
          <span v-if="scope.row.receiptsType == 5">其他入款</span>

          <span v-if="scope.row.drawType == 1">第三方银行出款</span>
          <span v-if="scope.row.drawType == 2">支付宝出款</span>
          <span v-if="scope.row.drawType == 3">人工提款</span>
          <span v-if="scope.row.drawType == 4">误存提款</span>
          <span v-if="scope.row.drawType == 5">行政提款</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="amount"
        :label="state==='deposit'?'存款金额':'提款金额'"
        width="">
        <template slot-scope="{row}">
          <template
            v-if="state === 'deposit'"
          >
            <span v-if='row.amount >0'>充值：{{row.amount}}</span>
            <br v-if='row.amount >0'>
            <span v-if='row.firstMoney >0'>首充送：{{row.firstMoney}}</span>
            <br v-if='row.firstMoney >0'>
            <span v-if='row.freeMoney >0'>优惠送：{{row.freeMoney}}</span>
            <br v-if='row.freeMoney >0'>
            <span v-if='row.activityMoney >0'>活动送：{{row.activityMoney}}</span>
          </template>
          <template
            v-else
          >
            {{row.amount}}
          </template>
        </template>
      </el-table-column>
      <el-table-column
        prop="levelName"
        label="会员等级"
      >
        <template slot-scope="scope">
          {{scope.row.levelName?scope.row.levelName:'-'}}
        </template>
      </el-table-column>
      <el-table-column label="操作人"
        prop="createBy"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
      >
        <template slot-scope="scope">
          {{scope.row.remark?scope.row.remark:'-'}}
        </template>  
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="space-around" align="middle">
      <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle" 
        :current-page="pageNum"
        :page-sizes="[10,20,50,100,200]"
        :page-size.sync="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      <el-col :span="6">
        <el-row type="flex" justify="space-between">
          <span v-if="state == 'withdrawal'">总提款金额:<el-tag type="primary" size="small">{{totalPayCount}}元</el-tag></span>
          <span v-if="state == 'deposit'">总存款金额:<el-tag type="primary" size="small">{{totalPayCount}}元</el-tag></span>
          <span v-if="state == 'deposit'">总赠送金额:<el-tag type="primary" size="small">{{totalFreeCount}}元</el-tag></span>
        </el-row>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import tableHeight from '@/tool/tableHeight'
import financeRequest from '@/request/finance'
import time from '@/tool/times'

export default {
  name:'ManualList',
  data () {
    return {
      state:'',//deposit 存款 withdrawal 提款
      account:'',
      startAmount:null,
      endAmount:null,
      daterange:[ time.DateToYMD(new Date()),time.DateToYMD(new Date())],//DateToYMD
      drawType:null, //提款类型 3.人工提款4.误存提款5.行政提款
      createBy:'', //操作人
      src:'', //导出表格src

      totalFreeCount:0, //总赠送金额
      totalPayCount:0, //总存款金额/总提款金额

      isloading:false,

      pageSize:10,
      total:0,
      pageNum:1,
      tableData:[],
    }
  },
  computed:{
    downloadname:{
      get(){
        // 获取当前日期
        let date = new Date();
        // 获取当前月份
        let nowMonth = date.getMonth() + 1;
        // 获取当前是几号
        let strDate = date.getDate();
        // 添加分隔符“-”
        let seperator = "-";
        // 对月份进行处理，1-9月在前面添加一个“0”
        if (nowMonth >= 1 && nowMonth <= 9) {
          nowMonth = "0" + nowMonth;
        }
        // 对月份进行处理，1-9号在前面添加一个“0”
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        // 最后拼接字符串，得到一个格式为(yyyy-MM-dd)的日期
        let nowDate = date.getFullYear() + seperator + nowMonth + seperator + strDate;
        if(this.state == 'deposit'){
          return '人工存款记录'+nowDate+'.xls'
        }else{
          return '人工提款记录'+nowDate+'.xls'
        }
      },
      set(){
      }
    }
  },
  methods:{
    searchHandle(){
      this.pageNum = 1;
      this.queryHandle();
    },
    queryHandle(){
      this.isloading = true;
      let data = {
        conditionsMap:{
          account:this.account.trim(),
          startAmount:this.startAmount || null,
          endAmount:this.endAmount || null,
          createBy:this.createBy.trim(),
          startTime:this.daterange?this.daterange[0]:'',
          endTime:this.daterange?this.daterange[1]:'',
        },
        limit:this.pageSize,
        offset:(this.pageNum -1)*this.pageSize,
        sort:'createDate',
        sortOrder:'desc'
      }
      if(this.state == 'deposit'){
        financeRequest.payRecoderList(data).then(res => {
          if(res.code == 200){
            let data = res.data;
            this.tableData = data.rows;
            this.totalFreeCount = data.totalFreeCount;
            this.totalPayCount = data.totalPayCount;
            
            this.pageSize = data.limit;
            this.total = data.total;
            this.pageNum = data.offset/data.limit +1;
          }else{
            this.$notify({
              type:'warning',
              title:res.msg
            })
          }
          this.isloading = false;
        }).catch(err => {
          console.log(err);
          this.isloading = false;
        })
      }else if(this.state == 'withdrawal'){
        data.conditionsMap.drawType = this.drawType || null;
        financeRequest.drawRecoderList(data).then(res => {
          if(res.code == 200){
            let data = res.data;
            this.tableData = data.rows;
            this.totalPayCount = data.totalRealDrawCount;

            this.pageSize = data.limit;
            this.total = data.total;
            this.pageNum = data.offset/data.limit +1;
          }else{
            this.$notify({
              type:'warning',
              title:res.msg
            })
          }
          this.isloading = false;
        }).catch(err => {
          console.log(err)
          this.isloading = false;
        })
      }
    },
    exportHandle(){
      let data = {
        account:this.account,   //会员账号
        playId:this.playId,     //会员id
        startAmount:this.startAmount, //金额下限
        endAmount:this.endAmount,     //金额上限
        createStartTime:'', //申请开始时间
        createEndTime:'',     //申请结束时间
        drawRecordStatus:'',  //出款订单状态 1申请中,2已出款,3已退回,4出款失败,5处理中,6已拒绝
        // drawType:this.drawType, //提款类型 1.第三方银行出款,3.人工提款,2,支付宝出款,4.误存提款,5.行政提款
        levelId:'',  //会员等级id
        merchantName:'',  //商户名称
        officePayType:'', //官方充值汇款类型1.ATM柜员机；2.ATM现金；3.银行柜台；4.手机银行转账；5.网银转账;6.其他；7支付宝收款码；8微信收款码；9QQ收款码 10云闪付收款码
        parentAccount:'', //上级推广账号
        payRecordStatus:'', //入款订单状态 1未支付,2已支付,3已确认,4未确认,5已取消
        // recordType:this.recordType,  //记录类型 1：人工存款 2：人工提款 3：官方充值 4：线上支付 5：支付宝出款 6：银行卡出款 7：自动出款
        updateBy:this.createBy,   //操作人
        updateStartTime:this.daterange?this.daterange[0]:'', //处理开始日期
        updateEndTime:this.daterange?this.daterange[1]:'',  //处理结束日期
      }
      if(this.state == 'deposit'){
        data.recordType = 1;
      }else{
        data.recordType = 2;
        data.drawType =  this.drawType;
      }
      financeRequest.financeExport(data).then(res => {
        if(res.code != 300 && res.code != 520){
          let type = 'application/msexcel,charset=uft-8';
          let blob = new Blob([res], {type: type});
          let URL = window.URL || window.webkitURL;
          let objectUrl = URL.createObjectURL(blob);
          this.src = objectUrl;
        }else{
          this.$notify.warning({title:res.msg})
        }
      }).catch(e=> {
        console.log(e);
      })
    },
    downloadHandle(){  //点击下载 删除src
      this.src = '';
    },
    sizeChangeHandle (size) {
      this.pageSize = size;
      this.queryHandle();
    },
    currentChangeHandle(crtpage){
      this.pageNum = crtpage;
      this.queryHandle();
    },
  },
  created () {
    this.state = this.$route.name === '人工存款记录'?'deposit':'withdrawal'
    this.queryHandle();
  },
  activated(){
        this.$nextTick(() => {
            this.daterange = [];
            this.daterange.push(time.DateToYMD(new Date()));
            this.daterange.push(time.DateToYMD(new Date()));
            this.queryHandle();
        })
    }
}
</script>
