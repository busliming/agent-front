import request from '@/request'

const prefix = '/'

export default {
  delSitePopuDomain:data=>request({
    url:prefix + 'siteDomain/delSitePopuDomain',
    method:'post',
    data:data
  }),
  enabledSitePopuDomain:data=>request({   //启用禁用站点域名
    url:prefix + 'siteDomain/enabledSitePopuDomain',
    method:'post',
    data:data
  }),
  addOrUpdateAgentDomain:data=>request({ //新增或修改代理站点域名信息
    url:prefix + 'siteDomain/addOrUpdateAgentDomain',
    method:'post',
    data:data
  }),
  getSiteAgentDomain: data=>request({ //查询代理站点域名信息
    url:prefix + 'siteDomain/getSiteAgentDomain',
    method:'post',
    data:data
  }),
  getSubAccounts:data => request({  //获取子账号列表
    url:prefix + 'accountManage/getSubAccounts',
    method:'post',
    data:data
  }),
  roleMenulist: data =>
    request({
      //获取权限树形结构
      url: prefix + 'roleManage/roleMenulist',
      method: 'post',
      data: data
    }),
  getRoles: data =>
    request({
      //获取角色列表
      url: prefix + 'roleManage/getRoles',
      method: 'post',
      data: data
    }),
  addAccount: data =>
    request({
      //添加子账号
      url: prefix + 'accountManage/addAccount',
      method: 'post',
      data: data
    }),
  updateAccount: data =>
    request({
      //更新子账号
      url: prefix + 'accountManage/updateAccount',
      method: 'post',
      data: data
    }),
  addOrUpdateRole: data =>
    request({
      //添加或更新角色
      url: prefix + 'roleManage/addOrUpdateRole',
      method: 'post',
      data: data
    }),
  deleteRole: data =>
    request({
      //删除角色
      url: prefix + 'roleManage/deleteRole',
      method: 'post',
      data: data
    }),
  roleToMenu: data =>
    request({
      //保存角色菜单
      url: prefix + 'roleManage/roleToMenu',
      method: 'post',
      data: data
    }),
  getGlobal: data =>
    request({
      //查询全局参数   全局设置
      url: '/globalManage/getGlobal',
      method: 'post',
      data: data
    }),
  updateGlobal: data =>
    request({
      //保存全局参数 全局设置
      url: '/globalManage/updateGlobal',
      method: 'post',
      data: data
    }),
  getSiteDownloadSetList: data =>
    request({
      //获取下载设置列表
      url: '/dlset/getSiteDownloadSetList',
      method: 'post',
      data: data
    }),
  // getSiteDownloadSetDetail:data => request({  //查询下载设置明细
  //   url:'/dlset/getSiteDownloadSetDetail',
  //   method:'post',
  //   data:data
  // }),
  addOrUpdateSiteActivity: data =>
    request({
      //保存下载设置
      url: '/dlset/addOrUpdateSiteActivity',
      method: 'post',
      data: data
    }),
  getUserProfile: data =>
    request({
      //获取个人资料
      url: '/userProfile/getUserProfile',
      method: 'post',
      data: data
    }),
  updateUserName: data =>
    request({
      //更改会员姓名
      url: '/userProfile/updateUserName',
      method: 'post',
      data: data
    }),
  getLogMenulist: data =>
    request({
      //操作日志-查询一级菜单二级菜单
      url: '/user/getLogMenulist',
      method: 'post',
      data: data
    }),
  addGoogle: data =>
    request({
      //个人资料 获取谷歌二维码
      url: '/userProfile/addGoogle',
      method: 'post',
      data: data
    }),
  changeGoogle: data =>
    request({
      //个人资料 绑定谷歌身份验证器
      url: '/userProfile/changeGoogle',
      method: 'post',
      data: data
    }),
  google_validate: data =>
    request({
      //个人资料 验证谷歌身份验证器
      url: '/google_validate',
      method: 'post',
      data: data
    }),
  unbindGoogle: data =>
    request({
      //个人资料 解除绑定谷歌
      url: '/userProfile/changeGoogle',
      method: 'post',
      data: data
    }),

  addEmail: data =>
    request({
      //个人资料 绑定邮箱
      url: '/userProfile/addEmail',
      method: 'post',
      data: data
    }),
  updateEmail: data =>
    request({
      //个人资料 解除绑定邮箱
      url: '/userProfile/updateEmail',
      method: 'post',
      data: data
    }),
  // sendEmail:data => request({  //个人资料 发送邮箱验证码
  //   url:'/sendEmail?account='+data.account+'&email='+data.email,
  //   method:'post',
  // }),
  emailValidate: data =>
    request({
      //个人资料 校验邮箱验证码
      url: '/emailValidate?account=' + data.account + '&vcode=' + data.vcode,
      method: 'post'
    }),

  addPhone: data =>
    request({
      //个人资料 绑定手机
      url: '/userProfile/addPhone',
      method: 'post',
      data: data
    }),
  updatePhone: data =>
    request({
      //个人资料 解除绑定手机
      url: '/userProfile/updatePhone',
      method: 'post',
      data: data
    }),
  sendSms: data =>
    request({
      //个人资料 发送手机验证码
      url:
        '/sendSms?account=' + data.account + '&phoneNumber=' + data.phoneNumber,
      method: 'post'
    }),
  phonValidate: data =>
    request({
      //个人资料 校验手机验证码
      url: '/phonValidate?phone=' + data.phone + '&vcode=' + data.vcode,
      method: 'post'
    }),
  enableTwoStep: data =>
    request({
      //开关两步验证
      url: '/userProfile/enable',
      method: 'post',
      data: data
    }),
  updatePassword: data =>
    request({
      //更改密码
      url: '/userProfile/updatePassword',
      method: 'post',
      data: data
    }),
  /**
   * 域名管理
   */
  getMainSiteDomainList: data =>
    request({
      //查询域名列表
      url: '/siteDomain/getMainSiteDomainList',
      method: 'post',
      data: data
    }),
  addSiteDomainInfo: data =>
    request({
      //新增站点域名
      url: '/siteDomain/addSiteDomainInfo',
      method: 'post',
      data: data
    }),
  editSiteDomainInfo: data =>
    request({
      //编辑站点域名
      url: '/siteDomain/editSiteDomainInfo',
      method: 'post',
      data: data
    }),
  enabledSiteDomain: data =>
    request({
      //启用禁用域名
      url: '/siteDomain/enabledSiteDomain',
      method: 'post',
      data: data
    }),
  delSiteDomainInfo: data =>
    request({
      //删除域名
      url: '/siteDomain/delSiteDomainInfo',
      method: 'post',
      data: data
    }),
  getSiteCnameInfo: data =>
    request({
      //获取cname信息
      url: '/siteDomain/getSiteCnameInfo',
      method: 'post',
      data: data
    }),
  getMainSiteDomainDetail: data =>
    request({
      //查询分组域名明细
      url: '/siteDomain/getMainSiteDomainDetail',
      method: 'post',
      data: data
    }),
  getSiteH5Domains: data =>
    request({
      //查询站点H5域名列表
      url: '/siteDomain/getSiteH5Domains',
      method: 'post',
      data: data
    }), 
  getSiteCnameInfo: data =>
    request({
      //查询站点ＣＮＡＭＥ信息
      url: '/siteDomain/getSiteCnameInfo',
      method: 'post',
      data: data
    }),     
  getSitePopuDomains: data =>
    request({
      //查询站点推广域名
      url: '/siteDomain/getSitePopuDomains',
      method: 'post',
      data: data
    }),   
  addOrUpSitePopuDomains: data =>
    request({
      //新增或修改推广域名
      url: '/siteDomain/addOrUpSitePopuDomains',
      method: 'post',
      data: data
    }),  

  //全局参数 注册登录
  getGlobalRegister: data =>
    request({
      //查询全局注册登录列表
      url: '/globalManage/getGlobalRegister',
      method: 'post'
    }),
  updateGlobalRegister: data =>
    request({
      //保存全局参数 注册登录
      url: '/globalManage/updateGlobalRegister',
      method: 'post',
      data: data
    }),
  getGlobalApplication: data =>
    request({
      //查询微信绑定相关参数
      url: '/globalManage/getGlobalApplication',
      method: 'post'
    }),
  updateGlobalApplication: data =>request({
    //保存微信绑定相关参数
    url: '/globalManage/updateGlobalApplication',
    method: 'post',
    data: data
  }),
  // 查询站点ＣＮＡＭＥ信息
  //   getSiteCnameInfo:data => request({  //保存微信绑定相关参数
  //     url:'/siteDomain/getSiteCnameInfo',
  //     method:'post',
  //     data:data
  //   }),
  //修改厅主子账号密码
  changeSubAccountPassWord:data => request({  //修改子账号密码
    url:'/accountManage/changeSubAccountPassWord',
    method:'post',
    data:data 
  }),
  updateSubAccount:data => request({  //修改子账号信息
    url:'/accountManage/updateSubAccount',
    method:'post',
    data:data 
  }),
}
