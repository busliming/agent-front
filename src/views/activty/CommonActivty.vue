<template>
  <el-card>
    <el-row
      style="height:100%"
    >
      <el-col
        :span="4"
      >
        <el-menu
          default-active="1"
          @select="menuSelectHandle"
        >
          <el-menu-item index="1">
            <i class="iconfont icon-hongbao"></i>
            <span slot="title">注册送</span>
          </el-menu-item>
          <el-menu-item index="2">
            <i class="iconfont icon-hongbao"></i>
            <span slot="title">试玩金</span>
          </el-menu-item>
          <el-menu-item index="3">
            <i class="iconfont icon-hongbao"></i>
            <span slot="title">首充送</span>
          </el-menu-item>
          <el-menu-item index="4">
            <i class="iconfont icon-hongbao"></i>
            <span slot="title">签到</span>
          </el-menu-item>
           <el-menu-item index="5" v-if="Isxingyunzhuanpan">
            <i class="iconfont icon-hongbao"></i>
            <span slot="title">幸运转盘</span>
          </el-menu-item>
           <el-menu-item index="7">
            <i class="iconfont icon-hongbao"></i>
            <span slot="title">实名认证</span>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col
        :span="20"
        style="height:100%"
      >
      <div class="settingCtn">
        <transition name="fade" mode="out-in">
          <component :is="crt"
            :isloading='savaBtnLoading'
            :subFlag="subFlag"
            @submit='SaveBtnHandle'
            ref="ActivChild"
          ></component>
        </transition>
      </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import activtyRequest from '@/request/activty'

export default {
  name:'CommonActivty',
  data () {
    return {
      crt:'zhucesong',
      savaBtnLoading:false,
      Isxingyunzhuanpan:null,
      subFlag:null,
    }
  },
  activated(){
     this.luckyControl()
  },
  components:{
    'zhucesong':() => import ('@/views/activty/components/zhucesong.vue'),
    'shouchongsong':() => import ('@/views/activty/components/shouchongsong.vue'),
    'shiwanjin':() => import ('@/views/activty/components/shiwanjin.vue'),
    'qiandao':() => import ('@/views/activty/components/qiandao.vue'),
    'xingyunzhuanpan':() => import ('@/views/activty/components/xingyunzhuanpan.vue'),
    'shimrenzheng':() => import ('@/views/activty/components/shimrenzheng.vue'),
  },
  methods:{
    luckyControl(){
        activtyRequest.luckyControl().then(res=>{
             if(res.code=='200'){
                  if(res.data){
                    this.subFlag=res.data.subFlag
                    this.Isxingyunzhuanpan=res.data.luckyOpen
                  }else{
                  
                    this.Isxingyunzhuanpan=false
                  }
             }
        })
    },
    menuSelectHandle (index) { //当前选中项菜单
      switch (index) {
        case "1":
        this.crt = 'zhucesong';
        break;
        case '2':
        this.crt = 'shiwanjin';
        break;
        case '3':
        this.crt = 'shouchongsong';
        break;
        case '4':
        this.crt = 'qiandao';
        break;
        case '5':
        this.crt = 'xingyunzhuanpan';
        break;
        case '7':
        this.crt = 'shimrenzheng';
        break;
      }
    },
    SaveBtnHandle(data){
      this.savaBtnLoading = true;
        activtyRequest.addOrUpdateSiteActivity(data).then(res => {
        if(res.code == 200){
          this.$notify({
            type:'success',
            title:'保存成功!'
          })
          console.log(this.crt)
        if(this.crt=='shimrenzheng'){
           this.$refs.ActivChild.getSiteActivityDetail() 
        }
        }else{
          this.$notify({
            type:'warning',
            title:res.msg
          })
        }
        this.savaBtnLoading = false;
      }).catch(err => {
        console.log(err)
        this.savaBtnLoading = false;
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.fade-enter-active,.fade-leave-active{
  opacity: 1;
  transform: translateX(0);
  transform: scale(1);
  transition: all .2s linear;
}
.fade-enter{
  transform: translateX(20px);
  opacity: 0;
}
.fade-leave-to{
  transform: translateX(20px);
  opacity: 0;
}
.settingCtn{
  padding: 10px;
}
</style>
