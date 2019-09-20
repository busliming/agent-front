import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store/store'
import './plugins/element.js'
import VeLine from 'v-charts/lib/line.common' //vchart图标单独引入
import clickToCopy from './components/clickToCopy' //全局组件-点击复制
import shortCuts from './components/shortCuts' //全局组件-财务 时间速选


//hasauth指令 按钮级别权限控制 v-hasauth:会员列表-新增  // 更新为menuModule v-hasauth:MemberListAddBtn
Vue.directive('hasauth',{
  bind:function(el,binding){
    let name = JSON.stringify(binding.arg) ; //指令绑定参数
    const permissionBtn = store.getters.permissionBtn;
    if(!permissionBtn.includes(name)){
      el.parentNode.removeChild(el);
    }
  }
})

console.log('界面刷新');
if(!window.sessionStorage.getItem('token')){
  //任意界面刷新检查token  无则跳登录
  router.push({path:'/'})
}

Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
  let _token = window.sessionStorage.getItem('token');
  console.log(to.name || to.meta.parentRouterName);
  if(!to.name && !to.meta.parentRouterName){ //强行访问不存在的路径
    console.log('不存在的资源路径')
   // vm.$message.error({message:'不存在的资源路径'});
      vm.$message.error({dangerouslyUseHTMLString: true, message: "<h3>不存在的资源路径</h3>"});
    next(false);
  }
  if(to.name === '登录'){
    next();
    return
  }
  if(_token){
    const permissionarray = store.getters.permissionarray; //页面级别权限数组
    if(to.name){
      if(to.name === 'layout'){  //允许访问layout
        next();
        return
      }
      /**
       * 判断当前用户权限菜单中是否包含目标路由
       */
      if(permissionarray.includes(to.meta.menuModule) || permissionarray.includes(to.meta.parentMenuModule)){  //已授权
        let item = {
          path:to.path,
          name:to.name
        }
        store.dispatch('navAddItem',item);
        next();
      }else{  //未授权
        console.log('没有访问该页面的权限:'+to.name);
        vm.$message.warning({dangerouslyUseHTMLString: true, message: "<h3>没有访问该页面的权限:<span style='color:#CD853F'>"+to.name+"</span></h3>"});
        next(false);
      }
    }
  }else{
    //无token，跳转登录
    next('/');
  }
})
Vue.component(VeLine.name, VeLine)
Vue.component(clickToCopy.name, clickToCopy)
Vue.component(shortCuts.name, shortCuts)
var vm = new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
