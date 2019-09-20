import request from "@/request"
export default{
    getPlayerSingleControlList:data=>
        request({
            //玩家单控列表查询
            url: '/controlSystem/selectControl',
            method: 'post',
            data: data
        }),
    addPlayerSingleControl:data=>
        request({
            //添加玩家单控
            url: '/controlSystem/insetControl',
            method: 'post',
            data: data
        }),
    deletePlayerSingleControl:data=>
        request({
            //删除玩家单控
            url: '/controlSystem/deleteControl',
            method: 'post',
            data: data
        }),
    updatePlayerSingleControl:data=>
    request({
        //编辑玩家单控
        url: '/controlSystem/updateControl',
        method: 'post',
        data: data
    }),
        //游戏控制列表 根据游戏类型 获取游戏列表
    getGameList:data=>
        request({
            url: '/controlSystem/selectGameName',
            method: 'post',
            data: data
        }),
    getGameRoomList:data=>//根据游戏获取房间列表
        request({
            url: '/controlSystem/selectGameRoom',
            method: 'post',
            data: data
        }),
    getGameControlList:data=>
        request({
            //游戏控制列表查询
            url: '/controlSystem/selectStockWeak',
            method: 'post',
            data: data
        }),
    updateGameControl:data=>
        request({
            //修改游戏控制
            url: '/controlSystem/insetOrUpdateStockWeak',
            method: 'post',
            data: data
        }),
    setBatchinVentory:data=>
        request({
            //批量设置库存衰减
            url: '/controlSystem/allStockWeak',
            method: 'post',
            data: data
        }),
    getInventoryGear:data=>
        request({
            //获取库存档位列表
            url: '/controlSystem/selectStockGear',
            method: 'post',
            data: data
        }),
    addInventoryGear:data=>
        request({
            //新增库存档位
            url: '/controlSystem/insetStockGear',
            method: 'post',
            data: data
        }),
    updateInventoryGear:data=>
        request({
            //修改库存档位(批量)
            url: '/controlSystem/allUpdateStockGear',
            method: 'post',
            data: data
        }),
    deleteStockGear:data=>
        request({
            //删除库存档位
            url: '/controlSystem/deleteStockGear',
            method: 'post',
            data: data
        }),
    getBetPeopleNumber:data=>
        request({
            //下注类人数设置查询
            url: '/controlSystem/selectBetNumber',
            method: 'post',
            data: data
        }),
    setBetPeopleNumber:data=>
        request({
            //下注类人数设置
            url: '/controlSystem/betNumber',
            method: 'post',
            data: data
        }),
    setVolume:data=>
        request({
            //批量设置
            url: '/controlSystem/allUpdateStockGear',
            method: 'post',
            data: data
        }),
    getInventoryReductionLog:data=>
        request({
            //获取库存衰减日志列表
            url: '/controlSystem/selectStockWeakLog',
            method: 'post',
            data: data
        }),
    getPlayerSingleControlLog:data=>
        request({
            //获取玩家单控日志列表
            url: '/controlSystem/selectControlLog',
            method: 'post',
            data: data
        }),
    selectStorage:data=>
        request({
            //查询库存值 2019/4/6 新增
            url: '/controlSystem/selectStorage',
            method: 'post',
            data: data
        }),
}