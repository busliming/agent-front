<template>
  <el-card>
    <el-row style="height:60px">
      <el-button type="primary" size="medium"
        @click='addNewBanner'
      >新增</el-button>
    </el-row>
    <el-table
      :data="tableData"
      v-loading="isloading"
      style="width: 100%;"
      :border='true'
      :fit='true'
      size="medium"
      stripe
      :cell-style='{textAlign:"center"}'
      :header-cell-style='{textAlign:"center"}'
      :default-sort = "{prop: 'createDate', order: 'descending'}"
    >
      <el-table-column
        prop="pictureName"
        label="图片名称"
      >
      </el-table-column>
      <el-table-column
        prop="picturePc"
        label="PC端图片"
      >
        <template slot-scope="scope">
          <el-button size="mini"
            @click='prevPic(scope.row.picturePc)'
          >预览</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="pictureMb"
        label="H5端图片"
      >
        <template slot-scope="scope">
          <el-button size="mini"
            @click='prevPic(scope.row.pictureMb)'
          >预览</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="createDateStr"
        label="添加时间"
      >
      </el-table-column>
      <el-table-column
        prop="linkUrl"
        label="链接地址"
      >
      </el-table-column>
      <el-table-column
        prop="pictureSort"
        label="排序"
      >
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        width="">
        <template slot-scope="scope">
          <el-tag size="medium" color="#ddd" type="danger" v-if="scope.row.status == 0">禁用</el-tag>
          <el-tag size="medium" color="#fff" type="success" v-if="scope.row.status == 1">启用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="createBy"
        label="操作者"
        width="">
      </el-table-column>
      <el-table-column
        prop="operating"
        width="180"
        label="操作">
        <template slot-scope="scope">
          <el-button size="mini" plain @click="editRow(scope.row)">编辑</el-button>
          <el-button size="mini" plain @click='deleteRow(scope.row)' type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="center">
      <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle" 
        :current-page="pageNum"
        :page-sizes="[10,20,50,100,200]"
        :page-size.sync="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-row>

    <el-dialog
      :title='dialogTitle'
      :visible.sync='dialogVisible'
      width="30%"
      @closed='dialogClosedHandle'
    >
      <el-form
        :model="dialogData"
        label-width="100px"
        :rules="rules"
        ref="dialogForm"
      >
        <el-form-item
          label="图片名称："
          prop="pictureName"
        >
          <el-input
            v-model="dialogData.pictureName"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item
          label="PC端图片"
        >
          <el-upload
            action='string'
            :http-request='pcfileUpload'
            :on-preview="handlePreview"
            :on-remove="handleRemovePc"
            :on-change="handlechangePc"
            :before-upload="beforeFileUpload"
            accept='image/*'
            :file-list="fileListPc"
            list-type="picture"
            :disabled='fileListPc.length>0'
          >
            <el-button size="small" type="primary"
              :disabled='fileListPc.length>0'
            >{{fileListPc.length>0?'已选择':'点击上传'}}</el-button>
            <el-button size="small" @click='delPC' type="danger"
              v-if="fileListPc.length>0"
              style="margin-left:10px;"
            >删除已上传图片</el-button>
            <div slot="tip" class="el-upload__tip">说明：支持上传JPG、PNG、GIF文件,大小500kb以内。</div>
          </el-upload>
        </el-form-item>
        <el-form-item
          label="H5端图片"
        >
          <el-upload
            action='string'
            :http-request='mobfileUpload'
            :on-preview="handlePreview"
            :on-remove="handleRemoveMob"
            :on-change="handlechangeMob"
            :before-upload="beforeFileUpload"
            accept='image/*'
            :file-list="fileListMob"
            list-type="picture"
            :disabled='fileListMob.length>0'
          >
            <el-button size="small" type="primary"
              :disabled='fileListMob.length>0'
            >{{fileListMob.length>0?'已选择':'点击上传'}}</el-button>
            <el-button size="small" @click='delMOB' type="danger"
              v-if="fileListMob.length>0"
              style="margin-left:10px;"
            >删除已上传图片</el-button>
            <div slot="tip" class="el-upload__tip">说明：支持上传JPG、PNG、GIF文件,大小500kb以内。</div>
          </el-upload>
        </el-form-item>
        <el-form-item
          label="链接地址："
          prop="linkUrl"
        >
          <el-input
            v-model="dialogData.linkUrl"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item
          label="排序："
        >
          <el-input
            v-model="dialogData.pictureSort"
            placeholder="数字越小下拉排序越靠前"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item
          label="状态："
        >
          <el-select v-model="dialogData.status" placeholder="请选择"
            style="width:100%"
          >
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
          </el-select>
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
import websiteRequest from '@/request/website'
import changeUrl from '@/tool/strUtil'

export default {
  name:'BannerSetting',
  data(){
    return {
      tableData:[],
      isloading:false,

      dialogTitle:'新增',
      dialogVisible:false,
      dialogState:'add',
      dialogData:{},
      saveLoading:false,
      rules:{
        pictureName:[
          {required:true,message:'图片名称必须输入',trigger:'blur'}
        ]
      },

      fileListPc:[],
      fileListMob:[],

      pcurl:'',
        pcurlOnline:'',
      moburl:'',
        moburlOnline:'',
      pageSize:10,
      total:0,
      pageNum:1
    }
  },
  methods:{
    dialogClosedHandle(){ //弹窗关闭
      this.fileListPc = [];
      this.fileListMob = [];
      this.pcurl = '';
      this.moburl = '';
      this.pcurlOnline ='';
      this.moburlOnline = '';
      this.$refs.dialogForm.resetFields();
    },
    dialogSaveBtnHandle(){ //弹窗保存

      this.$refs.dialogForm.validate().then(res => {
          if(this.fileListPc.length==0){
              this.$message.warning({message:'PC端图片不能为空！'});
              return;
          }
          if(this.fileListMob.length==0){
              this.$message.warning({message:'H5端图片不能为空！'});
              return;
          }
          this.saveLoading = true;
        let data = {
          "pictureName": this.dialogData.pictureName,
          "pictureMb": this.moburlOnline?this.moburlOnline.slice(this.moburlOnline.lastIndexOf('/')+1):'',
          "picturePc": this.pcurlOnline?this.pcurlOnline.slice(this.pcurlOnline.lastIndexOf('/')+1):'',
          "linkUrl": this.dialogData.linkUrl,
          "pictureSort": this.dialogData.pictureSort,
          "pictureType": "1",
          "status": this.dialogData.status
        }
        if(this.dialogState == 'edit'){
          data.id = this.dialogData.id;
        }
        websiteRequest.addOrEditPicture(data).then(res => {
          if(res.code == 200){
            this.$notify({
              type:'success',
              title:res.msg
            })
            this.getPictureList();
          }else{
            this.$notify({
              type:'warning',
              title:res.msg
            })
          }
          this.saveLoading = false;
          this.dialogVisible = false;
        }).catch(err => {
          console.log(err),
          this.saveLoading = false;
          this.dialogVisible = false;
        })
      }).catch(err => {
        console.log(err);
        this.$message.error({message:'校验不通过，请检查页面错误提示'})
        this.saveLoading = false;
      })

    },
    addNewBanner(){ //新增轮播图
      this.dialogTitle = '新增轮播图';
      this.dialogState = 'add';
      this.dialogData = {
        status:1
      }
      this.dialogVisible = true;
    },
    editRow(row){
      //console.log(row);
      this.dialogTitle = '编辑轮播图';
      this.dialogState = 'edit';
      this.fileListPc = [{
        name:changeUrl(row.picturePc),
        url:changeUrl(row.picturePc),
      }],
      this.pcurl = changeUrl(row.picturePc);
      this.pcurlOnline =changeUrl(row.picturePc);

      this.fileListMob = [{
        name:changeUrl(row.pictureMb),
        url:changeUrl(row.pictureMb),
      }],
      this.moburl = changeUrl(row.pictureMb);
      this.moburlOnline = changeUrl(row.pictureMb);

      if(!row.picturePc){
        this.fileListPc = [];
      }
      if(!row.pictureMb){
        this.fileListMob = [];
      }
      this.dialogData = Object.assign({},row);
      this.dialogVisible = true;
    },
    deleteRow(row){
      this.$confirm('确认删除吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {
          id:row.id
        }
        websiteRequest.delPicture(data).then(res => {
          if(res.code == 200){
            this.$notify({
              type:'success',
              title:res.msg
            })
            this.getPictureList();
          }else{
            this.$notify({
              type:'warning',
              title:res.msg
            })
          }
        }).catch(err => {
          console.log(err)
        })
      })
    },
    handlePreview(file){ //预览图片
      let message = '<div style="width:370px;height:370px;background:url('+file.url+') no-repeat center;background-size:contain;" >';
      this.$alert(message, '预览', {
        dangerouslyUseHTMLString:true,
        closeOnClickModal:true,
        closeOnPressEscape:true,
        center:true
      })
    },
    prevPic(url){ //表格里面点击预览
      let message = '<div style="width:370px;height:370px;background:url('+changeUrl(url)+') no-repeat center;background-size:contain;" >';
      this.$alert(message, '预览', {
        dangerouslyUseHTMLString:true,
        closeOnClickModal:true,
        closeOnPressEscape:true,
        center:true
      }).catch(action => {
         // console.log(action)
      });
    },

    //自定义删除方法  解决el-upload组件disable=true时没有删除按钮的问题
    delPC(){   //删除棋牌
      this.fileListPc = [];
      this.pcurl = '';
      this.pcurlOnline = "";
    },
    delMOB(){  //删除捕鱼
      this.fileListMob = [];
      this.moburl = '';
      this.moburlOnline="";
    },
    handleRemovePc(f,fl){ //删除图片-PC
      this.fileListPc = fl;
    },
    handlechangePc(f,fl){ //上传状态改变-PC
      this.fileListPc = fl;
    },
    handleRemoveMob(f,fl){ //删除图片-MOB
      this.fileListMob = fl;
    },
    handlechangeMob(f,fl){ //上传状态改变-MOB
      this.fileListMob = fl;
    },
      beforeFileUpload(file){ //图片上传之前检查格式
          if(file.type != "image/png" && file.type != "image/jpeg" && file.type != "image/bmp" && file.type != "image/gif"){
              this.$message.warning({message:'图片格式只能是jpg/jpeg/png/bmp/gif其中的一种'});
              return false;
          }
      },
    pcfileUpload(item){  //PC端图片上传
       if(item.file.size > 512000){
          this.$message.warning({message:'图片文件大小超过500kb，无法上传'})
          this.fileListPc = [];
          this.pcurlOnline = "";
          this.pcurl = '';
      }else{
        this.uploadFile(item.file,1,'PC')
      }
    },
    mobfileUpload(item){  //H5端图片上传
        if(item.file.size > 512000){
          this.$message.warning({message:'图片文件大小超过500kb，无法上传'})
          this.fileListMob = [];
          this.moburlOnline="";
          this.moburl = '';
      }else{
        this.uploadFile(item.file,1,'MOB')
      }
    },
    uploadFile(file,pathType,name){
      let data = {
        file:file,
        pathType:pathType,
      }
      websiteRequest.uploadFile(data).then(res => {
        if(res.code == 200){
          if(name=='PC'){
            this.pcurl =pathType; //changeUrl(res.data.url);
              this.pcurlOnline =changeUrl(res.data.url);
           /* this.fileListPc = [{
              name:changeUrl(res.data.url),
              url:changeUrl(res.data.url)
            }]*/
          }
          if(name == 'MOB'){
            this.moburl = pathType;//changeUrl(res.data.url);
            this.moburlOnline = changeUrl(res.data.url);
            /*this.fileListMob = [{
              name:changeUrl(res.data.url),
              url:changeUrl(res.data.url)
            }]*/
          }
          this.$notify({
            type:'success',
            title:'图片上传成功'
          })
        }else{
          if(name=='PC'){
            this.fileListPc = []
          }else if(name == 'MOB'){
            this.fileListMob = []
          }
          this.$notify({
            type:'warning',
            title:res.msg
          })
        }
      }).catch(err => {
        console.log(err);
        if(name=='PC'){
          this.fileListPc = []
        }else if(name == 'MOB'){
          this.fileListMob = []
        }
      })
    },
    getPictureList(){ //获取轮播图列表
      this.isloading = true;
      let data = {
        "conditionsMap": {
          "pictureType": "1"
        },
        "limit": this.pageSize,
        "offset": (this.pageNum -1)*this.pageSize,
        "sort": "",
        "sortOrder": "desc"
      }
      websiteRequest.getPictureList(data).then(res => {
        if(res.code == 200){
          this.tableData = res.data.rows;
          this.pageSize = res.data.limit;
          this.total = res.data.total;
          this.pageNum = res.data.offset/res.data.limit +1;
        }else{
          this.$notify({
            type:'warning',
            title:res.msg
          })
        }
        this.isloading = false;
      }).catch(err => {
        console.log(err)
        this.isloading = false;
      })
    },
    sizeChangeHandle(sz){
      this.pageSize = sz;
      this.getPictureList();
    },
    currentChangeHandle(crt){
      this.pageNum = crt;
      this.getPictureList();
    }
  },
  created(){
      this.$nextTick(()=>{
          this.getPictureList();
      })
  }
}
</script>
