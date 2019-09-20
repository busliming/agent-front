import request from '@/request'
const prefix = "/game";

export default {
    getBulletRecordList: data => request({  //获取游戏报表
        url: prefix + '/getBulletRecordList',
        method: 'post',
        data: data
    }),
}
