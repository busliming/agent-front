import router from '@/router/router'

const headernav = {
  state: {
    lists:[],
    crtitem:{}
  },

  mutations: {
    ADD_ITEM:(state,item) => {
      let idx = state.lists.findIndex(
        function (val) {
          return val.name === this.name
        },
        item
      )
      if(idx > -1){
        state.crtitem = state.lists[idx];
      }else{
        state.lists.push(item);
        state.crtitem = item;
      }
    },
    REMOVE_ITEM:(state,item) => {
      let idx = state.lists.findIndex(
        function(val){
          return val.name === this.name
        },
        item
      );
      if(item.name == state.crtitem.name){
        state.lists.splice(idx,1);
        state.crtitem = state.lists[idx-1];
        router.push(state.crtitem);
      }else{
        state.lists.splice(idx,1);
      }
    },
    CLOSE_ITEM:(state,item) => {
      let idx = state.lists.findIndex(
        function(val){
          return val.name === this.name
        },
        item
      );
      state.lists.splice(idx,1);
    },
    GOBACK_ITEM:(state,item) => {
      let idx = state.lists.findIndex( //当前三级选项卡在list中的位置
        function(val){
          return val.name === this.name
        },
        item
      );
      
      //找到当前三级选项卡的二级选项卡
      let routes = router.options.routes[1].children; //路由
      let currIdx = routes.findIndex( //当前三级菜单在路由里的id
        function(val){
          return val.name === this.name
        },
        item
      )
      let parentName = routes[currIdx].meta.parentRouterName; //当前三级菜单在路由里的parentRouterName
      let parentNameIdx = routes.findIndex(  //二级菜单index
        function(val){
          return val.name === this.name
        },
        {name:parentName}
      )
      let secondRoute = routes[parentNameIdx]; //二级菜单
      let secondIdx = state.lists.findIndex(
        function(val){
          return val.name == this.name
        },secondRoute
      )
      if(secondIdx > -1){  //如果二级选项卡在list中
        state.crtitem = state.lists[secondIdx];
      }else{
        state.crtitem = secondRoute
      }
      state.lists.splice(idx,1); //关闭当前三级选项卡
      router.push(state.crtitem);    
    },
    REMOVE_ALL:(state) => {
      state.lists = [
        {
          path:'/home',
          name:'首页'
        }
      ];
      state.crtitem = {
        path:'/home',
        name:'首页'
      };
      router.push(state.crtitem);
    },
    REMOVE_OTHER:(state) => {
      state.lists = [
        {
          path:'/home',
          name:'首页'
        }
      ];
      state.lists.push(state.crtitem);
    },
  },
  actions: {
    navAddItem({commit},item){  //顶部导航添加新卡片
      commit('ADD_ITEM',item)
    },
    navRemoveItem({commit},item){  //顶部导航关闭卡片
      commit('REMOVE_ITEM',item)
    },
    closeItem({commit},item){  //关闭当前模块  memberdetail  betdetail组件内beforeRouteLeave钩子触发
      commit('CLOSE_ITEM',item)
    },
    navGoBack({commit},item){  //返回按钮   三级功能模块回到二级功能模块   item参数:{name:三级功能路由的name}
      commit('GOBACK_ITEM',item)
    },
    navRemoveAllItem({commit}){ //关闭所有卡片
      commit('REMOVE_ALL')
    },
    navRemoveOtherItem({commit}){ //关闭其他卡片
      commit('REMOVE_OTHER')
    },
  }
}

export default headernav