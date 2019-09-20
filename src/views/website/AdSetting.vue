<template>
  <el-card body-style="overflow-y:scroll;overflow-x:hidden">
    <el-form
      label-width="100px"
      v-loading="modalLoading"
    >
      <el-form-item 
        label="棋牌游戏顶部"
      >
        <el-upload
          action='string'
          :http-request='qpfileUpload'
          :on-preview="handlePreview"
          :on-remove="handleRemoveQp"
          :on-change="handlechangeQp"
          :before-upload="beforeFileUpload"
          accept='image/*'
          :file-list="fileListQp"
          list-type="picture"
          :disabled='fileListQp.length>0'
        >
          <el-button size="small" type="primary" slot="trigger"
            :disabled='fileListQp.length>0'
          >{{fileListQp.length>0?'已选择':'点击上传'}}</el-button>
          <el-button size="small" @click='delQP' type="danger"
            v-if="fileListQp.length>0"
            style="margin-left:10px;"
          >删除已上传图片</el-button>
          <div slot="tip" class="el-upload__tip">说明：支持上传JPG、PNG、GIF文件,大小500kb以内。点击链接可以预览</div>
        </el-upload>
      </el-form-item>
      <el-form-item 
        label="捕鱼游戏顶部"
      >
        <el-upload
          action='string'
          :http-request='byfileUpload'
          :on-preview="handlePreview"
          :on-remove="handleRemoveBy"
          :on-change="handlechangeBy"
          :before-upload="beforeFileUpload"
          accept='image/*'
          :file-list="fileListBy"
          list-type="picture"
          :disabled='fileListBy.length>0'
        >
          <el-button size="small" type="primary"
            :disabled='fileListBy.length>0'
          >{{fileListBy.length>0?'已选择':'点击上传'}}</el-button>
          <el-button size="small" @click='delBY' type="danger"
            v-if="fileListBy.length>0"
            style="margin-left:10px;"
          >删除已上传图片</el-button>
          <div slot="tip" class="el-upload__tip">说明：支持上传JPG、PNG、GIF文件,大小500kb以内。点击链接可以预览</div>
        </el-upload>
      </el-form-item>
      <el-form-item 
        label="电玩游戏顶部"
      >
        <el-upload
          action='string'
          :http-request='dwfileUpload'
          :on-preview="handlePreview"
          :on-remove="handleRemoveDw"
          :on-change="handlechangeDw"
          :before-upload="beforeFileUpload"
          accept='image/*'
          :file-list="fileListDw"
          list-type="picture"
          :disabled='fileListDw.length>0'
        >
          <el-button size="small" type="primary"
            :disabled='fileListDw.length>0'
          >{{fileListDw.length>0?'已选择':'点击上传'}}</el-button>
          <el-button size="small" @click='delDW' type="danger"
            v-if="fileListDw.length>0"
            style="margin-left:10px;"
          >删除已上传图片</el-button>
          <div slot="tip" class="el-upload__tip">说明：支持上传JPG、PNG、GIF文件,大小500kb以内。点击链接可以预览</div>
        </el-upload>
      </el-form-item>
      <el-form-item 
        label="优惠活动顶部"
      >
        <el-upload
          action='string'
          :http-request='yhfileUpload'
          :on-preview="handlePreview"
          :on-remove="handleRemoveYh"
          :on-change="handlechangeYh"
          :before-upload="beforeFileUpload"
          accept='image/*'
          :file-list="fileListYh"
          list-type="picture"
          :disabled='fileListYh.length>0'
        >
          <el-button size="small" type="primary"
            :disabled='fileListYh.length>0'
          >{{fileListYh.length>0?'已选择':'点击上传'}}</el-button>
          <el-button size="small" @click='delYH' type="danger"
            v-if="fileListYh.length>0"
            style="margin-left:10px;"
          >删除已上传图片</el-button>
          <div slot="tip" class="el-upload__tip">说明：支持上传JPG、PNG、GIF文件,大小500kb以内。点击链接可以预览</div>
        </el-upload>
      </el-form-item>
    </el-form>
    <el-row
      type="flex"
      justify="center"
    >
      <el-button type="primary" size="medium"
        @click='SaveAdClick'
      >保存</el-button>
    </el-row>
  </el-card>
</template>

<script>
import websiteRequest from '@/request/website'
import changeUrl from '@/tool/strUtil'

export default {
  name:'AdSetting',
  data(){
    return {
      fileListQp:[],  //elupload模型
      fileListBy:[],
      fileListDw:[],
      fileListYh:[],

      qpurl:'',  //上传成功后返回路径
      byurl:'',
      dwurl:'',
      yhurl:'',

        qpurlOnline:'',  //线上返回路径
        byurlOnline:'',
        dwurlOnline:'',
        yhurlOnline:'',

      qpid:'',  //已存在广告图id
      byid:'',
      dwid:'',
      yhid:'',
        modalLoading:false,
    }
  },
  methods:{
      beforeFileUpload(file){ //图片上传之前检查格式
          if(file.type != "image/png" && file.type != "image/jpeg" && file.type != "image/bmp" && file.type != "image/gif"){
              this.$message.warning({message:'图片格式只能是jpg/jpeg/png/bmp/gif其中的一种'});
              return false;
          }
      },
    qpfileUpload(item){    //棋牌广告图上传
          if(item.file.size > 512000){
            this.$message.warning({message:'图片文件大小超过500kb，无法上传'})
            this.fileListQp = [];
            this.qpurlOnline = '';
            this.qpurl ='';
        }else{
          this.uploadFile(item.file,1,'qp')
        }
    },
    byfileUpload(item){     //捕鱼广告图上传
       if(item.file.size > 512000){
        this.$message.warning({message:'图片文件大小超过500kb，无法上传'})
        this.fileListBy = [];
        this.byurlOnline = '';
        this.byurl = '';
      }else{
        this.uploadFile(item.file,1,'by')
      }
    },
    dwfileUpload(item){     //电玩广告图上传
        if(item.file.size > 512000){
        this.$message.warning({message:'图片文件大小超过500kb，无法上传'})
        this.fileListDw = [];
        this.dwurlOnline = '';
        this.dwurl = '';
      }else{
        this.uploadFile(item.file,1,'dw')
      }
    },
    yhfileUpload(item){     //优惠活动图上传
         if(item.file.size > 512000){
         this.$message.warning({message:'图片文件大小超过500kb，无法上传'})
         this.fileListYh = [];
         this.yhurlOnline = '';
         this.yhurl = '';
      }else{
        this.uploadFile(item.file,1,'yh')
      }
    },
    uploadFile(file,pathType,name){
      let data = {
        file:file,
        pathType:pathType,
      }
      websiteRequest.uploadFile(data).then(res => {
        if(res.code == 200){
          if(name=='qp'){
            this.qpurl = pathType;//changeUrl(res.data.url);
              this.qpurlOnline = changeUrl(res.data.url);
           /* this.fileListQp = [
              {
                name:res.data.url,
                url:changeUrl(res.data.url)
              }
            ]*/
          }else if(name == 'by'){
            this.byurl = pathType;//changeUrl(res.data.url);
              this.byurlOnline = changeUrl(res.data.url);
           /* this.fileListBy = [
              {
                name:res.data.url,
                url:changeUrl(res.data.url)
              }
            ]*/
          }else if(name == 'dw'){
            this.dwurl = pathType;//changeUrl(res.data.url);
              this.dwurlOnline = changeUrl(res.data.url);
           /* this.fileListDw = [
              {
                name:res.data.url,
                url:changeUrl(res.data.url)
              }
            ]*/
          }else if(name == 'yh'){
            this.yhurl = pathType;//changeUrl(res.data.url);
              this.yhurlOnline = changeUrl(res.data.url);
           /* this.fileListYh = [
              {
                name:res.data.url,
                url:changeUrl(res.data.url)
              }
            ]*/
          }
          this.$notify({
            type:'success',
            title:'图片上传成功'
          })
        }else{
          if(name=='qp'){
            this.fileListQp = []
          }else if(name == 'by'){
            this.fileListBy = []
          }else if(name == 'dw'){
            this.fileListDw = []
          }else if(name == 'yh'){
            this.fileListYh = []
          }
          this.$notify({
            type:'warning',
            title:res.msg
          })
        }
      }).catch(err => {
        console.log(err);
        if(name=='qp'){
          this.fileListQp = []
        }else if(name == 'by'){
          this.fileListBy = []
        }else if(name == 'dw'){
          this.fileListDw = []
        }else if(name == 'yh'){
          this.fileListYh = []
        }
      })
    },
    SaveAdClick(){ //保存广告图设置

         if(this.fileListQp.length==0){
             this.$message.warning({message:'请上传棋牌游戏顶部图片!'});
             return;
         }
        if(this.fileListBy.length==0){
            this.$message.warning({message:'请上传捕鱼游戏顶部图片!'});
            return;
        }
        if(this.fileListDw.length==0){
            this.$message.warning({message:'请上传电玩游戏顶部图片!'});
            return;
        }
        if(this.fileListYh.length==0){
            this.$message.warning({message:'请上传优惠活动顶部图片!'});
            return;
        }
      let data = [
        {
          "id":this.qpid,
          "picturePc": this.qpurlOnline?this.qpurlOnline.slice(this.qpurlOnline.lastIndexOf('/')+1):'',
          "pictureType": "2"
        },
        {
          "id":this.byid,
          "picturePc": this.byurlOnline?this.byurlOnline.slice(this.byurlOnline.lastIndexOf('/')+1):'',
          "pictureType": "3"
        },
        {
          "id":this.dwid,
          "picturePc": this.dwurlOnline?this.dwurlOnline.slice(this.dwurlOnline.lastIndexOf('/')+1):'',
          "pictureType": "4"
        },
        {
          "id":this.yhid,
          "picturePc": this.yhurlOnline?this.yhurlOnline.slice(this.yhurlOnline.lastIndexOf('/')+1):'',
          "pictureType": "5"
        }
      ]
      websiteRequest.addAdsPicture(data).then(res => {
        if(res.code == 200){
          this.$notify({
            type:'success',
            title:'保存成功'
          })
            this.getPictureList();
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
    getPictureList(){ // 获取图片列表
      let data = {
        "limit": 4,
        "offset": 0,
        "sort": "",
        "sortOrder": ""
      }
      this.modalLoading=  true;
      websiteRequest.getPictureList(data).then(res => {
        if(res.code == 200){
          res.data.rows.forEach((item) => {
            //console.log(item);
            switch (item.pictureType){
              case '2':
                this.qpid = item.id;
                if(item.picturePc){
                  this.qpurl = changeUrl(item.picturePc);
                  this.qpurlOnline = changeUrl(item.picturePc);
                  this.fileListQp = [
                    {
                      name:item.picturePc,
                      url:changeUrl(item.picturePc)
                    }
                  ]
                }else{
                  this.qpurl = '';
                  this.qpurlOnline = '';
                  this.fileListQp = [];
                }
              break;
              case '3':
                this.byid = item.id;
                if(item.picturePc){
                  this.byurl = changeUrl(item.picturePc);
                  this.byurlOnline = changeUrl(item.picturePc);
                  this.fileListBy = [
                    {
                      name:item.picturePc,
                      url:changeUrl(item.picturePc)
                    }
                  ]
                }else{
                  this.byurl = '';
                  this.byurlOnline = '';
                  this.fileListBy = [];
                }
              break;
              case '4':
                this.dwid = item.id;
                if(item.picturePc){
                  this.dwurl = changeUrl(item.picturePc);
                  this.dwurlOnline = changeUrl(item.picturePc);
                  this.fileListDw = [
                    {
                      name:item.picturePc,
                      url:changeUrl(item.picturePc)
                    }
                  ]
                }else{
                  this.dwurl = '';
                  this.dwurlOnline = '';
                  this.fileListDw = [];
                }
              break;
              case '5':
                this.yhid = item.id;
                if(item.picturePc){
                  this.yhurl = changeUrl(item.picturePc);
                  this.yhurlOnline = changeUrl(item.picturePc);
                  this.fileListYh = [
                    {
                      name:item.picturePc,
                      url:changeUrl(item.picturePc)
                    }
                  ]
                }else{
                  this.yhurl = '';
                  this.yhurlOnline = '';
                  this.fileListYh = [];
                }
              break;
            }
          });
            this.modalLoading=  false;
        }else{
          this.$notify({
            type:'warning',
            title:res.msg
          });
            this.modalLoading=  false;
        }
      }).catch(err => {
        console.log(err);
          this.modalLoading=  false;
      })
    },
    handlePreview(file){
      let message = '<div style="width:370px;height:370px;background:url('+file.url+') no-repeat center;background-size:contain;" >';
      this.$alert(message, '预览', {
        dangerouslyUseHTMLString:true,
        closeOnClickModal:true,
        closeOnPressEscape:true,
        center:true
      }).catch(err => {})
    },
    //自定义删除方法  解决el-upload组件disable=true时没有删除按钮的问题
    delQP(){   //删除棋牌
      this.fileListQp = [];
      this.qpurl = '';
      this.qpurlOnline='';
    },
    delBY(){  //删除捕鱼
      this.fileListBy = [];
      this.byurl = '';
      this.byurlOnline='';
    },
    delDW(){  //删除电玩
      this.fileListDw = [];
      this.dwurl = '';
      this.dwurlOnline='';
    },
    delYH(){  //删除优惠
      this.fileListYh = [];
      this.yhurl = '';
      this.yhurlOnline='';
    },

    handleRemoveQp(file,fileList){
      this.fileListQp = fileList;
    },
    handlechangeQp(file,fileList){
      this.fileListQp = fileList;
    },

    handleRemoveBy(file,fileList){
      this.fileListBy = fileList;
    },
    handlechangeBy(file,fileList){
      this.fileListBy = fileList;
    },

    handleRemoveDw(file,fileList){
      this.fileListDw = fileList;
    },
    handlechangeDw(file,fileList){
      this.fileListDw = fileList;
    },

    handleRemoveYh(file,fileList){
      this.fileListYh = fileList;
    },
    handlechangeYh(file,fileList){
      this.fileListYh = fileList;
    },
  },
  created(){
      this.$nextTick(()=>{
          this.getPictureList();
      })
  }
}
</script>

