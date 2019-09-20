<template>
  <el-card>
    <el-table
      border 
      fit
      stripe
      :data='tableData'
      :cell-style="{textAlign:'center'}"
      :header-cell-style="{textAlign:'center'}"
      v-loading='tableLoading'
    >
      <el-table-column 
        label="类型"
        prop="apkType"
      >
      </el-table-column>
      <el-table-column 
        label="当前版本"
        prop="version"
      >
      </el-table-column>
      <el-table-column 
        label="系统支持"
        prop="supportOs"
      >
      </el-table-column>
      <el-table-column 
        label="文件大小"
        prop="fileSize"
      >
      </el-table-column>
      <!-- <el-table-column 
        label="二维码图片"
        prop=""
      >
        <template slot-scope="scope">
          <el-popover
            placement="right"
            width="auto"
            trigger="click"
          >
            <div :id="scope.row.apkType" :data-url='scope.row.fileUrl'></div>
            <el-button slot="reference" size="mini">预览</el-button>
          </el-popover>
        </template>
      </el-table-column> -->
      <el-table-column 
        label="路径"
        prop="fileUrl"
      >
      </el-table-column>
      <el-table-column 
        label="编辑时间"
        prop="updateDateStr"
      >
      </el-table-column>
      <el-table-column 
        label="操作人"
        prop="updateBy"
      >
      </el-table-column>
      <el-table-column
        label="操作"
      >
        <template
          slot-scope="scope"
        >
          <el-button size="mini"
            @click='editRow(scope.row)'
          >编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑弹框 -->
    <el-dialog
      title='编辑'
      :visible.sync='dialogVisible'
      width="30%"
      @closed='dialogClosed'
    >
      <el-form
        :model="dialogData"
        label-width="120px"
        :rules="rules"
        ref="dialogForm"
      >
        <el-form-item
          label="类型"
        >
          <el-input
            v-model="dialogData.apkType"
            readonly
          >
          </el-input>
        </el-form-item>
        <el-form-item
          label="绑定ID"
          prop="bundleId"
          v-if="dialogData.apkType == 'IOS'"
        >
          <el-input
            v-model="dialogData.bundleId"
          >
          </el-input>
        </el-form-item>
        <el-form-item
          label="当前版本"
          prop="version"
        >
          <el-input
            v-model="dialogData.version"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item
          label="系统支持"
          prop="supportOs"
        >
          <el-input
            v-model="dialogData.supportOs"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item
          label="安装包名称"
          prop="fileName"
        >
          <el-input
            v-model="dialogData.fileName"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item
          label="上传安装包"
        >
          <el-upload
            action='string'
            :http-request='fileUpload'
            :on-remove="handlechange"
            :on-change="handlechange"
            :file-list="fileList"
            list-type="text"
            :before-upload="beforeFileUpload"
            :disabled='fileList.length>0'
          >
            <el-button size="small" type="primary"
              :loading='uploading'
              :disabled='fileList.length>0'
            >{{fileList.length>0?'已选择':'点击上传'}}</el-button>
            <el-button size="small" @click='delFile' type="danger"
              v-if="fileList.length>0&&!uploading"
              style="margin-left:10px;"
            >删除已上传安装包</el-button>
            <!-- <div slot="tip" class="el-upload__tip">说明：选择安装包。鼠标移动到文件名上可以显示删除按钮</div> -->
          </el-upload>
          <el-tag type="primary" v-if='uploading'>{{progressStr == 100?'请稍候...':(progressStr +'%')}}</el-tag>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-row
          type="flex"
          justify="space-between"
        >
          <el-button @click="dialogVisible = false">
            取 消
          </el-button>
          <el-button :loading="saveLoading" type="primary" @click="dialogSaveBtnHandle">
            保存
          </el-button>
        </el-row>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import systemRequest from '@/request/system'
import websiteRequest from '@/request/website'

export default {
  name:'downloadConf',
  data(){
    return {
      tableData:[],  //表格数据
      tableLoading:false, //表格加载状态

      dialogVisible:false, //弹框
      dialogData:{}, //弹框数据
      saveLoading:false, //保存按钮的状态
      rules:{
        bundleId:[
          {required:true,message:'请输入绑定id',trigger:'blur'}
        ],
        version:[
          {required:true,message:'请输入当前版本号',trigger:'blur'}
        ],
        supportOs:[
          {required:true,message:'请输入系统支持',trigger:'blur'}
        ]
      },//验证规则

      fileList:[], //elupload模型
      iosfileurl:'',  //上传成功后返回路径
      androidfileurl:'',  //上传成功后返回路径
      uploading:false, //上传状态
      progressStr:'', //上传进度

      apkName:'', //上传选择文件的原始名称

      // qrdialogVisible:false, //预览弹窗
      // crturl:false,  //当前预览的二维码链接
      // qrcode : null, //qrcodejs实例
    }
  },
  methods:{
    queryHandle(){ //查询已有的下载配置列表
      this.tableLoading = true;
      systemRequest.getSiteDownloadSetList().then(res => {
        if(res.code == 200){
          this.tableData = res.data;
          // this.initQrcode(); 2018-10-23 产品说不需要
        }else{
          this.$notify({
            type:'warning',
            title:res.msg
          })
        } 
        this.tableLoading = false;
      }).catch(err => {
        console.log(err);
        this.tableLoading = false;
      })
    },
    initQrcode(){ //生成二维码
      //Android IOS
      this.$nextTick(function(){
        let IOSdom = document.querySelector('#IOS');
        let IOSurl = IOSdom.getAttribute('data-url');
        new QRCode(IOSdom, {
          text: IOSurl,
          width: 128,
          height: 128,
          colorDark : "#000000",
          colorLight : "#ffffff",
          correctLevel : QRCode.CorrectLevel.H
        });

        let Androiddom = document.querySelector('#Android');
        let Androidurl = Androiddom.getAttribute('data-url');
        new QRCode(Androiddom, {
          text: Androidurl,
          width: 128,
          height: 128,
          colorDark : "#000000",
          colorLight : "#ffffff",
          correctLevel : QRCode.CorrectLevel.H
        });
      });
    },

    editRow(row){  //编辑
      this.dialogData = Object.assign({},row);
      if(row.fileUrl){ //无数据
        this.apkName = row.apkName.slice(row.apkName.lastIndexOf('/')+1);
        this.fileList = [{
          name:row.fileName,
          url:row.fileUrl
        }]
        this.dialogData.fileUrl = row.fileUrl.slice(row.fileUrl.lastIndexOf('/')+1);
      }else{
        this.fileList = [];
        this.dialogData.fileUrl = ''
      }
      this.dialogVisible = true;
    },

    dialogSaveBtnHandle(){ //保存
      this.saveLoading = true;
      let data = {
        "id": this.dialogData.id,
        "apkType": this.dialogData.apkType,
        "bundleId": this.dialogData.bundleId?this.dialogData.bundleId:'',
        "version": this.dialogData.version,
        "supportOs": this.dialogData.supportOs,
        "fileSize": this.dialogData.fileSize,
        "fileName": this.dialogData.fileName,
        "fileUrl": this.dialogData.fileUrl,
        "apkName": this.apkName
      }
      systemRequest.addOrUpdateSiteActivity(data).then(res => {
        if(res.code == 200){
          this.dialogVisible = false;
          this.$notify({
            type:'success',
            title:'编辑成功!'
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
        console.log(err)
      })
    },

    beforeFileUpload(){ //上传之前需要先输入安装包名
      if(!this.dialogData.fileName){
        this.$message.error('上传安装包之前需要先输入安装包名称');
        return false
      }
      if(this.dialogData.apkType == 'IOS' &&!this.dialogData.bundleId){
        this.$message.error('上传安装包之前需要先输入绑定id');
        return false
      }
    },
    fileUpload(item){    //文件上传
      this.apkName = item.file.name;
      let arr = item.file.name.split('.');
      let crtfiletype = this.dialogData.apkType == "Android"?'apk':'ipa';
      if(arr[arr.length-1] != crtfiletype){
        this.$message({
          type:'warning',
          message:'请上传.'+crtfiletype+'格式文件'
        })
        this.fileList = [];
        return
      }
      this.dialogData.fileSize = (item.file.size/1024/1024).toFixed(2) + 'M'
      this.uploadFile(item.file,4,this.dialogData.fileName,this.dialogData.bundleId)
    },
    uploadFile(file,pathType,fileName,bundleId){
      this.uploading = true;
      let data = {
        file:file,
        pathType:pathType,
        fileName:fileName,
        bundleId:bundleId,
        progcallback:e => {
          this.progressStr = ((e.loaded / e.total)*100 | 0);
        }
      }
      websiteRequest.uploadFile(data).then(res => {
        if(res.code == 200){
          this.fileList[0].url = res.data.url;
          this.fileList[0].name = res.data.url.slice(res.data.url.lastIndexOf('/')+1);
          this.dialogData.fileUrl = res.data.url.slice(res.data.url.lastIndexOf('/')+1);
          this.$notify({
            type:'success',
            title:'文件上传成功'
          })
          this.uploading = false;
        }else{
          this.fileList = [];
          this.$notify({
            type:'warning',
            title:res.msg
          })
          this.uploading = false;
        }
      }).catch(err => {
        console.log(err);
        this.fileList = [];
        this.uploading = false;
      })
    },

    handlechange(file,fileList){
      this.fileList = fileList;
    },
    delFile(){
      this.fileList = [];
      this.dialogData.fileName ='';
      this.dialogData.fileSize ='';
      this.dialogData.fileUrl ='';
    },
    
    dialogClosed(){ //弹窗关闭
      this.fileList = [];
      this.dialogData = {}
    }
  }, 
  created(){
    this.queryHandle();
  }
}
</script>
