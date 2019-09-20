<template>
  <el-card>
    <el-form label-width="80px">
      <el-row type="flex" justify="space-between">
        <el-col :span="5">
          <el-form-item label="订单号">
            <el-input v-model="orderNumber" placeholder="订单号" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="会员账号">
            <el-input v-model="account" placeholder="会员账号" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="订单状态">
            <el-select v-model.number="state" clearable style="width:100%">
              <template v-for="item in stateOptions">
                <el-option :key="item.value" :label="item.name" :value="item.value"></el-option>
              </template>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="商户">
            <el-input v-model="merchantName" placeholder="商户名" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="space-between">
        <el-col :span="5">
          <el-form-item label="会员ID">
            <el-input type="number" v-model.number="playId" placeholder="会员id"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="操作人">
            <el-input v-model="updateBy" placeholder="操作人"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="金额" label-width="40px">
            <el-row type="flex" justify="space-between">
              <el-col :span="11">
                <el-input type="number" v-model.number="startAmount" placeholder="最小金额"></el-input>
              </el-col>
              <el-col :span="1" style="text-align:center;color:#000">~</el-col>
              <el-col :span="11">
                <el-input type="number" v-model.number="endAmount" placeholder="最大金额"></el-input>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-row type="flex" justify="end">
            <el-button
              type
              size="medium"
              :icon="moreConditions?'el-icon-arrow-down':'el-icon-arrow-up'"
              @click="moreConditions = !moreConditions"
            >更多条件</el-button>
            <el-button size="medium" type="primary" icon="el-icon-search" @click="searchHandle">查询</el-button>
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
        <el-form-item label="上级推广账号" label-width="150px">
          <el-input v-model="superior" placeholder="上级推广账号"></el-input>
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
    <!-- 表格 -->
    <el-table
      stripe
      border
      fit
      highlight-current-row
      :data="tableData"
      :cell-style="{textAlign:'center'}"
      :header-cell-style="{textAlign:'center'}"
      :default-sort="{prop:'ordernumber',order:'descending'}"
      style="margin-top:20px"
      v-loading="isloading"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="online-pay-table-expand">
            <el-form-item label="订单号">
              <span>{{ props.row.orderNumber }}</span>
            </el-form-item>
            <el-form-item label="会员等级">
              <span>{{ props.row.levelName }}</span>
            </el-form-item>
            <el-form-item label="备注">
              <span>{{ props.row.remark }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="会员账号" prop="account"></el-table-column>
      <el-table-column label="上级推广账号" prop="superior"></el-table-column>
      <el-table-column label="会员ID" prop="playId"></el-table-column>
      <el-table-column label="订单号" prop="orderNumber"></el-table-column>
      <!-- <el-table-column
              label="会员等级"
              prop="levelName"
      ></el-table-column>-->
      <el-table-column
        prop="amount"
        label="金额"
      >
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
      <el-table-column label="申请时间" prop="createDate" width="100"></el-table-column>
      <el-table-column label="处理时间" prop="updateDate" width="100"></el-table-column>
      <el-table-column label="状态" prop="state">
        <template slot-scope="scope">
          <el-tag size="medium" color="#ddd" type="danger" v-if="scope.row.state == 1">未支付</el-tag>
          <el-tag size="medium" color="#fff" type="success" v-if="scope.row.state == 2">已支付</el-tag>
          <el-tag size="medium" color="#fff" type="success" v-if="scope.row.state == 3">通过</el-tag>
          <el-tag size="medium" color="#fff" type="warning" v-if="scope.row.state == 4">待处理</el-tag>
          <el-tag size="medium" color="#fff" type="danger" v-if="scope.row.state == 5">拒绝</el-tag>
        </template>
      </el-table-column>
      <!--<el-table-column label="商户" prop="merchantName" width="180"></el-table-column>-->
      <el-table-column label="入款名称" prop="merchantName" width="180">
            <template slot-scope="scope">
                <!-- <template v-if="scope.row.alias == null">
                   {{scope.row.merchantName}}
                 </template>-->
                {{scope.row.alias}}
            </template>
      </el-table-column>
      <el-table-column label="操作人" prop="updateBy">
        <template slot-scope="scope">
          <span v-if="scope.row.updateBy">{{scope.row.updateBy}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
              label="备注"
              prop="remark"
      ></el-table-column>-->
      <el-table-column label="操作" prop="memberaccount" width="120">
        <template slot-scope="scope">
          <template v-if="scope.row.state == 1 ||scope.row.state == 4">
            <!--<el-button  style=" padding: 6px 6px; color: #fff;" size="mini" color="green" type="success" @click="operating(scope.row,3)" >通过</el-button>-->
            <!-- <el-button
              style="padding: 6px 6px; color: #fff;"
              type="danger"
              size="mini"
              @click="rejectedOrder(scope.row)"
            >拒绝</el-button> -->
            <el-button
              style="padding: 6px 6px; color: #fff;"
              type="warning"
              size="mini"
              @click="supplementOrderTab(scope.row)"
            >补单</el-button>
          </template>
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
    <!--补单弹窗-->
    <el-dialog title="入款订单审核" :visible.sync="dialogFormVisibleFrom" width="40%" @close="close">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        :inline="true"
        label-width="130px"
        class="demo-ruleForm"
      >
        <el-row
          type="flex"
          justify="center"
          align="middle"
          style="height: 36px; border-bottom: 1px solid #ddd; "
        >
          <el-col :span="12" style=" border-right: 1px solid #ddd">
            <el-form-item label="申请日期：" prop="createDate">
              <span>{{ruleForm.createDate}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="订单号：" prop="orderNumber">
              <span>{{ruleForm.orderNumber}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center" style="height: 40px; border-bottom: 1px solid #ddd;">
          <el-col :span="12" style=" border-right: 1px solid #ddd">
            <el-form-item label="会员账号：" prop="account">
              <span>{{ruleForm.account}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="会员等级：" prop="levelName">
              <span>{{ruleForm.levelName}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row
          type="flex"
          justify="center"
          align="middle"
          style=" height: 80px; border-bottom: 1px solid #ddd;"
        >
          <el-col
            :span="12"
            style=" height: 80px;   padding-top: 20px; border-right: 1px solid #ddd"
          >
            <el-form-item label="商户名称：" prop="merchantName">
              <span>{{ruleForm.merchantName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12" style=" height: 80px;   padding-top: 10px;">
            <!-- <el-form-item label="补单金额：" prop="realAmount"> -->
            <el-form-item label="补单金额：">
              <!--<span v-model="ruleForm.actualAmount">{{ruleForm.actualAmount}}</span>-->
              <el-input v-model="ruleForm.realAmount" size="small" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row
          type="flex"
          justify="center"
          align="middle"
          style=" height: 80px; border-bottom: 1px solid #ddd;"
        >
          <el-col :span="12" style=" height: 80px; padding-top: 20px; border-right: 1px solid #ddd">
            <el-form-item label="订单状态：">
              <span>{{ruleForm.state}}</span>
              <template slot-scope="scope">
                <el-tag
                  size="medium"
                  color="#ddd"
                  type="danger"
                  v-model="ruleForm.state"
                  v-if="ruleForm.state == 1"
                >申请中</el-tag>
                <el-tag
                  size="medium"
                  color="#fff"
                  type="success"
                  v-model="ruleForm.state"
                  v-if="ruleForm.state == 2"
                >已出款</el-tag>
                <el-tag
                  size="medium"
                  color="#fff"
                  type="success"
                  v-model="ruleForm.state"
                  v-if="ruleForm.state == 3"
                >已拒绝</el-tag>
                <el-tag
                  size="medium"
                  color="#fff"
                  type="success"
                  v-model="ruleForm.state"
                  v-if="ruleForm.state == 4"
                >出款失败</el-tag>
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="12" style=" height: 80px ; padding-top: 15px;" class="elRemarks">
            <el-form-item label="备注：" prop="remarks" style="width: 100%;">
              <el-input
                style=" width: 100%"
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="ruleForm.remarks"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center" align="middle" style=" padding-top: 20px;">
          <el-col :span="24" style="height: 45px;  text-align: center;">
            <el-form-item>
              <el-button
                type="primary"
                @click="supplementOrders('ruleForm')"
                :loading="supplementOrdersLoading"
              >提交</el-button>
              <el-button @click="dialogFormVisibleFrom = false">取消</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </el-card>
</template>

<style>
.online-pay-table-expand {
  font-size: 0;
  border: 1px solid #ddd;
  padding: 0 10px;
}

.online-pay-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.online-pay-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>

<script>
import validator from "@/tool/validate";
import financeOrder from "@/request/finance";
import time from '@/tool/times'

export default {
  name: "OnlinePay",
  data() {
    return {
      orderNumber: "", //订单号
      account: "", //会员账号
      playId: null, //会员账号
      superior: "", //上级推广账号
      levelName: "", //会员等级
      startAmount: null, //最小金额
      endAmount: null, //最大金额
      createDate: [time.DateToYMD(new Date()),time.DateToYMD(new Date())], //时间
      merchantName: "", //商户名称
      state: null, //订单状态
      updateBy: "", //操作人
      stateOptions: [
        {
          value: 1,
          name: "未支付"
        },
        {
          value: 2,
          name: "已支付"
        }
      ],
      moreConditions: false, //更多条件
      src:'', //导出表格src

      totalFreeCount:0, //总赠送金额
      totalPayCount:0, //总充值金额

      tableData: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      isloading: false,
      isActivated:false,
      //表单
      ruleForm: {
        amount: "", //充值金额
        account: "", //会员账号
        orderNumber: "", //订单号
        createDate: null, //申请日期
        remarks: "", //备注
        realAmount: "", //补单金额
        id: "", //出款订单id
        reviewStatus: "", //审核结果
        levelName: "", //会员等级
        merchantName: "", //商户名称
        state: "" //订单状态
      },
      //表单验证
      rules: {
        // realAmount: [
        //     {required: true, message: '请输入补单金额', trigger: 'blur' }
        // ],
        realAmount: [{ validator: validator.amount, trigger: "blur" }],
        remarks: [{ validator: validator.remarks, trigger: "blur" }]
      },
      dialogFormVisibleFrom: false, //点击补单弹出弹窗bol

      supplementOrdersLoading: false //点击补单提交按钮状态
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
        return '线上支付'+nowDate+'.xls'
      },
      set(){
      }
    }
  },
  created() {
    this.queryHandle();
  },
  methods: {
    searchHandle() {
      this.pageNum = 1;
      this.queryHandle();
    },
    queryHandle() {
      this.isloading = true;
      let data = {
        limit: this.pageSize,
        offset: (this.pageNum - 1) * this.pageSize,
        sort: "createDate",
        sortOrder: "desc",
        conditionsMap: {
          account: this.account.trim(),
          playId: this.playId || null,
          superior: this.superior.trim(),
          orderNumber: this.orderNumber,
          startAmount: this.startAmount || null,
          endAmount: this.endAmount || null,
          startTime: this.createDate ? this.createDate[0] : "",
          endTime: this.createDate ? this.createDate[1] : "",
          merchantName: this.merchantName,
          updateBy: this.updateBy,
          state: this.state || null,
        }
      };
      financeOrder
        .PayRecordList(data) //获取列表
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
        merchantName:this.merchantName,  //商户名称
        officePayType:'', //官方充值汇款类型1.ATM柜员机；2.ATM现金；3.银行柜台；4.手机银行转账；5.网银转账;6.其他；7支付宝收款码；8微信收款码；9QQ收款码 10云闪付收款码
        parentAccount:this.superior, //上级推广账号
        payRecordStatus:this.state, //入款订单状态 1未支付,2已支付,3已确认,4未确认,5已取消
        // recordType:this.recordType,  //记录类型 1：人工存款 2：人工提款 3：官方充值 4：线上支付 5：支付宝出款 6：银行卡出款 7：自动出款
        updateBy:this.updateBy,   //操作人
        updateStartTime:'', //处理开始日期
        updateEndTime:'',  //处理结束日期
      }
      data.recordType = 4;
      financeOrder.financeExport(data).then(res => {
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

    supplementOrderTab(row) {
      //补单
      // console.log(row);
      this.dialogFormVisibleFrom = true;

      this.ruleForm.orderNumber = row.orderNumber;
      this.ruleForm.account = row.account;
      this.ruleForm.createDate = row.createDate;
      this.ruleForm.updateDate = row.updateDate;
      this.ruleForm.levelName = row.levelName;
      this.ruleForm.merchantName = row.merchantName;
      this.ruleForm.state = row.state;
      this.ruleForm.realAmount = row.amount;
      this.ruleForm.remarks = ""; //初始化备注
    },
    rejectedOrder(row) {
      //拒绝补单
      this.$confirm("确定拒绝该笔支付吗？拒绝之后将不能再次补单", "提示", {
        confirmButtonText: "确定",
        cancleButtontext: "取消",
        type: "warning"
      })
        .then(() => {
          let data = "?orderNumber=" + row.orderNumber;
          financeOrder
            .rejectedOrder(data)
            .then(res => {
              if (res.code == 200) {
                this.$notify({
                  type: "success",
                  title: res.msg
                });
                this.queryHandle(); //操作成功重新查询
              } else {
                this.$notify({
                  type: "warning",
                  title: res.msg
                });
              }
            })
            .catch(e => {
              console.log(e);
            });
        })
        .catch(e => {});
    },
    supplementOrders(formName) {
      //处理出款补单
      this.supplementOrdersLoading = true;
      this.$refs[formName].validate(valid => {
        if (valid) {
          let orderNumber = this.ruleForm.orderNumber;
          let account = this.ruleForm.account;
          let realAmount = this.ruleForm.realAmount;
          let remark = this.ruleForm.remarks;
          let data =
            "?orderNumber=" +
            orderNumber +
            "&account=" +
            account +
            "&realAmount=" +
            realAmount +
            "&remark=" +
              window.encodeURIComponent(remark);
          financeOrder
            .supplementOrder(data)
            .then(res => {
              if ((res.code = "200")) {
                this.$notify({
                  type: "warning",
                  title: res.msg
                });
                this.dialogFormVisibleFrom = false;
                this.queryHandle(); //补单成功重新查询
              } else {
                this.$notify({
                  type: "warning",
                  title: res.msg
                });
              }
              this.supplementOrdersLoading = false;
            })
            .catch(err => {
              console.log(err);
              this.supplementOrdersLoading = false;
            });
        } else {
          this.$notify({
            type: "warning",
            title: "验证不通过，请检查错误提示"
          });
          this.supplementOrdersLoading = false;
          return false;
        }
      });
    },
    close() {
      //表单弹窗点击关闭解除验证
      this.$refs.ruleForm.clearValidate();
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
 /* beforeRouteLeave (to, from, next) {
        // 导航离开该组件的对应路由时调用
        // 可以访问组件实例 `this`
        this.createDate = [];
        this.createDate.push(time.DateToYMD(new Date()));
        this.createDate.push(time.DateToYMD(new Date()));
        next();
    }*/
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


