import request from '@/request'
import formdata from '@/tool/formdata'

const prefix = "/user";

export default {
  getUsers:data => request({  //获取用户列表
    url:prefix + '/getUsers',
    method:'post',
    data:data
  }),
  getLevelList:data => request({  //获取用户列表
    url: '/userLevel/getLevelList',
    method:'post',
  }),
  getUserDetail:data => request({  //根据账号获取用户详情
    url:prefix + '/getUserDetail',
    method:'post',
    headers:{
      'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
    },
    data:formdata(data)
  }),
  mNumberInfo:data => request({  //修改会员信息
    url:prefix + '/acc/mNumberInfo',
    method:'post',
    data:data
  }),
  kickPlayer: data => request({  //会员列表-在线会员踢人功能
    url: prefix + '/kickPlayer/?id='+data,
    method: 'post',
    // data: data
  }),
  getUserGameList:data => request({  //会员详情-会员游戏信息
    url:prefix+'/getUserGameList',
    method:'post',
    data:data
  }),
  // getUserOperList:data => request({  //会员详情-会员活动信息
  //   url:prefix+'/getUserOperList',
  //   method:'post',
  //   data:data
  // }),
  changeState:data => request({  //启用禁用某个账户
    url:prefix + '/changeState',
    method:'post',
    data:data
  }),
  checkAccount:data => request({ //新建用户账号是否可用
    url:prefix + '/acc/checkAccount',
    method:'post',
    headers:{
      'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
    },
    data:formdata(data)
  }),
  checkParentAccount:data => request({ //检查上级填写的账号是否可用
        url:prefix + '/acc/checkSiteAccount',
        method:'post',
        headers:{
            'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data:formdata(data)
    }),
  checkAgent:data => request({ //新建用户检查代理商账号是否存在
    url:prefix + '/acc/lastAgentAccountCheck',
    method:'post',
    headers:{
      'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
    },
    data:formdata(data)
  }),
  searchBankAccount:data => request({ //银行卡是否唯一
    url:prefix + '/searchBankAccount',
    method:'post',
    data:data
  }),
  signup:data => request({ //注册新用户
    url:prefix + '/acc/signup',
    method:'post',
    data:data
  }),
  getLevel:data => request({ //获取会员等级
    url:"/userLevel/getLevel",
    method:'post',
    data:data
  }),
  getSiteVip:data => request({ //获取站点VIP特权列表 2019/5/27
    url:"/activity/getSiteVip",
    method:'post'
  }),
  addOrUpdateSiteVip:data => request({ //更新或修改VIP特权
    url:"/activity/addOrUpdateSiteVip",
    method:'post',
    data:data
  }),
  getSiteVipInfo:data => request({ //获取站点VIP统计信息 2019/6/5
        url:"/activity/getSiteVipInfo",
        method:'post',
        data:data
  }),
  addLevel:data => request({ //新增会员等级
    url:"/userLevel/addUserLevel",
    method:'post',
    data:data
  }),
  updateLevel:data => request({ //更新会员等级
    url:"/userLevel/updateUserLevel",
    method:'post',
    data:data
  }),
  deleteLevel:data => request({ //删除会员等级
    url:"/userLevel/deleteUserLevel",
    method:'post',
    headers:{
      'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
    },
    data:formdata(data)
  }),
  queryUserLabels:data => request({ //分页获取会员标签列表
    url:"/userLabelManage/queryUserLabels",
    method:'post',
    data:data
  }),
  querySiteUserLabels:data => request({ //获取会员标签列表
    url:"/userLabelManage/querySiteUserLabels",
    method:'post',
    data:data
  }),
  addOrUpdateUserLabel:data => request({ //添加或修改会员标签
    url:"/userLabelManage/addOrUpdateUserLabel",
    method:'post',
    data:data
  }),
  deleteRole:data => request({ //删除标签
    url:"/userLabelManage/deleteRole",
    method:'post',
    data:data
  }),
  getUserOperList:data => request({ //会员登录日志
    url:"/user/getUserOperList",
    method:'post',
    data:data
  }),

  //查询出入款配置模板列表
  getDrawPayConfigList: data => request({
    url: '/dpConfig/getDrawPayConfigList',
    method: 'post',
    data: data
  }),
  //修改玩家账号预警值
  saveSiteGameAccout: data => request({
    url: '/user/saveSiteGameAccout',
    method: 'post',
    data: data
  }),
}
