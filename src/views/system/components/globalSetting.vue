<template>
  <el-form 
    :model="formData"
    label-width="200px"
    ref='form'
    :rules="rules"
  >
    <el-form-item label="参数名称">
      <el-row
        type="flex"
        justify="space-around"
      >
        <el-col :span="14">
          <el-row
            type="flex"
            justify="center"
            align="middle"
            style="height:40px;"
          >
            <span>设置</span>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-row
            type="flex"
            justify="center"
            align="middle"
            style="height:40px;"
          >
            <span>功能描述</span>
          </el-row>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item
      label="在线客服连接"
      prop="serviceUrl"
    >
      <el-row
        type="flex"
        justify="space-around"
      >
        <el-col :span="12">
          <el-row
            type="flex"
            justify="center"
            align="middle"
            style="height:40px;"
          >
            <el-input 
              v-model="formData.serviceUrl" placeholder="请输入URL地址"
              clearable
            ></el-input>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-row
            type="flex"
            justify="center"
            align="middle"
            style="height:40px;"
          >
            <span>在线客服链接地址配置</span>
          </el-row>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item
      label="提现方式开关"
    >
      <el-row
        type="flex"
        justify="space-around"
      >
        <el-col :span="14">
          <el-row
            type="flex"
            justify="center"
            align="middle"
            style="height:40px;"
          >
            <el-checkbox 
              :true-label="1"
              :false-label="2"
              v-model="formData.payBankFlag"
            >银行卡</el-checkbox>
            <el-checkbox 
              :true-label="1"
              :false-label="2"
              v-model="formData.payAlipayFlag"
            >支付宝</el-checkbox>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-row
            type="flex"
            justify="center"
            align="middle"
            style="height:40px;"
          >
            <span>显示/隐藏用户的提现方式</span>
          </el-row>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="稽核方式">
        <el-row   type="flex" justify="space-around">
            <el-col :span="14">
                    <el-radio v-model="formData.drawCheckType" label="1">稽核不通过时无法提起提现申请</el-radio>
                    <el-radio v-model="formData.drawCheckType" label="2">稽核不通过允许发起提现申请</el-radio>
            </el-col>  
        </el-row>
    </el-form-item>
    <el-form-item
      label="APP端启动页消息设置"
    >
      <el-row
        type="flex"
        justify="space-around"
      >
        <el-col :span="14">
          <el-row
            type="flex" justify="space-between"
          >
            <el-col :span="3">消息：</el-col>
            <el-col :span="21">
              <el-row
                type="flex"
                justify="start"
                align="middle"
                v-for="(item,idx) in msgList"
                :key="idx"
                style="margin-bottom:10px;"
              >
                <el-col :span="18"
                  style="margin-right:10px;"
                >
                  <el-input 
                    v-model="msgList[idx]" 
                    placeholder="请输入消息内容"
                    maxlength="20"
                    clearable
                  ></el-input>
                </el-col>
                <el-col :span="2"
                  style="margin-right:10px;"
                  v-if="msgList.length > 1"
                >
                  <el-button
                    size="small" icon="el-icon-minus" circle
                    @click='msgList.splice(idx,1)'
                  ></el-button>
                </el-col>
                <el-col :span="2"
                  style="margin-right:10px;"
                  v-if="idx == msgList.length - 1 && msgList.length < 6"
                >
                  <el-button 
                    size="small" type="primary" icon="el-icon-plus" circle
                    @click="msgList.push('')"
                  ></el-button>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-row
            type="flex"
            justify="center"
            align="middle"
            style="height:40px;"
          >
            <span>随机选择已设置的消息展示在APP启动页面</span>
          </el-row>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item
            label="前端官网设置"
            prop="websiteUrl"
            style="margin-bottom: 30px;"
    >
      <el-row
              type="flex"
              justify="space-around"
      >
        <el-col :span="12">
          <el-row
                  type="flex"
                  justify="center"
                  align="middle"
                  style="height:40px;"
          >
            <el-input
                    v-model="formData.websiteUrl" placeholder="请输入URL地址"
                    clearable
            ></el-input>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-row
                  type="flex"
                  justify="center"
                  align="middle"
                  style="height:40px;"
          >
            <span>前端官网地址展示</span>
          </el-row>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item
            label="推广排行虚拟数据"
            prop="popvtState"
            style="margin-bottom: 30px;"
    >
      <el-row
              type="flex"
              justify="space-around"
      >
        <el-col :span="12">
          <el-row
                  type="flex"
                  justify="left"
                  align="middle"
                  style="height:40px;"
          >
            <el-switch
                    v-model="formData.popvtState"
                    :active-value="1"
                    :inactive-value="2"
                    active-text="开启"
                    inactive-text="关闭">
            </el-switch>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-row
                  type="flex"
                  justify="center"
                  align="middle"
                  style="height:40px;"
          >
            <span>虚拟推广排行</span>
          </el-row>
        </el-col>
      </el-row>
    </el-form-item>


    <!-- <el-form-item
      label="APPkey"
      prop="appKey"
    >
      <el-row
        type="flex"
        justify="space-around"
      >
        <el-col :span="14">
          <el-row
            type="flex"
            justify="center"
            align="middle"
            style="height:40px;"
          >
            <el-input 
              v-model="formData.appKey" placeholder="请输入"
              clearable
            ></el-input>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-row
            type="flex"
            justify="center"
            align="middle"
            style="height:40px;"
          >
            <span></span>
          </el-row>
        </el-col>
      </el-row>
    </el-form-item> -->
    <el-form-item
      label="提示音设置"
    >
      <el-row
        type="flex"
        justify="space-around"
      >
        <el-col :span="22">
          <el-table
            class="golbal_param_audios_table"
            :data="audiosData"
            border
            fit
            stripe
            :header-cell-style="{textAlign:'center'}"
            :cell-style="{textAlign:'center'}"
          >
            <el-table-column
              prop="name"
              label="提示音项目"></el-table-column>
            <el-table-column
              label="当前声音"
            >
              <template slot-scope="{ row }">
                <span
                  v-if="row.name == '官网充值'"
                >
                  {{formData.offMusic.startsWith('default')?'默认铃声':'自定义铃声'}}
                </span>
                <span
                  v-if="row.name == '线上支付'"
                >
                  {{formData.lineMusic.startsWith('default')?'默认铃声':'自定义铃声'}}
                </span>
                <span
                  v-if="row.name == '支付宝出款'"
                >
                  {{formData.zfbMusic.startsWith('default')?'默认铃声':'自定义铃声'}}
                </span>
                <span
                  v-if="row.name == '银行卡出款'"
                >
                  {{formData.bankMusic.startsWith('default')?'默认铃声':'自定义铃声'}}
                </span>
                <span
                  v-if="row.name == '自动出款交易'"
                >
                  {{formData.autoMusic.startsWith('default')?'默认铃声':'自定义铃声'}}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              label="启用声音"
            >
              <template slot-scope="{ row }">
                <span
                  v-if="row.name == '官网充值'"
                >
                  <el-switch
                    v-model="formData.offState"
                    :active-value="1"
                    :inactive-value="2"
                    active-text="开启"
                    inactive-text="关闭">
                  </el-switch>
                </span>
                <span
                  v-if="row.name == '线上支付'"
                >
                  <el-switch
                    v-model="formData.lineState"
                    :active-value="1"
                    :inactive-value="2"
                    active-text="开启"
                    inactive-text="关闭">
                  </el-switch>
                </span>
                <span
                  v-if="row.name == '支付宝出款'"
                >
                  <el-switch
                    v-model="formData.zfbState"
                    :active-value="1"
                    :inactive-value="2"
                    active-text="开启"
                    inactive-text="关闭">
                  </el-switch>
                </span>
                <span
                  v-if="row.name == '银行卡出款'"
                >
                  <el-switch
                    v-model="formData.bankState"
                    :active-value="1"
                    :inactive-value="2"
                    active-text="开启"
                    inactive-text="关闭">
                  </el-switch>
                </span>
                <span
                  v-if="row.name == '自动出款交易'"
                >
                  <el-switch
                    v-model="formData.autoState"
                    :active-value="1"
                    :inactive-value="2"
                    active-text="开启"
                    inactive-text="关闭">
                  </el-switch>
                </span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              class-name="operate_column"
            >
              <template slot-scope="{ row }">
                <template
                  v-if="row.name == '官网充值'"
                >
                  <el-upload
                    action='meaninglessString'
                    :http-request='offMusicUpload'
                    :before-upload="beforeFileUpload"
                    accept='audio/mp3'
                    :file-list="offMusicFl"
                    :disabled='offUploading'
                  >
                    <el-button size="mini" type="primary"
                      :disabled="offUploading"
                    >
                      {{offUploading?('上传中...'+(progressStr == 100?'请稍候...':(progressStr +'%'))):'上传'}}
                    </el-button>
                  </el-upload>
                  <el-button size="mini" type="danger"
                    @click='resetAudio("off")'
                  >重置</el-button>
                </template>
                <template
                  v-if="row.name == '线上支付'"
                >
                  <el-upload
                    action='meaninglessString'
                    :http-request='lineMusicUpload'
                    :before-upload="beforeFileUpload"
                    accept='audio/mp3'
                    :file-list="lineMusicFl"
                    :disabled='lineUploading'
                  >
                    <el-button size="mini" type="primary"
                      :disabled="lineUploading"
                    >
                      {{lineUploading?('上传中...'+(progressStr == 100?'请稍候...':(progressStr +'%'))):'上传'}}
                    </el-button>
                  </el-upload>
                  <el-button size="mini" type="danger"
                    @click='resetAudio("line")'
                  >重置</el-button>
                </template>
                <template
                  v-if="row.name == '支付宝出款'"
                >
                  <el-upload
                    action='meaninglessString'
                    :http-request='zfbMusicUpload'
                    :before-upload="beforeFileUpload"
                    accept='audio/mp3'
                    :file-list="zfbMusicFl"
                    :disabled='zfbUploading'
                  >
                    <el-button size="mini" type="primary"
                      :disabled="zfbUploading"
                    >
                      {{zfbUploading?('上传中...'+(progressStr == 100?'请稍候...':(progressStr +'%'))):'上传'}}
                    </el-button>
                  </el-upload>
                  <el-button size="mini" type="danger"
                    @click='resetAudio("zfb")'
                  >重置</el-button>
                </template>
                <template
                  v-if="row.name == '银行卡出款'"
                >
                  <el-upload
                    action='meaninglessString'
                    :http-request='bankMusicUpload'
                    :before-upload="beforeFileUpload"
                    accept='audio/mp3'
                    :file-list="bankMusicFl"
                    :disabled='bankUploading'
                  >
                    <el-button size="mini" type="primary"
                      :disabled="bankUploading"
                    >
                      {{bankUploading?('上传中...'+(progressStr == 100?'请稍候...':(progressStr +'%'))):'上传'}}
                    </el-button>
                  </el-upload>
                  <el-button size="mini" type="danger"
                    @click='resetAudio("bank")'
                  >重置</el-button>
                </template>
                <template
                  v-if="row.name == '自动出款交易'"
                >
                  <el-upload
                    action='meaninglessString'
                    :http-request='autoMusicUpload'
                    :before-upload="beforeFileUpload"
                    accept='audio/mp3'
                    :file-list="autoMusicFl"
                    :disabled='autoUploading'
                  >
                    <el-button size="mini" type="primary"
                      :disabled="autoUploading"
                    >
                      {{autoUploading?('上传中...'+(progressStr == 100?'请稍候...':(progressStr +'%'))):'上传'}}
                    </el-button>
                  </el-upload>
                  <el-button size="mini" type="danger"
                    @click='resetAudio("auto")'
                  >重置</el-button>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-form-item>
    <el-row
      type="flex"
      justify="center"
    >
      <el-button type="primary"
        @click="SaveBtnClick" 
        :loading="saveLoading"
      >保存</el-button>
    </el-row>
  </el-form>
</template>

<script>
import systemRequest from '@/request/system'
import websiteRequest from '@/request/website'
import validator from '@/tool/validate'

export default {
  name:'GlobalParam',
  data () {
    return {
      formData:{
        id:0,
        serviceUrl:"", //客服链接
        maxPayLimit:null, //人工存款限额
        maxDrawLimit:null, //人工提款限额
        payBankFlag:1, //银行卡开关  1开 2关
        payAlipayFlag:1, //支付宝开关  1开  2关
        appMsg:'', //启动页消息 以@=@分割
        // appKey:'', //appkey
        siteId:0,
        websiteUrl:"",//前端官网设置
        
        drawCheckType:'', //稽核出款类型 1 稽核不通过不允许 2 稽核通过允许
        offMusic:'', //官网充值提示音
        lineMusic:'', //线上支付提示音
        zfbMusic:'', //支付宝出款提示音
        bankMusic:'', //银行卡出款提示音
        autoMusic:'', //自动出款提示音

        offState:'', //官网充值提示音状态  1启用 2关闭
        lineState:'', //线上支付提示音状态  1启用 2关闭
        zfbState:'', //支付宝出款提示音状态  1启用 2关闭
        bankState:'', //银行卡出款提示音状态  1启用 2关闭
        autoState:'', //自动出款提示音状态  1启用 2关闭
        popvtState:1,//推广排行虚拟数据 1启用 2关闭 默认启用
      },
      audiosData:[
        {
          name:'官网充值',
        },
        {
          name:'线上支付',
        },
        {
          name:'支付宝出款',
        },
        {
          name:'银行卡出款',
        },
        {
          name:'自动出款交易',
        }
      ],
      msgList:[''], //消息列表  最终拼接成formdata.appMsg
      rules:{
          serviceUrl:[ //url验证规则
          {validator:validator.codeserviceUrlType,trigger:'blur'}
        ],
        maxPayLimit:[
          {validator:validator.maxPayLimit,trigger:'blur'}
        ],
        maxDrawLimit:[
          {validator:validator.maxPayLimit,trigger:'blur'}
        ],
          websiteUrl:[
            //  {required:true,message:"前端官网设置不能为空",trigger:'blur'},
              {validator:validator.websiteUrl,trigger:'blur'}
          ]
      },
      saveLoading:false,

      watchFlag:false, //true开始监听   false忽略监听

      offMusicFl:[], //官网充值提示音上传file list
      lineMusicFl:[], //线上支付提示音上传file list
      zfbMusicFl:[], //支付宝提示音上传file list
      bankMusicFl:[], //银行卡提示音上传file list
      autoMusicFl:[], //自动出款提示音上传file list
      offUploading:false, //上传状态
      lineUploading:false, //上传状态
      zfbUploading:false, //上传状态
      bankUploading:false, //上传状态
      autoUploading:false, //上传状态

      progressStr:0, //上传进度
    }
  },
  methods:{
    queryHandle(){  //获取已保存的参数
      systemRequest.getGlobal(this.formData).then(res => {
        if(res.code == 200){
          this.formData = res.data;
            //this.formData.promoteRankingState = this.formData.promoteRankingState? 1:1;
          console.log(this.formData);
          this.msgList = res.data.appMsg.split('@=@');
          setTimeout(() => {
            this.watchFlag = true;
          },1*1000)
        }else{
          this.$notify({
            type:'warning',
            title:res.msg
          })
        }
        this.saveLoading = false;
      })
    },
    SaveBtnClick(){ //点击保存按钮
      if(this.formData.payBankFlag === 2 && this.formData.payAlipayFlag === 2){
        this.$notify({
          type:'warning',
          title:'请至少选择一种提现方式'
        })
        return
      }
      if(this.formData.drawCheckType=='' || this.formData.drawCheckType==undefined){
         this.$notify({
          type:'warning',
          title:'请至少选择一种稽核方式'
        })
        return
      }
      if(!this.msgList[0].length>0){
        this.$notify({
          type:'warning',
          title:'请至少输入一条启动页消息'
        })
        return
      }
      this.$refs.form.validate().then((resolve) => { //表单验证
        this.saveLoading = true;
        let str = '';
        this.msgList.forEach((value,idx) => {
          if(value.length>0){
            if(idx === 0){
              str = value
            }else{
              str += '@=@'+value
            }
          }
          this.formData.appMsg = str;
        })

          //this.formData.serviceUrl=this.formData.serviceUrl.trim();
          //this.formData.websiteUrl=this.formData.websiteUrl.trim();
          this.formData.serviceUrl=this.formData.serviceUrl.replace(/\s+/g, ""); //过滤多余回车
          this.formData.websiteUrl=this.formData.websiteUrl.replace(/\s+/g, ""); //过滤多余回车
        systemRequest.updateGlobal(this.formData).then(res => {
          if(res.code == 200){
            this.$notify({
              type:'success',
              title:'保存成功'
            })
            this.queryHandle();
          }else{
            this.$notify({
              type:'warning',
              title:res.msg
            })
          }
          this.saveLoading = false;
        }).catch(err => {
          console.log(err);
          this.saveLoading = false;
        })
      }).catch(result => {
        this.$notify({
          type:'error',
          title:'校验结果不通过，请检查页面错误提示'
        })
      })

    },
    popTip(){ //保存提示
      this.$message({
        type:'info',
        message:'参数已记录，请点击“保存”按钮以生效'
      })
    },
    resetAudio(type){ //重置提示音
      this.$confirm(
        '是否确认重置为默认铃声？',
        '提示',
        {
          confirmButtonText:'确定',
          cancleButtonText:'取消',
        }
      ).then(() => {
        switch (type) {
          case 'off':
            this.formData.offMusic = 'default1.mp3'
          break;
          case 'line':
            this.formData.lineMusic = 'default2.mp3'
          break;
          case 'zfb':
            this.formData.zfbMusic = 'default3.mp3'
          break;
          case 'bank':
            this.formData.bankMusic = 'default4.mp3'
          break;
          case 'auto':
            this.formData.autoMusic = 'default5.mp3'
          break;
        }
      }).catch(e => {})
    },
    beforeFileUpload(file){ //音频上传之前检查格式
      if(file.type != 'audio/mp3'){
        this.$message.error('请选择mp3格式的音频上传');
        return false
      }
    },
    offMusicUpload(item){
      this.uploadFile(item.file,'off')
    },
    lineMusicUpload(item){
      this.uploadFile(item.file,'line')
    },
    zfbMusicUpload(item){
      this.uploadFile(item.file,'zfb')
    },
    bankMusicUpload(item){
      this.uploadFile(item.file,'bank')
    },
    autoMusicUpload(item){
      this.uploadFile(item.file,'auto')
    },
    uploadFile(file,type){
      switch (type) {
        case 'off':
          this.offUploading = true;
        break;
        case 'line':
          this.lineUploading = true;
        break;
        case 'zfb':
          this.zfbUploading = true;
        break;
        case 'bank':
          this.bankUploading = true;
        break;
        case 'auto':
          this.autoUploading = true;
        break;
      }
      let data = {
        file:file,
        pathType:6,
        progcallback:e => {
          this.progressStr = ((e.loaded / e.total)*100 | 0);
        }
      }
      websiteRequest.uploadFile(data).then(res => {
        if(res.code == 200){
          let url = res.data.url;
          let _url = url.slice(url.lastIndexOf('/')+1);
          switch (type) {
            case 'off':
              this.formData.offMusic = _url;
            break;
            case 'line':
              this.formData.lineMusic = _url;
            break;
            case 'zfb':
              this.formData.zfbMusic = _url;
            break;
            case 'bank':
              this.formData.bankMusic = _url;
            break;
            case 'auto':
              this.formData.autoMusic = _url;
            break;
          }
          this.$notify({
            type:'success',
            title:'提示音上传成功'
          })
        }else{
          this.$notify({
            type:'warning',
            title:res.msg
          })
        }
        switch (type) {
          case 'off':
            this.offUploading = false;
            this.offMusicFl = [];
          break;
          case 'line':
            this.lineUploading = false;
            this.lineMusicFl = [];
          break;
          case 'zfb':
            this.zfbUploading = false;
            this.zfbMusicFl = [];
          break;
          case 'bank':
            this.bankUploading = false;
            this.bankMusicFl = [];
          break;
          case 'auto':
            this.autoUploading = false;
            this.autoMusicFl = [];
          break;
        }
      }).catch(err => {
        console.log(err);
        switch (type) {
          case 'off':
            this.offUploading = false;
            this.offMusicFl = [];
          break;
          case 'line':
            this.lineUploading = false;
            this.lineMusicFl = [];
          break;
          case 'zfb':
            this.zfbUploading = false;
            this.zfbMusicFl = [];
          break;
          case 'bank':
            this.bankUploading = false;
            this.bankMusicFl = [];
          break;
          case 'auto':
            this.autoUploading = false;
            this.autoMusicFl = [];
          break;
        }
      })
    },
  },
  watch:{
    'formData':{
      deep:true,
      handler:function(){
        if(this.watchFlag){
          this.popTip();
          this.watchFlag = false;
          setTimeout(() => {
            this.watchFlag = true;
          },3*1000)
        }
      }
    },
  },
  created () {
    this.queryHandle();
  }
}
</script>

<style lang="scss">
.golbal_param_audios_table{
  .operate_column{
    >.cell>div{
      display: inline-block;
      margin-right: 10px;
      .el-upload-list{
        display: none;
      }
    }
  }
}
</style>
