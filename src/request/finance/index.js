import request from '@/request'
import formdata from '@/tool/formdata'

export default {
  findUser: data =>
    request({
      //人工提存查找会员
      url: '/manualAccess/user',
      method: 'post',
      data: data
    }),
  countCodeSize: data =>
    request({
      //人工提存 计算充值打码量
      url: '/manualAccess/countCodeSize' + data,
      method: 'get'
    }),
  getCheckMultip: data =>
    request({
      //人工提存 获取优惠稽核倍数
      url: '/manualAccess/getCheckMultip' + data,
      method: 'get'
    }),
  countFreeCodeSize: data =>
    request({
      //人工提存 计算优惠打码量
      url: '/manualAccess/countFreeCodeSize' + data,
      method: 'get'
    }),
  add: data =>
    request({
      //添加人工存提
      url: '/manualAccess/add',
      method: 'post',
      data: data
    }),
  payRecoderList: data =>
    request({
      //人工存款记录
      url: '/manualAccess/payRecoderList',
      method: 'post',
      data: data
    }),
  drawRecoderList: data =>
    request({
      //人工提款记录
      //url: '/manualAccess/drawRecoderList',  2019/4/20日有变动
      url:'/drawRecord/manualWithdrawal',
      method: 'post',
      data: data
    }),
  listByBank: data =>
    request({
      //官方入款配置查询
      url: '/payRecord/officialPayRecordList',
      method: 'post',
      data: data
    }),
  updateState: data =>
    request({
      //官方充值订单处理
      url: '/payRecord/updateState' + data,
      method: 'post'
    }),
  PayRecordList: data =>
    request({
      //线上支付入款记录查询
      url: '/payRecord/payRecordList',
      method: 'post',
      data: data
    }),

  getLevelList: data =>
    request({
      //获取会员等级下拉菜单
      url: '/userLevel/getLevelList',
      method: 'post',
      data: data
    }),
  supplementOrder: data =>
    request({
      //线上入款补单操作
      url: '/payRecord/supplementOrder' + data,
      method: 'post'
    }),
  rejectedOrder: data =>
    request({
      //线上支付拒绝操作
      url: '/payRecord/rejectedOrder' + data,
      method: 'post'
    }),

  getZfbDrawRecordList: data =>
    request({
      //支付宝出款记录查询
      url: '/drawRecord/getZfbDrawRecordList',
      method: 'post',
      data: data
    }),
  getBankDrawRecordList: data =>
    request({
      //银行卡出款记录查询
      url: '/drawRecord/getBankDrawRecordList',
      method: 'post',
      data: data
    }),
  updateOperatingState: data =>
    request({
      //出款订单锁定与取消
      url: '/drawRecord/updateOperatingState' + data,
      method: 'post'
    }),
  updateReviewResult: data =>
    request({
      //出款订单审核操作   确认  退回
      url: '/drawRecord/updateReviewResult',
      method: 'post',
      data: data
    }),
  updateOperatingState: data =>
    request({
      //出款订单锁定与取消
      url: '/drawRecord/updateOperatingState' + data,
      method: 'post'
    }),
  checkRejustDraw: data =>
    request({
      //出款订单拒绝
      url: '/drawRecord/checkRejustDraw' + data,
      method: 'post'
    }),
  queryByRecord: data =>
    request({
      //查看出款订单
      url: '/drawRecord/queryByRecord' + data,
      method: 'get'
    }),
  updateRemark: data =>
    request({
      //更新备注
      url: '/drawRecord/updateRemark' + data,
      method: 'post'
    }),

  getDrawRecordList: data =>
    request({
      //自动出款交易记录查询
      url: '/drawRecord/getDrawRecordList',
      method: 'post',
      data: data
    }),
  getDrawConfig: data =>
    request({
      //自动出款补单获取支付信息
      url: '/payMerchant/getDrawConfigList',
      method: 'post',
      data: data
    }),

  getPayDrawCount: data =>
    request({
      //查看出款订单 出入款总次数
      url: '/drawRecord/getPayDrawCount' + data,
      method: 'post'
    }),

  getLevelList: data =>
    request({
      //获取会员等级下拉菜单
      url: '/userLevel/getLevelList',
      method: 'post',
      data: data
    }),

  //稽核查询
  getHistoryCheckRecordList: data =>
    request({
      //历史稽核查询
      url: '/check/getHistoryCheckRecordList',
      method: 'post',
      data: data
    }),
  getCurrentCheckRecordDetail: data =>
    request({
      //明细查询
      url: '/check/getCurrentCheckRecordDetail',
      method: 'post',
      data:data
    }),
  updateCheckRecord: data =>
    request({
      //修改稽核记录
      url: '/check/updateCheckRecord',
      method: 'post',
      data: data
    }),

    //1.04新需求
    financeExport:data => request({  //财务订单导出
      url:'/drawRecord/financeExport',
      method:'post',
      data:data,
      responseType: 'blob'
  }),
  // 获取厅主的会员等级
  getLevelList: data =>
    request({
      url: '/userLevel/getLevelList',
      method: 'post',
      data: data
    }),
  // 微信公众号入款配置 查询
  listByWeChatPublic: data =>
    request({
      url: '/payMerchant/listByWeChatPublic',
      method: 'get',
      data: data
    }),
  // 线上入款配置 微信公众号开关
  changeWeChat: data =>
    request({
      url: '/payMerchant/changeWeChat',
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: formdata(data)
    }),
  // 微信公众号入款配置 添加和修改
  addWeChatPublic: data =>
    request({
      url: '/payMerchant/addWeChatPublic',
      method: 'post',
      data: data
    })
}
