import request from '@/request'

const prefix = "/game";

export default {
    updateOrderAll:data => request({  //排序切换模式
        url: prefix + '/updateOrderAll',
        method: 'post',
        data:data
    }),
    updateConfigOrder: data => request({  //排序切换模式
        url: prefix + '/updateConfigOrder'+'?type='+data,
        method: 'post',
        // data:data
    }),
    upOrDown: data => request({  //游戏上移下移
        url: prefix + '/upOrDown',
        method: 'post',
        data:data
    }),
    findConfigOrder: () => request({  //获取排序模式
        url: prefix + '/findConfigOrder',
        method: 'get'
    }),
    getGamePage: data => request({  //获取游戏列表
        url: prefix + '/getGamePage',
        method: 'post',
        data: data
    }),

    maintainTbGameList: data => request({  //修改游戏状态
        url: prefix + '/maintainTbGameList',
        method: 'post',
        data: data
    }),
    getRoomPage: data => request({
        url: '/room/getRoomPage',
        method: 'post',
        data: data
    }),


    editRoomConfig: data => request({  //查询下注类
        url: '/room/editRoomConfig',
        method: 'post',
        data: data
    }),
    editFishRoomConfig: data => request({  //查询捕鱼类
        url: '/room/editFishRoomConfig',
        method: 'post',
        data: data
    }),
    addDouDiZhuRoomConfig: data => request({  //查询对战类
        url: '/room/addDouDiZhuRoomConfig',
        method: 'post',
        data: data
    }),
    addBetRoomConfig: data => request({  //修改下注类
        url: '/room/addBetRoomConfig',
        method: 'post',
        data: data
    }),
    addFishRoomConfig: data => request({  //修改捕鱼类
        url: '/room/addFishRoomConfig',
        method: 'post',
        data: data
    }),
    editDouDiZhuRoomConfig: data => request({  //修改对战类
        url: '/room/editDouDiZhuRoomConfig',
        method: 'post',
        data: data
    }),

    // 修改下注类 房间配置
    updateBetRoomConfig: data => request({
        url: '/room/addBetRoomConfig',
        method: 'post',
        data: data
    }),

    updateRoomConfig: data => request({
        url: '/room/updateTbGameRoom',
        method: 'post',
        data: data
    }),

    changeRoomState: data => request({  //更新房间配资
        url: '/room/updateTbGameRoom',
        method: 'post',
        data: data
    }),
    addRoom: data => request({
        url: '/room/addRoom',
        method: 'post',
        data: data
    }),
    updateGameTopOrGameHot: data => request({   //将游戏设置为热门或者置顶
        url: '/game/updateGameTopOrGameHot',
        method: 'post',
        data: data
    }),

}
