<template>
  <el-card body-style="padding:0 10px">
    <el-row
      type="flex"
      justify="end"
      align="middle"
      style="height:76px;line-height:76px;border-bottom:1px solid #ddd;margin-bottom:40px;"
    >
      <el-button type="primary" size="medium" @click="depositBtnHandle">人工存款记录</el-button>
      <el-button type="primary" size="medium" @click="withdrawalBtnHandle">人工提款记录</el-button>
    </el-row>
    <div class="bodycontainer">
      <el-form
        label-width="90px"
        :model="ManualOperateForm"
        status-icon
        ref="ManualOperateForm"
        :rules="rules"
      >
        <el-form-item label="账号：">
          <el-input placeholder="请输入会员账号" v-model="memberAccount">
            <el-button slot="append" icon="el-icon-search"
            @click="findAccountBtnClick('account')"
            :loading="findAccountBtnLoading"
            >查找</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="会员ID：">
          <el-input type="number" placeholder="请输入会员id" v-model.number="playId">
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="findAccountBtnClick('id')"
              :loading="findAccountBtnLoading"
            >查找</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="">
          <el-form :model="memberInfo" v-if="memberInfo.account" label-width="90px">
            <el-card>
              <div slot="header">确认存款/提款的会员信息</div>
              <el-row type="flex" justify="space-between">
                <el-form-item label="会员账号">
                  <el-input readonly v-model="memberInfo.account"></el-input>
                </el-form-item>
                <el-form-item label="账号余额">
                  <el-input readonly v-model="memberInfo.money"></el-input>
                </el-form-item>
              </el-row>
              <el-row type="flex" justify="space-between">
                <el-form-item label="会员等级">
                  <el-input readonly v-model="memberInfo.levelName"></el-input>
                </el-form-item>
                <el-form-item label="注册时间">
                  <el-input readonly v-model="memberInfo.createDate"></el-input>
                </el-form-item>
              </el-row>
            </el-card>
          </el-form>
        </el-form-item>
        <template v-if="memberInfo.account">
          <el-form-item prop="money" label="金额："
            v-if="ManualOperateForm.type != 1"
          >
            <el-input 
              placeholder="请输入金额" clearable type="number" v-model="ManualOperateForm.money"
            ></el-input>
          </el-form-item>
          <template
            v-else
          >
            <el-row
              type="flex" justify="space-between"
            >
              <el-form-item prop="money" label="存款金额：">
                <el-input 
                  placeholder="请输入金额" clearable  v-model="ManualOperateForm.money"
                ></el-input>
              </el-form-item>
              <el-form-item label="" label-width="20px">
                <el-radio-group v-model="orderCheck">
                  <el-radio :label="1">稽核</el-radio>
                  <el-radio :label="0">不稽核</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="" label-width="10px">
                <el-input readonly v-model="codeSize">
                  <template slot="prepend">打码量：</template>
                </el-input>
              </el-form-item>
            </el-row>
            <el-row
              type="flex" justify="space-between"
            >
              <el-form-item prop="freeMoney" label="优惠存款(彩金)：" style="width:300px;">
                <el-input placeholder="请输入金额" clearable v-model="ManualOperateForm.freeMoney"></el-input>
              </el-form-item>
              <el-form-item label="" label-width="20px">
                <el-radio-group v-model="freeCheck">
                  <el-radio :label="1">稽核</el-radio>
                  <el-radio :label="0">不稽核</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="" label-width="10px" :error="freeMulityWarningMsg">
                <el-input type="number" v-model.number="freeMulity" clearable>
                  <template slot="prepend">打码倍数：</template>
                </el-input>
              </el-form-item>
              <el-form-item label="" label-width="10px">
                <el-input readonly v-model="freeCodeSize">
                  <template slot="prepend">打码量：</template>
                </el-input>
              </el-form-item>
            </el-row>
          </template>
          <el-form-item label="类型：">
            <el-radio-group v-model="ManualOperateForm.type">
              <el-radio :label="1">人工存款</el-radio>
              <!-- <el-radio :label="2">优惠活动</el-radio> -->
              <el-radio :label="3">人工提款</el-radio>
              <el-radio :label="4">误存提款</el-radio>
              <el-radio :label="5">行政提款</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="remark" label="备注：">
            <el-input placeholder="请输入备注" type="textarea" v-model="ManualOperateForm.remark"></el-input>
          </el-form-item>
          <el-form-item>
            <el-row type="flex" justify="space-around">
              <el-button @click="cancleBtnClick">取 消</el-button>
              <el-button @click="submitBtnClick" type="primary" :loading="submitBtnLoading">提 交</el-button>
            </el-row>
          </el-form-item>
        </template>
      </el-form>
    </div>
  </el-card>
</template>

<script>
import financeRequest from "@/request/finance";
import manuloperatevalidator from "@/tool/validate";

export default {
  name: "ManualOperate",
  data() {
    const moneyRule = (r,v,c) => {  //存款金额验证
      let reg = new RegExp(/^(([0-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/);
      if(!v){
        c();
      }else if(!reg.test(v)){
        c(new Error('金额应该大于等于0且最多包含两位小数'));//('金额应该大于0且最多包含两位小数'));
      }else{
        c()
      }
    };
    return {
      memberAccount: "", //账号
      playId: null, //会员id

      memberInfo: {
        account: "",
        money: ""
      },

      ManualOperateForm: {
        money: '', //存提金额
        freeMoney:'', //优惠金额
        type: 1, //存提类型
        remark: "" //存提备注
      },
      orderCheck:1, //充值稽核开关
      freeCheck:1, //优惠稽核开关 1开 0关
      freeMulity:0, //优惠稽核倍数
      codeSize:0, //充值打码量
      freeCodeSize:0, //优惠打码量
      freeMulityWarningMsg:'', //优惠稽核倍数错误提示信息

      findAccountBtnLoading: false,
      submitBtnLoading: false,

      rules: {
        money: [
          {
            validator: moneyRule,
            trigger: "change"
          }
        ],
        freeMoney: [
          {
            validator: moneyRule,
            trigger: "change"
          }
        ],
        remark: [
          {
            validator: manuloperatevalidator.manualoperateremark,
            trigger: "blur"
          }
        ]
      },
      freeMoneyRule: [
        { validator: moneyRule, trigger: "blur"}
      ],
    };
  },
  watch:{
    'ManualOperateForm.money':function(newval){  //存款金额变动获取打码量
      if(!newval){return}
      if(newval < 0){return}
      let data = `?levelId=${this.memberInfo.levelId}&amount=${newval}`
      financeRequest.countCodeSize(data).then((res) => {
        if(res.code == 200){
          this.codeSize = parseFloat(res.data).toFixed(2);
        }else{
          // this.$notify.warning({title:res.msg})
        }
      })
    },
    'ManualOperateForm.freeMoney':function(newval){  //优惠金额变动更新优惠打码量
        let val_=this.freeMulity;
        if(val_.toString().length>4){
            this.$message.warning({message:"打码倍数不能超过4位数!"});
            return;
        }
        if(this.freeMulity<0){
            this.$message.warning({message:"打码倍数不能为负数!"});
            return;
        }
      if(!newval || (this.freeMulity!=0&&!this.freeMulity) ){
        return
      }
      let data = `?levelId=${this.memberInfo.levelId}&amount=${this.ManualOperateForm.money || 0}&freeMoney=${newval}&freeMulity=${this.freeMulity || 0}`
      financeRequest.countFreeCodeSize(data).then((res) => {
        if(res.code == 200){
          this.freeCodeSize = parseFloat(res.data).toFixed(2);
        }else{
          // this.$notify.warning({title:res.msg})
        }
      })
    },
      freeCheck:function (newval) {
          if(newval==0){
              this.freeMulity=0;
          }
      },
    freeMulity:function(newval){ //优惠存款倍数变动更新优惠打码量
        console.log(newval)
        let val_=newval;
        if(val_.toString().length>4){
            this.$message.warning({message:"打码倍数不能超过4位数!"});
            return;
        }
        if(newval<0){
            this.$message.warning({message:"打码倍数不能为负数!"});
            return;
        }
      if((newval!=0&&!newval) || !this.ManualOperateForm.freeMoney ){
        return
      }
      console.log(newval.length)

      let data = `?levelId=${this.memberInfo.levelId}&amount=${this.ManualOperateForm.money || 0}&freeMoney=${this.ManualOperateForm.freeMoney || 0}&freeMulity=${newval}`
      financeRequest.countFreeCodeSize(data).then((res) => {
        if(res.code == 200){
          this.freeCodeSize = parseFloat(res.data).toFixed(2);
        }else{
          // this.$notify.warning({title:res.msg})
        }
      })
    }
  },
  methods: {
    depositBtnHandle() {
      //点击人工存款记录按钮
      this.$router.push({
        name: "人工存款记录"
      });
    },
    withdrawalBtnHandle() {
      //点击人工提款记录按钮
      this.$router.push({
        name: "人工提款记录"
      });
    },
    findAccountBtnClick(type) {
      //查找账号
      if (type === 'account'&&!this.memberAccount) {
        this.$message({
          type: "warning",
          message: "请输入账号"
        });
        return;
      }
      if (type === 'id'&&!this.playId) {
        this.$message({
          type: "warning",
          message: "请输入会员id"
        });
        return;
      }

      let data;  
      if(type === 'account'){  //根据账号查找
        data = {
          userAccount:this.memberAccount.trim()
        };
      }
      if(type === 'id'){  //根据id查找
        data = {
          playId:this.playId || null
        };
      }
      this.findAccountBtnLoading = true;
      financeRequest
        .findUser(data)
        .then(res => {
          if (res.code == "200") {
            this.memberInfo = Object.assign({}, res.data);
            console.log(res.data);
            //获取优惠稽核倍数
            let data = `?levelId=${this.memberInfo.levelId}`
            financeRequest.getCheckMultip(data).then((res) => {
              if(res.code == 200){
                  console.log(res.data);
                this.freeMulity = res.data;
              }else{
                this.$notify.warning({title:res.msg})
              }
            })
          } else {
            this.$notify({
              type: "warning",
              title: res.msg
            });
          }
          this.findAccountBtnLoading = false;
        })
        .catch(err => {
          console.log(err);
          this.findAccountBtnLoading = false;
        });
    },

    cancleBtnClick() {
      //点击取消按钮
      this.$refs.ManualOperateForm.resetFields();
    },

    submitBtnClick() {
      //点击提交按钮
      if(this.freeCheck >0 && this.freeMoney >0){
        if(!this.freeMulity > 0){
          this.freeMulityWarningMsg = '已选择稽核优惠存款，请输入打码倍数'
          return
        }else{
          this.freeMulityWarningMsg = ''
        }
      }
      console.log(typeof  this.ManualOperateForm.money)
        console.log(typeof  this.ManualOperateForm.freeMoney)
      if((this.ManualOperateForm.money==null||this.ManualOperateForm.money=="")&&(this.ManualOperateForm.freeMoney==null||this.ManualOperateForm.freeMoney=="")){
        this.$message.warning('存款金额和优惠金额必须填写一项')
        return
      }
        if((this.ManualOperateForm.money <= 0)&&(this.ManualOperateForm.freeMoney<=0)){
            this.$message.warning('存款金额和优惠金额必须有一项大于0')
            return
        }
        if(this.freeMulity.toString().length>4){
            this.$message.warning({message:"打码倍数不能超过4位数!"});
            return;
        }
        if(this.freeMulity<0){
            this.$message.warning({message:"打码倍数不能为负数!"});
            return;
        }
      this.submitBtnLoading = true;
      this.$refs.ManualOperateForm.validate()
        .then(res => {
          if (this.memberInfo.account) {
            this.$confirm("请确认是否继续提交,提交将直接生效", "注意", {
              confirmButtonText: "确认",
              cancleButtonText: "取消",
              type: "info"
            }).then(
              () => {
                let data = {
                  levelName: this.memberInfo.levelName,
                  levelId: this.memberInfo.levelId,
                  id: this.memberInfo.id,
                  userAcount: this.memberInfo.account,

                  amount: Number(this.ManualOperateForm.money) || 0,
                  remark: this.ManualOperateForm.remark,
                  type: this.ManualOperateForm.type,
                };
                if(this.ManualOperateForm.type == 1){ //稽核相关参数
                  data.orderCheck = this.orderCheck;
                  data.freeCheck = this.freeCheck;
                  data.freeMulity = this.freeMulity || 0;
                  data.freeMoney = Number(this.ManualOperateForm.freeMoney) || 0;
                }
                financeRequest
                  .add(data)
                  .then(res => {
                    if (res.code == 200) {
                      this.$notify({
                        type: "success",
                        title: res.msg
                      });
                    } else {
                      this.$notify({
                        type: "warning",
                        title: res.msg
                      });
                    }
                    this.memberAccount = "";
                    this.memberInfo.account = "";
                    this.memberInfo.money = "";
                    this.$refs.ManualOperateForm.resetFields();
                    this.submitBtnLoading = false;
                  })
                  .catch(err => {
                    console.log(err);
                    this.submitBtnLoading = false;
                  });
              },
              rej => {
                this.submitBtnLoading = false;
              }
            );
          } else {
            this.$notify({
              type: "warning",
              title: "请查找需要操作的会员账号"
            });
            this.submitBtnLoading = false;
          }
        })
        .catch(err => {
          this.$notify({
            type: "warning",
            title: "校验不通过，请检查页面错误提示"
          });
          this.submitBtnLoading = false;
        });
    }
  }
};
</script>

<style lang="scss">
.bodycontainer {
  width:880px;
  margin: auto;
  .el-card__header {
    padding: 5px 20px;
  }
}
</style>

<style>
.el-radio-group {
  height: 40px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-flow: row warp;
}
</style>


