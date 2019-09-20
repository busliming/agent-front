<template>
  <el-card>
    <div style="height:100%;">
      <el-card>
        <div slot="header">必填项目</div>
        <el-form
          inline
          ref='requiredForm'
          status-icon
          :rules='rules'
          :model="requiredForm"
        >
          <el-form-item
            prop="account"
          >
            <el-input
              clearable
              v-model='requiredForm.account'
              placeholder="会员登入系统账号">
              <div slot="prepend">
                会员账号
              </div>
            </el-input>
          </el-form-item>
          <el-form-item
            prop="password"
          >
            <el-input
              clearable
              v-model='requiredForm.password'
              type="password"
              placeholder="请输入密码">
              <div slot="prepend">
                会员密码
              </div>
            </el-input>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card style='margin-top:30px;'>
        <div slot="header">选填项目</div>
        <el-form
          ref="optionalForm"
          :model='optionalForm'
          :rules="rules"
          label-width="0"
        >
          <el-row type="flex" justify="start">
            <el-col :span="5">
              <el-form-item
                prop="parentAccount"
              >
                <el-input
                  clearable
                  v-model="optionalForm.parentAccount"
                  placeholder="代理商账号">
                  <div slot="prepend">
                    代理商账号
                  </div>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <el-row type="flex" justify="space-around" align="middle" style="margin-top:30px;padding-bottom:20px;">
        <el-button 
          @click="backBtnHandle"
        >&lt; 返回上一页</el-button>
        <el-popover
          placement="top"
          width="220"
          v-model="clearPopVisible">
          <p>确定清空本页已输入数据吗？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="clearPopVisible = false">取消</el-button>
            <el-button type="primary" size="mini" @click="clearPopConfirmHandle">确定</el-button>
          </div>
          <el-button slot="reference" type="warning">清空已填数据</el-button>
        </el-popover>
        <el-button 
          @click="addMemberBtnHandle" 
          type='primary'
          :loading="addBtnLoading"
        >保存</el-button>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import validator from '@/tool/validate'
import memberRequest from '@/request/member'

export default {
  name:'MemberAdd',
  data () {
    return {
      requiredForm:{  //必填项目
        account:'',
        password:''
      },
      optionalForm:{ //选填项目
        parentAccount:''
      },
      addBtnLoading:false,   //保存按钮的loading状态
      clearPopVisible:false, //清空弹窗的可视状态
      rules:{  //表单验证器
        account:[
          {validator: validator.validateAccount, trigger: 'change' }
        ],
        password:[
          {validator: validator.password, trigger: 'change' }
        ],
        parentAccount:[
          {validator: validator.validateSuperior, trigger: 'blur' }
        ],
      }
    }
  },
  methods:{
    addMemberBtnHandle () {  //保存按钮
      this.addBtnLoading = true;
      console.log(this.requiredForm);
      console.log(this.optionalForm);
      let validate1 = this.$refs['requiredForm'].validate(); //验证必填表单
      let validate2 = this.$refs['optionalForm'].validate(); //验证选填表单
      Promise.all([validate1,validate2]).then( () => {
        //调新增会员接口
        let data = Object.assign({},this.requiredForm,this.optionalForm);
        memberRequest.signup(data).then( res => {
          if(res.code == '200'){
            this.$notify({
              type:'success',
              title: res.msg,
            });
          }else{
            this.$notify({
              type:'warning',
              title: res.msg,
            });
          }
          this.addBtnLoading = false;
        }).catch(err => {
          this.$notify({
              type:'warning',
              title: err,
          });
        })
      }).catch( () => {
        this.$notify({
          type:'warning',
          title: '验证不通过，请检查错误提示',
        });
        this.addBtnLoading = false;
      })
    },
    clearPopConfirmHandle(){ //清空已填数据按钮
      this.$refs.requiredForm.resetFields();
      this.$refs.optionalForm.resetFields();
      this.clearPopVisible = false;
    },
    backBtnHandle(){  //点击返回
      this.$store.dispatch('navGoBack',{
        name:'新增用户',
      });
    },
  }
}
</script>

