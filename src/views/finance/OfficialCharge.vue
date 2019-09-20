<template>
  <el-card>
    <el-form label-width="80px">
      <el-row type="flex" justify="space-between">
        <el-col :span="5">
          <el-form-item label="订单号">
            <el-input placeholder="订单号码" v-model="orderNumber" clearable ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="会员账号">
            <el-input placeholder="会员账号" v-model="account" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="开始金额">
            <el-input placeholder="开始金额" type="number" v-model.number="startAmount" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="结束金额">
            <el-input placeholder="结束金额" type="number" v-model.number="endAmount" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="space-between">
        <el-col :span="5">
          <el-form-item label="会员ID">
            <el-input type="number" v-model.number="playId" placeholder="会员id" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="操作人">
            <el-input placeholder="操作人" v-model="updateBy" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="订单状态">
            <el-select v-model.number="state" clearable placeholder="订单状态" style="width:100%">
              <el-option
                v-for="item in stateoptions"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-row type="flex" justify="end">
            <el-button
              type=""
              size="medium"
              :icon="moreConditions?'el-icon-arrow-down':'el-icon-arrow-up'"
              @click="moreConditions = !moreConditions"
            >更多条件</el-button>
            <el-button size="medium" icon="el-icon-search" type="primary" @click="searchHandle">查询</el-button>
          </el-row>
        </el-col>
      </el-row>
      <el-row type="flex" justify="space-between" v-if="moreConditions">
        <el-form-item label="申请日期">
          <el-row type="flex" justify="space-between">
            <el-date-picker
              v-model="createDate"
              type="daterange"
              range-separator="~"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
            <short-cuts
              :_value="{_date:'jint'}"
              :currentContext='this'
              currentModelName='createDate'
              currentQueryHandle='searchHandle'
            ></short-cuts>
          </el-row>
        </el-form-item>
        <el-form-item label="入款类型" label-width="100px">
          <el-select v-model="rechargeType" placeholder="全部" clearable >
            <el-option label="ATM柜员机" :value="1"></el-option>
            <el-option label="ATM现金" :value="2"></el-option>
            <el-option label="银行柜台" :value="3"></el-option>
            <el-option label="手机银行转账" :value="4"></el-option>
            <el-option label="网银转账" :value="5"></el-option>
            <el-option label="其他" :value="6"></el-option>
            <el-option label="支付宝收款码" :value="7"></el-option>
            <el-option label="微信收款码" :value="8"></el-option>
            <el-option label="QQ收款码" :value="9"></el-option>
            <el-option label="云闪付收款码" :value="10"></el-option>
          </el-select>
        </el-form-item>
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
      </el-row>
    </el-form>
    <el-table
      :data="tableData"
      v-loading="isloading"
      style="width: 100%;"
      :border="true"
      :fit="true"
      size="medium"
      stripe
      :cell-style="{textAlign:'center'}"
      :header-cell-style="{textAlign:'center'}"
      highlight-current-row
      :default-sort="{prop: 'orderTime', order: 'descending'}"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="official-charge-table-expand">
            <el-form-item label="会员等级">
              <span>{{ props.row.levelName }}</span>
            </el-form-item>
            <el-form-item label="公司账号">
              <span>{{ props.row.companyAccount }}</span>
            </el-form-item>
            <!-- <el-form-item label="操作人">
              <span>{{ props.row.updateBy }}</span>
            </el-form-item>-->
            <el-form-item label="订单时间">
              <span>{{ props.row.orderTime }}</span>
            </el-form-item>
            <el-form-item label="操作时间">
              <span>{{ props.row.updateDate }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="orderNumber" label="订单编号" width="200"></el-table-column>
      <el-table-column prop="account" label="会员账号"></el-table-column>
      <el-table-column prop="playId" label="会员ID"></el-table-column>
      <el-table-column prop="depositorName" label="存款人姓名"></el-table-column>
      <el-table-column prop="depositorBank" label="存款账户银行名" width="120">
        <template slot-scope="scope">
          <template v-if="scope.row.depositorBank == null">
            <template v-if="scope.row.rechargeType == 1">ATM柜员机</template>
            <template v-if="scope.row.rechargeType == 2">ATM现金</template>
            <template v-if="scope.row.rechargeType == 3">银行柜台</template>
            <template v-if="scope.row.rechargeType == 4">手机银行转账</template>
            <template v-if="scope.row.rechargeType == 5">网银转账</template>
            <template v-if="scope.row.rechargeType == 6">其他</template>
            <template v-if="scope.row.rechargeType == 7">支付宝收款码</template>
            <template v-if="scope.row.rechargeType == 8">微信收款码</template>
            <template v-if="scope.row.rechargeType == 9">QQ收款码</template>
            <template v-if="scope.row.rechargeType == 10">云闪付收款码</template>
          </template>
          <template v-else>{{scope.row.depositorBank}}</template>
        </template>
      </el-table-column>
      <el-table-column prop="rechargeType" label="入款类型" width="120">
        <template slot-scope="scope">
          <el-tag size="medium" type="success" v-if="scope.row.rechargeType == 1">ATM柜员机</el-tag>
          <el-tag size="medium" type="success" v-if="scope.row.rechargeType == 2">ATM现金</el-tag>
          <el-tag size="medium" type="success" v-if="scope.row.rechargeType == 3">银行柜台</el-tag>
          <el-tag size="medium" type="success" v-if="scope.row.rechargeType == 4">手机银行转账</el-tag>
          <el-tag size="medium" type="success" v-if="scope.row.rechargeType == 5">网银转账</el-tag>
          <el-tag size="medium" type="success" v-if="scope.row.rechargeType == 6">其他</el-tag>
          <el-tag size="medium" type="success" v-if="scope.row.rechargeType == 7">支付宝收款码</el-tag>
          <el-tag size="medium" type="success" v-if="scope.row.rechargeType == 8">微信收款码</el-tag>
          <el-tag size="medium" type="success" v-if="scope.row.rechargeType == 9">QQ收款码</el-tag>
          <el-tag size="medium" type="success" v-if="scope.row.rechargeType == 10">云闪付收款码</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="alias" label="入款名称" width="120">
            <template slot-scope="scope">
                <!--<template v-if="scope.row.alias == null">
                  {{scope.row.merchantName}}
                </template>-->
                {{scope.row.alias}}
            </template>
      </el-table-column>
      <el-table-column prop="amount" label="充值金额" sortable>
        <template slot-scope="{row}">
          <span>充值：{{row.amount}}</span> 
          <br v-if='row.firstMoney >0'>
          <span v-if='row.firstMoney >0'>首充送：{{row.firstMoney}}</span>
          <br v-if='row.freeMoney >0'>
          <span v-if='row.freeMoney >0'>优惠送：{{row.freeMoney}}</span>
          <br v-if='row.activityMoney >0'>
          <span v-if='row.activityMoney >0'>活动送：{{row.activityMoney}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createDate" label="申请时间" sortable></el-table-column>
      <el-table-column prop="updateBy" label="操作人" sortable></el-table-column>
      <el-table-column prop="state" label="订单状态" width="120">
        <template slot-scope="scope">
          <el-tag size="medium" color="#ddd" type="danger" v-if="scope.row.state == 1">未支付</el-tag>
          <el-tag size="medium" color="#fff" type="success" v-if="scope.row.state == 2">已支付</el-tag>
          <el-tag size="medium" color="#fff" type="success" v-if="scope.row.state == 3">通过</el-tag>
          <template v-if="scope.row.state == 4">
            <!--<el-tag size="medium" type="info">待处理</el-tag>-->
            <el-button
              style=" padding: 6px 8px; color: #fff;"
              size="mini"
              color="green"
              type="success"
              @click="operating(scope.row,3)"
            >通过</el-button>
            <el-button
              style="padding: 6px 7px; color: #fff;"
              type="danger"
              color="#f60"
              size="mini"
              @click="operating(scope.row,5)"
            >拒绝</el-button>
          </template>
          <el-tag size="medium" color="#fff" type="danger" v-if="scope.row.state == 5">拒绝</el-tag>
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
        :total="total"
      ></el-pagination>
      <el-col :span="6">
        <el-row type="flex" justify="space-between">
          <span>总充值金额:<el-tag type="primary" size="small">{{totalPayCount}}元</el-tag></span>
          <span>总赠送金额:<el-tag type="primary" size="small">{{totalFreeCount}}元</el-tag></span>
        </el-row>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import tableHeight from "@/tool/tableHeight";
import financeRequest from "@/request/finance";
import time from '@/tool/times'
export default {
  name: "ManualList",
  data() {
    return {
      //  搜索条件
      orderNumber: "", //订单号
      account: "", //会员账号
      startAmount: null, //开始金额
      endAmount: null, //结束金额
      createDate: [time.DateToYMD(new Date()),time.DateToYMD(new Date())], //申请日期
      updateBy: "", //操作人
      state: null, //订单状态
      playId: null, //会员id
      stateoptions: [
        {
          value: 3,
          label: "通过"
        },
        {
          value: 4,
          label: "待处理"
        },
        {
          value: 5,
          label: "拒绝"
        }
      ],
      moreConditions:false, //更多条件
      rechargeType:null, //入款类型
      src:'', //导出表格src

      totalFreeCount:0, //总赠送金额
      totalPayCount:0, //总充值金额

      //  表格分页
      pageSize: 10,
      total: 0,
      pageNum: 1,
      tableData: [],
      isloading: false,
       isActivated :false,
    };
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
        return '官方充值记录'+nowDate+'.xls'
      },
      set(){
      }
    }
  },
  created() {
    this.queryHandle();
  },
  methods: {
    searchHandle(){
      this.pageNum = 1;
      this.queryHandle();
    },
    queryHandle() {
      this.isloading = true;
      let data = {
        //要发送的数据
        conditionsMap: {
          account: this.account.trim(),
          playId: this.playId || null,
          orderNumber: this.orderNumber.trim(),
          startAmount: this.startAmount || null,
          endAmount: this.endAmount || null,
          startTime: this.createDate ? this.createDate[0] : "",
          endTime: this.createDate ? this.createDate[1] : "",
          rechargeType:this.rechargeType || null,
          updateBy: this.updateBy.trim(),
          state: this.state || null,
        },
        limit: this.pageSize,
        offset: (this.pageNum - 1) * this.pageSize,
        sort: "createDate",
        sortOrder: "desc"
      };
      financeRequest
        .listByBank(data)
        .then(res => {
          if (res.data.rows) {
            this.tableData = res.data.rows;
            this.totalFreeCount = res.data.totalFreeCount;
            this.totalPayCount = res.data.totalPayCount;

            this.pageSize = res.data.limit;
            this.total = res.data.total;
            this.pageNum = res.data.offset / res.data.limit + 1;
            this.isActivated = true;
          } else {
            this.$notify({
              type: "warning",
              title: res.msg
            });
          }
          this.isloading = false;
        })
        .catch(err => {
          console.log(err);
          this.isloading = false;
        });
    },
    operating(row, state) {
      //订单操作
      this.$confirm(
        "请确认" + (state == 3 ? "通过" : "拒绝") + "该笔订单",
        "提示",
        {
          confirmButtonText: "确定",
          cancleButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        let orderNumbers = row.orderNumber;
        let accounts = row.account;
        this.isloading = true;
        let data =
          "?orderNumber=" +
          orderNumbers +
          "&account=" +
          accounts +
          "&state=" +
          state;
        financeRequest
          .updateState(data)
          .then(res => {
            this.$notify({
              type: "warning",
              title: res.msg
            });
            this.isloading = false;
            this.queryHandle(); //订单操作成功重新查询
          })
          .catch(err => {
            console.log(err);
            this.isloading = false;
          });
      });
    },
    exportHandle(){
      let data = {
        orderNumber:this.orderNumber, //订单号
        account:this.account,   //会员账号
        playId:this.playId,     //会员id
        startAmount:this.startAmount, //金额下限
        endAmount:this.endAmount,     //金额上限
        createStartTime:this.createDate?this.createDate[0]:'', //申请开始时间
        createEndTime:this.createDate?this.createDate[1]:'',     //申请结束时间
        drawRecordStatus:'',  //出款订单状态 1申请中,2已出款,3已退回,4出款失败,5处理中,6已拒绝
        // drawType:this.drawType, //提款类型 1.第三方银行出款,3.人工提款,2,支付宝出款,4.误存提款,5.行政提款
        levelId:'',  //会员等级id
        merchantName:'',  //商户名称
        officePayType:this.rechargeType, //官方充值汇款类型1.ATM柜员机；2.ATM现金；3.银行柜台；4.手机银行转账；5.网银转账;6.其他；7支付宝收款码；8微信收款码；9QQ收款码 10云闪付收款码
        parentAccount:'', //上级推广账号
        payRecordStatus:this.state, //入款订单状态 1未支付,2已支付,3已确认,4未确认,5已取消
        // recordType:this.recordType,  //记录类型 1：人工存款 2：人工提款 3：官方充值 4：线上支付 5：支付宝出款 6：银行卡出款 7：自动出款
        updateBy:this.updateBy,   //操作人
        updateStartTime:'', //处理开始日期
        updateEndTime:'',  //处理结束日期
      }
      data.recordType = 3;
      
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
    sizeChangeHandle(size) {
      this.pageSize = size;
      this.queryHandle();
    },
    currentChangeHandle(crtpage) {
      this.pageNum = crtpage;
      this.queryHandle();
    }
  },
    /*beforeRouteLeave (to, from, next) {
        // 导航离开该组件的对应路由时调用
        // 可以访问组件实例 `this`
        this.createDate = [];
        this.createDate.push(time.DateToYMD(new Date()));
        this.createDate.push(time.DateToYMD(new Date()));
        console.log("我走了");
        next();
    },*/
    activated(){
        if(this.isActivated) {
            this.createDate = [];
            this.createDate.push(time.DateToYMD(new Date()));
            this.createDate.push(time.DateToYMD(new Date()));
            this.queryHandle();
        }
    }
};
</script>

<style>
.official-charge-table-expand {
  font-size: 0;
  border: 1px solid #ddd;
  padding: 0 10px;
}
.official-charge-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.official-charge-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 33%;
}
</style>
