<template>
  <div
    style="width:100%;margin:auto;"
  >
    <el-form
      :model="formData"
      ref='formData'
      label-width="100px"
      :rules="rules"
      status-icon
    > 
      <!--此处6-18号需求 弹窗和银行卡认证都去掉
      <el-row>
            <el-form-item label="弹窗提示" >
                <el-radio-group v-model="formData.signLimit">
                    <el-radio :label="1">开启</el-radio>
                    <el-radio :label="2">不开启</el-radio>
                </el-radio-group>
            </el-form-item>
      </el-row>
      <el-row style="padding-left:30px; padding-bottom:30px;">
          <template>
            <el-checkbox v-model="formData.signCount">启动银行卡号认证</el-checkbox>
          </template>
      </el-row>-->
      <el-row type="flex" justify="start">
        <el-form-item prop="amount" label="金额" style="width:32%;margin-right:15px;">
          <el-input v-model="formData.amount" placeholder="请输入金额" maxlength="3" clearable></el-input>
        </el-form-item>
        <el-form-item label-width="0" style="width:180px;margin-right: 0;">
          <el-radio-group v-model="isCheck">
            <el-radio label="1">稽核</el-radio>
            <el-radio label="0">不稽核</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="checkMultip" label="打码倍数" style="width:32%;">
          <el-input v-model="formData.checkMultip" placeholder="打码倍数"  maxlength="3" clearable></el-input>
        </el-form-item>
        <el-form-item label="打码量" style="width:220px;">
          <el-input v-model="computedDamaliang"  readonly></el-input>
        </el-form-item>
      </el-row>
      <el-form-item  label="认证方式" style="width:380px;">
          <el-radio-group v-model="signCount">
            <el-radio label='1'>手机号认证</el-radio>
            <el-radio label='2'>银行卡号认证</el-radio>
          </el-radio-group>
        </el-form-item>
      <el-row type="flex" justify="start">

      </el-row>
      <el-form-item
        label="活动时间"
      >
        <el-radio-group v-model="formData.timetype">
          <el-radio label="永久"
          >永久</el-radio>
          <el-radio label="时间范围"
          >时间范围</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label=""
        v-if="formData.timetype == '时间范围'"
      >
        <el-date-picker 
          v-model="formData.daterange" 
          type="datetimerange" 
          value-format="timestamp"
          format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="选择开始日期"
          end-placeholder="选择结束日期"
          range-separator="~"
        ></el-date-picker>
      </el-form-item>
      <el-form-item
        label="活动状态"
      >
        <el-select v-model="formData.state" placeholder="请选择">
          <el-option label="启用" :value='1'></el-option>
          <el-option label="禁用" :value='0'></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-row
      type="flex"
      justify="center"
    > 
      <el-button type="primary" size="medium"
        @click='saveBtnClick'
        :loading="isloading"
      >保存</el-button>
    </el-row>
  </div>
</template>

<script>
import activityRequest from '@/request/activty'
import validator from '@/tool/validate'
export default {
  name:'shimrenzheng',
  props:[
    'isloading'
  ],
  data(){
    const moneyRule = (r,v,c) => {  //存款金额验证
      let reg = new RegExp(/^[0-9]+$/);
      if(!reg.test(v)){
        c(new Error('只能输入大于0的正整数'));
      }else if(parseInt(v) > 999){
          c(new Error("最大值不能超过999"));
      }else{
          c()
      }
    };
    return {
      formData:{
       // signLimit:1,
       // signCount:false,
        amount:58,//默认金额58
        timetype:'永久',
        checkMultip:1,//打码倍数
        daterange:null,
        state:0,//默认不开启
      },
      SaveTime:null,
      isCheck:'1', //是否稽核
      signCount:'1',
      rules:{
        amount:[
          {required:true,message:'请输入金额',trigger:'blur'},
          {validator:moneyRule,trigger:['blur','change']}
        ],
        checkMultip:[
          {validator:moneyRule,trigger:'change'}
        ],
      }
    }
  },
  computed:{
    computedDamaliang:{
      get(){
        return (this.formData.amount *1 || 0) * (this.formData.checkMultip * 1 || 0)
      }
    }
  },
  methods:{
    getSiteActivityDetail(){
      let data = {
        activityType:7     //实名认证
      }
      activityRequest.getSiteActivityDetail(data).then(res => {
        if(res.code == '200'){
          let data = res.data;
          if(data){
            this.signCount = data.signCount+'';
            //this.formData.signLimit = data.signLimit;
            this.formData.id = data.id;
            this.formData.amount = data.activityAmount;
            this.formData.checkMultip = data.checkMultip;
            this.formData.timetype = data.activityFlag == '1'?'永久':'时间范围';
            this.formData.daterange = [data.activityBegin,data.activityEnd];
            this.SaveTime = [data.activityBegin, data.activityEnd];
            this.formData.state = data.status
          }
        }else{
          this.$notify({
            type:'warning',
            title:res.msg
          })
        }
      }).catch(err => {
        console.log(err);
      })
    },
    saveBtnClick(){
      if(this.isCheck == '1' && this.formData.checkMultip == 0){
        this.$message.warning({message:'已选择稽核请输入打码倍数'})
        return
      }
      if(this.formData.checkMultip <0){
        this.$message.warning({message:'打码倍数不能为负数'})
        return
      }
      let data = {
        signCount:Number(this.signCount),
        //"signLimit":this.formData.signLimit,
        "activityAmount": this.formData.amount,
        "checkMultip": this.formData.checkMultip,
        "activityBegin": this.formData.daterange?this.formData.daterange[0]:'',
        "activityEnd": this.formData.daterange?this.formData.daterange[1]:'',
        "activityFlag": this.formData.timetype=='永久'?1:2,
        "activityMburl": "",
        "activityPcurl": "",
        "activityName": "实名认证",
        "activityType": 7,
        "remark": "",
        "status": this.formData.state,
      }
      if(this.formData.id){
        data.id = this.formData.id;
      }
      this.$refs.formData.validate().then(res => { //验证
        this.$emit('submit',data);
        this.SaveTime=this.formData.daterange
      }).catch(err => {
        this.$message.warning({message:'校验不通过，请检查页面错误提示'})
      })
    }
  },
  watch:{
    'formData.timetype':{
      handler(newval,oldval){
        if(newval == '永久'){
          this.formData.daterange = [];
          const end = new Date().getTime() + 3600 * 1000 * 24 * 365 * 100;
          const start = new Date().getTime();
          this.formData.daterange.push(start);
          this.formData.daterange.push(end);
        }else if(newval === '时间范围'){
            if(this.formData.daterange[1] -this.formData.daterange[0] ==3600*1000*24*365*100 ){
                if(this.SaveTime==null || this.SaveTime==''){
                    this.formData.daterange = [];
                    this.formData.daterange.push(this.DateToYMDHMS(new Date()));
                    this.formData.daterange.push(this.DateToYMDHMS2(new Date()));
                }else{
                    this.formData.daterange = [];
                    this.formData.daterange = this.SaveTime;
                } 
            }
        }
      },
      immediate: true
    },
    isCheck(val){
      if(val == '0'){
        this.formData.checkMultip = 0;
      }
    },
    'formData.checkMultip':{
      handler(newval){
        if(newval>0){
          this.isCheck = '1'
        }else{
           this.isCheck = '0'
        }
      }
    }
  },
  created(){
    this.getSiteActivityDetail();
  }
}
</script>
