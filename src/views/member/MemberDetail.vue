<template>
  <el-card body-style="background:transparent;"
    v-loading="loading"
  >
    <div style="width:780px;margin:auto;padding-bottom:10px;" class="memberdetailcontainer">
      <el-card >
        <div slot="header" class="clearfix">
          <span>会员基础信息</span>
        </div>
        <el-form 
          label-width="120px"
          label-position="left"
          :rules="rules"
          :model="usrInfo"
          ref="form1"
        >
          <el-row type="flex" justify="space-between">
            <el-col
              :span="11"
            >
              <el-form-item label="会员账户：">
                <el-input readonly disabled="disabled"   v-model="usrInfo.account"></el-input>
              </el-form-item>
            </el-col>
            <el-col
              :span="11"
              justify="space-between"
            >
              <el-form-item label="上级：" prop="parentAccount" >
                <el-input clearable  v-model="usrInfo.parentAccount" ></el-input>
                <!-- <span style="width: 20%;color: red;" > {{this.tingzhu}}</span> -->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="space-between">
            <el-col
              :span="11"
            >
              <el-form-item label="会员等级："
              >
                <el-select v-model="usrInfo.levelId" placeholder="会员等级"
                  style="width:100%"
                  :disabled="true"
                >
                  <el-option
                    v-for="item in leveloptions"
                    :key="item.id"
                    :label="item.levelName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              :span="11"
            >
              <el-form-item label="真实姓名："
                prop="realName"
              >
                <el-input clearable v-model.trim="usrInfo.realName"  @keyup.enter.native.prevent="true" @keyup.native="canEditrealNameAuth"
                          :disabled="!canEdit"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="space-between">
            <el-col
              :span="11"
            >
              <el-form-item label="会员状态：">
                <el-select
                  v-model="usrInfo.state"
                  style="width:100%"
                  :disabled="!canEdit"
                >
                  <el-option
                    label='正常'
                    :value="1"
                  ></el-option>
                  <el-option
                    label='禁用'
                    :value="2"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              :span="11"
            >
              <el-form-item label="E-mail："
                prop="email"
              >
                <el-input clearable v-model.trim="usrInfo.email"
                  :disabled="!canEdit"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="space-between">
            <el-col
              :span="11"
            >
              <el-form-item label="手机号码："
                prop="phone"
              >
                <el-input clearable v-model.trim="usrInfo.phone"  @keyup.enter.native.prevent="true" @keyup.native="canEditrealNameAuth"
                  :disabled="!canEdit"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col
              :span="11"
            >
              <el-form-item label="微信号码："
                prop="weixin"
              >
                <el-input clearable v-model.trim="usrInfo.weixin"
                  :disabled="!canEdit"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="space-between">
            <el-col
              :span="11"
            >
              <el-form-item label="QQ号码："
                prop="qq"
              >
                <el-input clearable v-model.trim="usrInfo.qq"
                  :disabled="!canEdit"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col
              :span="11"
            >
              <el-form-item label="账户id："
              >
                <el-input clearable v-model="usrInfo.playId" readonly disabled="disabled" ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="space-between">
            <el-col
              :span="11"
            >
              <el-form-item label="注册时间：">
                <el-input readonly v-model="usrInfo.createDate" disabled="disabled" ></el-input>
              </el-form-item>
            </el-col>
            <el-col
              :span="11"
            >
              <el-form-item label="最后登录：">
                <el-input readonly v-model="usrInfo.lastLoginDate" disabled="disabled" ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="space-between">
            <el-col
              :span="11"
            >
              <el-form-item  
                label="密码："
                prop="password"
              >
                <el-input 
                  :readonly="pwReadonly"  
                  :clearable="!pwReadonly"
                  v-model.trim="password"
                  ref='pwinput'
                  type="password"
                  :disabled="!canEdit"
                >
                  <template slot="append">
                    <el-button size="medium" type="warning"
                      @click="pwRestBtnhandle"
                    >修改密码</el-button>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col
              :span="11"
            >
              <el-form-item label="实名认证：">
                <el-select
                        v-model="usrInfo.realNameAuth"
                        style="width:100%"
                        :disabled="IsrealNameAuth"
                >
                  <el-option
                          label='未认证'
                          :value="0"
                  ></el-option>
                  <el-option
                          label='未通过'
                          :value="2"
                  ></el-option>
                  <el-option
                          label='已通过'
                          :value="1"
                  ></el-option>
                </el-select>
              </el-form-item>
              <!-- <el-form-item  
                label="资金密码："
                prop="safePassword"
              >
                <el-input 
                  :readonly="sfpwReadonly"  
                  :clearable="!sfpwReadonly"
                  v-model="safePassword"
                  ref='sfpwinput'
                  type="password"
                  :disabled="!canEdit"
                >
                  <template slot="append">
                    <el-button size="medium" type="warning"
                      @click="sfpwRestBtnhandle"
                    >修改密码</el-button>
                  </template>
                </el-input>
              </el-form-item> -->
            </el-col>
          </el-row>
          <el-row type="flex" justify="space-between">
            <el-col
              :span="11"
            >
              <el-form-item  
                label="会员标签："
              >
                <el-select v-model="usrInfo.labelId" placeholder="请选择"
                  style="width:100%"
                  :disabled="!canEdit"
                >
                  <el-option
                    v-for="item in labelList"
                    :key="item.id"
                    :label="item.labelName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              :span="11"
            >
              <el-form-item  
                label="设备唯一标识码："
              >
                <el-select v-model="usrInfo.weChatCode" placeholder="请选择"
                  style="width:100%"
                  :disabled="true"
                >
                  <el-option label="已绑定" value="1"></el-option>
                  <el-option label="未绑定" value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="space-between">
            <el-col
              :span="24"
            >
              <el-form-item  
                label="备注："
                prop="remark"
              >
                <el-input v-model="usrInfo.remark" clearable 
                  type='textarea'
                  :disabled="!canEdit"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>

      <el-card style='margin-top:10px;'>
        <div slot="header" class="clearfix">
          <span>账户信息</span>
        </div>
        <el-form
          label-width="90px"
          :model="usrInfo"
          :rules="rules"
          ref="form2"
        > 
          <el-row type="flex" justify="space-between" >
            <el-col
              :span="11"
            >
              <el-form-item label-width="100px" label="账户余额：">
                <el-input readonly v-model="usrInfo.money" disabled="disabled" ></el-input>
              </el-form-item>
            </el-col>
            <el-col
              :span="11"
            >
              <el-form-item label-width="100px" label="保险箱余额：">
                <el-input readonly v-model="computedSafeMoney" disabled="disabled" ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="space-between">
            <el-col
              :span="11"
            >
              <el-form-item label-width="100px" label="支付宝："
                prop="aliAccountId"
              >
                <el-input clearable v-model.trim="usrInfo.aliAccountId"
                  :disabled="!canEdit"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col
              :span="11"
            >
              <el-form-item label-width="100px" label="银行卡："
                prop="bankAccount"
              >
                <el-input clearable v-model.trim="usrInfo.bankAccount"
                  placeholder="不包含空格"
                  :disabled="!canEdit"
                  @clear="clearbankAccount" 
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="space-between">
            <el-col
              :span="11"
            >
              <el-form-item label-width="100px" label="银行名称："
                prop="bankName"
              >
                <el-input clearable v-model.trim="usrInfo.bankName"
                  :disabled="!canEdit"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col
              :span="11"
            >
              <el-form-item label-width="100px" label="充值次数：">
                <el-input readonly  v-model="usrInfo.rechargeNum" disabled="disabled" ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="space-between">
            <el-col
              :span="11"
            >
              <el-form-item label-width="100px" label="充值金额：">
                <el-input readonly v-model="usrInfo.rechargeMoney" disabled="disabled" ></el-input>
              </el-form-item>
            </el-col>
            <el-col
              :span="11"
            >
              <el-form-item label-width="100px" label="提现次数：">
                <el-input readonly v-model="usrInfo.drawNum" disabled="disabled" ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="space-between">
            <el-col
              :span="11"
            >
              <el-form-item label-width="100px" label="提现金额：">
                <el-input readonly v-model="usrInfo.drawMoney" disabled="disabled" ></el-input>
              </el-form-item>
            </el-col>
            <el-col
              :span="11"
            >
              <el-form-item label-width="100px" label="返水金额：">
                <el-input readonly v-model="rebateMoneyComputed" disabled="disabled" ></el-input>
              </el-form-item>
            </el-col> 
          </el-row>
           <el-row type="flex" justify="space-between">
            <el-col
              :span="11"
            >
              <el-form-item label-width="100px" label="当前幸运积分:">
                <el-input readonly v-model="usrInfo.score" disabled="disabled" ></el-input>
              </el-form-item>
            </el-col>
            <el-col
              :span="11"
            >
              <el-form-item label-width="100px" label="明日幸运积分:">
                <el-input readonly v-model="usrInfo.todayIntegral" disabled="disabled" ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!--<el-row type="flex" justify="space-between">
            <el-col
                    :span="11"
            >
              <el-form-item label-width="100px" label="VIP打码倍数：" prop="codeMultiple">
                <el-input  v-model="usrInfo.codeMultiple"></el-input>
              </el-form-item>
            </el-col>
            <el-col
                    :span="13"
            >
              <el-form-item label-width="10px" >
                <el-tooltip class="item" effect="light" placement="top-start" style="margin-left:10px;">
                  <div slot="content">1.提款VIP赠送金额需要的打码倍数。<br />
                    2.最终打码量=VIP打码倍数*VIP赠送金额。<br />
                    3.VIP赠送金额包括：VIP晋级礼金、VIP周礼金、VIP月礼金。</div>
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </el-form-item>
            </el-col>
          </el-row>-->
        </el-form>
      </el-card>
      <!-- <el-card style='margin-top:10px;' body-style="padding:20px 20px 0 20px"
        v-if="canAdjust"
      >
        <div slot="header" class="clearfix">
          <span>会员权限设置</span>
        </div>
        <el-form
          label-width="90px"
        >
          <el-row
            type="flex"
            justify="space-between"
          >
            <el-form-item
              label="会员充值："
            >
              <el-select v-model="chargeState" size="small"
                style="width:130px"
              >
                <el-option label="启用" :value="1">启用</el-option>
                <el-option label="禁用" :value="0">禁用</el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="会员取款："
            >
              <el-select v-model="withdrawState" size="small"
                style="width:130px"
              >
                <el-option label="启用" :value="1">启用</el-option>
                <el-option label="禁用" :value="0">禁用</el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="会员下注："
            >
              <el-select v-model="betState" size="small"
                style="width:130px"
              >
                <el-option label="启用" :value="1">启用</el-option>
                <el-option label="禁用" :value="0">禁用</el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row
            type="flex"
            justify="space-between"
          >
            <el-form-item
              label="账户余额："
            >
              <el-select v-model="balanceState" size="small"
                style="width:130px"
              >
                <el-option label="启用" :value="1">启用</el-option>
                <el-option label="禁用" :value="0">禁用</el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label=""
              label-width="220px"
            >
            </el-form-item>
            <el-form-item
              label=""
              label-width="220px"
            >
            </el-form-item>
          </el-row>
        </el-form>
      </el-card> -->
      <el-card style='margin-top:10px;' body-style="padding:20px 20px 0 20px">
        <div slot="header" class="clearfix">
          <span>会员游戏信息</span>
        </div>
        <el-table
          stripe
          fit
          border
          :data="userGameListData"
          :cell-style="{textAlign:'center'}"
          :header-cell-style="{textAlign:'center'}"
          style="width: 100%">
          <el-table-column
            prop="gameName"
            label="游戏"
          >
          </el-table-column>
          <el-table-column
            prop="gameNum"
            label="游戏次数"
          >
          </el-table-column>
          <el-table-column
            prop="money"
            label="输赢"
          >
            <template slot-scope="scope">
              <div slot="reference" :style="scope.row.money*1<0?'color: #5adbc9':'color:red '" >
                {{scope.row.money | _moneyFormatterMax}}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="lastGameDate"
            label="最后游戏时间"
          >
          </el-table-column>
          <el-table-column
            label="操作"
          >
            <template slot-scope="{row}">
              <el-button size="mini"
                v-if="row.gameName !== '总计'"
                @click="checkBetRecord(row)"
              >查询</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row
          type="flex"
          justify="center"
        >
          <el-pagination
            @size-change='gamelistsizechange'
            @current-change='gamelistcrtchange'
            :current-page="userGameListOffset"
            :page-sizes="[10,20,50,100,200]"
            :page-size="userGameListLimit"
            :total="userGameListTotal"
            layout="total,sizes,prev,pager,next,jumper"
          ></el-pagination>
        </el-row>
      </el-card>
      <el-card style='margin-top:10px;' body-style="padding:20px 20px 0 20px">
        <div slot="header" class="clearfix">
          <span>会员活动信息</span>
        </div>
        <el-table
          stripe
          fit
          border
          :data="userOperListData"
          :cell-style="{textAlign:'center'}"
          :header-cell-style="{textAlign:'center'}"
          style="width: 100%">
          <el-table-column
            prop="operDate"
            label="时间"
            width="200px"
          >
          </el-table-column>
          <el-table-column
            prop="ip"
            label="IP"
          >
          </el-table-column>
          <el-table-column
            prop="address"
            label="地址"
          >
          </el-table-column>
          <el-table-column
            prop="operation"
            label="行为"
          >
          </el-table-column>
          <el-table-column
            prop="deviceName"
            label="设备"
          >
          </el-table-column>
        </el-table>
        <el-row
          type="flex"
          justify="center"
        >
          <el-pagination
            @size-change='operlistsizechange'
            @current-change='operlistcrtchange'
            :current-page="userOperListOffset"
            :page-sizes="[10,20,50,100,200]"
            :page-size="userOperListLimit"
            :total="userOperListTotal"
            layout="total,sizes,prev,pager,next,jumper"
          ></el-pagination>
        </el-row>
      </el-card>
      <el-row type="flex" justify="space-around" style='margin-top:20px;'>
        <el-col :span='2'>
          <el-button
            @click="backBtnHandle"
          >返回</el-button>
        </el-col>
        <el-col :span='2'>
          <el-button
            :loading="saveLoading"
            @click="mNumberInfo"
            :disabled="!canEdit"
          >保存</el-button>
        </el-col>
      </el-row>
    </div>

    <el-dialog
      title="注意"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <span>您已经修改了会员信息但是并未保存。</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogBtnHandle('confirm')">不保存信息</el-button>
        <el-button type="primary" @click="dialogBtnHandle('cancle')">返回保存信息</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import memberRequest from '@/request/member'
import vali from '@/tool/validate'

export default {
  name:'MemberDetail',
  created () {
    //根据store状态进行权限判断
    let permissionState = this.$store.getters.permissionState;  //全部'状态'权限
    if(permissionState.indexOf('"MemberListDetailEdit"') != -1){
      console.log('拥有编辑权限')
      this.canEdit = true;
    }else{
      console.log('没有编辑权限')
      this.canEdit = false;
    }
    if(permissionState.indexOf('"MemberListDetailPerm"') != -1){
      console.log('拥有调整会员权限权限')
      this.canAdjust = true;
    }else{
      console.log('没有调整会员权限权限')
      this.canAdjust = false;
    }
    this.getUserDetail();
    this.getLevelList();
    this.querySiteUserLabels();
    this.getUserGameList();
    this.getUserOperList();
  },
  data () {
     var  validateBankAccount = (rule, value, callback) => { //验证银行卡号
        if(!value){
          this.bankAccountValide = true;
          callback();
          return
        }
        let reg = new RegExp(/^[0-9]{16,19}$/);//10-20
        if(reg.test(value)){
          callback();
          this.bankAccounts(value)
        }else{
            callback(new Error('请输入16~19位银行卡号'))
        }
    };
      var validateParentAccount = (rule, value, callback) => { //会员详情验证上级 任务954
           if (!value) {
              callback();
              return
          }else if(value==this.usrInfo.account){//不能是自己
              callback(new Error('上级不能填自己'));
              return
          }else{
             // let reg = new RegExp(/[a-z]{1,13}[0-9]{1,13}/) //字母开头
              let reg = new RegExp(/^([a-z]|[A-Z]|[0-9]){6,14}$/);
              if(reg.test(value)&&value.length>5&&value.length<15) {
                  if (!this.isSubmitted) {
                      memberRequest.checkParentAccount({parentAccount: value}).then(res => {
                              if (res.code != '200') {
                                  this.tingzhu = "";//清空
                                  callback(new Error(res.msg))
                                  return 
                              }
                              if (res.data == null) {
                                  this.tingzhu = "";//清空
                              }
                              if (res.data.accountType != 1) {
                                  this.tingzhu = "";//清空
                              }
                              if (res.data.accountType == 1) {
                                  this.tingzhu = "(厅主)";
                              }
                              // this.parentAccountId = res.data.accountId ? res.data.accountId : null;
                            
                              return callback();
                          }
                      )
                  }else{
                    return callback();
                  }
              }else {
                  return callback(new Error('请输入6-14位的字母和数字'));
              }
          }
      };
    return {
      IsrealNameAuth:true,//默认禁用
      canEdit:false, //当前登录账号是否有会员详情编辑权限
      canAdjust:false, //当前登录账号是否有调整会员权限权限

      loading:false, //整个详情load状态

      tingzhu:"",//用于当修改上级时，接收输入厅主时后台返回当accoun tType==1时 为厅主
      parentAccountId:null,//此处用于保存时 接收acc/checkSiteAccount 接口返回的 accountId
      isSubmitted:false,//判断是否调用过checkSiteAccount失焦事件
      userParentAccout:null,//保存第一次页面加载的上级值
      usrInfo:{labelId:0,realNameAuth:0},   //基础信息+账户信息 会员标签默认无 实名认证默认无

      leveloptions:[], //等级选项
      labelList:[], //标签选项

      chargeState:1, //会员充值
      withdrawState:1, //会员取款
      betState:1, //会员下注
      balanceState:1, //会员账户余额

      //游戏信息
      userGameListData : [],
      userGameListLimit : 10,
      userGameListOffset : 1,
      userGameListTotal : 0,

      //活动信息
      userOperListData : [],
      userOperListLimit : 10,
      userOperListOffset : 1,
      userOperListTotal : 0,
      

      rules:{  //表单验证器
        parentAccount :[{validator:validateParentAccount,trigger: 'blur'}],
        realName:[
          {validator: vali.validateName, trigger: 'blur' }
        ],
        email:[
          {validator: vali.validateEmail, trigger: 'blur' }
        ],
        phone:[
          {validator: vali.validatePhone, trigger: 'blur' }
        ],
        weixin:[
          {validator: vali.validateWechat, trigger: 'blur' }
        ],
        qq:[
          {validator: vali.validateQq, trigger: 'blur' }
        ],
        password:[
          {validator: vali.validatePassword, trigger: 'blur' }
        ],
        safePassword:[
          {validator: vali.validatePassword, trigger: 'blur' }
        ],
        aliAccountId:[
          {validator: vali.validateAlipay, trigger: 'blur' }
        ],
        bankAccount:[
          {validator:validateBankAccount, trigger: 'blur' }
        ],
        bankName:[
          {validator: vali.validateBankName, trigger: 'blur' }
        ],
      },

      dialogVisible:false, //对话框可见状态

      // isModify:false, //页面状态 false未修改  true已修改.
      // promiseFlag:'', //异步标记
       //hasFirstChange:false, //后台获取数据后监听页面数据状态是否修改

      pwReadonly:true, //密码默认只读，点击重置密码按钮可以修改
      sfpwReadonly:true, //密码默认只读，点击重置密码按钮可以修改
      saveLoading:false, //保存按钮的加载状态

      bankAccountValide:true, //银行卡号是否唯一  不唯一则无法保存
    }
  },
  computed: {   //需要翻译的字段
    password: {
      get: function () {
        let str = '';
        if(this.usrInfo.password){
          str = this.usrInfo.password
        }else{
          str = '无'
        }
        return str
      },
      set: function (value) {
        return this.usrInfo.password = value;
      }
    },
    safePassword: {
      get: function () {
        let str = '';
        if(this.usrInfo.safePassword){
          str = this.usrInfo.safePassword
        }else{
          str = '无'
        }
        return str
      },
      set: function (value) {
        return this.usrInfo.safePassword = value;
      }
    },
    state:{
      get:function () {
        let stateCN = '';
        switch(this.usrInfo.state+''){
          case '1':
            stateCN = '启用';
            break;
          case '2':
            stateCN = '禁用';
            break;
        }
        return stateCN;
      },
      set:function (value) {
        return this.usrInfo.state = value;
      }
    },
    realNameAuth:{
        get:function () {
            let stateCN = '';
            switch(this.usrInfo.realNameAuth+''){
                case '0':
                    stateCN = '未认证';
                    this.IsrealNameAuth=true;
                    break;
                case '1':
                    stateCN = '已通过';
                    this.IsrealNameAuth=true;
                    break;
                case '2':
                    stateCN = '未通过';
                    this.IsrealNameAuth=true;
                    if(this.usrInfo.phone!=null&&this.usrInfo.phone!=""&&this.usrInfo.realName!=null&&this.usrInfo.realName!="") {
                        this.IsrealNameAuth = false;//当玩家是“未通过”状态下，玩家账号绑定“手机号码、真实姓名”，厅主可以将“未通过”状态，通过下拉框改为“已通过”状态
                    }
                    break;
            }
            return stateCN;
        },
        set:function (value) {
            return this.usrInfo.realNameAuth = value;
        }
      },
    computedSafeMoney:{
      get:function () {
        return this.usrInfo.safeMoney?this.usrInfo.safeMoney.toFixed(2):'0.00'
      },
      set:function (val) {
        this.usrInfo.safeMoney = val;
      }
    },
    rebateMoneyComputed:{ //返水金额需要除以1000     bug10436
      get:function () {
        let val = this.usrInfo.rebateMoney;
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
    }
  },
    filters: {
        _moneyFormatterMax(val) {//当需要返回加减号 需要除以1000 需要截取保留2位小数
            if (!val) return "0.00";
            if(val==0)return "0.00";
            let str = String(val / 1000);
            let idx = str.indexOf('.') + 3;
            if (str.indexOf('.') > -1) {
                if (str.length > 4) {
                    str = str.slice(0, idx);
                }
            }
            str = str.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return str.includes("-") ? str : str != "0.00" ? "+" + str : str;
        },
    },
  methods: {
      // _todayIntegral(val){//当不需要返回加减号 需要除以1000 需要截取保留2位小数
      //     if (!val) return "0";
      //     let str = String(val/1000);
      //     let idx = str.indexOf('.') + 3;
      //     if(str.indexOf('.') > -1){
      //         if(str.length>4){
      //             str = str.slice(0,idx);
      //         }
      //     }
      //     return str;
      // },
      _moneyFormatter(val){//当不需要返回加减号 不需要除以1000 需要截取保留2位小数
          if (!val) return "0.00";
          let str = String(val);
          let idx = str.indexOf('.') + 3;
          if(str.indexOf('.') > -1){
              if(str.length>4){
                  str = str.slice(0,idx);
              }
          }
          return str;
      },
    canEditrealNameAuth(){
        if(this.usrInfo.phone!=null&&this.usrInfo.phone!=""&&this.usrInfo.realName!=null&&this.usrInfo.realName!=""&&this.usrInfo.realNameAuth==2) {//2是未通过
            this.IsrealNameAuth = false;//当玩家是“未通过”状态下，玩家账号绑定“手机号码、真实姓名”，厅主可以将“未通过”状态，通过下拉框改为“已通过”状态
        }else if(this.usrInfo.bankAccount!=null&&this.usrInfo.bankAccount!=""&&this.usrInfo.realName!=null&&this.usrInfo.realName!=""&&this.usrInfo.realNameAuth==2) {//2是未通过
            this.IsrealNameAuth = false;//当玩家是“未通过”状态下，玩家账号绑定“银行卡号、真实姓名”，厅主可以将“未通过”状态，通过下拉框改为“已通过”状态
        }
        else{
            this.IsrealNameAuth = true;
        }
      },
    getUserDetail () { //获取会员信息
      this.loading = true;
      memberRequest.getUserDetail({account:this.$route.params.account}).then( res => {
        if(res.code == '200'){
            if(res.data) {
                this.usrInfo = res.data;
                this.usrInfo.money = this._moneyFormatter(this.usrInfo.money);
                this.usrInfo.score = this.$route.params.score; //今日可以幸运积分
                this.usrInfo.todayIntegral = this.$route.params.todayIntegral;  //明日可用幸运积分
                this.chargeState = res.data.accountRecharge;
                this.withdrawState = res.data.accountWithdrawal;
                this.betState = res.data.accountBet;
                this.balanceState = res.data.accountBalance;

               /* if(this.usrInfo.phone!=null&&this.usrInfo.phone!=""&&this.usrInfo.realName!=null&&this.usrInfo.realName!=""&&this.usrInfo.realNameAuth==2) {
                    this.IsrealNameAuth = false;//当玩家是“未通过”状态下，玩家账号绑定“手机号码、真实姓名”，厅主可以将“未通过”状态，通过下拉框改为“已通过”状态
                }*/
                if(((this.usrInfo.bankAccount!=null&&this.usrInfo.bankAccount!="")||(this.usrInfo.phone!=null&&this.usrInfo.phone!=""))&&this.usrInfo.realName!=null&&this.usrInfo.realName!=""&&this.usrInfo.realNameAuth==2) {
                    this.IsrealNameAuth = false;//当玩家是“未通过”状态下 ,会员真实姓名+银行卡号 或者 真是姓名+手机号 状态变成可编辑
                }
                if (res.data.siteId!=null&&res.data.parentAccountId!=null&&res.data.siteId == res.data.parentAccountId) {
                    this.tingzhu = "(厅主)"
                }
                this.userParentAccout = res.data&&res.data.parentAccount? res.data.parentAccount:null;
            }
        }else{
          this.$notify({
            type:'warning',
            title:res.msg
          })
        }
        this.loading = false;
      }).catch(err => {
        console.log(err)
      })
    },
    getLevelList () {  //获取等级列表
      memberRequest.getLevelList().then( res => {
        if(res.code == '200'){
          this.leveloptions = res.data;
        }else{
          this.$notify({
            type:'warning',
            title:res.msg
          })
        }
      }).catch( err => {
        console.log(err)
      })
    },
    getUserGameList(){  //会员游戏信息
      let data = {
        conditionsMap:{
          account:this.$route.params.account
        },
        limit:this.userGameListLimit,
        offset:(this.userGameListOffset -1) * this.userGameListLimit,
        sort:'lastGameDate',
        sortOrder:'desc'
      }
      memberRequest.getUserGameList(data).then(res => {
        this.userGameListData = res.rows;
        this.userGameListLimit = res.limit;
        this.userGameListOffset = res.offset/res.limit +1;
        this.userGameListTotal = res.total;
      }).catch( err => {
        console.log(err)
      })
    },
    getUserOperList(){ //会员活动信息
      let data = {
        conditionsMap:{
          userName:this.$route.params.account,
          eventEnd:'',
          eventStart:'',
          origin:'',
          eventEnd:'',
        },
        limit:this.userOperListLimit,
        offset:(this.userOperListOffset -1) * this.userOperListLimit,
        sort:'operDate',
        sortOrder:'desc'
      }
      memberRequest.getUserOperList(data).then(res => {
        this.userOperListData = res.rows;
        this.userOperListLimit = res.limit;
        this.userOperListOffset = res.offset/res.limit +1;
        this.userOperListTotal = res.total;
      }).catch( err => {
        console.log(err)
      })
    },
    mNumberInfo(){  //点击保存按钮更新会员详情
        //弹出确认框 954
        this.$confirm('您确定要保存已经编辑的会员信息吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.saveLoading = true;
            //银行卡唯一性验证
            if (!this.bankAccountValide) {
                this.$message({
                    type: 'warning',
                    message: '该银行卡号已被其他账号绑定'
                })
                this.saveLoading = false;
                return
            }
            if(this.IsrealNameAuth==false&&((this.usrInfo.phone!=null&&this.usrInfo.phone!="")||(this.usrInfo.bankAccount!=null&&this.usrInfo.bankAccount!=""))&&this.usrInfo.realName!=null&&this.usrInfo.realName!=""&&this.usrInfo.realNameAuth!=1) {//1为已通过
                this.$message.warning({message: '玩家账号已绑定(手机号码+真实姓名或银行卡号+真实姓名)且实名认证状态为未通过时，此时只能改成已通过状态,请重新选择'})
                this.saveLoading = false;
                return
            }
            if(this.usrInfo.realNameAuth==1){
                if((this.usrInfo.phone==null || this.usrInfo.phone=="")&&(this.usrInfo.bankAccount==null||this.usrInfo.bankAccount=="")||this.usrInfo.realName==null || this.usrInfo.realName=="")
                {
                    console.log(this.usrInfo.phone)
                    this.$message.warning({message: '实名认证为已通过,必须填写(手机号码+真实姓名或银行卡号+真实姓名),请填写后保存'})
                    this.saveLoading = false;
                    return
                }
            }
            // if(this.usrInfo.parentAccount==this.usrInfo.account){
            //     this.$message.warning({message: '上级不能填写自己'})   
            //     return  
            // }
            /*if(this.IsrealNameAuth==false&&this.usrInfo.realNameAuth==1&&!(this.usrInfo.phone!=null&&this.usrInfo.phone!=""&&this.usrInfo.realName!=null&&this.usrInfo.realName!=""))
            {
                this.$message.warning({message: '实名认证为已通过的情况,必须绑定手机号和真实姓名,请填写后保存'})
                this.saveLoading = false;
                return
            }*//*注释原因：上面已经有this.usrInfo.realNameAuth==1的判断逻辑，不管选择框是否可编辑都需要 判断 姓名+手机号或者姓名+银行卡*/

            /*if(this.IsrealNameAuth==false&&this.usrInfo.realNameAuth!=1){
                this.$message.warning({message: '实名认证只能从未通过状态改成已通过且必须绑定手机号和真实姓名,请重新选择或填写后保存'})
                this.saveLoading = false;
                return
            }*/
            //表单验证
            this.isSubmitted = true;
            let p1 = this.$refs.form1.validate();
            let p2 = this.$refs.form2.validate();

            Promise.all([p1, p2]).then(res => {
                this.isSubmitted = false;
                let data = {
                    // parentAccountId: this.parentAccountId,  //上级
                    parentAccount:this.usrInfo.parentAccount,
                    account: this.$route.params.account,
                    remark: this.usrInfo.remark ? this.usrInfo.remark.trim() : '',
                    aliAccountId: this.usrInfo.aliAccountId ? this.usrInfo.aliAccountId.trim() : '',
                    bankAccount: this.usrInfo.bankAccount ? this.usrInfo.bankAccount.trim() : '',
                    bankName: this.usrInfo.bankName ? this.usrInfo.bankName.trim() : '',
                    email: this.usrInfo.email ? this.usrInfo.email.trim() : '',
                    levelId: this.usrInfo.levelId,
                    labelId: this.usrInfo.labelId,
                    password: this.usrInfo.password ? this.usrInfo.password.trim() : '',
                    safePassword: this.usrInfo.safePassword ? this.usrInfo.safePassword.trim() : '',
                    phone: this.usrInfo.phone ? this.usrInfo.phone.trim() : '',
                    qq: this.usrInfo.qq ? this.usrInfo.qq.trim() : '',
                    realName: this.usrInfo.realName ? this.usrInfo.realName.trim() : '',
                    state: this.usrInfo.state,
                    weixin: this.usrInfo.weixin ? this.usrInfo.weixin.trim() : '',
                    realNameAuth:this.usrInfo.realNameAuth,
                }
                if (this.canAdjust) { //当前账号有权限
                    data.accountRecharge = this.chargeState;
                    data.accountWithdrawal = this.withdrawState;
                    data.accountBet = this.betState;
                    data.accountBalance = this.balanceState;
                }
                memberRequest.mNumberInfo(data).then(res => {
                    if (res.code == '200') {
                        this.$notify({
                            type: 'success',
                            title: res.msg
                        })
                        this.getUserDetail();
                    } else {
                        this.$notify({
                            type: 'warning',
                            title: res.msg
                        })
                        //如果修改的上级他的所有直线上级中是有当前会员的话。则保存失败并且提示“此上级账户无法修改，请重新填写”并且上级修改为原本上级
                        this.usrInfo.parentAccount = this.userParentAccout;
                    }
                    // this.isModify = false;
                    this.saveLoading = false;
                }).catch(err => {
                    console.log(err)
                    this.saveLoading = false;
                })
            }).catch(err => {
                this.$notify({
                    type: 'error',
                    title: '验证不通过，请检查错误提示',
                })
                this.saveLoading = false
            })
        })
    },
    backBtnHandle(){  //点击返回
      this.$store.dispatch('navGoBack',{
        name:'会员详情',
      });
    },
    pwRestBtnhandle(){  //点击重置密码
      this.pwReadonly = false;
      this.$refs.pwinput.focus();
    },
    sfpwRestBtnhandle(){  //点击重置密码
      this.sfpwReadonly = false;
      this.$refs.sfpwinput.focus();
    },
    dialogBtnHandle(state){   //点击对话框按钮
      this.dialogVisible = false;
      if(state === 'confirm'){
        this.promiseFlag.resolve()
      }else{
        this.promiseFlag.reject()
      }
    },
    checkBetRecord(row){
      //时间  游戏名称     会员账号
      let data = {
        time:row.lastGameDate,
        game:row.gameId,
        account:this.$route.params.account
      }
      this.$store.dispatch('setBetParams',data);
      this.$router.push({
        name:'投注记录',
      })
    },
    gamelistsizechange(sz){   //会员游戏信息表格-条数修改
      this.userGameListLimit = sz;
      this.getUserGameList();
    },
    gamelistcrtchange(crt) {  //会员游戏信息表格-页数跳转
      this.userGameListOffset = crt;
      this.getUserGameList();
    },
    operlistsizechange(sz){   //会员活动信息表格-条数修改
      this.userOperListLimit = sz,
      this.getUserOperList();
    },
    operlistcrtchange(crt) {  //会员活动信息表格-页数跳转
      this.userOperListOffset = crt,
      this.getUserOperList();
    },
    querySiteUserLabels(){
      memberRequest.querySiteUserLabels().then(res => {
        this.labelList = res;
        let result = {labelName:"无",id:0};//因为
        this.labelList.unshift(result);
        //console.log(this.labelList);
      }).catch(err => {
        console.log(err)
      })
    },
    bankAccounts(val){
      if(val){
         memberRequest.searchBankAccount({bankAccount: val,playId:this.usrInfo.playId}).then(
                (res) => {
                    if (res.code != '200') {
                        this.$message({
                            type: 'warning',
                            message: res.msg
                        })
                        this.bankAccountValide = false;
                    } else {
                        this.bankAccountValide = true;
                    }
                }
            )
      }      
    },
    clearbankAccount(){   
         this.bankAccountValide = true;
    }
  },
  beforeRouteLeave (to, from , next) { 
    this.$store.dispatch('closeItem',{name:'会员详情'}) //离开页面  关闭页面
    next();
  }
}
</script>

<style lang="scss">
</style>
