<template>
  <el-card>
    <el-form label-width="80px">
      <el-row type="flex" justify="space-between">
        <el-col :span="5">
          <el-form-item label="订单号" label-width="60px">
            <el-input v-model="orderNumber" placeholder="订单号" clearable ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="会员账号">
            <el-input v-model="account" placeholder="会员账号" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="会员等级">
            <el-select v-model.number="level" placeholder="请选择" clearable>
              <template v-for="item in levelOptions">
                <el-option :key="item.id" :label="item.levelNames" :value="item.id"></el-option>
              </template>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="状态" label-width="50px">
            <el-select v-model.number="state" placeholder="请选择" clearable>
              <template v-for="item in stateOptions">
                <el-option :key="item.value" :label="item.name" :value="item.value"></el-option>
              </template>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="space-between">
        <el-col :span="5">
          <el-form-item label="会员ID" label-width="60px">
            <el-input type="number" v-model.number="playId" placeholder="会员id" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="操作人" label-width="60px">
            <el-input v-model="updateBy" placeholder="操作人" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="金额" label-width="50px">
            <el-row type="flex" justify="space-between">
              <el-col :span="11">
                <el-input type="number" v-model.number="startAmount" placeholder="最低金额" clearable></el-input>
              </el-col>
              <el-col :span="1" style="text-align:center;color:#000">~</el-col>
              <el-col :span="11">
                <el-input type="number" v-model.number="endAmount" placeholder="最高金额" clearable></el-input>
              </el-col>
            </el-row>
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
            <el-button size="medium" type="primary" icon="el-icon-search" @click="searchHandle">查询</el-button>
          </el-row>
        </el-col>
      </el-row>
      <el-row type="flex" justify="space-between" v-if="moreConditions">
        <el-col :span="11">
        <el-form-item label="申请日期">
          <el-row type="flex" justify="space-between">
            <el-date-picker
              v-model="daterange1"
              type="daterange"
              range-separator="~"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
            <short-cuts
              :_value="{_date:'jint'}"
              :currentContext='this'
              currentModelName='daterange1'
              currentQueryHandle='searchHandle'
            ></short-cuts>
          </el-row>
        </el-form-item>
        </el-col>
        <el-col :span="11">
        <el-form-item label="处理日期">
          <el-row type="flex" justify="space-between">
            <el-date-picker
              v-model="daterange2"
              type="daterange"
              range-separator="~"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
            <short-cuts
              :_value="{_date:''}"
              :currentContext='this'
              currentModelName='daterange2'
              currentQueryHandle='searchHandle'
            ></short-cuts>
          </el-row>
        </el-form-item>
        </el-col>
        <el-col :span="2">
        <el-form-item label-width="10px">
          <el-button 
            size="medium"
            type="primary"
            @click="exportHandle"
          >导出</el-button>
          <a v-if="src" :href="src" :download="downloadname" @click="downloadHandle">
            <el-tag type="">导出成功，点击下载</el-tag>
          </a>
        </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 表格 -->
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
      :default-sort="{prop: 'createDate', order: 'descending'}"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="draw-record-table-expand">
            <el-form-item label="订单号">
              <span>{{ props.row.orderNumber }}</span>
            </el-form-item>
            <el-form-item label="会员等级">
              <span>{{ props.row.levelName }}</span>
            </el-form-item>
            <!-- <el-form-item label="操作人">
                    <span>{{ props.row.updateBy }}</span>
            </el-form-item>-->
            <el-form-item label="处理时间">
              <span>{{ props.row.updateDate }}</span>
            </el-form-item>
            <el-form-item label="备注">
              <span>{{ props.row.remark }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="会员账号" prop="account"></el-table-column>
      <el-table-column label="会员ID" prop="playId"></el-table-column>
      <el-table-column label="订单号" prop="orderNumber"></el-table-column>
      <!-- <el-table-column
        label="会员等级"
        prop="levelName"
      ></el-table-column>-->
      <el-table-column label="出款金额" prop="amount"></el-table-column>
      <el-table-column label="实际出款金额" prop="actualAmount"></el-table-column>
      <el-table-column label="费用扣除" prop="amountFee"></el-table-column>
      <el-table-column label="申请日期" prop="createDate" width="110"></el-table-column>
      <el-table-column label="订单状态" prop="state" width="150">
        <template slot-scope="scope">
          <el-tag size="medium" color="#ddd" type="success" v-if="scope.row.state == 1">申请中</el-tag>
          <el-tag size="medium" color="#fff" type="success" v-if="scope.row.state == 2">已出款</el-tag>
          <el-tag size="medium" color="#fff" type="danger" v-if="scope.row.state == 3">已拒绝</el-tag>
          <el-tag size="medium" color="#fff" type="danger" v-if="scope.row.state == 4">出款失败</el-tag>
          <el-tag size="medium" color="#fff" type="warning" v-if="scope.row.state == 5">处理中</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作人" prop="updateBy">
        <template slot-scope="scope">
          <span v-if="scope.row.updateBy">{{scope.row.updateBy}}</span>
          <span v-if="!scope.row.updateBy&&scope.row.state == 2">系统</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.state == 1 || scope.row.state == 5"
            style=" padding: 6px 8px; color: #fff;"
            size="mini"
            type="success"
            @click="supplementOrders(scope.row)"
            :loading="supplementOrderLoading"
          >补单</el-button>
          <el-button
            v-if="scope.row.state != 1 && scope.row.state != 5"
            style=" padding: 6px 8px; color: #fff;"
            size="mini"
            type="info"
            @click="queryByRecords(scope.row)"
          >查看</el-button>
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="处理时间"
        prop="updateDate"
      ></el-table-column>-->
      <!-- <el-table-column
        label="备注"
        prop="remark"
      ></el-table-column>-->
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
    </el-row>
    <el-row type="flex" justify="center" align="middle">
      <el-col :span="24">
        <el-row type="flex" justify="space-around">
          <span>总出款金额:<el-tag type="primary" size="small">{{totalDrawCount}}元</el-tag></span>
          <span>总实际出款:<el-tag type="primary" size="small">{{totalRealDrawCount}}元</el-tag></span>
          <span>总费用扣除:<el-tag type="primary" size="small">{{totalDrawFreeCount}}元</el-tag></span>
        </el-row>
      </el-col>
    </el-row>

    <el-dialog title="自动出款补单" :visible.sync="dialogFormVisibleFrom" width="30%" @close="close">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="是否补单" prop="reviewStatus">
          <el-radio-group v-model="ruleForm.reviewStatus">
            <el-radio label="1">是</el-radio>
            <el-radio label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="出款方式" prop="drawType" v-if="ruleForm.reviewStatus == 1">
          <el-radio-group v-model="ruleForm.drawType">
            <!-- <el-radio label="1">第三方出款</el-radio> -->
            <el-radio label="2">手动出款</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="支付渠道"
          prop="merchantIds"
          v-if="ruleForm.drawType == 1 && ruleForm.reviewStatus == 1"
        >
          <el-select v-model="ruleForm.merchantIds" clearable placeholder="请选择支付渠道">
            <template v-for="item in BankList">
              <el-option :key="item.id" :label="item.merchantName" :value="item.id"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="ruleForm.remark"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="getDrawConfig('ruleForm')"
            :disabled="isDisabled"
            :loading="getDrawConfigLoading"
          >立即创建</el-button>
          <el-button @click="dialogFormVisibleFrom = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 查看记录弹窗 -->
    <el-dialog
      title="自动出款记录"
      :visible.sync="dialogVisible"
      width="70%"
    >
      <el-form
        :model="dialogData"
        label-width="100px"
        v-loading='dialogLoading'
      >
        <el-row
          type="flex" justify="center"
          style="border:1px solid #ddd;margin-bottom:15px;padding:10px;font-size:18px;"
        >
          <span>存款次数{{dialogData.count}}次，共{{dialogData.money}}元；</span>
          <span>提款次数{{dialogData.drawCount}}次，共{{dialogData.drawMoney}}元</span>
        </el-row>

        <el-row
          type="flex" justify="space-between" style="border-bottom:1px solid #ddd;"
        >
          <el-col :span="6" style="border-right:1px solid #ddd">
            <el-row type="flex" justify="start" align="middle" style="height:60px">
              <span style="width:90px;text-align:right;padding-right:10px;">订单号:</span>
              <span style="margin-right:10px;" >{{dialogData.orderNumber}}</span>
            </el-row>
          </el-col>
          <el-col :span="6" style="border-right:1px solid #ddd">
            <el-row type="flex" justify="start" align="middle" style="height:60px">
              <span style="width:90px;text-align:right;padding-right:10px;">申请人:</span>
              <span style="margin-right:10px;" >{{dialogData.account}}</span>
            </el-row>
          </el-col>
          <el-col :span="6" style="border-right:1px solid #ddd">
            <el-row type="flex" justify="start" align="middle" style="height:60px">
              <span style="width:90px;text-align:right;padding-right:10px;">会员等级:</span>
              <span style="margin-right:10px;" >{{dialogData.levelName}}</span>
            </el-row>
          </el-col>
          <el-col :span="6" style="border-right:1px solid transparent">
            <el-row type="flex" justify="start" align="middle" style="height:60px"
            >
              <span style="width:90px;text-align:right;padding-right:10px;">处理日期:</span>
              <span style="margin-right:10px;" >{{dialogData.updateDate}}</span>
            </el-row>
          </el-col>
        </el-row>
        <el-row
          style="border-bottom:1px solid #ddd;"
        >
          <el-col :span="6" style="border-right:1px solid #ddd;">
            <el-row type="flex" justify="start" align="middle" style="height:60px">
              <span style="width:90px;text-align:right;padding-right:10px;">真实姓名:</span>
              <span style="margin-right:10px;">{{dialogData.realName}}</span>
              <click-to-copy :content='dialogData.realName'></click-to-copy>
            </el-row>
          </el-col>
          <el-col :span="6" style="border-right:1px solid #ddd;">
            <el-row type="flex" justify="start" align="middle" style="height:60px">
              <span style="width:90px;text-align:right;padding-right:10px;">银行卡号:</span>
              <span style="margin-right:10px;" >{{dialogData.bankAccount}}</span>
              <click-to-copy :content='dialogData.bankAccount'></click-to-copy>
            </el-row>
          </el-col>
          <el-col :span="6" style="border-right:1px solid #ddd;">
            <el-row type="flex" justify="start" align="middle" style="height:60px">
              <span style="width:90px;text-align:right;padding-right:10px;">银行名称:</span>
              <span style="margin-right:10px;" >{{dialogData.bankName}}</span>
              <click-to-copy :content='dialogData.bankName'></click-to-copy>
            </el-row>
          </el-col>
          <el-col :span="6" style="border-right:1px solid transparent;">
            <el-row type="flex" justify="start" align="middle" style="height:60px">
              <span style="width:90px;text-align:right;padding-right:10px;">开户行:</span>
              <span style="margin-right:10px;" >{{dialogData.branchAddress || '无'}}</span>
              <click-to-copy :content='dialogData.branchAddress'></click-to-copy>
            </el-row>
          </el-col>
        </el-row>
        <el-row type="flex" justify="space-between" style="border-bottom:1px solid #ddd;">
          <el-col :span="6" style="border-right:1px solid #ddd;">
            <el-row type="flex" justify="start" align="middle" style="height:60px">
              <span style="width:90px;text-align:right;padding-right:10px;">取款金额:</span>
              <span style="margin-right:10px;" >{{dialogData.amount}}</span>
            </el-row>
          </el-col>
          <el-col :span="6" style="border-right:1px solid #ddd;">
            <el-row type="flex" justify="start" align="middle" style="height:60px">
              <span style="width:90px;text-align:right;padding-right:10px;">手续费:</span>
              <span style="margin-right:10px;" >{{dialogData.amountFee}}</span>
            </el-row>
          </el-col>
          <el-col :span="6" style="border-right:1px solid #ddd;">
            <el-row type="flex" justify="start" align="middle" style="height:60px">
              <span style="width:90px;text-align:right;padding-right:10px;">行政费:</span>
              <span style="margin-right:10px;" >{{dialogData.serverAmount}}</span>
            </el-row>
          </el-col>
          <el-col :span="6" style="border-right:1px solid #ddd;">
            <el-row type="flex" justify="start" align="middle" style="height:60px">
              <span style="width:90px;text-align:right;padding-right:10px;">优惠扣除:</span>
              <span style="margin-right:10px;" >{{dialogData.freeAmount}}</span>
            </el-row>
          </el-col>
        </el-row>

        <el-row type="flex" justify="center" align="middle" style="height:80px">
          <el-col :span="18">
            <el-row
              type="flex" justify="start" align="middle"
              style="padding-left:550px;"
            >
              <span>出款金额:</span>
              <span style="margin-right:10px;margin-left:10px;">{{dialogData.actualAmount}}</span>
              <span v-if='dialogData.state == 1'>【申请中】</span>
              <span v-if='dialogData.state == 2'>【已出款】</span>
              <span v-if='dialogData.state == 3'>【已退回】</span>
              <span v-if='dialogData.state == 4'>【出款失败】</span>
              <span v-if='dialogData.state == 6'>【已拒绝】</span>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row
              type="flex" justify="center"
            >
              <el-button type="primary"
                style="width:160px;margin-left:10px;"
                @click='checkAuditDetail'
              >查看会员稽核明细</el-button>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="备注">
            <el-input v-model="dialogData.remark" type="textarea" readonly></el-input>
          </el-form-item>
        </el-row>
      </el-form>
    </el-dialog>
  </el-card>
</template>

<script>
import financeDrawRecord from "@/request/finance";
import validator from "@/tool/validate";
import time from '@/tool/times'
export default {
  name: "DrawRecord",
  data() {
    return {
        isDisabled:false,//默认禁用按钮
      supplementOrderLoading:false,//默认补单为false不能点击
      orderNumber: "", //订单号
      account: "", //会员账号
      level: null, //等级
      state: null, //状态
      daterange1: [time.DateToYMD(new Date()),time.DateToYMD(new Date())], //申请日期
      daterange2: null, //处理日期
      startAmount: null, //开始金额
      endAmount: null, //结束金额
      updateBy: "", //操作人
      playId: null, //会员id
      levelOptions: [
        {
          id: 0,
          levelNames: "全部"
        }
      ],
      stateOptions: [
        {
          value: 1,
          name: "申请中"
        },
        {
          value: 2,
          name: "已出款"
        },
        {
          value: 3,
          name: "已拒绝"
        },
        {
          value: 4,
          name: "出款失败"
        },
        {
          value: 5,
          name: "处理中"
        }
      ],
      moreConditions:false, //更多条件
      src:'', //导出表格src

      totalDrawCount:0, //总出款金额
      totalRealDrawCount:0, //总实际出款
      totalDrawFreeCount:0, //总费用扣除

      pageNum: 1,
      pageSize: 10,
      total: 0,
      isloading: false,
      tableData: [],
      //表单
      BankList: [], //支付渠道下拉
      ruleForm: {
        reviewStatus: "1", //是否补单
        drawType: "", //出款方式
        remark: "", //备注
        merchantIds: "", //支付渠道id
        id: "", //出款订单号
        state: "",
        amountFee: "", //费用扣除
        updateBy: ""
      },
      //表单验证
      rules: {
        reviewStatus: [
          { required: true, message: "请选择是否补单", trigger: "blur" }
        ],
        drawType: [
          { required: true, message: "请选择出款方式", trigger: "blur" }
        ],
        merchantIds: [
          { required: true, message: "请选择支付渠道", trigger: "blur" }
        ],
        remark: [{ validator: validator.remarks, trigger: "blur" }]
      },
      dialogFormVisibleFrom: false, //点击补单弹出弹窗bol
      getDrawConfigLoading: false, //自动出款补单弹窗  立即创建按钮状态

      dialogVisible:false, //查看弹窗可视状态
      dialogLoading:false, //查看弹窗加载状态
      dialogData:{}, //弹窗数据
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
        return '自动出款交易记录'+nowDate+'.xls'
      },
      set(){
      }
    }
  },
  created() {
    this.queryHandle();
    this.getLevelList();
  },
  methods: {
    searchHandle(){
      this.pageNum = 1;
      this.queryHandle();
    },
    queryHandle() {
      this.isloading = true;
      let data = {
        conditionsMap: {
          state: this.state || null,
          account: this.account.trim(),
          playId: this.playId || null,
          levelId: this.level || null,
          orderNumber: this.orderNumber,
          startAmount: this.startAmount || null,
          endAmount: this.endAmount || null,
          startTime: this.daterange1 ? this.daterange1[0] : "",
          endTime: this.daterange1 ? this.daterange1[1] : "",
          updatedStartTime: this.daterange2 ? this.daterange2[0] : "",
          updatedEndTime: this.daterange2 ? this.daterange2[1] : "",
          updateBy: this.updateBy
        },
        limit: this.pageSize,
        offset: (this.pageNum - 1) * this.pageSize,
        sort: "createDate",
        sortOrder: " desc"
      };
      financeDrawRecord
        .getDrawRecordList(data) //请求数据列表
        .then(res => {
          if (res.data&&res.data.rows) {
            this.tableData = res.data.rows;
            this.totalDrawCount = res.data.totalDrawCount;
            this.totalRealDrawCount = res.data.totalRealDrawCount;
            this.totalDrawFreeCount = res.data.totalDrawFreeCount;

            this.pageSize = res.data.limit;
            this.total = res.data.total;
            this.pageNum = res.data.offset / res.data.limit + 1;
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
        createStartTime:this.daterange1?this.daterange1[0]:'', //申请开始时间
        createEndTime:this.daterange1?this.daterange1[1]:'',     //申请结束时间
        drawRecordStatus:this.state,  //出款订单状态 1申请中,2已出款,3已退回,4出款失败,5处理中,6已拒绝
        // drawType:this.drawType, //提款类型 1.第三方银行出款,3.人工提款,2,支付宝出款,4.误存提款,5.行政提款
        levelId:this.level,  //会员等级id
        merchantName:'',  //商户名称
        officePayType:'', //官方充值汇款类型1.ATM柜员机；2.ATM现金；3.银行柜台；4.手机银行转账；5.网银转账;6.其他；7支付宝收款码；8微信收款码；9QQ收款码 10云闪付收款码
        parentAccount:'', //上级推广账号
        payRecordStatus:'', //入款订单状态 1未支付,2已支付,3已确认,4未确认,5已取消
        // recordType:this.recordType,  //记录类型 1：人工存款 2：人工提款 3：官方充值 4：线上支付 5：支付宝出款 6：银行卡出款 7：自动出款
        updateBy:this.updateBy,   //操作人
        updateStartTime:this.daterange2?this.daterange2[0]:'', //处理开始日期
        updateEndTime:this.daterange2?this.daterange2[1]:'',  //处理结束日期
      }
      data.recordType = 7;
      financeDrawRecord.financeExport(data).then(res => {
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
    supplementOrders(row) {
      this.supplementOrderLoading =true;
      //出款补单
      this.dialogFormVisibleFrom = true;
      this.ruleForm.id = row.id;
      //初始化表单
      this.ruleForm.reviewStatus = "1";
      this.ruleForm.drawType = "2";
      this.ruleForm.remark = "";
      this.ruleForm.merchantIds = "";

      financeDrawRecord
        .getDrawConfig()
        .then(res => {
          for (var i = 0; i < res.data.length; i++) {
            var merchantId = res.data[i].id;
            var merchantNames = res.data[i].merchantName;
            this.BankList.push({ id: merchantId, merchantName: merchantNames });
          }
            this.supplementOrderLoading =false;
        })
        .catch(err => {
          console.log(err);
            this.supplementOrderLoading =false;
        });
    },
    getDrawConfig(formName) {
      this.isDisabled = true;
      //表单提交
      this.getDrawConfigLoading = true;
      this.$refs[formName].validate(valid => {
        if (valid) {
          let data = {
            drawType: this.ruleForm.drawType,
            id: this.ruleForm.id,
            merchantId: this.ruleForm.merchantIds,
            remark: this.ruleForm.remark,
            reviewStatus: this.ruleForm.reviewStatus
          };
          financeDrawRecord
            .updateReviewResult(data)
            .then(res => {
              if (res.code == "201") {
                this.$notify({
                  type: "warning",
                  title: res.data
                });
              } else {
                this.$notify({
                  type: "success",
                  title: res.msg
                });
              }
              this.getDrawConfigLoading = false;
              this.dialogFormVisibleFrom = false;
              var timer = setTimeout(() => {
                    this.isDisabled = false;
                    clearTimeout(timer);
                }, 1000)
              this.queryHandle(); //补单成功重新查询
            })
            .catch(err => {
              console.log(err);
              this.getDrawConfigLoading = false;
                this.isDisabled = false;
            });
        } else {
          this.$notify({
            type: "warning",
            title: "验证不通过，请检查错误提示"
          });
          this.getDrawConfigLoading = false;
        }
      });
    },
    close() {
      //表单弹窗点击关闭解除验证
      this.$refs.ruleForm.clearValidate();
      this.BankList = [];
    },
    queryByRecords(row) {
      //查看出款订单
      this.dialogVisible = true;
      this.dialogLoading = true;
      let data = "?tbDrawRecordId=" + row.id;
      financeDrawRecord
        .queryByRecord(data)
        .then(res => {
          if (res.code == 200) {
            this.dialogData = Object.assign({},res.data)
          }else{
            this.$notify.warning({title:res.msg})
          }
        })
        .then(() => {
          //获取出入款总次数和金额
          let data = "?drawRecordId=" + row.id;
          financeDrawRecord.getPayDrawCount(data).then(res => {
            if (res.code == 200) {
              this.dialogData.count = res.data.count;
              this.dialogData.drawCount = res.data.drawCount;
              this.dialogData.drawMoney = res.data.drawMoney;
              this.dialogData.money = res.data.money;
            } else {
              this.$notify({
                type: "warning",
                title: res.msg
              });
            }
            this.dialogLoading = false;
          })
        })
        .catch(err => {
          console.log(err);
          this.dialogLoading = false;
        });
    },
    getLevelList() {
      //获取会员等级下拉菜单
      financeDrawRecord.getLevelList().then(res => {
        if (res.data) {
          // this.levelOptions.push(res.data)
          for (let i in res.data) {
            var id = res.data[i].id;
            var levelNames = res.data[i].levelName;
            this.levelOptions.push({
              id: id,
              levelNames: levelNames
            });
          }
        }
      });
    },
    checkAuditDetail(){ //查看会员稽核明细
      let params = {
          drawnumber:this.dialogData.orderNumber,
          account:this.dialogData.account,
          state:this.dialogData.state
        }
      this.$store.dispatch('setAuditParams',params);
      this.$router.push({
        name:'稽核查询',
      })
    },
    sizeChangeHandle(sz) {
      this.pageSize = sz;
      this.queryHandle();
    },
    currentChangeHandle(crt) {
      this.pageNum = crt;
      this.queryHandle();
    }
  }
};
</script>

<style>
.draw-record-table-expand {
  font-size: 0;
  border: 1px solid #ddd;
  padding: 0 10px;
}
.draw-record-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.draw-record-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 33%;
}
</style>

