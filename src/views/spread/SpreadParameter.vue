<template>
  <el-card>
    <el-card header='推广代码'>
      <el-form label-width="60px" size="medium">
        <el-row type="flex">
          <el-form-item label="会员id"
            :error="playidErrorMsg"
          >
            <el-input clearable v-model="playId" placeholder="请输入会员id" style="width:250px;">
              <template slot="append">
                <el-button
                  @click="getSitePopularJs"
                >查询</el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="" v-if="src&&!playidErrorMsg">
            <el-tag type="primary">
              <a :href="src" :download="downloadname">点击下载js代码</a>
            </el-tag>
          </el-form-item>
        </el-row>
      </el-form>
      <el-row
        style="font-size:16px;line-height:30px;text-align:left;padding-left:60px;"
      >
        <p>PS：前提条件，已完成推广页开发，比如：index.html</p>
        <p>1，从代理系统->推广参数菜单下载JS文件，文件名格式：会员ID+_popular.js（eg:155555_popular.js，以下说明举例使用）</p>
        <p>2，把155555_popular.js文件复制到index.html同级；</p>
        <p>3，复制以下标签到index.html底部的&lt;/body&gt;与&lt;/html&gt;标签中间的位置引入如下JS</p>
        <p>&lt;script type=&#x27;text/javascript&#x27; charset=&#x27;UTF-8&#x27; src=&#x27;//res.cdn.openinstall.io/openinstall.js&#x27;&gt;&lt;/script&gt;</p>
        <p>4，复制以下标签到index.html底部的&lt;/body&gt;与&lt;/html&gt;标签中间的位置，并更换JS文件名</script></p>
        <p>&lt;script src=&quot;15172455_popular.js&quot; &gt;&lt;/script&gt;</p>
        <p>5，index.html推广下载包的按钮标签（是你想要点击那个下载安装包的按钮），添加class属性 class="mohe_down"</p>
        <p>6,将源码放到服务器上访问即可测试下载，及下载后推广ID生效效果</p>
      </el-row>
    </el-card>
  </el-card>
</template>

<script>
import spreadRequest from "@/request/spread";

export default {
  name: "SpreadParameter",
  data() {
    return {
      playId:'', //会员id
      src:'', //js下载路径
      playidErrorMsg:'',//会员id校验信息  
    };
  },
  computed:{
    downloadname:{
      get(){
        return this.playId+'_popular.js'
      },
      set(){
      }
    }
  },
  watch:{
    playId(val){
      this.src = '';
      if(!val){
        this.playidErrorMsg = ''
        return
      }
      let data = {
        playId:val
      };
      spreadRequest
        .findUser(data)
        .then(res => {
          if (res.code == "200") {
            this.playidErrorMsg = '';
          } else {
            this.playidErrorMsg = '会员id不存在';
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  methods: {
    getSitePopularJs(){
      if(!this.playId){
        return
      }
      if(this.playidErrorMsg){
        this.$notify.warning({title:'会员id不存在'})
        return
      }
      let data = {
        playId:this.playId
      }
      spreadRequest.getSitePopularJs(data).then(res => {
        if(res.code != 300){
          let type = 'application/force-download';
          let blob = new Blob([res], {type: type})
          let URL = window.URL || window.webkitURL;
          let objectUrl = URL.createObjectURL(blob);
          this.src = objectUrl;
          this.$notify.success({title:'生成JS代码成功'})
        }else{
          this.$notify.warning({title:res.msg})
        }
      }).catch(e => {
        console.log(e);
      })
    }
  },
};
</script>

