import request from '@/request'

const prefix = '/promotion'

export default {
  infinitetaxaudit:data => request({ //无限税收推广返利审核
    url:'/promotion/infinite/tax/audit',
    method:'post',
    data:data
  }),
  infinitetaxexperience:data => request({ //无限税收推广等级经验查询
    url:'/promotion/infinite/tax/experience',
    method:'post',
  }),
  infinitetaxexperienceupdate:data => request({ //无限税收推广等级经验修改
    url:'/promotion/infinite/tax/experience/update',
    method:'post',
    data:data
  }),
  infinitetaxreportinfo:data => request({ //无限税收推广报表详情
    url:'/promotion/infinite/tax/report/info',
    method:'post',
    data:data
  }),
  infinitetaxreport:data => request({ //无限税收推广报表
    url:'/promotion/infinite/tax/report',
    method:'post',
    data:data
  }),
  infinitetaxpage:data => request({ //分页查询无限税收推广返利信息
    url:'/promotion/infinite/tax/page',
    method:'post',
    data:data
  }),
  taxexperienceupdate:data => request({ //无限税收推广等级经验修改
    url:'/promotion/infinite/tax/experience/update',
    method:'post',
    data:data
  }),
  taxexperience:data => request({ //无限税收推广等级经验查询
    url:'/promotion/infinite/tax/experience',
    method:'post',
    data:data
  }),
  deletesiteInfiniteTaxRebateConfig:data => request({ //删除返利设置
    url:'/siteInfiniteTaxRebateConfig/delete',
    method:'post',
    data:data
  }),
  infiniteaudit:data => request({ //无限推广返利审核
    url:prefix + '/infinite/audit',
    method:'post',
    data:data
  }),
  infinitepage:data => request({ //分页查询每万代推广返利信息
    url:prefix + '/infinite/page',
    method:'post',
    data:data
  }),
  setsiteInfiniteTaxRebateConfig:data => request({ //保存返利设置
    url:'/siteInfiniteTaxRebateConfig',
    method:'post',
    data:data
  }),
  getsiteInfiniteTaxRebateConfig:() => request({ //获取自己代理的返利设置
    url: '/siteInfiniteTaxRebateConfig/site',
    method:'get',
  }),
  reportinfo:data => request({ // //获取无限级推广报表详情
    url:prefix + '/infinite/report/info',
    method:'post',
    data:data
  }),
  report:data => request({ //获取无限级推广报表
    url:prefix + '/infinite/report',
    method:'post',
    data:data
  }),

  siteRebateConfigGet:() => request({ //获取自己代理的返利设置
    url:'/siteRebateConfig/site',
    method:'get',
  }),
  siteRebateConfig:data => request({ //保存返利设置
    url:'/siteRebateConfig',
    method:'post',
    data:data
  }),
  getPromotionUsers:data => request({ //获取推广玩家列表
    url:prefix + '/getPromotionUsers',
    method:'post',
    data:data
  }),
  getPromotionRebates:data => request({ //获取推广返利列表
    url:prefix + '/getPromotionRebates',
    method:'post',
    data:data
  }),
  getRebateConfig:data => request({ //获取返利设置列表
    url:prefix + '/getRebateConfig',
    method:'post',
    data:data
  }),
  updateOrAddRebateConfig:data => request({ //添加或者修改返利设置
    url:prefix + '/updateOrAddRebateConfig',
    method:'post',
    data:data
  }),
  getPromotionReport:data => request({ //获取推广报表
    url:prefix + '/getPromotionReport',
    method:'post',
    data:data
  }),
    getPromotionGroupReport:data => request({ //获取推广团队报表19-7-12
        url:prefix + '/getPromotionGroupReport',
        method:'post',
        data:data
    }),
    getPromotionPersonReport:data => request({ //获取个人团队报表19-7-15
        url:prefix + '/getPromotionPersonReport',
        method:'post',
        data:data
    }),
    getPromotionGroupReportDetails:data => request({ //获取推广团队报表个人详情19-7-13
        url:prefix + '/getPromotionGroupReport/'+data.accountId+'/info',
        method:'post',
        data:{startTime:data.startTime,endTime:data.endTime}
    }),
  getPromotionRebatesExperience:() => request({ //获取推广经验设置
    url:prefix + '/getPromotionRebatesExperience',
    method:'post',
  }),
  updateRebateExperienceConfig:data => request({ //修改推广经验设置
    url:prefix + '/updateRebateExperienceConfig',
    method:'post',
    data:data
  }),
  /**
   * 推广参数
   */
  getSitePopularJs:data => request({ //根据id生成js
    url:'/popjs/getSitePopularJs',
    method:'post',
    data:data
  }),
  findUser:data => request({  //查找会员id是否存在
    url:'/manualAccess/user',
    method:'post',
    data:data
  }),
    dailyRecord:data => request({  //查找会员id是否存在
    url: prefix + '/dailyRecord',
    method:'post',
    data:data
  }),
}
