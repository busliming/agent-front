import loginRequest from '@/request/login'

const user = {
  state: {
    token: window.sessionStorage.getItem('token'),
    siteid: window.sessionStorage.getItem('siteid'),
    name: window.sessionStorage.getItem('name'),
    avatar: window.sessionStorage.getItem('avatar'),
    role: window.sessionStorage.getItem('role'),
    permissionMenu:JSON.parse(window.sessionStorage.getItem('permissionmenu')),
    permissionarray:JSON.parse(window.sessionStorage.getItem('permissionarray')),
    permissionBtn:JSON.parse(window.sessionStorage.getItem('permissionBtn')),
    permissionState:JSON.parse(window.sessionStorage.getItem('permissionState')),
    wsUrl:window.sessionStorage.getItem('wsUrl'),
    gettreba:window.sessionStorage.getItem('TREBA'),
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
      window.sessionStorage.setItem('token',token);
    },
    SET_SITEID: (state, siteid) => {
      state.siteid = siteid;
      window.sessionStorage.setItem('siteid',siteid)
    },
    SET_NAME: (state, name) => {
      state.name = name
      window.sessionStorage.setItem('name',name)
    },
    SET_WSURL: (state, wsUrl) => {
      state.wsUrl = wsUrl.trim();
      window.sessionStorage.setItem('wsUrl',wsUrl.trim())
    },
    GET_TREBA:(state,data)=>{
      switch(data +''){
        case '1':
            state.gettreba = 'SThree'
            window.sessionStorage.setItem('TREBA','SThree')
            break;
        case '2':
            state.gettreba = 'Everys'
            window.sessionStorage.setItem('TREBA','Everys')
            break;
        case '3':
          state.gettreba = 'Unlimited'
          window.sessionStorage.setItem('TREBA','Unlimited')
          break;
          default:
            state.gettreba = 'SThree'
            window.sessionStorage.setItem('TREBA','SThree')  
       }
    },
    // SET_AVATAR: (state, avatar) => {
    //   state.avatar = avatar
    //   window.sessionStorage.setItem('avatar',avatar)
    // },
    SET_PERMISSIONMENU: (state,permissionmenu) => {
      permissionmenu.sort((a,b) => { //一级菜单按menuSort排序
        return a.menuSort - b.menuSort
      })
      let _permissionmenu = permissionmenu.map(menu => { //二级菜单排序
        if(menu.list&&menu.list.length>0){
          let _list = menu.list;
          _list.sort((a,b) => {
            return a.menuSort - b.menuSort
          })
        }
        return menu
      })
      state.permissionMenu = _permissionmenu;   //生成侧边栏
      window.sessionStorage.setItem('permissionmenu',JSON.stringify(_permissionmenu))

      let permissionarray = [];               //扁平化的权限菜单(一级菜单+二级菜单)
      let permissionBtn = [];                //权限按钮数组 如 '会员列表-新增'
      let permissionState = [];                //四级权限状态 如 '会员详情-编辑'
      
      //按照下表约定来判断权限
      //https://docs.google.com/spreadsheets/d/12rqbfzueweKPKmf9RYFRcBxJG4S_tnNUk_9MTVv76KI/edit#gid=1711180637
      for (var i =0;i<permissionmenu.length;i++){ //遍历一级菜单
        if(permissionmenu[i].list&&permissionmenu[i].list.length>0){ 
          for(var j= 0 ;j<permissionmenu[i].list.length;j++){  //遍历二级菜单
            permissionarray.push(permissionmenu[i].list[j].menuModule);
            if(permissionmenu[i].list[j].list&&permissionmenu[i].list[j].list.length>0){ //遍历三级权限按钮
              permissionmenu[i].list[j].list.forEach(item => {
                permissionBtn.push('"'+item.menuModule+'"');
                if(item.list&&item.list.length>0){ //遍历四级权限(会员详情)
                  item.list.forEach(state => {
                    permissionState.push('"'+state.menuModule+'"');
                  });
                }
              });
            }
            // 旧权限判断方式  v1.0.5 开始作废  2019-2-13  //4-29数据库启用新表   提前约定按照新字段判断
            // permissionarray.push(permissionmenu[i].list[j].menuName);
            // if(permissionmenu[i].list[j].list&&permissionmenu[i].list[j].list.length>0){ //遍历三级权限按钮
            //   permissionmenu[i].list[j].list.forEach(item => {
            //     let str = '"' + permissionmenu[i].list[j].menuName + '-' + item.menuName + '"'
            //     permissionBtn.push(str);
            //     if(item.list&&item.list.length>0){ //遍历四级权限(会员详情)
            //       item.list.forEach(state => {
            //         let str = item.menuName + '-' + state.menuName
            //         permissionState.push(str);
            //       });
            //     }
            //   });
            // }
          }
        }else{
          permissionarray.push(permissionmenu[i].menuModule); //首页
        }
      }

      state.permissionarray = permissionarray; //路由跳转判断权限
      state.permissionBtn = permissionBtn; //自定义指令判断按钮权限
      state.permissionState = permissionState; //四级权限状态  用于views/各个视图内部权限判断

      window.sessionStorage.setItem('permissionarray',JSON.stringify(permissionarray))
      window.sessionStorage.setItem('permissionBtn',JSON.stringify(permissionBtn))
      window.sessionStorage.setItem('permissionState',JSON.stringify(permissionState))
    },
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        loginRequest.LoginByUsername(userInfo).then(response => {
          const data = response.data;
          if(response.code == '200'){
            commit('SET_TOKEN', data.token)
            commit('SET_WSURL', data.wsUrl || 'ws://none')
            commit('SET_NAME', data.account)
            commit('SET_PERMISSIONMENU',data.menuList)
            //保存accountid
            window.sessionStorage.setItem('accountId',data.accountId)
          }
          resolve(response);  //直接resolve响应   由login.vue判断code是否为200是否显示警告
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 安全退出
    LogOut({ commit }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '')
        resolve()
      })
    },
    Getrebatemode({ commit }){ //获取返利状态
      loginRequest.gitspreadReport().then(res =>{
        commit('GET_TREBA',res.data)  // 1 为默认模式  2为无限模式  3 为每万返
      }).catch(error => {
          reject(error)
      })
    },
  }
}

export default user