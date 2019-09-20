# agent-front 
## 简介
```
一个使用vue-cli@3 + elementUI + vuex + vue router + axios 搭建的后台管理系统。
用到的技术：高级路由组件、全局路由守卫、请求拦截/响应拦截、动态权限；

按钮级别权限控制上线：
main.js自定义全局指令v-hasauth 
在各个视图里面给按钮注册指令传递参数即可   v-hasauth:会员列表-新增

全局引入的第三方插件(未能在package.json列明的)：(10-23更新：砍了需求，暂时用不上了。。。)
public/jslib
    |------------qrcode.min.js  js生成二维码工具   系统设置-下载配置

开发备注：避免java及其他前端同事维护困难，迭代新视图时不要对elementUI组件进行再次封装。
```

## 快速上手

#### 0、https://nodejs.org/zh-cn/   下载安装nodeJS
```
略 😆
```

#### 1、验证安装成功:
```
node -v
* 在任意路径输入命令行命令，能显示版本号为正确安装
```

#### 2、git克隆项目到本地  
```
略 😆
```

#### 3、命令行进入项目文件夹
```
cd agent-front
* 包含package.json文件的文件夹
```

#### 4、安装依赖
```
npm i   
* npm install的简写
* 随着功能的扩充，依赖包会逐渐增加，重复运行该命令会自动安装本项目没有安装过的依赖
```

#### 5、本地开发：
```
npm start

* 启动后所有接口请求默认代理转发到vue.config.js文件里的target里。比如：target:'http://puat.agent.com:9090'
* 启动后依据终端提示 App running at: 的路径即可本地访问该web应用
* 默认端口8080会与java本地服务account-service的8080端口一致，如果先启动web应用，会导致account-service无法启动，先启动account-service再启动agent-front则正常
```


## 目录说明 (待更新)
```
├─ src
    ├─ assets          静态资源
    │   └─ font            自定义图标
    ├─ request         接口请求集合
    │   ├─ finance           财务管理请求方法集合
    │   ├─ game              游戏管理请求方法集合
    │   ├─ login             登录方法
    │   ├─ member            会员管理
    │   ├─ message           公告管理
    │   ├─ operation         运营管理
    │   ├─ spread            推广管理
    │   ├─ system            系统设置
    │   └─ index.js          request主入口 封装axios 全局拦截
    ├─ router           路由管理
    │   └─ router.js         路由设置 挂载无需权限的同步组件
    ├─ store            状态管理
    │   ├─ headernav.js      顶部导航栏状态模块
    │   ├─ store.js          状态主入口 引入了headernav和user两个模块
    │   └─ user.js           用户状态模块
    ├─ tool             工具类模块
    │   └─ validate.js       表单验证模块 可按页面继续模块化
    ├─ views            视图集合
    │   ├─ finance          财务管理
    │   │   ├─ components          出入款配置子组件
    │   │   │   ├─ AgentChargeConf.vue      代理充值配置
    │   │   │   ├─ DispensingConf.vue       出款配置
    │   │   │   ├─ OfficialChargeConf.vue   官方充值配置
    │   │   │   ├─ OnlineDispensingConf.vue 线上出款配置
    │   │   │   └─ OnlinePayConf.vue        线上入款配置
    │   │   ├─ DrawRecord.vue      自动出款交易记录
    │   │   ├─ FinanceConf.vue     出入款配置
    │   │   ├─ ManualList.vue      人工存款/人工提款共用组件
    │   │   ├─ ManualOperate.vue   人工存提
    │   │   ├─ OfficialCharge.vue  官方充值
    │   │   ├─ OnlinePay.vue       线上支付
    │   │   └─ PaymentReview.vue   支付宝/银行卡出款审核
    │   ├─ game              游戏管理
    │   │   ├─ GameList.vue        游戏列表
    │   │   └─ GameRoomList.vue    游戏房间列表
    │   ├─ IndexComponents   页面布局子组件
    │   │   ├─ HeaderNavItem.vue   顶部导航栏组件
    │   │   ├─ index.js            子组件整合入口
    │   │   ├─ Main.vue            主功能布局
    │   │   ├─ Nav.vue             顶部导航栏布局
    │   │   └─ Sidebar.vue         侧边栏布局
    │   ├─ member            会员管理
    │   │   ├─ MemberAdd.vue       新增会员
    │   │   ├─ MemberDetail.vue    会员详情
    │   │   ├─ MemberLevel.vue     会员等级
    │   │   └─ MemberList.vue      会员列表
    │   ├─ message            公告管理
    │   │   ├─ AnnounceList.vue    公告列表
    │   │   └─ InternalMessage.vue 站内消息
    │   ├─ operation          运营管理
    │   │   ├─ GameReport.vue       游戏报表
    │   │   └─ GameReportDetail.vue 游戏报表详情
    │   ├─ spread             推广管理
    │   │   ├─ ProfitConf.vue       返利设置
    │   │   ├─ SpreadProfit.vue     推广返利
    │   │   └─ SpreadUser.vue       推广玩家
    │   ├─ system              系统管理
    │   │   ├─ RoleManage.vue       角色管理
    │   │   └─ SubAccount.vue       子账号管理
    │   ├─ Index.vue        界面布局
    │   ├─ IndexDefault.vue 首页默认视图,将来用于放置仪表盘
    │   └─ Login.vue        登录界面
    ├─ App.vue 应用组件入口
    └─ main.js 应用主入口

```
