<template>
  <div class="asidecontainer">
    <div class="usrInfo"
    >
      <div class="logo"></div>
      <div class="headimg" :style="{background:'url('+usrhead+') no-repeat center',backgroundSize:'cover'}"></div>
      <el-dropdown
        @command="handleCommand" trigger="click"
      >
        <span class="el-dropdown-link">
          {{name}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="info">个人资料</el-dropdown-item>
          <el-dropdown-item command="logout">安全退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="menucontainer">
      <el-menu
        :default-active="$route.name"
        unique-opened
        @select='menuSelectHandle'
      >
        <template v-for="level1 in route">
          <template v-if="level1.list&&level1.list.length > 0">
            <el-submenu :index="level1.menuName" :key="level1.id">
              <template slot="title">
                <i :class="['iconfont',currentMenuIcon(level1.menuName)]"></i>
                <span>{{level1.menuName}}</span>
              </template>
              <template v-for="level2 in level1.list">
                <el-menu-item
                  :key="level2.id"
                  :index="level2.menuName"
                >
                  {{level2.menuName}}
                </el-menu-item>
              </template>
            </el-submenu>
          </template>
          <template v-else>
            <el-menu-item :index="level1.menuName" :key="level1.id">
              <template slot="title">
                <i class="iconfont icon-shouye"></i>
                <span slot="title">{{level1.menuName}}</span>
              </template>
            </el-menu-item>
          </template>
        </template>
      </el-menu>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      usrhead:'http://pluspng.com/img-png/handsome-guy-png-user-avatar-210.png',
      // usrhead:this.$store.getters.avatar,
      name:this.$store.getters.name,
      route:this.$store.getters.permissionmenu,
    }
  },
  computed:{

  },
  methods:{
    handleCommand(cmd){  //点击名字显示下拉菜单
      if(cmd == 'info'){
        this.$router.push({
          name:'个人资料设置'
        })
      }
      if(cmd == 'logout'){ //安全退出
        this.$confirm(
          '确认退出后台管理系统吗？',
          '提示',
          {
            confirmButtonText:'确认退出',
            cancleButtonText:'确认退出',
            type:'warning'
          }
        ).then(() => {
          this.$store.dispatch('LogOut').then(() => {
            location.reload()
          })
        })
      }
    },
    menuSelectHandle(i,p){ //点击侧边栏导航
      this.$router.push({
        name:i
      })
    },
    currentMenuIcon (name) { //当前菜单项图片
      let str = '';
      switch (name){
        case '会员管理':
        str = 'icon-huiyuan'
        break;
        case '报表查询':
        str = 'icon-yunying'
        break;
        case '游戏管理':
        str = 'icon-youxi'
        break;
        case '财务管理':
        str = 'icon-caiwu'
        break;
        case '消息管理':
        str = 'icon-gonggao'
        break;
        case '推广管理':
        str = 'icon-tuiguang'
        break;
        case '系统设置':
        str = 'icon-xitong'
        break;
        case '网站管理':
        str = 'icon-wangzhan'
        break;
        case '活动管理':
        str = 'icon-huodong'
        break;
        case '控制系统':
        str = 'icon-kongzhi'
        break;
      }
      return str
    }
  },
}
</script>

<style lang="scss">
.asidecontainer{
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-image: linear-gradient(0deg, #2c315a 0%, #3d4972 53%, #4e618a 100%),
	linear-gradient(#2e3352, #2e3352);
	background-blend-mode: normal, normal;
  .usrInfo{
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-flow: column nowrap;
    width: 100%;
    height: 220px;
    .logo{
      width: 160px;
      height: 35px;
      background: url('~@/assets/logo2.png') no-repeat center;
      background-size: contain;
    }
    .headimg{
      width: 80px;
      height: 80px;
      border-radius: 50%;
      border: 1px solid #ddd;
      background-color: #ddd;
    }
    .el-dropdown-link{
      color: #fff;
    }
  }
}
.menucontainer{
  height: calc(100% - 220px);
  overflow-y: scroll;
  width: 240px;
  background: transparent;
  border-top: 1px solid #67729a;
  .el-menu{
    background: transparent;
  }
  .el-menu-item,.el-submenu__title{
    position: relative;
    font-size: 14px;
	  color: #9799ab;
    &:hover{
      background: transparent;
      color: #f1f3f6;
    }
    &:hover:after{
      position: absolute;
      top: 50%;
      right: 0%;
      content: '';
      display: block;
      width: 0px;
      height: 0px;
      border: 1px solid transparent;
      border-right: 1px solid #f1f3f6;
      background: transparent;
      transform-origin: 100% 50%;
      transform:scale(10);
    }
  }
  .el-menu-item,.el-submenu{
    border-left: 3px solid transparent;
  }
  .el-submenu.is-opened{
    background: #292d47;
    border-left: 3px solid #4a90e2;
  }
  .el-submenu__title,.el-menu-item{
    height: 44px;
    line-height: 44px;
  }
  .el-menu-item.is-active{
    position: relative;
    background: transparent;
    color: #fff;
    &:after{
      position: absolute;
      top: 50%;
      right: 0%;
      content: '';
      display: block;
      width: 0px;
      height: 0px;
      border: 1px solid transparent;
      border-right: 1px solid #f1f3f6;
      background: transparent;
      transform-origin: 100% 50%;
      transform:scale(10);
    }
  }
}
.el-menu-item [class^="iconfont"],.el-submenu [class^="iconfont"]{
  margin-right: 5px;
  width: 24px;
  text-align: center;
  font-size: 18px;
  vertical-align: middle;
  color: inherit;
}
.el-submenu__title i{
  color: inherit;
}

// @media screen and (max-width: 1450px) {
//   .asidecontainer{
//     .usrInfo{
//       height: 100px;
//       .logo{
//         width: 72px;
//         height: 16px;
//       }
//       .headimg{
//         width: 36px;
//         height: 36px;
//       }
//       .el-dropdown-link{
//         font-size: 12px;
//       }
//     }
//   }
//   .menucontainer{
//     height: calc(100% - 100px);
//   }
// }
</style>

