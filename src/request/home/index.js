import request from '@/request'
import formdata from '@/tool/formdata'

export default {
  newGameMoneyStatistics:data => request({  //首页营收等统计
    url:'/home/newGameMoneyStatistics',
    method:'post',
    data:data
  }),
  GameHeatStatistics:data => request({  //游戏热度统计
    url:'/home/GameHeatStatistics',
    method:'post',
    data:data
  }),
  GameFlowStatistics:data => request({  //流量分布统计
    url:'/home/GameFlowStatistics',
    method:'post',
    data:data
  }),
  GameHomeCountStatistics:data => request({  //笔数/人数  图形数据
    url:'/home/GameHomeCountStatistics',
    method:'post',
    data:data
  }),
  GameHomeMoneyStatistics:data => request({  //充提 图形数据
    url:'/home/GameHomeMoneyStatistics',
    method:'post',
    data:data
  }),
  GameHomeOnlineStatistics:data => request({  //在线人数 图形数据
    url:'/home/GameHomeOnlineStatistics',
    method:'post',
    data:data
  }),
  GameHomeProfitLossStatistics:data => request({  //盈亏 图形数据
    url:'/home/GameHomeProfitLossStatistics',
    method:'post',
    data:data
  }),
  HomeOnlineNumber:data => request({  //导航栏 在线人数
    url:'/home/HomeOnlineNumber',
    method:'post',
  }),
}