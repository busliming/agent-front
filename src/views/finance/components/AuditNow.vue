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
          <el-input  v-model.trim="id" placeholder="会员id"></el-input>
        </el-form-item>
        <el-form-item label-width="0">
          <el-button type="primary"
            @click="clickHandle"
          >查询</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <el-row
      type="flex" justify="space-between"
    >
      <el-col :span="16" style="line-height:40px;">
        <p
          v-for="(item,idx) in chResultSum"
          :key="idx"
        >
          <span v-if="item.receiptType === null">存款记录总共{{item.subTotal}}笔，总扣除费用{{item.subTotalAmount}}</span>
          <span v-if="item.receiptType == 1">存款稽核有{{item.subTotal}}笔未通过，需要扣除行政费总共：{{item.subTotalAmount}}+手续费{{item.totalcharge}}</span>
          <span v-if="item.receiptType == 2">优惠稽核有{{item.subTotal}}笔未通过，需要扣除优惠总和：{{item.subTotalAmount}}元</span>
        </p>
        <p v-if="drawnumber1">取款订单号：{{drawnumber1}}</p>
      </el-col>
      <el-col :span="8">
        <el-tooltip class="item" effect="light" placement="bottom">
          <template slot="content">
            <p style='text-align:center'>
              即时稽核: <br>
            1、统计的是会员存款后，未取款前的记录 <br>
            2、通过出款稽核跳转到即时稽核界面，显示 <br>
            的是这一笔取款订单的稽核信息
            </p>
          </template>
          <i class="el-icon-info"></i>
        </el-tooltip>
      </el-col>
    </el-row>
    <el-table
      :data="tableData"
      v-loading='loading'
      :border="true"
      :fit="true"
      size="medium"
      stripe
      :cell-style="{textAlign:'center'}"
      :header-cell-style="{textAlign:'center'}"
      style="margin-top:15px;"
    >
      <el-table-column label="订单号" prop="orderNumber"></el-table-column>
      <el-table-column label="存款时间" prop="orderDate"></el-table-column>
      <el-table-column label="金额">
        <template slot-scope="{row}">
           <span>{{row.receiptType | myCurrenc}}{{row.orderAmount}}</span>
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
      <el-table-column label="剩余打码量"
      >
        <template slot-scope="{row}">
          <span
            v-if="row.unCheck == 1"
          >
            免稽核
          </span>
          <span
            v-else
          >{{row.checkedResult}}</span>
        </template>
      </el-table-column>
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
      <el-table-column label="扣除费用" width="150">
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
      <el-table-column label=""
        v-if="tableState == 'edit'"
        width="120"
      >
        <template slot-scope="{row}">
          <el-row
            v-if="row.checkedResult < 0"
          >
            <el-input size="small" v-model="row.editCheckedResult" placeholder="请输入"></el-input>
          </el-row>
          <el-row
            v-else
          >
          -
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <el-row
      style="margin-top:15px"
      type="flex"
      justify="end"
      v-if="tableState == ''"
    >
      <el-button type="primary" size="medium"
        @click="editTable()"
        :disabled="tableData.length == 0"
      >修改稽核</el-button>
      <el-button type="primary" size="medium"
        @click="editTable('all')"
        :disabled="tableData.length == 0"
      >清除所有稽核</el-button>
    </el-row>
    <el-row
      style="margin-top:15px"
      type="flex"  
      justify="end"
      v-if="tableState == 'edit'"
    >
      <el-button type="primary" size="medium"
        @click="tableState = ''"
      >取消</el-button>
      <el-button type="primary" size="medium"
        @click="SaveHandle"
        :loading='loading'
      >保存</el-button>
    </el-row>
  </div>
</template>

<script>
import financeRequest from '@/request/finance'

export default {
  name:'AuditNow',
  created(){
    console.log('created');
    this.$nextTick(() => {
      this.init();
      this.tableState = ''
    })    
  },
  activated(){
    console.log('及时稽核activated');
    this.$nextTick(() => {
      this.init();
      this.tableState = ''
    })    
  },
  data(){
    const isIntegerFixed2 = (r,v,c) => { //小数点后两位
      let reg = new RegExp(/^[0-9]+(.[0-9]{2})?$/);
      if(!v){
        c();
      }
      if(!reg.test(v)){
        c(new Error('请输入正数,小数点后两位'))
      }else{
        c();
      }
    };
    return {
      account:"",//条件查询 会员账号
      id:"",//条件查询 会员id
      orderNumber:'', //订单号，出款审核明细，及历史稽核明细查询时有值，即时稽核查询时没值

      drawnumber1:'', //取store.state值
      account1:'', //取store.state值

      tableData:[//列表数据  手动修改稽核绑定模型为editCheckedResult
      ], 
      chResultSum:[], //汇总数据
      loading:false,
      tableState:"", //修改状态为edit   取消为"""
    }
  },
  methods: {
      init() {
          //判断是否从出款审核跳转过来
          this.drawnumber1 = this.$store.getters.auditParams.drawnumber;
          this.account1 = this.$store.getters.auditParams.account;
          let orderState = this.$store.getters.auditParams.state;
          console.log('进入即时稽核');
          console.log(this.drawnumber1);
          console.log(this.account1);
          console.log(orderState);
          if (this.drawnumber1 && this.account1 && (orderState == 1 || orderState == 4)) { //从审核跳转过来  申请中  出款失败
              this.account = this.account1;
              this.orderNumber = this.drawnumber1;
              this.queryHandle();
              this.$store.dispatch('clearAuditParams') //清空store
          } else if (this.drawnumber1 && this.account1 && (orderState == 2 || orderState == 6)) {
              console.log('应该跳转历史稽核');
              this.$emit('tabChange', 0, 'AuditHistory')
          }
      },
      clickHandle() {

          this.drawnumber1 = '';
          this.orderNumber = ''; //清除数据
          this.queryHandle();
      },
      queryHandle() { //获取列表数据
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
              account: this.account,
              playId:this.id,
              checkStatus: 0, //及时
              orderNumber: this.orderNumber,
          }
          financeRequest.getCurrentCheckRecordDetail(data).then(res => {
              if (res.code == 200) {
                  this.tableData = res.data.chResultList;
                  this.chResultSum = res.data.chResultSum;
              } else {
                  this.$notify.warning({title: res.msg})
              }
          }).catch(e => {
              console.log(e)
          })
      },
      editTable(type) { //修改稽核
          if (type === 'all') {
              this.$confirm(
                  '此动作无法复原，确定要清除所有稽核吗？',
                  '提示',
                  {
                      confirmButtonText: '确认',
                      cancleButtonText: '取消',
                      type: 'warning'
                  }
              ).then(() => {  //确认清除
                  //所有稽核设置为0
                  this.tableData = this.tableData.map(row => {
                      row.editCheckedResult = 0
                      return row;
                  })
                  this.SaveHandle();
                  //this.editSaveHandle(this.account.trim());
              }).catch(cancle => { //取消清除
              })

          } else {
              //弹出提示
              this.$message.warning('应打码量修改通过后不可再修改，请仔细操作');
              //复制row.betAmountWill 到 editCheckedResult
              this.tableData = this.tableData.map(row => {
                  row.editCheckedResult = row.betAmountWill
                  return row;
              })
              this.tableState = 'edit'
          }
      },
      SaveHandle() {
          if (this.id != null && this.id != "") {
              this.editSaaveHandleCback();
          } else if (this.account != null && this.account != "") {
              this.editSaveHandle(this.account.trim());
          }
      },
      editSaaveHandleCback() {
          let data = {
              playId: this.id.trim()
          };
          financeRequest.findUser(data).then(res => {
              if (res.code == 200) {
                  this.editSaveHandle(res.data.account)
              } else {
                  this.$notify.warning({title: res.msg})
              }
          }).catch(e => {
              console.log(e)
          })
      },
      editSaveHandle(account) { //保存修改稽核
          this.loading = true;
          //验证修改稽核值是否是包含两位小数的值
          //let reg = new RegExp(/^[0-9]+(.[0-9]{2})?$/);
          let reg = /^\d+(\.\d{0,2})?$/;
          let validate = true;
          var detailList = [];
          if (this.tableData.length > 0) {
              for (var i = 0; i < this.tableData.length; i++) {
                  var item = this.tableData[i];
                  if (!reg.test(item.editCheckedResult)) {
                      validate = false;
                      this.$message.warning({message: '修改的稽核值必须是数字且不能小于0最多包含两位小数:' + item.editCheckedResult});
                      this.loading = false;
                      break;
                  }
                  let _item = {
                      betAmountMod:Number(item.editCheckedResult),
                      id: item.id,
                      receiptType: item.receiptType,
                  }
                  detailList.push(_item);
              }
          }
          /* let detailList = this.tableData.map(item => {
        if(!reg.test(item.editCheckedResult) || (Number(item.editCheckedResult) == 0 &&item.unCheck!=1 && item.checkedResult<0) ){//当输入为0 且 为稽核 且已稽核打码量结果小于0的时候 排除 页面显示 -的情况
              validate = false;
              this.$notify.warning({title:'修改的稽核值必须是大于零最多包含两位小数的数字:'+item.editCheckedResult});
              this.loading = false;
              return;
        }
        let _item = {
          betAmountMod:item.editCheckedResult,
          id:item.id,
          receiptType:item.receiptType,
        }
        return _item;
      });*/
          if (!validate) {
              this.loading = false;
              return
          }
          let data = {
              account: account,
              playId: this.id,
              drawNumber: this.orderNumber,
              detailList
          }
          console.log(data);
          financeRequest.updateCheckRecord(data).then(res => {
              if (res.code == 200) {
                  this.$notify.success({title: '保存成功'})
                  this.queryHandle(); //刷新数据
              } else {
                  this.$notify.warning({title: res.msg})
              }
              this.tableState = '';
              this.loading = false;
          }).catch(e => {
              console.log(e)
          })
      }
  },
  filters:{
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
  }
}
</script>