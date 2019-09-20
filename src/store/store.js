import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'
import headernav from './headernav'
import auditRecord from './auditRecord'
import betRecord from './betRecord'
import labelRecord from './labelRecord'
import levelRecord from './levelRecord'
import spreadReport from './spreadReport'
Vue.use(Vuex)
export default new Vuex.Store({
    modules: {
        user,
        headernav,
        auditRecord, //稽核查询跳转带参
        betRecord, //会员详情跳转投注记录带参
        labelRecord,//存储会员标签，当获取异常时从这里获取
        levelRecord,
        spreadReport
    },
    getters: {
        //token: state => state.user.token,
        siteid: state => state.user.siteid,
        avatar: state => state.user.avatar,
        name: state => state.user.name,
        role: state => state.user.role,
        permissionmenu: state => state.user.permissionMenu,
        permissionarray: state => state.user.permissionarray,
        permissionBtn: state => state.user.permissionBtn,
        permissionState: state => state.user.permissionState,
        wsUrl: state => state.user.wsUrl,
        headernavlists: state => state.headernav.lists,
        crtitem: state => state.headernav.crtitem,
        auditParams: state => state.auditRecord.params,
        betParams: state => state.betRecord.params,
        labelList: state => state.labelRecord.list,
        levelList: state => state.levelRecord.list,
        levelListName: state => state.levelRecord.listName,
        spreadParams: state => state.spreadReport.params,
        spreadParams1: state => state.spreadReport.params1,
        gettreba:state=>state.user.gettreba,
        DomainLists:state=> state.auditRecord.DomainLis,
    }
})
