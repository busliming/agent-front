import request from '@/request'
import formdata from '@/tool/formdata'

const prefix = "/game";

export default {
  findSumQuery: data => request({ //获取游戏报表
    url: prefix + '/findSumQuery',
    method: 'post',
    data: data
  }),
  queryGroupGameRecord: data => request({ //游戏报表详情
    url: prefix + '/queryGroupGameRecord',
    method: 'post',
    data: data
  }),
  queryTbFundsVariety: data => request({ //游戏报表详情
    url: '/user/queryTbFundsVariety',
    method: 'post',
    data: data
  }),
  queryTbSysTypeList: data => request({ //游戏报表详情
    url: '/user/queryTbSysTypeList',
    method: 'post',
    data: data
  }),
  getGameRecord: data => request({ //查询游戏报表
    url: '/game/getGameRecord',
    method: 'post',
    data: data
  }),
  // getGameRecordSummary: data => request({ //prod_new 作废
  //   url: '/game/getGameRecordSummary',
  //   method: 'post',
  //   data: data
  // }),
  getGameType: data => request({ //获取游戏类型列表
    url: '/game/getGameType',
    method: 'post',
    data: data
  }),
  getRoomTypeList: data => request({ //获取游戏房间查询条件
    url: '/game/getRoomTypeList',
    method: 'post',
    data: data
  }),

    getRedBlackWarDetails: data => request({ // 查询红黑大战详细
        url: '/game/getRedBlackWarDetails',
        method: 'post',
        data: data
    }),
    getDouDiZhuDetails: data => request({ //查询斗地主游戏详情
        url: '/game/getDouDiZhuDetails',
        method: 'post',
        data: data
    }),
    getBenzBmwDetails: data => request({ //查询奔驰宝马游戏详情
        url: '/game/getBenzBmwDetails',
        method: 'post',
        data: data
    }),
    getBirdsAndBeastsDetails: data => request({ //查询飞禽走兽游戏详情
        url: '/game/getBirdsAndBeastsDetails',
        method: 'post',
        data: data
    }),
    getBaiRenNiuNiuDetails: data => request({ //查询百人牛牛游戏详情
        url: '/game/getBaiRenNiuNiuDetails',
        method: 'post',
        data: data
    }),
    getTwoPeopleTenDetails: data => request({ //查询斗地主游戏详情
        url: '/game/getTwoPeopleTenDetails',
        method: 'post',
        data: data
    }),
    getBaccaratDetails: data => request({ //查询百家乐游戏详情
        url: '/game/getBaccaratDetails',
        method: 'post',
        data: data
    }),
    getShakeOneShakeDetails: data => request({ //查询摇一摇游戏详情
        url: '/game/getShakeOneShakeDetails',
        method: 'post',
        data: data
    }),
    getQiangeZhuangDetails: data => request({ //查询抢庄牛牛游戏详情
        url: '/game/getQiangeZhuangDetails',
        method: 'post',
        data: data
    }),
    getThirteenDetails: data => request({ //查询十三水游戏详情
        url: '/game/getThirteenDetails',
        method: 'post',
        data: data
    }),
    getTexasPokerDetails: data => request({ //查询德州扑克游戏详情
        url: '/game/getTexasPokerDetails',
        method: 'post',
        data: data
    }),
    getZJHDetails: data => request({ //查询炸金花游戏详情
        url: '/game/getZJHDetails',
        method: 'post',
        data: data
    }),
    getTBNNDDetails: data => request({ //查询通比牛牛游戏详情
        url: '/game/getTBNNDDetails',
        method: 'post',
        data: data
    }),
    getQZPJDetails: data => request({ //查询抢庄牌九游戏详情
        url: '/game/getQZPJDetails',
        method: 'post',
        data: data
    }),
    getYZLHDetails: data => request({ //查询压装龙虎游戏详情
        url: '/game/getYZLHDetails',
        method: 'post',
        data: data
    }),
    getSanGongDetails: data => request({ //查询三公游戏详情
        url: '/game/getSanGongDetails',
        method: 'post',
        data: data
    }),
    getEBGDetails: data => request({ //查询二八杠游戏详情
        url: '/game/getEBGDetails',
        method: 'post',
        data: data
    }),
    getBlackJackDetails: data => request({ //查询二十一点游戏详情
        url: '/game/getBlackJackDetails',
        method: 'post',
        data: data
    }),
    getForestDanceDetails: data => request({// 获取森林舞会游戏详情
        url: '/game/getForestDanceDetails',
        method: 'post',
        data: data
    }),

	 /**
	  * 1.0.4 公司账单
	  */
	 getBill: data => request({ //查询公司账单列表
	   url: '/comBill/getBill',
	   method: 'post',
	   data: data
	 }),
}
