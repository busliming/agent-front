<template>
  <el-form 
    :model="formData"
    label-width="220px"
    ref='form'
    :rules="rules"
    v-loading="loading"
    size="medium"
  >
    <el-row style="margin:20px 0;">
      注册限制
    </el-row>
    <el-form-item label="同一IP最大注册次数" style="width:500px;" prop="ipMaxLimit">
      <el-input type="number" v-model.number="formData.ipMaxLimit">
        <template slot="append">次</template> 
      </el-input>
    </el-form-item>
    <el-form-item label="注册方式">
      <el-radio-group v-model="formData.registerType">
        <el-radio :label="1">手机号注册</el-radio>
        <el-radio :label="2">账号注册</el-radio>
      </el-radio-group>
    </el-form-item>
    <div
      v-if="formData.registerType == '1'"
      style="border:1px solid #ddd;padding:10px;width:600px;"
    >
      <el-form-item label="验证方式"
      >
        <el-radio-group v-model="formData.codeType">
          <el-radio :label="1">图形验证码</el-radio>
          <el-radio :label="2">手机验证码</el-radio>
        </el-radio-group>
      </el-form-item>
    </div>
    <div
      v-if="formData.registerType == '2'"
      style="border:1px solid #ddd;padding:10px;width:600px;"
    >
      <el-form-item label="账号注册限制"
      >
        <el-radio-group v-model="formData.accountLimit">
          <!-- <el-radio :label="1">6-14位字母或数字</el-radio> -->
          <el-radio :label="2">6-14位字母加数字</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="手机号绑定">
        <el-switch
          v-model="formData.phoneBind"
          active-text="开"
          :active-value="1"
          inactive-text="关"
          :inactive-value="2"
        >
        </el-switch>
      </el-form-item>
      <el-form-item label="验证方式"
      >
        <el-radio-group v-model="formData.codeType">
          <el-radio :label="1">图形验证码</el-radio>
          <el-radio v-if='formData.phoneBind == 1' :label="2">手机验证码</el-radio>
        </el-radio-group>
      </el-form-item>
    </div>
    <el-form-item label="密码输入限制"
    >
      <el-radio-group v-model="formData.passwordLimit">
        <el-radio :label="1">6-14位字母或数字</el-radio>
        <el-radio :label="2">6-14位字母加数字</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-row style="margin:20px 0;">
      公众号关联
    </el-row>
    <div style="border:1px solid #ddd;padding:10px;width:600px;"
      v-loading="wxLoading"
    >
      <el-form-item label="微信应用唯一标识APPID(APP)"  style="width:500px;"
      >
        <el-input v-model="wxFormData.appId"></el-input>
      </el-form-item>
      <el-form-item label="微信应用密钥secret(APP)"  style="width:500px;"
      >
        <el-input v-model="wxFormData.secret"></el-input>
      </el-form-item>
      <el-form-item label=""  style="width:500px;"
      >
      </el-form-item>
      <el-form-item label="微信应用唯一标识APPID(H5)"  style="width:500px;"
      >
        <el-input v-model="wxFormData.h5AppId"></el-input>
      </el-form-item>
      <el-form-item label="微信应用密钥secret(H5)"  style="width:500px;"
      >
        <el-input v-model="wxFormData.h5Secret"></el-input>
      </el-form-item>
      <el-form-item label=""  style="width:500px;"
      >
        <el-button type="primary" size="small"
          @click="updateGlobalApplication"
        >绑定</el-button>
      </el-form-item>
    </div>
    <el-form-item label="允许APP微信登录"
    >
      <el-switch
        v-model="formData.appWechatLogon"
        active-text="开"
        :active-value="1"
        inactive-text="关"
        :inactive-value="2"
      >
      </el-switch>
    </el-form-item>
    <el-form-item label="允许H5微信登录"
    >
      <el-switch
        v-model="formData.h5WechatLogon"
        active-text="开"
        :active-value="1"
        inactive-text="关"
        :inactive-value="2"
      >
      </el-switch>
    </el-form-item>
    <el-row style="margin:24px 0;">
    </el-row>
    <!-- <el-form-item label="开启登录界面【人脸识别登录】"
    >
      <el-switch
        v-model="formData.faceLogon"
        active-text="开"
        active-value="1"
        inactive-text="关"
        inactive-value="2"
      >
      </el-switch>
    </el-form-item> -->
    <el-form-item label="开启登录界面【账号登录】"
    >
      <el-switch
        v-model="formData.accountLogon"
        active-text="开"
        :active-value="1"
        inactive-text="关"
        :inactive-value="2"
      >
      </el-switch>
    </el-form-item>
    
    <el-form-item label="开启登录界面【快速登录】"
    >
      <el-switch
        v-model="formData.fastLogon"
        active-text="开"
        :active-value="1"
        inactive-text="关"
        :inactive-value="2"
      >
      </el-switch>
    </el-form-item>
    
    <el-form-item label="开启登录界面【注册】"
    >
      <el-switch
        v-model="formData.openRegister"
        active-text="开"
        :active-value="1"
        inactive-text="关"
        :inactive-value="2"
      >
      </el-switch>
    </el-form-item>
    <div>
    <el-row style="margin:20px 0;">
      验证码
    </el-row>
    <div style="border:1px solid #ddd;padding:10px;width:600px;margin-bottom:20px">
      <el-form-item 
        label="验证码格式"
      >
        <el-select v-model="formData.validateType" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item 
        label="排除内容"
        prop="codeOut"
        :rules="rules[vcodeRules]"
        ref="vcodeForm"
      >
        <el-input v-model="formData.codeOut" placeholder="输入排除内容"></el-input>
      </el-form-item>
    </div>
    </div>
    <el-row
      type="flex" justify="center"
    >
      <el-button type="primary"
        @click='updateGlobalRegister'
      >保存</el-button>
    </el-row>
  </el-form>
</template>

<script>
import systemRequest from '@/request/system'

export default {
  name:'signInlogin',
  data(){
    const isPositiveInteger = (r,v,c) => { //正整数 不包含0
      let reg = new RegExp(/^\+?[1-9][0-9]*$/)
      if(!v){
        c();
      }
      if(!reg.test(v)){
        c(new Error('请输入正整数'))
      }else{
        c();
      }
    };
    const isLength = (r,v,c) => { //字符长度小于6并且只能为数字
      let reg = new RegExp(/^[0-9]*$/)
      let reg2 = new RegExp(/^[\s\S]{0,5}$/)
      if(!v){
        c();
      }
      if(!reg.test(v)){
        c(new Error('请填写数字'))
      }else if(!reg2.test(v)){
        c(new Error('最大可排除5个字符'))
      }else{
        c();
      }
    }
    const isNumberLetter = (r,v,c) => { //0-9 a-z A-Z 的范围
      let reg = new RegExp(/^[A-Za-z0-9]+$/)
      let reg2 = new RegExp(/^[\s\S]{0,20}$/)
      if(!v){
        c();
      }
      if(!reg.test(v)){
        c(new Error('请填写数字或者字母'))
      }else if(!reg2.test(v)){
        c(new Error('最大可排除20个字符'))
      }else{
        c();
      }
    };
    return{
      formData:{
        ipMaxLimit:5,
        registerType:1,
        codeType:1,
        accountLimit:2,
        phoneBind:1,
        passwordLimit:1,
        validateCode:'',       
        litterNumber:'aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ0123456789', //默认使用的字符串
        validateType:1,                 //默认验证码的格式 
        codeOut:'1IL0o2zg9q',
      },
      options: [                  //验证码格式
        {value:1,label:'数字加字母'},
        {value:2,label:'纯数字'},
        {value:3,label:'加减法'},
      ],
      vcodeRules:'vcode',         //默认input验证方式为vcode  
      wxFormData:{},
      rules:{                     
        ipMaxLimit:[
          {validator:isPositiveInteger,trigger:'change'}
        ],
        vcode:[                    //验证input为不超过20个字符的数字和字母
          {validator:isNumberLetter,trigger:'blur'}
        ],
        vcodeLength:[              //验证input为不超过6个字符的数字
          {validator:isLength,trigger:'blur'}
        ]
      },
      loading:false,
      wxLoading:false,
      
    }
  },
  created(){
    this.getGlobalRegister();
    this.getGlobalApplication();
  },
  computed:{
    computedPhoneBind:{
      get(){
        return this.formData.phoneBind
      }
    },
    computedRegisterType:{
      get(){
        return this.formData.registerType
      }
    },
    computedCodeFormat:{
      get(){
        return this.formData.validateType
      }
    }
  },
  watch:{
    computedPhoneBind(val){
      if(val == 2){
        if(this.formData.registerType == 2){
          this.formData.codeType = 1
        }
      }
    },
    computedRegisterType(val){
      //如果注册方式为账号注册并且手机号绑定为关  则验证方式处理成图形验证码
      if(val == 2 && this.formData.phoneBind == 2){
        this.formData.codeType = 1
      }
      //如果注册方式为手机号码注册  则accountLimit设置为1否则为2 
      if(val == 1){
        this.formData.accountLimit = 1
      }else{
        this.formData.accountLimit = 2
      }
    },
    computedCodeFormat(val){
      //监听验证码格式变化 重置当前表单并且修改默认值
      //this.$refs.vcodeForm.resetField();  重置表单
      if(val == 1){
        this.vcodeRules='vcode'
        this.formData.litterNumber = 'aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ0123456789'
      }else{
        this.vcodeRules="vcodeLength"
        this.formData.litterNumber = '0123456789'
      }
    }
  },
  methods:{
    restvcode(formName){
      this.$refs[formName].resetField();
    },
    getGlobalRegister(){//获取已设置参数
      systemRequest.getGlobalRegister().then(res => {
        if(res.code == 200){
          let CodeOut = res.data.validateCode; 
          this.formData = Object.assign(this.formData,res.data)
          if(res.data.validateType=='1'){
            let vCode = 'aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ0123456789';//所有字符串
            for(let i=0;i<CodeOut.length;i++){    //for循环  将排除字符串抽离
              let pattern = new RegExp(CodeOut[i],'g');
              vCode = vCode.replace(pattern, "");
            }
            this.formData.codeOut = vCode;
          }else{
            let vCode = '0123456789';                      //所有字符串
            for(let i=0;i<CodeOut.length;i++){    //for循环  将排除字符串抽离
              let pattern = new RegExp(CodeOut[i],'g');
              vCode = vCode.replace(pattern, "");
            }
            this.formData.codeOut = vCode
          }
        }else{
          this.$notify({
            type:'warning',
            title:res.msg
          })
        }
      }).catch(e => {
        console.log(e);
      })
    },
    getGlobalApplication(){//获取已设置的微信相关参数
      
      systemRequest.getGlobalApplication().then(res => {
        if(res.code == 200){
          this.wxFormData = res.data;
        }else{
          this.$notify({
            type:'warning',
            title:res.msg
          })
        }
      }).catch(e => {
        console.log(e);
      })
    },
    updateGlobalRegister(){ //保存注册登录参数
      let codeOut = this.formData.codeOut;           //要排除的字符串
      let vCode = this.formData.litterNumber;      //所有字符串
      for(let i=0;i<codeOut.length;i++){    //for循环  将排除字符串抽离
        let pattern = new RegExp(codeOut[i],'g');
        vCode = vCode.replace(pattern, "");
      }
      this.formData.validateCode = vCode;         
      this.$refs.form.validate().then(() => {
        this.loading = true;
        let data = this.formData;
        systemRequest.updateGlobalRegister(data).then(res => {
          if(res.code == 200){
            this.$notify.success({title:'保存成功'})
          }else{
            this.$notify.warning({title:res.msg})
          }
          this.loading = false;
        }).catch(e => { 
          console.log(e);
        })
      }).catch(e=> {
        this.$notify.error({title:'校验不通过，请检查页面错误提示'})
      })
    },
    updateGlobalApplication(){ //保存微信相关参数
      //若开关已打开  则值不能为空   针对编辑微信参数的情况
      if(this.formData.appWechatLogon == 1){
        if(!this.wxFormData.appId || !this.wxFormData.secret){
          this.$message.warning('允许APP微信登录开关已打开，无法绑定空微信应用参数');
          return
        }
      }
      if(this.formData.h5WechatLogon == 1){
        if(!this.wxFormData.h5AppId || !this.wxFormData.h5Secret){
          this.$message.warning('允许H5微信登录开关已打开，无法绑定空微信应用参数');
          return
        }
      }
      this.wxLoading = true;
      let data = this.wxFormData;
      systemRequest.updateGlobalApplication(data).then(res => {
        if(res.code == 200){
          this.$notify.success({title:'保存微信应用参数成功'})
          this.getGlobalApplication(); //重新获取已设置的微信相关参数
        }else{
          this.$notify.warning({title:res.msg})
        }
        this.wxLoading = false;
      }).catch(e => {
        console.log(e);
      })
    }
  }
}
</script>

