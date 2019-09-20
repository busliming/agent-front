import request from '@/request'

const prefix = "/agentNotice";

export default {
  getNotices:data => request({  //获取公告列表
    url:prefix + '/getNotices',
    method:'post',
    data:data
  }),
  addOrUpdateNotice:data => request({  //新建和更新公告
    url:prefix + '/addOrUpdateNotice',
    method:'post',
    data:data
  }),
  deleteNotice:data => request({  //删除公告
    url:prefix + '/deleteNotice',
    method:'post',
    data:data
  }),
  getNoticeMsgList:data => request({  //获取收件箱消息列表
    url:prefix + '/getNoticeMsgList',
    method:'post',
    data:data
  }),
  getSendMsgList:data => request({  //获取发件箱消息列表
    url:prefix + '/getSendMsgList',
    method:'post',
    data:data
  }),
  userQueryList:data => request({  //发件箱列表获取收件人列表
    url:prefix + '/userQueryList',
    method:'post',
    data:data
  }),
  // queryUserList:data => request({  //获取会员列表
  //   url:prefix + '/queryUserList',
  //   method:'post',
  //   data:data
  // }),
  queryUserLevelList:data => request({  //获取会员等级
    url:prefix + '/queryUserLevelList',
    method:'post',
    data:data
  }),
  addNoticeMsg:data => request({  //发送站内消息
    url:prefix + '/addNoticeMsg',
    method:'post',
    data:data
  }),
  updateIsRead:data => request({  //未读消息改为已读
    url:prefix + '/updateIsRead',
    method:'post',
    data:data
  }),
  deleteMsg:data => request({  //删除收件箱邮件
    url:prefix + '/deleteMsg',
    method:'post',
    data:data
  }),
  deleteSend:data => request({  //删除发件箱邮件
    url:prefix + '/deleteSend',
    method:'post',
    data:data
  }),
  queryAccount:data => request({  //精确模糊查找会员
    url:'/user/acc/queryAccount',
    method:'post',
    data:data
  }),
  getUnreadMsgCount:data => request({  //获取未读消息
    url:'/agentNotice/getUnreadMsgCount',
    method:'post',
    data:data
  }),
    queryNewUserNotice:data => request({  //查询新用户邮件
        url:'/agentNotice/queryNewUserNotice',
        method:'post',
        data:data
    }),
    updateNewUserNotice:data => request({  //添加或更新新用户邮件
        url:'/agentNotice/updateNewUserNotice',
        method:'post',
        data:data
    }),
    addOrUpdatePush: data => request({      //添加个推
        url: '/push/addOrUpdatePush',
        method: 'post',
        data: data
    }),
    getPushList: data => request({      //查询个推记录
        url: '/push/getPushList',
        method: 'post',
        data: data
    })
}
