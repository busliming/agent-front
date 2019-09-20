<template>
  <el-card class="addActivtyctn">
    <el-form :model="formData" label-width="150px">
      <el-form-item label="活动名称">
        <el-input maxlength="6" v-model="formData.activityName" placeholder="请填写"></el-input>
      </el-form-item>
      <el-form-item label="活动标题 （选填）">
        <el-input maxlength="9" v-model="formData.activityTitle" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="活动说明">
        <el-input type="textarea" rows="10" v-model="formData.activityContent"></el-input>
      </el-form-item>
      <el-form-item label="活动图片">
        <el-upload
          action="string"
          :http-request="imgUpload"
          :on-remove="handleRemoveImg"
          :on-change="handleChangeImg"
          :before-upload="beforeFileUpload"
          :on-preview="handlePreview"
          accept="image/*"
          :file-list="imgList"
          list-type="picture"
          :disabled="imgList.length>0"
        >
          <el-button
            size="small"
            type="primary"
            :disabled="imgList.length>0"
          >{{imgList.length>0?'已选择':'上传图片'}}</el-button>
          <el-button
            size="small"
            @click="delImg"
            type="danger"
            v-if="imgList.length>0"
            style="margin-left:10px;"
          >删除已上传图片</el-button>
          <div slot="tip" class="el-upload__tip">
            图片尺寸:宽度 {{ optimizedWidth }}px，高度不限,
            <br>
            小于等于 {{ sizeLimit/1024 }}Kb
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item label="提示：">活动说明与活动图片必须有一个</el-form-item>
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
        <el-select v-model="formData.status">
          <el-option label="启用" :value="1"></el-option>
          <el-option label="禁用" :value="0"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-row type="flex" justify="space-around">
      <el-button @click="backBtnHandle">&lt; 返回上一页</el-button>
      <el-button type="primary" @click="previewClickHandle">预览</el-button>
      <el-button type="primary" size="medium" @click="saveActivity"
        :loading="saveLoading"
      >保存</el-button>
    </el-row>
    <el-dialog :visible.sync="dialog.visible" width="800px" :class="dialog.className">
      <div class="name-preview">{{ formData.activityName }}</div>
      <div class="title-preview">{{ formData.activityTitle }}</div>
      <div class="content-preview">
        <p>{{ formData.activityContent }}</p>
        <div class="uploaded-img" v-if="dialog.imgUrl">
          <img :src="dialog.imgUrl" alt>
        </div>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import activityRequest from "@/request/activty";
import websiteRequest from "@/request/website";
import changeUrl from "@/tool/strUtil";
import timeFormat from "@/tool/times";

export default {
  name: "addActivty",
  data() {
    return {
      id: "",
      formData: {
        activityName: "",
        activityTitle: "",
        activityContent: "",
        activityType: "",
        activityPriture: "",
        widget: 1,
        remark: "",
        status: 1,
        timetype: "永久",
        daterange: []
      },
      optimizedWidth: 1188,
      sizeLimit: 512000,
      // 预览弹框
      dialog: {
        visible: false,
        loading: false,
        imgUrl: "",
        className: "",
        activityContent: ""
      },

      saveLoading:false, //保存按钮加载状态

      imgList: []
    };
  },
  methods: {
      handlePreview(file){ //预览图片
          let message = '<div style="width:370px;height:370px;background:url('+file.url+') no-repeat center;background-size:contain;" >';
          this.$alert(message, '预览', {
              dangerouslyUseHTMLString:true,
              closeOnClickModal:true,
              closeOnPressEscape:true,
              center:true
          })
      },
      beforeFileUpload(file){ //图片上传之前检查格式
          if(file.type != "image/png" && file.type != "image/jpeg" && file.type != "image/bmp" && file.type != "image/gif"){
              this.$message.warning({message:'图片格式只能是jpg/jpeg/png/bmp/gif其中的一种'});
              return false;
          }
      },
    previewClickHandle() {
      if (this.formData.activityTitle.trim() === "") {
        this.dialog.className = "img-preview3";
      } else if (this.formData.activityType == 1) {
        this.dialog.className = "img-preview1";
      } else {
        this.dialog.className = "img-preview2";
      }
      this.dialog.visible = true;
    },
    saveActivity() {
      // 保存活动
      let url = this.dialog.imgUrl;
      //输入校验
      try {
        if (this.formData.activityName === "") throw "请输入活动名称！";
        if (this.formData.activityName.length<3) throw "活动名称不能少于3个字";
        if (this.formData.activityContent === "" && url === "")
          throw "活动说明与活动图片必须有一个！";
        // if (this.formData.activityPriture==="") throw "请上传图片";  //11832
      } catch (e) {
        this.$notify.warning({ title: e });
        return;
      }
      let data = {
        activityName: this.formData.activityName, //活动名称
        activityTitle: this.formData.activityTitle, //活动标题
        activityContent: this.formData.activityContent, //活动内容
        activityType: this.formData.activityType,
        widget: this.formData.widget,
        status: this.formData.status, //状态
        activityPriture: url ? url.slice(url.lastIndexOf("/") + 1) : "", //活动图片
        activityBegin: this.formData.daterange
          ? this.formData.daterange[0]
          : "", //活动开始时间
        activityEnd: this.formData.daterange ? this.formData.daterange[1] : "" //活动结束时间
      };
      // 活动说明 - 传换行标签
      data.activityContent = data.activityContent.split(/\n/).join("\\n");
      if (this.formData.timetype == "永久") {
        data.activityBegin = "";
        data.activityEnd = "";
      }
      if (this.id) {
        this.saveLoading = true;
        data.id = this.id;
        activityRequest.update(data).then(res => {
          if (res.code == 200) {
            this.$notify({
              type: "success",
              title: "保存成功"
            });
            this.backBtnHandle();
          } else {
            this.$notify({
              type: "error",
              title: res.msg
            });
          }
          this.saveLoading = false;
        }).catch(e => {
          console.log(e);
        });
      } else {
        this.saveLoading = true;
        activityRequest
          .insert(data)
          .then(res => {
            if (res.code == 200) {
              this.$notify({
                type: "success",
                title: "保存成功"
              });
              this.backBtnHandle();
            } else {
              this.$notify({
                type: "error",
                title: res.msg
              });
            }
            this.saveLoading = false;
          })
          .catch(e => {
            console.log(e);
          });
      }
    },
    imgUpload(item) {
      if (item.file.size > 512000) {
        this.$notify({
          type: "warning",
          title: "图片文件大小超过500kb，无法上传"
        });
        this.imgList = [];
      } else {
        this.uploadFile(item.file, 3);
      }
    },
    uploadFile(file, pathType) {
      let data = {
        file: file,
        pathType: pathType
      };
      websiteRequest
        .uploadFile(data)
        .then(res => {
          if (res.code == 200) {
            this.dialog.imgUrl = res.data.url;
            //this.formData.activityPriture = res.data.url;
            this.$notify({
              type: "success",
              title: "图片上传成功"
            });
          } else {
            this.dialog.imgUrl = "";
            //this.formData.activityPriture = "";
            this.imgList = [];
            this.$notify({
              type: "warning",
              title: res.msg
            });
          }
        })
        .catch(err => {
          console.log(err);
          this.imgList = [];
        });
    },
    getSiteActivityDetail(type) {
      this.id = this.$route.params.id ? this.$route.params.id : "";
      let data = JSON.parse(window.sessionStorage.getItem("activityData"));
      this.formData = Object.assign({},data);
      this.formData.activityContent = this.formData.activityContent
        .split("\\n")
        .join("\n");
      if (data.activityPriture) {
        this.dialog.imgUrl = data.activityPriture;
        this.imgList = [
          {
            name: data.activityPriture,
            url: changeUrl(data.activityPriture)
          }
        ];
      }
      if (data.activityBegin || data.activityEnd) {
        this.$set(this.formData,'timetype','时间范围')
        this.$set(this.formData,'daterange',[data.activityBegin, data.activityEnd])
      } else {
        this.$set(this.formData,'timetype','永久')
      }
    },

    delImg() {
      this.imgList = [];
      this.dialog.imgUrl = "";
    },
    handleRemoveImg(file, fileList) {
      this.dialog.imgUrl = "";
      this.imgList = [];
    },
    handleChangeImg(file, fileList) {
      this.dialog.imgUrl = file.url;
      this.imgList = fileList;
    },
    handleExceed(file, fileList) {
      this.$notify({
        type: "info",
        title: "只需要上传一张图片"
      });
    },
    backBtnHandle() {
      //点击返回
      this.$store.dispatch("navGoBack", {
        name: this.id ? "编辑活动" : "添加活动"
      });
    }
  },
  created() {
    if(this.$route.name === '编辑活动'){
      this.getSiteActivityDetail();
    }else{  //新增  初始化表单数据
        this.id = "";
      this.formData = {
        activityName: "",
        activityTitle: "",
        activityContent: "",
        activityType: "",
        activityPriture: "",
        widget: parseInt(window.sessionStorage.getItem('widget')),
        remark: "",
        status: 1,
        timetype: "永久",
        daterange: []
      }
      this.imgList = [];
      this.dialog.imgUrl = "";
    }
    this.formData.activityType = window.sessionStorage.getItem("activityType");
  },
  activated() {
    if(this.$route.name === '编辑活动'){
        this.$nextTick(()=>{
            this.getSiteActivityDetail();
        })

    }else{  //新增  初始化表单数据
        this.id = "";
      this.formData = {
        activityName: "",
        activityTitle: "",
        activityContent: "",
        activityType: "",
        activityPriture: "",
        widget: parseInt(window.sessionStorage.getItem('widget')),
        remark: "",
        status: 1,
        timetype: "永久",
        daterange: []
      }
      this.imgList = [];
      this.dialog.imgUrl = "";
    }
    this.formData.activityType = window.sessionStorage.getItem("activityType");
  }
};
</script>

<style lang="scss">
.img-preview1,
.img-preview2,
.img-preview3 {
  .el-dialog {
    height: 450px; //real = 1242
    position: relative;

    .name-preview {
      position: absolute;
      width: 142px;
      height: 42px;
      top: 147px;
      left: 106px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      letter-spacing: 1px;
      color: #764e14;
    }
    .title-preview {
      position: absolute;
      width: 130px;
      height: 37px;
      top: 148px;
      left: 418px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      color: #6f470d;
      font-weight: bolder;
      font-family: MicrosoftYaHei-Bold;
    }
    .content-preview {
      white-space: pre-wrap;
      position: absolute;
      width: 415px;
      height: 160px;
      border-radius: 4px;

      left: 275px;
      overflow-x: hidden;
      font-size: 11px;
      line-height: 14px;
      letter-spacing: 1px;
      text-align: justify;
      color: #ffffff;
      text-indent: 31px;
      overflow-y: auto;
      &::-webkit-scrollbar {
        display: none;
        width: 0;
        height: 0;
      }
      .uploaded-img {
        /*bg-img real size = 2208 x 1242*/
        /*preview size = real size / 2.76*/
        /*position: absolute;*/
        border-radius: 4px;
        padding: 0;
        margin-top: 10px;
        width: 415px; //real = 1188
        height: 114px;
        /*left: 275px;*/
        /*bottom: 82px;*/
        img {
          width: 415px;
          height: 100%;
        }
      }
    }
  }
}

.img-preview1,
.img-preview2 {
  .content-preview {
    top: 204px;
  }
}

.img-preview3 {
  .content-preview {
    top: 148px;
  }
}

.img-preview1 .el-dialog {
  background: url("./components/renwu-preview.jpg") no-repeat;
  background-size: 100% 100%;
}

.img-preview2 .el-dialog {
  background: url("./components/gonggao-preview.jpg") no-repeat;
  background-size: 100% 100%;
}

.img-preview3 .el-dialog {
  background: url("./components/notitle-preview.jpg") no-repeat;
  background-size: 100% 100%;
}
</style>
