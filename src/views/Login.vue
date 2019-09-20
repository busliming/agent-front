<template>
<div class="logincontainer">
  <el-card>
    <div class="logo"></div>
    <!-- <p class="name">登陆代理系统</p> -->
    <div class="formContainer" @keyup.enter='onSubmit'>
      <el-form 
        ref="form" :model="form" label-width="0px"
      >
         <el-form-item>
          <el-input v-model="form.username"
            placeholder="账号"
            clearable
          >
          <div
            slot="prepend"
            style="padding:0 3px;"
          >
            <i class="iconfont icon-zhanghao" style="font-size:16px;"></i>
          </div>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-input v-model="form.password" type="password"
            placeholder="密码"
            clearable
          >
          <div
            slot="prepend"
            style="padding:0 2px;"
          >
            <i class="iconfont icon-mima" style="font-size:18px;"></i>
          </div>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-input v-model="form.code" placeholder="请输入右侧验证码"
            clearable
          >
            <div
              slot="prepend"
              style="padding:0;"
            >
              <i class="iconfont icon-yanzhengma" style="font-size:22px;"></i>
            </div>
            <div slot="append">
              <img class="codeimg" :src="codeSrc" alt="验证码" @click="refreshCodeImg">
            </div>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="success" @click="onSubmit"
            :loading="loading"
          >立即登录</el-button> 
        </el-form-item>
      </el-form>
    </div>
    <p class="tips">请使用谷歌浏览器/Chrome等现代浏览器登录</p>
  </el-card>
  
  <!-- 开启两步验证弹窗 -->
  <el-dialog title="您已开启两步验证，请进行安全验证"
    :visible="twoStepDialogVisible"
    width="30%"
  >
    <el-form>
      <el-form-item>
        <el-select v-model.number="validateType" placeholder=""
          :disabled='true'
          style="width:100%"
        >
          <el-option label="Google身份验证器" :value="1">Google身份验证器</el-option>
          <el-option label='手机验证' :value="2">手机验证</el-option>
        </el-select>
      </el-form-item>
      <template
        v-if="validateType === 1"
      >
        <el-form-item>
          <el-input v-model="googleCode" placeholder="请输入随机码"></el-input>
        </el-form-item>
      </template>
      <template
        v-if="validateType === 2"
      >
        <el-form-item>
          <el-input v-model="phoneMasked" readonly></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="phoneCode" placeholder="请输入验证码">
            <template slot="append">
              <el-button
                @click='sendMessage'
                :disabled="sendMessageLoading"
              >{{sendMessageLoading?'已发送':'发送验证码'}}</el-button>
            </template>
          </el-input>
        </el-form-item>
      </template>
    </el-form>
    <span slot="footer">
      <el-button @click="cancleTwoStep">取 消</el-button>
      <el-button type="primary" @click="confirmTwoStep"
        :loading="confirmLoading"
      >确 定</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
import loginRequest from '@/request/login'
import systemRequest from '@/request/system'

export default {
  name:'Login',
  data () {
    return {
      form:{
        username:'',
        password:'',
        code:''
      },
      loading:false, //立即登陆按钮的加载状态

      accountFirstMenu:'',//当前账号拥有的第一个权限菜单

      twoStepDialogVisible:false, //两步验证弹框
      validateType:null, //两步验证状态 1谷歌验证 2手机验证
      googleCode:'',//谷歌随机码
      phoneCode:'',//短信随机码
      phone:'',//手机号码
      phoneMasked:'',//手机号码已打码

      confirmLoading:false, //安全验证弹框确定按钮loading状态
      sendMessageLoading:false, //发送验证码按钮状态

      codeSrc:'/api/generateCode'  //验证码
    }
  },
  methods:{
    onSubmit() {
      this.loading = true;
      this.$store.dispatch('LoginByUsername',this.form).then(
        res => {
          if(res.code == 200){
            let data = res.data;
            let tempMenu = this.$store.getters.permissionmenu;
             this.$store.dispatch('Getrebatemode')
            if(tempMenu.length === 0){
              this.$notify({
                type:'warning',
                title:'当前账号所属角色没有配置菜单'
              })
              this.$router.push({
                name:'layout'
              })
              this.loading = false;
            }
            if(tempMenu[0].list.length>0){
              this.accountFirstMenu = tempMenu[0].list[0].menuName
            }else{
              this.accountFirstMenu = tempMenu[0].menuName
            }
            if(data.enable === 1 ){ //两部验证状态 1开启  0关闭
              if((data.validateType+'').indexOf('&') == 1){
                this.validateType = parseInt(data.validateType.slice(0,1));
                this.phone = data.validateType.slice(2);
                this.phoneMasked = this.phone.slice(0,3)+'****'+this.phone.slice(7,11);
              }else{
                this.validateType = data.validateType;
              }
              this.twoStepDialogVisible = true;
            }else{ //未开启两步验证
              this.$router.push({
                name:this.accountFirstMenu
              })
              this.loading = false;
            }
          }else{
            this.$notify({
              type:'warning',
              title:res.msg
            })
            this.refreshCodeImg();
            this.form.code = '';
            this.loading = false;
          }
        }
      ).catch(err => {
        console.log(err);
      })
    },

    refreshCodeImg(){ //刷新验证码
      this.codeSrc = '/api/generateCode?'+new Date().getTime();
    },

    confirmTwoStep(){ //两步验证确认
      this.confirmLoading = true;
      if(this.validateType === 1){ //谷歌验证
        let data = {
          username:this.form.username,
          code:this.googleCode
        }
        systemRequest.google_validate(data).then(res => {
          if(res.code == 200){
            this.$router.push({
              name:this.accountFirstMenu
            })
            this.loading = false;
          }else{
            this.$notify({
              type:'error',
              title:res.msg
            })
          }
          this.confirmLoading = false;
        }).catch(e => {
          console.log(e)
        })
      }
      if(this.validateType === 2){ //手机短信验证
        let data = {
          phone:this.phone,
          vcode:this.phoneCode
        };
        systemRequest.phonValidate(data).then(res =>{
          if(res.code == 200){
            this.$router.push({
              name:this.accountFirstMenu
            })
            this.loading = false;
          }else{
            this.$notify({
              type:'error',
              title:res.msg
            })
          }
          this.confirmLoading = false;
        }).catch(e => {
          console.log(e);
        })
      }
      this.loading = false;
    },
    sendMessage(){ //发送手机验证码
      let data = {
        account:this.form.username,
        phoneNumber:this.phone
      }
      systemRequest.sendSms(data).then(res => {
        if(res.code == 200){
          this.sendMessageLoading = true;
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
    cancleTwoStep(){ //两步验证取消
      location.reload();
    }
  },
  created(){
    console.log('2019-04-15 11:05');
  }
}
</script>

<style lang="scss" scope>
@import '~@/assets/font/iconfont.css';
.logincontainer {
  position: relative;
  height: 100%;
  background:url('~@/assets/bg_login.png') no-repeat center;
  background-size: cover;
  .el-card{
    position: absolute;
    top: 50%;
    left: 50%;
    width: 350px;
    transform: translate(-50%,-50%);
    background: transparent;
    border: none;
    color: #fff;
    box-shadow: none;
    .el-card__body{
      padding: 0;
      background: transparent;
      .logo{
        width: 159px;
        height: 116px;
        margin: auto;
        background: url('~@/assets/login_logo2.png') no-repeat center;
        background-size: contain;
      }
      p.name{
        line-height: 20px;
        font-size: 14px;
        color:#3ec5ed;
        margin-top: 30px;
        text-align: center;
      }
      .formContainer{
        margin-top: 12px;
        .el-form-item__content{
          &:hover,&:focus{
            .el-input-group__prepend,.el-input__inner{
              color:#000;
              background: #fff;
            }
          }
        }
        input{
          color: #fff;
          border: 1px solid #ddd;
          border-left: none;
          background: transparent;
        }
        button{
          width: 100%;
        }
        .el-input-group__prepend{
          padding: 0 10px;
          background: transparent;
        }
        [class^="iconfont"]{
          font-size: 18px;
          vertical-align: middle;
          color: inherit;
        }
      }
      .el-input-group__append{
        padding: 0;
        height: 100%;
        border: none;
        overflow: hidden;
        >div{
          height: 38px;
          background: transparent;
          .codeimg{
            height: 100%;
            cursor: pointer;
          }
        }
      }
      
      .tips{
        width: 100%;
        color: #676a6c;
        text-align: center;
        font-size: 16px;
        line-height: 1.5;
        margin-top:98px;
      }
    }
  }
}
</style>

