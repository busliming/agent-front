<template>
  <el-card>
    <el-form label-width="80px">
      <el-row type="flex" justify="space-between">
        <el-col :span="5">
          <el-form-item label="订单号" label-width="60px">
            <el-input v-model="orderNumber" placeholder="订单号" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="会员账号">
            <el-input v-model="account" placeholder="会员账号" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="会员等级">
            <el-select placeholder="请选择" v-model.number="levelId" clearable style="width:100%">
              <el-option
                v-for="item in levelOptions"
                :key="item.id"
                :label="item.levelName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="订单状态">
            <el-select placeholder="请选择" v-model.number="orderState" clearable style="width:100%">
              <el-option label="申请中" :value="1"></el-option>
              <el-option label="已出款" :value="2"></el-option>
              <el-option label="已退回" :value="3"></el-option>
              <!-- <el-option v-if="state == 'bank'" label="出款失败" :value="4"></el-option> -->
              <!-- <el-option  label="处理中" :value="5"></el-option> -->
              <el-option  label="已拒绝" :value="6"></el-option>
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
            <el-input v-model="updateBy" placeholder="请输入" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="金额" label-width="40px">
            <el-row>
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
        <el-col :span="11">
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
        </el-col>
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
      :cell-style="{textAlign:'center'}"
      :header-cell-style="{textAlign:'center'}"
      :default-sort="{prop:'ordernumber',order:'descending'}"
      :data="tableData"
      v-loading="isloading"
    >
      <!-- <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="payment-review-table-expand">
            <el-form-item label="订单编号">
              <span>{{ props.row.orderNumber }}</span>
            </el-form-item>
            <el-form-item label="会员等级">
              <span>{{ props.row.levelName }}</span>
            </el-form-item>
            <el-form-item label="真实姓名">
              <span>{{ props.row.realName }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column> -->
      <el-table-column label="订单号" prop="orderNumber"></el-table-column>
      <el-table-column label="会员账号" prop="account"></el-table-column>
      <el-table-column label="会员ID" prop="playId"></el-table-column>
      <el-table-column :label="state === 'ali'?'支付宝账号':'银行卡账号'" prop="bankAccount"></el-table-column>
      <el-table-column label="申请时间" prop="createDate" width="110">
        <template slot-scope="{row}">
          <el-tooltip class="item" effect="light" placement="top">
            <div slot="content">{{row.createDate}}</div>
            <span>{{row.createDate | YMDHMStoTIME}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      
      <el-table-column label="扣除费用" width="90">
        <template slot-scope="{row}">
          <el-row
            type="flex" justify="space-around"
          >
            <el-tooltip class="item" effect="dark" placement="bottom"
              v-if="row.amountFee > 0"
            >
              <div slot="content">手续费{{row.amountFee}}</div>
              <el-button circle size="small" style="background:blue;"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" placement="bottom"
              v-else
            >
              <div slot="content">无手续费</div>
              <el-button circle size="small" style="background:transparent;"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" placement="bottom"
              v-if="row.serverAmount > 0"
            >
              <div slot="content">行政费用{{row.serverAmount}}</div>
              <el-button circle size="small" style="background:red;"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" placement="bottom"
              v-else
            >
              <div slot="content">无行政费用</div>
              <el-button circle size="small" style="background:transparent;"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" placement="bottom"
              v-if="row.freeAmount > 0"
            >
              <div slot="content">优惠扣除{{row.freeAmount}}</div>
              <el-button circle size="small" style="background:green;"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" placement="bottom"
              v-else
            >
              <div slot="content">无优惠扣除</div>
              <el-button circle size="small" style="background:transparent;"></el-button>
            </el-tooltip>
          </el-row>
        </template>
      </el-table-column>

      <el-table-column label="出款金额">
        <template slot-scope="{row}">
          <el-row
            type="flex" justify="center" align="middle"
          >
            <span style="margin-right:10px;">{{row.amount}}</span>
            <clickToCopy :content='row.amount'></clickToCopy>
          </el-row>
        </template>
      </el-table-column>

      <el-table-column label="状态" prop="state">
        <template slot-scope="scope">
          <el-tag size="medium" color="#ddd" type="success" v-if="scope.row.state == 1">申请中</el-tag>
          <el-tag size="medium" color="#fff" type="success" v-if="scope.row.state == 2">已出款</el-tag>
          <el-tag size="medium" color="#fff" type="danger" v-if="scope.row.state == 3">已退回 </el-tag>
          <el-tag size="medium" color="#fff" type="danger" v-if="scope.row.state == 4">出款失败</el-tag>
          <el-tag size="medium" color="#fff" type="warning" v-if="scope.row.state == 5">处理中</el-tag>
          <el-tag size="medium" color="#fff" type="danger" v-if="scope.row.state == 6">已拒绝</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作人/处理日期">
        <template slot-scope="{row}">
            {{row.updateBy}} / {{row.updateDate | YMDHMStoTIME}}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="120">
        <!-- state  出款状态：1，出款未完成/申请中，2已出款, 3已退回，4出款失败,5处理中,6已拒绝 -->
        <!-- operatingState:订单操作状态：1.已锁定 -->
        <template slot-scope="scope">
          <template v-if="scope.row.operatingState != 1">
            <el-button
              style="padding: 6px 6px; color: #fff;"
              type="danger"
              size="mini"
              @click="updateOperatingStates(scope.row,1)"
            >锁定</el-button>
          </template>
          <template v-else>
            <template v-if="scope.row.state  == 1 || scope.row.state  == 5">
              <template
                v-if="scope.row.isLock"
              >
                {{scope.row.lockingAccount}}已锁定
              </template>
              <template
                v-else
              >
                <el-button
                  style=" padding: 6px 6px; color: #fff;"
                  size="mini"
                  color="green"
                  type="success"
                  @click="queryByRecords(scope.row)"
                >处理</el-button>
                <el-button
                  style="padding: 6px 6px; color: #fff;"
                  type="danger"
                  size="mini"
                  @click="updateOperatingStates(scope.row,0)"
                >取消</el-button>
              </template>
            </template>
            <template v-if="scope.row.state  == 2 || scope.row.state  == 3 || scope.row.state  == 4 || scope.row.state  == 6">
              <el-button
                style=" padding: 6px 6px; color: #fff;"
                size="mini"
                color="green"
                type="info"
                @click="checkDetail(scope.row)"
              >查看</el-button>
            </template>
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
          <span>总出款金额:<el-tag type="primary" size="small">{{totalDrawCount}}元</el-tag></span>
        </el-row>
      </el-col>
    </el-row>

    <!-- 查看订单/处理订单弹窗 -->
    <el-dialog
      title="出款申请明细"
      :visible.sync="dialogVisible"
      width="70%"
      height="100%"
      @close='dialogClose'
      :modal-append-to-body='false'
    >
      <el-form
        :model="dialogData"
        :rules="rules"
        ref="dialogForm"
        v-loading='dialogLoading'
        label-width="100px"
        height="80%"
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
              <span style='margin-right:10px;' >{{dialogData.orderNumber}}</span>
            </el-row>
          </el-col>
          <el-col :span="6" style="border-right:1px solid #ddd">
            <el-row type="flex" justify="start" align="middle" style="height:60px">
              <span style="width:90px;text-align:right;padding-right:10px;">申请人:</span>
              <span style='margin-right:10px;' >{{dialogData.account}}</span>
            </el-row>
          </el-col>
          <el-col :span="6" style="border-right:1px solid #ddd">
            <el-row type="flex" justify="start" align="middle" style="height:60px">
              <span style="width:90px;text-align:right;padding-right:10px;">会员等级:</span>
              <span style='margin-right:10px;' >{{dialogData.levelName}}</span>
            </el-row>
          </el-col>
          <el-col :span="6" style="border-right:1px solid transparent">
            <el-row type="flex" justify="start" align="middle" style="height:60px"
              v-if="!dialogIsCheck"
            >
              <span style="width:90px;text-align:right;padding-right:10px;">申请日期:</span>
              <span style='margin-right:10px;' >{{dialogData.createDate}}</span>
            </el-row>
            <el-row type="flex" justify="start" align="middle" style="height:60px"
              v-if="dialogIsCheck"
            >
              <span style="width:90px;text-align:right;padding-right:10px;">处理日期:</span>
              <span style='margin-right:10px;' >{{dialogData.updateDate}}</span>
            </el-row>
          </el-col>
        </el-row>
        <el-row
          v-if="state === 'ali'"
          style="border-bottom:1px solid #ddd;"
        >
          <el-col :span="6" style="border-right:1px solid #ddd;">
            <el-row type="flex" justify="start" align="middle" style="height:60px">
              <span style="width:90px;text-align:right;padding-right:10px;">真实姓名:</span>
              <span style='margin-right:10px;'> {{dialogData.realName}}</span>
              <click-to-copy :content='dialogData.realName'></click-to-copy>
            </el-row>
          </el-col>
          <el-col :span="6" style="border-right:1px solid #ddd;">
            <el-row type="flex" justify="start" align="middle" style="height:60px">
              <span style="width:90px;text-align:right;padding-right:10px;">支付宝账号:</span>
              <span style='margin-right:10px;'> {{dialogData.bankAccount}}</span>
              <click-to-copy :content='dialogData.bankAccount'></click-to-copy>
            </el-row>
          </el-col>
        </el-row>
        <el-row
          v-if="state === 'bank'"
          style="border-bottom:1px solid #ddd;"
        >
          <el-col :span="6" style="border-right:1px solid #ddd;">
            <el-row type="flex" justify="start" align="middle" style="height:60px">
              <span style="width:90px;text-align:right;padding-right:10px;">真实姓名:</span>
              <span style='margin-right:10px;' >{{dialogData.realName}}</span>
              <click-to-copy :content='dialogData.realName'></click-to-copy>
            </el-row>
          </el-col>
          <el-col :span="6" style="border-right:1px solid #ddd;">
            <el-row type="flex" justify="start" align="middle" style="height:60px">
              <span style="width:90px;text-align:right;padding-right:10px;">银行卡号:</span>
              <span style='margin-right:10px;' >{{dialogData.bankAccount}}</span>
              <click-to-copy :content='dialogData.bankAccount'></click-to-copy>
            </el-row>
          </el-col>
          <el-col :span="6" style="border-right:1px solid #ddd;">
            <el-row type="flex" justify="start" align="middle" style="height:60px">
              <span style="width:90px;text-align:right;padding-right:10px;">银行名称:</span>
              <span style='margin-right:10px;' >{{dialogData.bankName}}</span>
              <click-to-copy :content='dialogData.bankName'></click-to-copy>
            </el-row>
          </el-col>
          <el-col :span="6" style="border-right:1px solid transparent;">
            <el-row type="flex" justify="start" align="middle" style="height:60px">
              <span style="width:90px;text-align:right;padding-right:10px;">开户行:</span>
              <span style='margin-right:10px;' >{{dialogData.branchAddress || '无'}}</span>
              <click-to-copy :content='dialogData.branchAddress'></click-to-copy>
            </el-row>
          </el-col>
        </el-row>
        <el-row type="flex" justify="space-between" style="border-bottom:1px solid #ddd;">
          <el-col :span="6" style="border-right:1px solid #ddd;">
            <el-row type="flex" justify="start" align="middle" style="height:60px">
              <span style="width:90px;text-align:right;padding-right:10px;">取款金额:</span>
              <span style='margin-right:10px;' >{{dialogData.amount}}</span>
            </el-row>
          </el-col>
          <el-col :span="6" style="border-right:1px solid #ddd;">
            <el-row type="flex" justify="start" align="middle" style="height:60px">
              <span style="width:90px;text-align:right;padding-right:10px;">手续费:</span>
              <span style='margin-right:10px;' >{{dialogData.amountFee}}</span>
            </el-row>
          </el-col>
          <el-col :span="6" style="border-right:1px solid #ddd;">
            <el-row type="flex" justify="start" align="middle" style="height:60px">
              <span style="width:90px;text-align:right;padding-right:10px;">行政费:</span>
              <span style='margin-right:10px;' >{{dialogData.serverAmount}}</span>
            </el-row>
          </el-col>
          <el-col :span="6" style="border-right:1px solid #ddd;">
            <el-row type="flex" justify="start" align="middle" style="height:60px">
              <span style="width:90px;text-align:right;padding-right:10px;">优惠扣除:</span>
              <span style='margin-right:10px;' >{{dialogData.freeAmount}}</span>
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
              <span style="margin:0 10px;">{{dialogData.actualAmount}}</span>
              <span v-if='dialogData.state == 1'>【申请中】</span>
              <span v-if='dialogData.state == 2'>【已出款】</span>
              <span v-if='dialogData.state == 3'>【已退回】</span>
              <span v-if='dialogData.state == 4'>【出款失败】</span>
              <span v-if='dialogData.state == 6'>【已拒绝】</span>
            </el-row>
          </el-col>
          <el-col :span="6"
            v-if="dialogData.state != 3"
          >
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
          <el-form-item label="备注" prop="remark">
            <el-input v-model="dialogData.remark" type="textarea"></el-input>
          </el-form-item>
        </el-row>
      </el-form>

      <template slot="footer" style="height: 20%;">
        <div v-if="!dialogIsCheck" v-loading='dialogLoading'>
        <el-row
          type="flex" justify="center"
        >
          <el-col :span="6">
            <el-row
              type="flex" justify="space-between"
            >
              <el-button type="primary" size="medium"
                @click='updateReviewResult(1)'
              >确认</el-button>
              <el-button type="primary" size="medium"
                @click='updateReviewResult(2)'
              >退回</el-button>
              <el-button type="primary" size="medium"
                @click='checkRejustDraw'
              >拒绝</el-button>
            </el-row>
          </el-col>
        </el-row>
        <el-row
        >
          <p style="text-align:center;padding-top:15px;">【退回】：代表取款金额退回到会员的账户余额，取款订单取消      【拒绝】：代表取款金额不会退回到会员的账户余额，取款订单取消</p>
        </el-row>
        </div>
        <el-row
          type="flex" justify="center"
          v-if="dialogIsCheck"
        >
          <el-button type="primary" size="medium"
            @click="updateRemark"
          >
            更新备注
          </el-button>
        </el-row>
      </template>
    </el-dialog>
  </el-card>
</template>

<script>
import financeAli from "@/request/finance";
import validator from "@/tool/validate";
import { YMDHMStoTIME } from "@/tool/times";
import time from '@/tool/times'
export default {
  name: "PaymentReview",
  data() {
    return {
      state: "", //判断路由 ali支付宝出款审核 bank银行卡出款审核
      levelName: "", //出款订单审核弹框 会员等级名称

      orderNumber: "", //订单号
      account: "", //会员账号
      levelId: null, //会员等级
      orderState: null, //订单状态
      playId: null, //会员id
      updateBy: "", //操作人
      startAmount: null, //开始金额
      endAmount: null, //结束金额
      createDate: [time.DateToYMD(new Date()),time.DateToYMD(new Date())], //时间日期

      levelOptions: [], //会员等级下拉

      operatingState: "", //锁定状态
      tableData: [], //表格数据
      stateOptions: [
        //出款状态
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
        }
      ],
      moreConditions: false, //更多条件
      src:'', //导出表格src

      totalDrawCount:0 ,//总出款金额

      pageNum: 1,
      pageSize: 10,
      total: 0,
      isloading: false, //loading

      dialogVisible: false, //出款申请明细弹窗
      dialogData: { //弹窗表单数据
      }, 
      dialogLoading: false, //弹窗加载状态  点击确认/退回/拒接后为true

      //表单验证
      rules: {
        remarks: [{ validator: validator.remarks, trigger: "blur" }]
      },

      dialogIsCheck: false //处理订单/查看  操作共用区分标注   true为查看
    };
  },
  filters:{
    YMDHMStoTIME
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
        if(this.state == 'ali'){
          return '支付宝出款审核'+nowDate+'.xls'
        }else{
          return '银行卡出款审核'+nowDate+'.xls'
        }
      },
      set(){
      }
    }
  },
  methods: {
    searchHandle() { //查询按钮
      this.pageNum = 1;
      this.queryHandle();
    },
    queryHandle() {
      this.isloading = true;
      let data = {
        limit: this.pageSize,
        offset: (this.pageNum - 1) * this.pageSize,
        sort: "createDate",
        sortOrder: " desc",
        conditionsMap: {
          state: this.orderState || null,
          account: this.account.trim(),
          playId: this.playId || null,
          levelId: this.levelId || null,
          orderNumber: this.orderNumber,
          startAmount: this.startAmount || null,
          endAmount: this.endAmount || null,
          startTime: this.createDate ? this.createDate[0] : "",
          endTime: this.createDate ? this.createDate[1] : "",
          updateBy: this.updateBy
        }
      };

      if (this.state === "ali") {
        financeAli.getZfbDrawRecordList(data).then(res => {
          if (res.code == 200) {
            let data = res.data
            this.tableData = data.rows;
            this.totalDrawCount = data.totalDrawCount;

            this.pageSize = data.limit;
            this.total = data.total;
            this.pageNum = data.offset / data.limit + 1;
          } else {
            this.$notify({
              type: "warning",
              title: res.msg
            });
          }
          this.isloading = false;
        });
      } else {
        //    银行卡出款审核
        financeAli.getBankDrawRecordList(data).then(res => {
          if (res.code == 200) {
            let data = res.data
            this.tableData = data.rows;
            this.totalDrawCount = data.totalDrawCount;
            
            this.pageSize = data.limit;
            this.total = data.total;
            this.pageNum = data.offset / data.limit + 1;
          } else {
            this.$notify({
              type: "warning",
              title: res.msg
            });
          }
          this.isloading = false;
        });
      }
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
        drawRecordStatus:this.orderState,  //出款订单状态 1申请中,2已出款,3已退回,4出款失败,5处理中,6已拒绝
        // drawType:this.drawType, //提款类型 1.第三方银行出款,3.人工提款,2,支付宝出款,4.误存提款,5.行政提款
        levelId:this.levelId,  //会员等级id
        merchantName:'',  //商户名称
        officePayType:'', //官方充值汇款类型1.ATM柜员机；2.ATM现金；3.银行柜台；4.手机银行转账；5.网银转账;6.其他；7支付宝收款码；8微信收款码；9QQ收款码 10云闪付收款码
        parentAccount:'', //上级推广账号
        payRecordStatus:'', //入款订单状态 1未支付,2已支付,3已确认,4未确认,5已取消
        // recordType:this.recordType,  //记录类型 1：人工存款 2：人工提款 3：官方充值 4：线上支付 5：支付宝出款 6：银行卡出款 7：自动出款
        updateBy:this.updateBy,   //操作人
        updateStartTime:'', //处理开始日期
        updateEndTime:'',  //处理结束日期
      }
      if(this.state == 'ali'){
        data.recordType = 5;
      }else{
        data.recordType = 6;
      }
      financeAli.financeExport(data).then(res => {
        if(res.code != 300 && res.code != 520){
          let type = 'application/msexcel,charset=uft-8';
          let blob = new Blob([res], {type: type});
          let URL = window.URL && window.webkitURL;
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
    getLevelList() {
      //获取会员等级下拉菜单
      financeAli.getLevelList().then(res => {
        if (res.data) {
          this.levelOptions = Object.assign([],res.data);
        }
      });
    },
    updateOperatingStates(row, state) {
      //出款订单锁定与取消
      let id = row.id;
      let data = "?id=" + id + "&operatingState=" + state;
      financeAli.updateOperatingState(data).then(res => {
        this.$notify({
          type: "warning",
          title: res.msg
        });
        this.queryHandle(); //处理完成 重新查询
      });
    },
    checkDetail(row) {
      //查看详情
      this.dialogIsCheck = true;
      this.queryByRecords(row);
    },
    queryByRecords(row) {
      //解决10766与10767 防止用户点击键盘enter键操作
        document.onkeydown = function(e) {
            var ev = (typeof event != 'undefined') ? window.event : e;
            if (ev.keyCode == 13) {
                return false;
            }
        }
      this.dialogVisible = true;
      this.dialogLoading = true;
      if(row.state==1||row.state==5){ //因查看 和 处理都会进入queryByRecords 方法，点击查看后dialogIsCheck变成true了，所有需要加判断当需要处理的时候dialogIsCheck改成false
          this.dialogIsCheck = false;
      }
      //根据id获取详情
      let data = "?tbDrawRecordId=" + row.id;
      financeAli
        .queryByRecord(data)
        .then(res => {
          if (res.code == 200) {
            this.dialogData = Object.assign({},res.data);
          } else {
            this.$notify({
              type: "warning",
              title: res.msg
            });
          }
        })
        .then(() => {
          //获取出入款总次数和金额
          let data = "?drawRecordId=" + row.id;
          financeAli.getPayDrawCount(data).then(res => {
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
    updateReviewResultHandle(state){  //审核通过或者退回  --异步请求
      this.dialogLoading = true;
      this.$refs.dialogForm.validate().then(res => {
        let data = {
          id: this.dialogData.id,
          remark: this.dialogData.remark,
          reviewStatus: state
        };
        financeAli.updateReviewResult(data).then(res => {
          if (res.code == 200) {
            this.$notify({
              type: "success",
              title: res.msg
            });
            this.queryHandle(); //补单成功重新查询
            this.dialogVisible = false;
          } else {
            this.$notify.warning({title: res.msg});
          }
          this.dialogLoading = false;
        })
        .catch(err => {
          console.log(err);
          this.dialogLoading = false;
        });
      }).catch(e => {
        this.$notify.warning({title:'校验不通过，请检查错误提示'})
        this.dialogLoading = false;
      })
    },
    updateReviewResult(state){  //审核通过或者退回 --点击按钮
      if(state === 1 && this.dialogData.actualAmount<0){
        //点击确定并且出款金额为负数则弹窗
        this.$confirm(
          '该用户打码量不足，是否保存稽核到历史记录？',
          '提示',
        ).then(res => {
          console.log(res);
          this.updateReviewResultHandle(state);
        },rej => {
          console.log(rej);
          return;
        })
      }else if(state === 1){
        this.updateReviewResultHandle(state);
      }
      if(state === 2){
        //点击退回弹窗
        this.$confirm(
          '金额退回到会员的账户余额，取款订单取消，打码量不会被清除，稽核信息被继续保留。',
          '提示',
        ).then(res => {
          console.log(res);
          this.updateReviewResultHandle(state);
        },rej => {
          console.log(rej);
          return;
        })
      }
    },
    checkRejustDraw(){  //审核拒绝
      this.$confirm(
        '取款金额不退回到会员的账户余额，取款订单取消，打码量会被清除。',
        '提示',
      ).then(res => {
        console.log(res)
        this.dialogLoading = true;
        let data = "?drawRecordId=" + this.dialogData.id;
        financeAli.checkRejustDraw(data).then(res => {
          if (res.code == 200) {
            this.$notify({
              type: "success",
              title: res.msg
            });
            this.queryHandle(); //补单成功重新查询
            this.dialogVisible = false;
          } else {
            this.$notify.warning({title: res.msg});
          }
          this.dialogLoading = false;
        })
        .catch(err => {
          console.log(err);
          this.dialogLoading = false;
        });
      },rej => {
        console.log(rej)
        return
      })
    },
    updateRemark(){  //更新备注
      this.dialogLoading = true;
      let data = "?drawRecordId=" + this.dialogData.id + '&remark='+ this.dialogData.remark;
      financeAli.updateRemark(data).then(res => {
        if (res.code == 200) {
          this.$notify({
            type: "success",
            title: '更新备注成功'
          });
          this.queryHandle(); //更新备注重新查询
          this.dialogVisible = false;
        } else {
          this.$notify.warning({title: res.msg});
        }
        this.dialogLoading = false;
      })
      .catch(err => {
        console.log(err);
        this.dialogLoading = false;
      });
    },
    checkAuditDetail(){ //查看会员稽核明细
      let params = {
        drawnumber:this.dialogData.orderNumber,
        account:this.dialogData.account,
        state:this.dialogData.state
      }
      console.log('params：');
      console.log(params);
      this.$store.dispatch('setAuditParams',params);
      this.$router.push({
        name:'稽核查询',
      })
    },
    dialogClose() {
      //表单弹窗点击关闭解除验证
      this.$refs.dialogForm.clearValidate();
     var timer = setTimeout(function () {
          this.dialogIsCheck = false;
          clearTimeout(timer);
      },500)
    },
    sizeChangeHandle(sz) {
      this.pageSize = sz;
      this.queryHandle();
    },
    currentChangeHandle(crt) {
      this.pageNum = crt;
      this.queryHandle();
    },
  },
  created() {
    this.state = this.$route.name === '支付宝出款审核'?'ali':'bank';
    this.getLevelList();
    this.queryHandle();
  },
  activated(){
        this.$nextTick(() => {
            this.createDate = [];
            this.createDate.push(time.DateToYMD(new Date()));
            this.createDate.push(time.DateToYMD(new Date()));
            this.queryHandle();
       })
   }
};
</script>


<style lang='scss' scoped>
.label {
  text-align: right;
  color: rgb(96, 98, 102);
  font-size: 14px;
}

// .el-form-itemS {
//     width: 100%;
// }

// .el-form-item__content {
//     width: 60% !important;
// }
</style>

<style>
.payment-review-table-expand {
  font-size: 0;
  border: 1px solid #ddd;
  padding: 0 10px;
}
.payment-review-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.payment-review-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 33%;
}
</style>
