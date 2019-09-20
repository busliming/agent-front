import request from '@/request'

const prefix = ''

export default {
    luckyControl: data => request({  //获取幸运转盘控制参数
        url:prefix +'/activity/luckyControl',
        method: 'post',
        data: data
    }),
    getSiteActivityList: data => request({
        url: prefix + '/activity/getSiteActivityList',
        method: 'post',
        data: data
    }),
    addOrUpdateSiteActivity: data => request({
        url: prefix + '/activity/addOrUpdateSiteActivity',
        method: 'post',
        data: data
    }),
    addOrUpdateSiteSignActivity: data => request({
        url: prefix + '/activity/addOrUpdateSiteSignActivity',
        method: 'post',
        data: data
    }),
    getSiteActivityDetail: data => request({
        url: prefix + '/activity/getSiteActivityDetail',
        method: 'post',
        data: data
    }),
    getTestSiteActivityDetail: data => request({//获取试玩金活动配置
        url: prefix + '/activity/getTestSiteActivityDetail',
        method: 'post',
        data: data
    }),
    addOrUpdateTestSiteActivity: data => request({//保存试玩金活动配置
        url: prefix + '/activity/addOrUpdateTestSiteActivity',
        method: 'post',
        data: data
    }),
    delSiteActivity: data => request({ //删除活动
        url: prefix + '/activity/delSiteActivity',
        method: 'post',
        data: data
    }),
    getSiteActivityBonusList: data => request({ //获取活动报表列表
        url: prefix + '/activity/getSiteActivityBonusList',
        method: 'post',
        data: data
    }),
    auditSiteActivityBonus: data => request({ //审核活动奖励
        url: prefix + '/activity/auditSiteActivityBonus',
        method: 'post',
        data: data
    }),
    delete: data => request({ //删除活动 - 新
        url: prefix + '/activity/delete',
        method: 'post',
        data: data
    }),
    insert: data => request({ //保存活动 - 新
        url: prefix + '/activity/insert',
        method: 'post',
        data: data
    }),
    update: data => request({ //更新活动 - 新
        url: prefix + '/activity/update',
        method: 'post',
        data: data
    }),
    list: data => request({ //活动列表 - 新
        url: prefix + '/activity/list',
        method: 'post',
        data: data
    }),
    updateSort: data => request({ //修改排序 - 新
        url: prefix + '/activity/updateSort',
        method: 'post',
        data: data
    }),
    updateWidGet: data => request({ //修改游戏自动弹出开关 - 新
        url: prefix + '/activity/updateWidGet',
        method: 'post',
        data: data
    }),
    getSiteSignDetail: data => request({ // 连续签到
        url: prefix + '/activity/getSiteSignDetail',
        method: 'post',
        data: data
    }),
    bulidWheelSurfs: data => request({ // 奖项概率算法
        url: prefix + '/activity/bulidWheelSurfs',
        method: 'post',
        data: data
    }),
}
