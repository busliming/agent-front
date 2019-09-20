import request from '@/request'
import formdata from '@/tool/formdata'

export default {
    uploadFile:data => request({  //文件上传
        url:'/upload/uploadFile?pathType='+data.pathType+'&fileName='+data.fileName+'&bundleId='+data.bundleId,
        method:'post',
        headers:{
        'Content-Type':'multipart/form-data'
        },
        data:formdata({file:data.file}),
        onUploadProgress:data.progcallback
    }),
    getUserLabelList: data => request({
        url: '/userLabelManage/querySiteUserLabels',
        method: 'post',
        data: data
    }),
    getUserLevel: data => request({
        url: '/userLevel/getLevelList',
        method: 'post',
        data: data
    }),
    // 代理充值配置
    getListByAgent: data => request({
        url: '/payMerchant/listByAgent',
        method: 'post',
        data: data
    }),
    //固码配置 + 代理配置公用
    getAgentById: data => request({
        url: '/payMerchant/getAgentById?id=' + data.id,
        method: 'post',
        data: data
    }),
    //固码配置+代理配置公用
    changeAgentState: data => request({
        url: '/payMerchant/changeUseAgent',
        method: 'post',
        data: formdata(data)
    }),
    //固码配置 + 代理配置公用
    deleteAgent: data => request({
        url: '/payMerchant/delAgent',
        method: 'post',
        data: formdata(data)
    }),
    submitAgent: data => request({
        url: '/payMerchant/addTbPayMerchantByAgent',
        method: 'post',
        data: data
    }),
    getReportInfo: data => request({
        url: '/payMerchant/getReportInfo',
        method: 'get',
        data: data
    }),
    saveReportInfo: data => request({
        url: '/payMerchant/saveReportInfo',
        method: 'post',
        data: data
    }),
    // 固码入款配置
    getListByQrCode: data => request({
        url: '/payMerchant/listByQrCode',
        method: 'post',
        data: data
    }),
    submitQrCode: data => request({
        url: '/payMerchant/addQrCode',
        method: 'post',
        data: data
    }),
    uploadQrCode: data => request({
        url: '/upload/uploadFile?siteId=' + data.id + '&pathType=' + data.type + '',
        method: 'post',
        headers: {
            "Content-Type": false
        },
        data: data.file
    }),

    // 官方入款配置
    getListByBank: data => request({
        url: '/payMerchant/listByBank',
        method: 'post',
        data: data
    }),
    submitBank: data => request({
        url: '/payMerchant/addBank',
        method: 'post',
        data: data
    }),

    //线上入款配置
    getListByOnlMerchant: data => request({
        url: '/payMerchant/listByOnline',
        method: 'post',
        data: data
    }),
    payTypeListAll: data => request({
        url: '/pay/payTypeListAll',
        method: 'get',
        data: data
    }),
    paySystemList: data => request({
        url: '/pay/paySystemList?bankType='+data.bankType,
        method: 'post',
    }),
    changeOnlPayState: data => request({
        url: '/payMerchant/changeOnline',
        method: 'post',
        data: formdata(data)
    }),
    deletePayMerchant: data => request({
        url: '/payMerchant/delTbPayMerchant',
        method: 'post',
        data: formdata(data)
    }),
    getMerchantById: data => request({
        url: '/payMerchant/getMerchantById?id=' + data.id,
        method: 'post',
        data: data
    }),
    submitPayMerchant: data => request({
        url: '/payMerchant/addTbPayMerchant',
        method: 'post',
        data: data
    }),
    //线上入款  充值参数
    showSiteAmountConfig: data => request({
        url: '/siteAmountConfig/showSiteAmountConfig',
        method: 'post',
        data: data
    }),
    addOrUpdateSiteAmount: data => request({
        url: '/siteAmountConfig/addOrUpdateSiteAmount',
        method: 'post',
        data: data
    }),
    // 出款配置  稽核版本已废弃
    // getWithdrawConf: data => request({
    //     url: '/payMerchant/getDrawConfig',
    //     method: 'post',
    //     data: data
    // }),
    // submitWithdrawConf: data => request({
    //     url: '/payMerchant/drawConfig',
    //     method: 'post',
    //     data: data
    // }),
    // getWithdrawConfList: data => request({
    //     url: '/payMerchant/getDrawConfigList',
    //     method: 'post',
    //     data: data
    // }),

    //出入款配置 稽核版本更新
    getDrawPayConfigPageList: data => request({
        url: '/dpConfig/getDrawPayConfigPageList',
        method: 'post',
        data: data
    }),
    addOrUpdateDrawPayConfig: data => request({
        url: '/dpConfig/addOrUpdateDrawPayConfig',
        method: 'post',
        data: data
    }),
    delDrawPayConfig: data => request({
        url: '/dpConfig/delDrawPayConfig',
        method: 'post',
        data: data
    }),
    getDrawPayConfigDetail: data => request({
        url: '/dpConfig/getDrawPayConfigDetail',
        method: 'post',
        data: data
    }),
    getDrawMerchantList: data => request({
        url: '/draw/getDrawMerchantList',
        method: 'get',
    }),


    //线上出款配置
    getListByOnlWithdrawMerchant: data => request({
        url: '/payMerchant/listByDraw',
        method: 'post',
        data: data
    }),
    getOnlWithdrawMerchantById: data => request({
        url: '/payMerchant/getMerchantDrawById?id=' + data.id,
        method: 'post',
        data: data
    }),
    deleteWithdrawConf: data => request({
        url: '/payMerchant/delTbPayMerchantDraw',
        method: 'post',
        data: formdata(data)
    }),
    changeOnlWithdrawConf: data => request({
        url: '/payMerchant/changeUseDraw',
        method: 'post',
        data: formdata(data)
    }),
    initWithdrawChannel: data => request({
        url: '/pay/payTypeListAllForDraw',
        method: 'get',
        data: data
    }),
    submitOnlWithdrawConf: data => request({
        url: '/payMerchant/addDraw',
        method: 'post',
        data: data
    }),
    
};
