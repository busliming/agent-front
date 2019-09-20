<template>
  <el-card>
    <el-col :span="10">
      <el-form :model="formData"
        label-width="140px"
      >
        <el-form-item label="账号">
          <el-input v-model="formData.userAccount" readonly></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop='userName'>
          <el-input ref='nameInput' v-model="formData.userName"
          >
            <template slot="append">
              <el-button type=""
                @click='saveName'
                :loading="saveNameLoading"
              >保存</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="google身份验证器">
          <el-row type="flex" justify="start">
            <el-button size="medium"
              style="width:60%"
              v-if="formData.bindGoogle == '1' || formData.bindGoogle == null"
              @click='editGoogle'
            >点击绑定</el-button>
            <el-button size="medium"
              v-else
              style="width:60%"
              @click='removeGoogle'
            >
              解除绑定
            </el-button>
            <el-button size="medium"
              style="width:40%"
              type="primary"
              @click='downGoogleTutorial'
            >
              下载教程
            </el-button>
          </el-row>
        </el-form-item>
        <!-- <el-form-item label="电子邮箱" prop='userEmail'>
          <el-input v-model="formData.userEmail" readonly>
            <template slot="append">
              <el-button
                v-if="!formData.userEmail"
                @click="editEmail"
              >
                绑定邮箱
              </el-button>
              <el-button
                v-else
                @click="removeEmail"
              >
                解除绑定
              </el-button>
            </template>
          </el-input>
        </el-form-item> -->
        <el-form-item label="手机号" prop='phone'>
          <el-input v-model="formData.phone" readonly>
            <template slot="append">
              <el-button
                v-if="!formData.phone"
                @click="editPhone"
              >
                绑定手机
              </el-button>
              <el-button
                v-else
                @click="removePhone"
              >
                解除绑定
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="登录密码" prop='password'>
          <el-button
            type="medium"
            @click='editPw'
            style="width:100%"
          >修改密码</el-button>
        </el-form-item>
        <el-form-item label="两步验证" prop='enable'>
          <el-row type="flex" justify="start">
            <el-button size="medium"
              style="width:60%"
            >{{formData.enable == '0'?'未启用':'已启用'}}</el-button>
            <el-button size="medium"
              style="width:40%"
              v-if="!formData.enable"
              @click='changeTwoStepState'
            >点击启用</el-button>
            <el-button size="medium"
              style="width:40%"
              v-else
              @click='changeTwoStepState'
            >
              点击禁用
            </el-button>
          </el-row>
        </el-form-item>
        <el-form-item label="上次登录">
          <el-input readonly :value='formData.lastLogin+" "+(formData.lastLoginDate || "暂无时间记录")'></el-input>
        </el-form-item>
        <el-form-item label="本次登录">
          <el-input readonly :value='formData.thisLogin+" "+(formData.thisLoginDate || "暂无时间记录")'></el-input>
        </el-form-item>
      </el-form>
    </el-col>


    <!-- 手机号码绑定弹窗 -->
    <el-dialog title="绑定手机号码"
      :visible.sync="phoneDialogVisible"
      width="30%"
      @closed='phoneDialogClosed'
    >
      <el-form :model="phoneFormData"
        ref='phoneForm'
        :rules="phoneFormRules"
      >
        <el-form-item
          prop='phone'
        >
          <el-input v-model="phoneFormData.phone" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <!-- 没有绑定任何安全方式： -->
        <template
          v-if="(formData.bindGoogle == null || formData.bindGoogle == 1) && (formData.userEmail == '' || formData.userEmail == null) "
        >
          <el-form-item
            prop="pw"
          >
            <el-input v-model="phoneFormData.pw" placeholder="请输入登录密码" type="password"></el-input>
          </el-form-item>
          <el-form-item
            prop="code"
          >
            <el-input v-model="phoneFormData.code" placeholder="请输入手机收到的验证码">
              <template slot="append">
                <el-button
                  @click='sendMessage'
                  :disabled="sendMessageLoading"
                >{{sendMessageLoading?'已发送':'发送验证码'}}</el-button>
              </template>
            </el-input>
          </el-form-item>
        </template>
        <!-- 已绑定其他安全方式： -->
        <template
          v-else
        >
          <el-form-item>
            <el-select v-model="phoneFormData.flag" placeholder="选择验证方式">
              <el-option v-if="formData.bindGoogle == 2" value="google" label="谷歌身份验证器">谷歌身份验证器</el-option>
              <el-option v-if="formData.userEmail != '' &&formData.userEmail != null" value="mail" label="邮箱验证">邮箱验证</el-option>
            </el-select>
          </el-form-item>
          <template
            v-if="phoneFormData.flag == 'google'"
          >
            <el-form-item
              prop="googlecode"
            >
              <el-input v-model="phoneFormData.googlecode" placeholder="请输入Google验证器上的随机码"
                clearable
              ></el-input>
            </el-form-item>
          </template>
          <template
            v-if="phoneFormData.flag == 'mail'"
          >
            <el-form-item
              prop="mailcode"
            >
              <el-input v-model="phoneFormData.mailcode" placeholder="请输入邮箱收到的验证码">
                <template slot="append">
                  <el-button
                    @click='phoneSendEmail'
                    :disabled="sendEmailLoading"
                  >{{sendEmailLoading?'已发送':'发送验证码'}}</el-button>
                </template>
              </el-input>
            </el-form-item>
          </template>
        </template>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="phoneDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="phoneSave"
          :loading="phoneSaveLoading"
        >绑 定</el-button>
      </span>
    </el-dialog>

    <!-- 邮箱绑定弹窗 -->
    <el-dialog title="绑定电子邮箱"
      :visible.sync="emailDialogVisible"
      width="30%"
      @closed='emailDialogClosed'
    >
      <el-form :model="mailFormData"
        ref='mailForm'
        :rules="mailFormRules"
      >
        <el-form-item
          prop='email'
        >
          <el-input v-model="mailFormData.email" placeholder="请输入邮箱账户"></el-input>
        </el-form-item>
        <!-- 没有绑定任何安全方式： -->
        <template
          v-if="(formData.bindGoogle == null || formData.bindGoogle == 1) && (formData.phone == '' || formData.phone == null)"
        >
          <el-form-item
            prop="pw"
          >
            <el-input v-model="mailFormData.pw" placeholder="请输入登录密码" type="password"></el-input>
          </el-form-item>
          <el-form-item
            prop="code"
          >
            <el-input v-model="mailFormData.code" placeholder="请输入邮箱收到的验证码">
              <template slot="append">
                <el-button
                  @click='sendEmail'
                  :disabled="sendEmailLoading"
                >{{sendEmailLoading?'已发送':'发送验证码'}}</el-button>
              </template>
            </el-input>
          </el-form-item>
        </template>
        <!-- 已绑定其他安全方式： -->
        <template
          v-else
        >
          <el-form-item>
            <el-select v-model="mailFormData.flag" placeholder="选择验证方式">
              <el-option v-if="formData.bindGoogle == 2" value="google" label="谷歌身份验证器">谷歌身份验证器</el-option>
              <el-option v-if="formData.phone != '' && formData.phone != null" value="phone" label="手机短信验证">手机短信验证</el-option>
            </el-select>
          </el-form-item>
          <template
            v-if="mailFormData.flag == 'google'"
          >
            <el-form-item
              prop="googlecode"
            >
              <el-input v-model="mailFormData.googlecode" placeholder="请输入Google验证器上的随机码"
                clearable
              ></el-input>
            </el-form-item>
          </template>
          <template
            v-if="mailFormData.flag == 'phone'"
          >
            <el-form-item
              prop="phonecode"
            >
              <el-input v-model="mailFormData.phonecode" placeholder="请输入手机收到的验证码">
                <template slot="append">
                  <el-button
                    @click='emailSendPhone'
                    :disabled="sendMessageLoading"
                  >{{sendMessageLoading?'已发送':'发送验证码'}}</el-button>
                </template>
              </el-input>
            </el-form-item>
          </template>
        </template>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="emailDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="emailSave"
          :loading="emailSaveLoading"
        >绑 定</el-button>
      </span>
    </el-dialog>

    <!-- 谷歌身份绑定弹窗 -->
    <el-dialog title="绑定谷歌身份验证器"
      :visible.sync="googleDialogVisible"
      width="30%"
      @open="googleDialogOpen"
      @closed='googleDialogClosed'
    >
      <div id="googleCodeCtn" style="position:relative;height:204px;"></div>
      <p style='font-size:14px;line-height:22px;margin:10px 0;text-indent:28px;'>说明：使用Google身份验证器‘扫描条形码’方式，扫描上图二维码，并在下方输入Google随机码，您账户的登录密码，同时在Google身份验证器上点击添加，即可添加成功。</p>
      <el-form :model="googleFormData"
        ref="googleForm"
        :rules="googleFormRules"
      >
        <el-form-item
          prop="pw"
        >
          <el-input v-model="googleFormData.pw" placeholder="请输入登录密码" type="password"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="code"
        >
          <el-input v-model="googleFormData.code" placeholder="请输入Google验证器上的随机码"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="googleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="googleSave"
          :loading="googleSaveLoading"
        >绑 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改密码弹窗 -->
    <el-dialog title="修改密码"
      :visible.sync="passwordDialogVisible"
      width="30%"
      @closed='passwordDialogClosed'
    >
      <el-form :model="passwordFormData"
        ref='passwordForm'
        label-width="90px"
        :rules="passwordFormRules"
      >
        <el-form-item
            prop="oldpw"
            label="原密码"
          >
            <el-input v-model="passwordFormData.oldpw" placeholder="请输入原密码" type="password"></el-input>
          </el-form-item>
          <el-form-item
            prop="newpw"
            label="新密码"
          >
            <el-input type="password" v-model="passwordFormData.newpw" placeholder="请输入6-14位字母与数字的组合"></el-input>
          </el-form-item>
          <el-form-item
            prop="rpnewpw"
            label="确认密码"
          >
            <el-input type="password" v-model="passwordFormData.rpnewpw" placeholder="请输入6-14位字母与数字的组合"></el-input>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="passwordDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="passwordSave"
        :loading="passwordSaveLoading"
        >确 定</el-button>
      </span>
    </el-dialog>

  </el-card>
</template>

<script>
import systemRequest from '@/request/system'
import valide from '@/tool/validate'
export default {
  name:'UserProfile',
  data () {
    const googleCodeValidate = (r,v,c) => {
      let reg = new RegExp(/^[0-9]{6}$/);
      if(!v){
        c(new Error('请输入谷歌验证器上六位随机码'))
        return
      }
      if(!reg.test(v)){
        c(new Error('请输入谷歌验证器上六位随机码'))
        return
      }else{
        c();
      }
    }
    return {
      formData:{
        "enable": 0,
        "id": 0,
        "lastLogin": "",
        "lastLoginDate": "",
        "newPassword": "",
        "password": "",
        "phone": "",
        "thisLogin": "",
        "thisLoginDate": "",
        "userAccount": "",
        "userEmail": "",
        "userName": ""
      },

      googleCodeUrl:'', //绑定谷歌验证条码

      saveNameLoading:false, //保存名称加载状态
      phoneSaveLoading:false, //保存手机绑定
      emailSaveLoading:false, //保存邮箱绑定
      googleSaveLoading:false, //保存谷歌绑定

      sendEmailLoading:false,//发送邮箱验证码已发送状态
      sendMessageLoading:false,//发送短信验证码已发送状态

      passwordSaveLoading:false, //修改密码保存状态

      phoneDialogVisible:false,  //绑定手机号码对话框可视状态
      emailDialogVisible:false,  //绑定电子邮箱对话框可视状态
      googleDialogVisible:false,  //绑定谷歌身份可视状态
      passwordDialogVisible:false,  //修改密码弹窗可视状态

      mailFormData:{//邮箱绑定数据
        email:null,
        pw:null,
        code:null,
        googlecode:null,
        phonecode:null,
      },
      phoneFormData:{//手机绑定数据
        phone:null,
        pw:null,
        code:null,
        googlecode:null,
        mailcode:null,
      },
      googleFormData:{ //谷歌绑定数据
        pw:null,
        code:null
      },
      passwordFormData:{//修改密码绑定数据
        oldpw:null,
        newpw:null,
        rpnewpw:null
      },

      phoneFormRules:{  //手机绑定验证
        phone:[
          {
            required:true,
            message:'请输入手机号',
            trigger:'blur'
          },
          {
            validator:valide.validatePhone,
            trigger:'blur'
          }
        ],
        pw:[
          {
            required:true,
            message:'请输入密码',
            trigger:'blur'
          }
        ],
        code:[
          {
            required:true,
            message:'请输入验证码',
            trigger:'blur'
          }
        ],
        googlecode:[
          {
            validator:googleCodeValidate,
            trigger:'blur'
          }
        ],
        mailcode:[
          {
            required:true,
            message:'请输入邮箱收到的验证码',
            trigger:'blur'
          }
        ],
      },
      mailFormRules:{  //邮箱绑定验证
        email:[
          {
            required:true,
            message:'请输入邮箱地址',
            trigger:'blur'
          },
          {
            validator:valide.validateEmail,
            trigger:'blur'
          }
        ],
        pw:[
          {
            required:true,
            message:'密码不能为空',
            trigger:'blur'
          }
        ],
        code:[
          {
            required:true,
            message:'请输入验证码',
            trigger:'blur'
          }
        ],
        googlecode:[
          {
            validator:googleCodeValidate,
            trigger:'blur'
          }
        ],
        phonecode:[
          {
            required:true,
            message:'请输入验证码',
            trigger:'blur'
          }
        ],
      },
      googleFormRules:{  //谷歌相关验证
        pw:[
          {
            required:true,
            message:'请输入密码',
            trigger:'blur'
          }
        ],
        code:[
          {
            validator:googleCodeValidate,
            trigger:'blur'
          }
        ]
      },
      passwordFormRules:{  //修改密码相关验证
        oldpw:[
          {
            required:true,
            message:'请输入旧密码',
            trigger:'blur'
          }
        ],
        newpw:[
          {
            required:true,
            message:'请输入新密码',
            trigger:'blur'
          },
          {
            validator:valide.password,
            trigger:'blur'
          }
        ],
        rpnewpw:[
          {
            required:true,
            message:'请再次输入新密码',
            trigger:'blur'
          },
          {
            validator:valide.password,
            trigger:'blur'
          }
        ],
      },
    }
  },
  methods:{
    getUserProfile(){  //获取厅主个人资料
      systemRequest.getUserProfile().then(res => {
        if(res.code == 200){
          this.formData = res.data
          this.getGoogleCode();
        }else{
          this.$notify({
            type:'warning',
            title:res.msg
          })
        }
      }).catch(err => {
        console.log(err);
        this.$notify({
          type:'error',
          title:err
        })
      })
    },
    getGoogleCode(){  //获取谷歌二维码
      let data = {
        "userAccount": this.formData.userAccount,
      }
      systemRequest.addGoogle(data).then(res => {
        if(res.code == 200){
          this.googleCodeUrl = res.data.replace(/"/g,"");
        }else{
          this.$notify({
            type:'warning',
            title:res.msg
          })
        }
      }).catch(err => {
        this.$notify({
          type:'error',
          title:error
        })
      })
    },
    saveName(){ //保存名称
      this.saveNameLoading = true;
      if(!this.formData.userName){
        this.$message({
          type:'warning',
          message:'请输入姓名'
        })
        this.saveNameLoading = false;
        return
      }
      let data = {
        id:this.formData.id,
        userName:this.formData.userName
      }
      systemRequest.updateUserName(data).then(res => {
        if(res.code == 200){
          this.$notify({
            type:'success',
            title:'保存成功'
          })
        }else{
          this.$notify.warning({title:res.msg})
        }
        this.saveNameLoading = false;
      }).catch(err => {
        console.log(err);
      })
    },

    editEmail(){ //点击绑定邮箱
      this.emailDialogVisible = true;
    },
    sendEmail(){ //发送邮箱验证码
      this.$refs.mailForm.validateField('email',(err)=>{
        if(!err){
          // let data = {
          //   account:this.formData.userAccount,
          //   email:this.mailFormData.email
          // }
          // systemRequest.sendEmail(data).then(res => {

          // }).catch(err => {
          //   console.log(err);
          // })
          this.sendEmailLoading = true;
        }else{
          this.$notify({
            type:'error',
            title:'校验不通过，请检查红色错误提示'
          })
        }
      })
    },
    phoneSendEmail(){ // 绑定手机时发送邮箱验证码
      //todo 发送验证码
      // let data = {
      //   account:this.formData.userAccount,
      //   email:this.mailFormData.email
      // }
      // systemRequest.sendEmail(data).then(res => {

      // }).catch(err => {
      //   console.log(err);
      // })
      this.sendEmailLoading = true;
    },
    removeEmail(){ //点击解除绑定邮箱
      this.$confirm(
        '是否确定解除已绑定的电子邮箱？',
        '注意',
        {
          confirmButtonText:'确定解除',
          cancelButtonText:'取消',
          type:'warning'
        }
      ).then(()=>{
        let data = {
          userAccount:this.formData.userAccount
        }
        systemRequest.updateEmail(data).then(res => {
          if(res.code == 200){
              this.$notify({
                type:'success',
                title:res.msg
              })
              this.getUserProfile();
            }else{
              this.$notify({
                type:'warning',
                title:res.msg
              })
            }
          }).catch(err => {
            console.log(err);
            this.$notify({
              type:'error',
              title:err
            })
          })
        })
    },
    emailDialogClosed(){ //邮箱弹窗关闭
      this.$refs.mailForm.resetFields();
    },
    emailSave(){  //绑定Email
      if(this.formData.bindGoogle ==1&&(this.formData.phone == '' || this.formData.phone == null)){
        console.log('没有绑定任何安全方式：');
        this.$refs.mailForm.validate((success,object) => {
          if(success){
            this.emailSaveLoading = true;
            let data = {
              account:this.formData.userAccount,
              vcode:this.mailFormData.code
            }
            systemRequest.emailValidate(data).then(res => {
              if(res.code == 200){
                let data = {
                  userAccount:this.formData.userAccount,
                  userEmail:this.mailFormData.email
                }
                systemRequest.addEmail(data).then(res => {
                  if(res.code == 200){
                    this.$notify({
                      type:'success',
                      title:res.msg
                    })
                    this.emailDialogVisible = false;
                  }else{
                    this.$notify({
                      type:'error',
                      title:res.msg
                    })
                  }
                  this.emailSaveLoading = false;
                  this.getUserProfile();
                }).catch(err => {
                  console.log(err);
                  this.$notify({
                    type:'error',
                    title:error
                  })
                  this.emailSaveLoading = false;
                })
              }else{
                this.$notify({
                  type:'error',
                  title:res.msg
                })
                this.emailSaveLoading = false;
              }
            }).catch(err => {
              console.log(err);
              this.$notify({
                type:'error',
                title:err
              })
            })
          }else{
            this.$notify({
              type:'error',
              title:'校验不通过，请检查红色错误提示'
            })
          }
        })
      }else{
        console.log('已绑定其他安全验证方式'+this.mailFormData.flag);
        if(this.mailFormData.flag == 'google'){
          console.log('表单验证谷歌随机码')
          this.$refs.mailForm.validate((success,object)=>{
            if(success){
              this.emailSaveLoading = true;
              let data = {
                username:this.formData.userAccount,
                code:this.mailFormData.googlecode
              }
              console.log('验证谷歌随机码：')
              systemRequest.google_validate(data).then(res => {
                if(res.code == 200){
                  let data = {
                    userAccount:this.formData.userAccount,
                    userEmail:this.mailFormData.email
                  }
                  systemRequest.addEmail(data).then(res => {
                    if(res.code == 200){
                      this.$notify({
                        type:'success',
                        title:res.msg
                      })
                      this.emailDialogVisible = false;
                    }else{
                      this.$notify({
                        type:'error',
                        title:res.msg
                      })
                    }
                    this.emailSaveLoading = false;
                    this.getUserProfile();
                  });
                }else{
                  this.$notify({
                    type:'warning',
                    title:res.msg
                  })
                  this.emailSaveLoading = false;
                }
              }).catch(err => {
                this.$notify({
                  type:'warning',
                  title:res.msg
                })
                this.emailSaveLoading = false;
              })
            }else{
              this.$notify({
                type:'error',
                title:'校验不通过，请检查红色错误提示'
              })
            }
          })
        }
        if(this.mailFormData.flag == 'phone'){
          console.log('表单验证手机验证码')
          this.$refs.mailFormData.validate((success,object)=>{
            if(success){
              this.emailSaveLoading = true;
              let data = {
                // account:this.formData.userAccount,
                phone:this.formData.phone,
                vcode:this.mailFormData.phonecode
              }
              console.log('后端验证手机验证码：')
              systemRequest.phonValidate(data).then(res =>{
                if(res.code == 200){
                  let data = {
                    userAccount:this.formData.userAccount,
                    userEmail:this.mailFormData.email
                  }
                  systemRequest.addEmail(data).then(res => {
                    if(res.code == 200){
                      this.$notify({
                        type:'success',
                        title:res.msg
                      })
                      this.emailDialogVisible = false;
                    }else{
                      this.$notify({
                        type:'error',
                        title:res.msg
                      })
                    }
                    this.emailSaveLoading = false;
                    this.getUserProfile();
                  }).catch(err => {
                    console.log(err);
                    this.$notify({
                      type:'error',
                      title:error
                    })
                    this.emailSaveLoading = false;
                  })
                }else{
                  this.$notify({
                    type:'warning',
                    title:res.msg
                  })
                  this.emailSaveLoading = false;
                }
              }).catch(err => {
                this.$notify({
                  type:'warning',
                  title:res.msg
                })
                this.emailSaveLoading = false;
              })
            }else{
              this.$notify({
                type:'error',
                title:'校验不通过，请检查红色错误提示'
              })
            }
          })
        }
      }
    },
    editPhone(){ //点击绑定手机
      this.phoneDialogVisible = true;
    },
    phoneDialogClosed(){ //邮箱弹窗关闭
      this.$refs.phoneForm.resetFields();
    },
    sendMessage(){ //发送手机验证码
      this.$refs.phoneForm.validateField('phone',(err)=>{
        if(!err){
          let data = {
            account:this.formData.userAccount,
            phoneNumber:this.phoneFormData.phone
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
        }
      })
    },
    emailSendPhone(){ //邮箱绑定发送手机验证码
      let data = {
        account:this.formData.userAccount,
        phoneNumber:this.formData.phone
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
    removePhone(){ //点击解除绑定手机
       this.$confirm(
        '是否确定解除已绑定的手机号码？',
        '注意',
        {
          confirmButtonText:'确定解除',
          cancelButtonText:'取消',
          type:'warning'
        }
      ).then(()=>{
        let data = {
          userAccount:this.formData.userAccount,
        }
        systemRequest.updatePhone(data).then(res => {
          if(res.code == 200){
              this.$notify({
                type:'success',
                title:res.msg
              })
              this.getUserProfile();
            }else{
              this.$notify({
                type:'warning',
                title:res.msg
              })
            }
          }).catch(err => {
            console.log(err);
            this.$notify({
              type:'error',
              title:err
            })
          })
        })
    },
    phoneSave(){ //绑定手机
      if(this.formData.bindGoogle ==1&&(this.formData.userEmail == '' || this.formData.userEmail == null)){
        console.log('没有绑定任何安全方式');
        this.$refs.phoneForm.validate((success,object)=>{
          if(success){
            this.phoneSaveLoading = true;
            let data = {
              // account:this.formData.userAccount,
              phone:this.phoneFormData.phone,
              vcode:this.phoneFormData.code
            }
            systemRequest.phonValidate(data).then(res =>{
              if(res.code == 200){
                let data = {
                  userAccount:this.formData.userAccount,
                  phone:this.phoneFormData.phone
                }
                systemRequest.addPhone(data).then(res => {
                  if(res.code == 200){
                    this.$notify({
                      type:'success',
                      title:res.msg
                    })
                    this.phoneDialogVisible = false;
                    this.getUserProfile();
                  }else{
                    this.$notify({
                      type:'warning',
                      title:res.msg
                    })
                  }
                  this.phoneSaveLoading = false;
                }).catch(err => {
                  console.log(err);
                  this.$notify({
                    type:'error',
                    title:error
                  })
                  this.phoneSaveLoading = false;
                })
              }else{
                this.$notify({
                  type:'warning',
                  title:res.msg
                })
                this.phoneSaveLoading = false;
              }
            })
          }else{
            this.$notify({
              type:'warning',
              title:'校验不通过，请检查红色错误提示'
            })
          }
        })
      }else{
        console.log('已绑定其他安全验证方式'+this.phoneFormData.flag);
        if(this.phoneFormData.flag == 'google'){
          console.log('表单验证谷歌随机码')
          this.$refs.phoneForm.validate((success,object)=>{
            if(success){
              this.phoneSaveLoading = true;
              let data = {
                username:this.formData.userAccount,
                code:this.phoneFormData.googlecode
              }
              console.log('验证谷歌随机码：')
              systemRequest.google_validate(data).then(res => {
                if(res.code == 200){
                  let data = {
                    userAccount:this.formData.userAccount,
                    phone:this.phoneFormData.phone
                  }
                  systemRequest.addPhone(data).then(res => {
                    if(res.code == 200){
                      this.$notify({
                        type:'success',
                        title:res.msg
                      })
                      this.phoneDialogVisible = false;
                      this.getUserProfile();
                    }else{
                      this.$notify({
                        type:'warning',
                        title:res.msg
                      })
                    }
                    this.phoneSaveLoading = false;
                  }).catch(err => {
                    console.log(err);
                    this.$notify({
                      type:'error',
                      title:error
                    })
                    this.phoneSaveLoading = false;
                  })
                }else{
                  this.$notify({
                    type:'warning',
                    title:res.msg
                  })
                  this.phoneSaveLoading = false;
                }
              }).catch(err => {
                this.$notify({
                  type:'warning',
                  title:res.msg
                })
                this.phoneSaveLoading = false;
              })
            }else{
              this.$notify({
                type:'error',
                title:'校验不通过，请检查红色错误提示'
              })
            }
          })
        }
        if(this.phoneFormData.flag == 'mail'){
          console.log('表单验证邮箱验证码')
          this.$refs.phoneForm.validate((success,object)=>{
            if(success){
              this.phoneSaveLoading = true;
              let data = {
                account:this.formData.userAccount,
                vcode:this.phoneFormData.mailcode
              }
              console.log('后端验证邮箱随机码：')
              systemRequest.emailValidate(data).then(res => {
                if(res.code == 200){
                  let data = {
                    userAccount:this.formData.userAccount,
                    phone:this.phoneFormData.phone
                  }
                  systemRequest.addPhone(data).then(res => {
                    if(res.code == 200){
                      this.$notify({
                        type:'success',
                        title:res.msg
                      })
                      this.phoneDialogVisible = false;
                      this.getUserProfile();
                    }else{
                      this.$notify({
                        type:'warning',
                        title:res.msg
                      })
                    }
                    this.phoneSaveLoading = false;
                  }).catch(err => {
                    console.log(err);
                    this.$notify({
                      type:'error',
                      title:error
                    })
                    this.phoneSaveLoading = false;
                  })
                }else{
                  this.$notify({
                    type:'warning',
                    title:res.msg
                  })
                  this.phoneSaveLoading = false;
                }
              }).catch(err => {
                this.$notify({
                  type:'warning',
                  title:res.msg
                })
                this.phoneSaveLoading = false;
              })
            }else{
              this.$notify({
                type:'error',
                title:'校验不通过，请检查红色错误提示'
              })
            }
          })
        }
      }
    },

    editGoogle(){ //点击绑定谷歌身份验证
      this.googleDialogVisible = true;
    },
    googleDialogOpen(){ //弹窗打开  显示google二维码
      this.$nextTick(() => {
        let ctn = document.querySelector('#googleCodeCtn');
        console.log(ctn);
        let iframe = document.createElement('iframe');
        let html = '<!doctype html><head><meta charset="utf-8"></head><body>'
            + '<style>*{box-sizing: border-box;margin:0;padding:0;}</style>'
            + '<img src="'+ this.googleCodeUrl + '">'
            + '</body></html>';
        let src = 'javascript:document.write(window.frameElement.getAttribute(\'data-src\'))';
        iframe.setAttribute('data-src', html);
        iframe.setAttribute('src', src);
        iframe.setAttribute('style', 'position:absolute;left:50%;transform:translateX(-50%);border:none;width:204px;height:204px;overflow:hidden;margin:auto;');
        ctn.innerHTML = '';
        ctn.appendChild(iframe)
      })
    },
    googleDialogClosed(){ //谷歌验证弹窗关闭
      this.$refs.googleForm.resetFields();
    },
    removeGoogle(){ //点击接触绑定谷歌身份验证
      this.$confirm(
        '是否确定解除绑定谷歌身份验证？',
        '注意',
        {
          confirmButtonText:'确定解除',
          cancelButtonText:'取消',
          type:'warning'
        }
      ).then(()=>{
        let data = {
          userAccount:this.formData.userAccount,
          id:this.formData.id,
          bindGoogle:'1',
        }
        systemRequest.unbindGoogle(data).then(res => {
          if(res.code == 200){
              this.$notify({
                type:'success',
                title:res.msg
              })
              this.getUserProfile();
            }else{
              this.$notify({
                type:'warning',
                title:res.msg
              })
            }
          }).catch(err => {
            console.log(err);
            this.$notify({
              type:'error',
              title:err
            })
          })
        })
    },
    googleSave(){ //绑定谷歌
      this.googleSaveLoading = true;
      let data = {
        id:this.formData.id,
        bindGoogle:'2',
        code:this.googleFormData.code,
        password:this.googleFormData.pw
      }
      this.$refs.googleForm.validate().then(() => {
        systemRequest.changeGoogle(data).then(res => {
          if(res.code == 200){
            this.$notify({
              type:'success',
              title:res.msg
            })
            this.googleDialogVisible = false;
            this.getUserProfile();
          }else{
            this.$notify({
              type:'warning',
              title:res.msg
            })
          }
          this.googleSaveLoading = false;
        }).catch(err => {
          console.log(err);
          this.$notify({
            type:'error',
            title:err
          })
          this.googleSaveLoading = false;
        })
      }).catch(err => {
        console.log(err)
        this.$notify({
          type:'error',
          title:'校验不通过，请检查红色错误提示'
        })
        this.googleSaveLoading = false;
      })
    },

    changeTwoStepState(){ //开关两步验证
      this.$confirm(
        this.formData.enable == 0?'确认启用两步验证吗？':'确认关闭两步验证吗？',
        '提示',
        {
          confirmButtonText:'确认',
          cancelButtonText:'取消',
          type:'warning'
        }
      ).then(() => {
        let data = {
          userAccount:this.formData.userAccount,
          enable:this.formData.enable == 0?1:0
        }
        systemRequest.enableTwoStep(data).then(res => {
          if(res.code == 200){
            this.$notify({
              type:'success',
              title:'操作成功'
            })
          }else{
            this.$notify({
              type:'warning',
              title:res.msg
            })
          }
          this.getUserProfile();
        })
      })
    },

    passwordDialogClosed(){  //修改密码弹窗关闭
      this.$refs.passwordForm.resetFields();
    },
    editPw(){  //修改密码
      this.passwordDialogVisible = true;
    },
    passwordSave(){ //点击确定
      this.$refs.passwordForm.validate((success) => {
        if(success){
            if(this.passwordFormData.newpw != this.passwordFormData.rpnewpw){
              this.$message({
                type:'error',
                message:'两次输入的新密码不一致'
              })
            }else{
              let data = {
                flag:0,
                password:this.passwordFormData.oldpw,
                newPassword:this.passwordFormData.newpw,
              }
              this.saveNewPw(data);
            }
        }else{
          this.$notify({
            type:'error',
            title:'校验不通过，请检查红色错误提示'
          })
        }
      })
    },
    saveNewPw(data){ //保存新密码
      this.passwordSaveLoading = true;
      systemRequest.updatePassword(data).then(res => {
        if(res.code == 200){
          this.$notify({
            type:'success',
            title:'密码修改成功'
          })
          // this.getUserProfile();
          // this.passwordDialogVisible = false;
          this.$confirm(
            '密码修改成功，请重新登录系统',
            '提示',
            {
              confirmButtonText:'确认退出',
              showCancelButton:false,
              type:'warning'
            }
          ).then(() => {
            this.$store.dispatch('LogOut').then(() => {
              location.reload()
            })
          }).catch(() => {
            this.$store.dispatch('LogOut').then(() => {
              location.reload()
            })
          })
        }else{
          this.$notify({
            type:'warning',
            title:res.msg
          })
        }
        this.passwordSaveLoading = false;
      }).catch(err => {
        console.log(err);
        this.passwordSaveLoading = false;
      })
    },
    downGoogleTutorial(){ //下载谷歌安装教程
     // let windowHandle = window.open('')
        window.location.href = '//img.csdncw.com/online/google_authenticator_tutorial.docx';
      //windowHandle.location.href = 'http://agent.huihuang300.com/download/google_authenticator_tutorial.docx'
    }
  },
  created(){
    this.getUserProfile();
  }
}
</script>
