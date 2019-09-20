<template>
  <div style="width:100%;margin:auto;">
    <el-form :model="formData" ref="formData" label-width="100px" :rules="rules" status-icon>
      <el-form-item prop="limitAmount" label="首充">
        <el-input v-model="formData.limitAmount" placeholder="请输入首充金额，达到此金额以上才有奖励金赠送" clearable></el-input>
      </el-form-item>
      <el-row type="flex" justify="space-between">
        <el-form-item prop="amount" label="赠送金额" style="width:300px;margin-right: 15px;">
          <el-input v-model="formData.amount" placeholder="请输入数字" clearable></el-input>
        </el-form-item>
        <el-form-item label-width="0" style="width:160px;">
          <el-radio-group v-model="isCheck">
            <el-radio label="1">稽核</el-radio>
            <el-radio label="0">不稽核</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="checkMultip" label="打码倍数" style="width:200px;">
          <el-input v-model="formData.checkMultip" placeholder="稽核倍数" clearable></el-input>
        </el-form-item>
        <el-form-item label="打码量" style="width:200px;">
          <el-input v-model="computedDamaliang"  readonly></el-input>
        </el-form-item>
      </el-row>

      <el-form-item label="活动时间">
        <el-radio-group v-model="formData.timetype">
          <el-radio label="永久">永久</el-radio>
          <el-radio label="时间范围">时间范围</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label v-if="formData.timetype == '时间范围'">
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
      <el-form-item label="状态">
        <el-select v-model="formData.state" placeholder="请选择">
          <el-option label="启用" :value="1"></el-option>
          <el-option label="禁用" :value="0"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-row type="flex" justify="center">
      <el-button type="primary" size="medium" @click="saveBtnClick" :loading="isloading">保存</el-button>
    </el-row>
  </div>
</template>

<script>
import activityRequest from "@/request/activty";
import validator from "@/tool/validate";
export default {
  name: "shouchongsong",
  props: ["isloading"],
  data() {
    const moneyRule = (r,v,c) => {  //存款金额验证
      let reg = new RegExp(/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/);
      if(!v){
        c();
      }else if(!reg.test(v)){
        c(new Error('金额应该大于0且最多包含两位小数'));
      }else{
        c()
      }
    };
    return {
      formData: {
        limitAmount:'',
        amount: "",
        checkMultip:0,
        timetype: "永久",
        daterange: null,
        state: 1
      },
      SaveTime:null,
      isCheck:'0', //是否稽核  
      rules: {
        limitAmount:[
          {required:true,message:'请输入金额',trigger:'blur'},
          { validator: moneyRule, trigger: "change" }
        ],
        amount: [
          { validator: moneyRule, trigger: "change" }
        ],
        checkMultip: [
          { validator: moneyRule, trigger: "change" }
        ],
      }
    };
  },
  computed:{
    computedDamaliang:{
      get(){
      let DamaData  =  this.formData.amount * (this.formData.checkMultip || 0)
        return  DamaData.toFixed(2)
      }
    }
  },
  methods: {
    getSiteActivityDetail() {
      let data = {
        activityType: 3 //首充送
      };
      activityRequest
        .getSiteActivityDetail(data)
        .then(res => {
          if (res.code == "200") {
            let data = res.data;
            if (data) {
              this.formData.id = data.id;
              this.formData.amount = data.activityAmount;
              this.formData.limitAmount = data.limitAmount;
              this.formData.checkMultip = data.checkMultip;
              this.formData.timetype =
                data.activityFlag == "1" ? "永久" : "时间范围";
              this.formData.daterange = [data.activityBegin, data.activityEnd];
              this.SaveTime = [data.activityBegin, data.activityEnd];
              this.formData.state = data.status;
            }
          } else {
            this.$notify({
              type: "warning",
              title: res.msg
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    saveBtnClick() {
      if(this.isCheck == '1' && this.formData.checkMultip == 0){
        this.$message.warning({message:'已选择稽核请输入打码倍数'})
        return
      }
      if(this.formData.checkMultip <0){
        this.$message.warning({message:'打码倍数不能为负数'})
        return
      }
      let data = {
        activityAmount: this.formData.amount,
        checkMultip: this.formData.checkMultip,
        limitAmount: this.formData.limitAmount,
        activityBegin: this.formData.daterange
          ? this.formData.daterange[0]
          : "",
        activityEnd: this.formData.daterange ? this.formData.daterange[1] : "",
        activityFlag: this.formData.timetype == "永久" ? 1 : 2,
        activityMburl: "",
        activityPcurl: "",
        activityName: "首充送",
        activityType: 3,
        remark: "",
        status: this.formData.state
      };
      if (this.formData.id) {
        data.id = this.formData.id;
      }
      this.$refs.formData
        .validate()
        .then(res => {
          //验证
          this.SaveTime=this.formData.daterange
          this.$emit("submit", data);
        })
        .catch(err => {
          this.$notify({
            type: "warning",
            title: "校验不通过，请检查页面错误提示"
          });
        });
    }
  },
  watch: {
    "formData.timetype": {
      handler(newval, oldval) {
        if (newval == "永久") {
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
        }
      }
    },
  },
  created() {
    this.getSiteActivityDetail();
  }
};
</script>