import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

/**
 * 页面组件
 */
const Layout = ()=>import('@/views/Index.vue');
const Dashborad = ()=>import('@/views/IndexDefault.vue');

const MemberList = ()=>import('@/views/member/MemberList.vue');
const MemberLog = ()=>import('@/views/member/MemberLog.vue');
const MemberDetail = ()=>import('@/views/member/MemberDetail.vue');
const MemberLevel = ()=>import('@/views/member/MemberLevel.vue');
const MemberLevelVip = ()=>import('@/views/member/MemberLevelVip.vue');
const MemberLabel = ()=>import('@/views/member/MemberLabel.vue');
const MemberAdd = ()=>import('@/views/member/MemberAdd.vue');
const MemberDistributionList = ()=>import('@/views/member/MemberReport.vue');

const GameReport = ()=>import('@/views/operation/GameReport.vue');
const FundsReport = () =>import('@/views/operation/FundsReport.vue');
const BetRecord = () =>import('@/views/operation/BetRecord.vue');
const BetDetails = () =>import('@/views/operation/BetDetails.vue');
const CompReport = () =>import('@/views/operation/CompReport.vue');

const GameList = () =>import('@/views/game/GameList.vue');
const GameRoomList = () =>import('@/views/game/GameRoomList.vue');
const GameGroup = () =>import('@/views/game/GameGroup.vue');

const ManualOperate = () =>import('@/views/finance/ManualOperate.vue');
const ManualListDeposit = () =>import('@/views/finance/ManualListDeposit.vue');
const ManualListWithdrawal = () =>import('@/views/finance/ManualListWithdrawal.vue');
const OfficialCharge = () =>import('@/views/finance/OfficialCharge.vue');
const OnlinePay = () =>import('@/views/finance/OnlinePay.vue');
const AlipayPaymentReview = () =>import('@/views/finance/AlipayPaymentReview.vue');
const BankPaymentReview = () =>import('@/views/finance/BankPaymentReview.vue');
const DrawRecord = () =>import('@/views/finance/DrawRecord.vue');
const FinanceConf = () =>import('@/views/finance/FinanceConf.vue');
const AuditRecord = () =>import('@/views/finance/AuditRecord.vue');

const AnnounceList = () =>import('@/views/message/AnnounceList.vue');
const InternalMessage = () =>import('@/views/message/InternalMessage.vue');

const SpreadUser = () =>import('@/views/spread/SpreadUser.vue');
const SpreadProfit = () =>import('@/views/spread/SpreadProfit.vue');
const ProfitConf = () =>import('@/views/spread/ProfitConf.vue');
const SpreadReport = () =>import('@/views/spread/SpreadReportNew.vue');
const SpreadParameter = () =>import('@/views/spread/SpreadParameter.vue');
const DailySpreadReport = () =>import('@/views/spread/SpreadReportNewDetails.vue');
const SpreadReportNewDetailsUnlimited = () =>import('@/views/spread/SpreadReportNewDetailsUnlimited.vue');
const SpreadReportNewDetailEverys = () =>import('@/views/spread/SpreadReportNewDetailEverys.vue');
const SpreadReportPersonal = () =>import('@/views/spread/SpreadReportPersonal.vue');
const SpreadReview = () =>import('@/views/spread/SpreadReview.vue');

const SubAccount = () =>import('@/views/system/SubAccount.vue');
const RoleManage = () =>import('@/views/system/RoleManage.vue');
const GlobalParam = () =>import('@/views/system/GlobalParam.vue');
const DownloadConf = () =>import('@/views/system/DownloadConf.vue');
const UserProfile = () =>import('@/views/system/UserProfile.vue');
const OperateLog = () =>import('@/views/system/OperateLog.vue');
const DomainManage = () =>import('@/views/system/DomainManage.vue');

const CommonActivty = () =>import('@/views/activty/CommonActivty.vue');
const ActivtyList = () =>import('@/views/activty/ActivtyList.vue');
const AddActivty = () =>import('@/views/activty/AddActivty.vue');
const ActivtyReport = () =>import('@/views/activty/ActivtyReport.vue');

const AdSetting = () =>import('@/views/website/AdSetting.vue');
const BannerSetting = () =>import('@/views/website/BannerSetting.vue');

const PlayerSingleControl = () =>import('@/views/controlSystem/PlayerSingleControl.vue');
const GameControl = () =>import('@/views/controlSystem/GameControl.vue');
const InventoryGear = () =>import('@/views/controlSystem/InventoryGear.vue');
const Log = () =>import('@/views/controlSystem/Log.vue');


export default new Router({
        mode: 'hash',
        base: process.env.BASE_URL,
        routes: [
            {
                path: '/',
                name: '登录',
                component: () => import('@/views/Login.vue')
            },
            {
            path: '/layout',
            name: 'layout',
            component: Layout,
            children: [
                {
                    path: '/home',
                    name: '首页',
                    component: Dashborad,
                    meta:{
                      menuModule:'Dashborad'
                    }
                },
                {
                    path: 'member',
                    name: '会员管理',
                    meta:{
                      menuModule:'MemberManage'
                    }
                },
                {
                    path: '/member/memberList',
                    component: MemberList,
                    name: '会员列表',
                    meta:{
                      menuModule:'MemberList'
                    }
                },
                {
                    path: '/member/memberLog',
                    component: MemberLog,
                    name: '会员登录日志',
                    meta:{
                      menuModule:'MemberLog'
                    }
                },
                {
                    path: '/member/memberLevel',
                    name: '会员层级',
                    component: MemberLevel,
                    meta:{
                      menuModule:'MemberLevel'
                    }
                },
                {
                    path: '/member/MemberLevelVip',
                    name: 'VIP等级',
                    component: MemberLevelVip,
                    meta:{
                        menuModule:'VIPLevel'
                    }
                },
                {
                    path: '/member/MemberDistributionList',
                    name: '会员分布',
                    component: MemberDistributionList,
                    meta:{
                        menuModule:'MemberDistributionList'
                    }
                },
                {
                    path: '/member/memberLabel',
                    name: '会员标签',
                    component: MemberLabel,
                    meta:{
                      menuModule:'MemberLabel'
                    }
                },
                {
                    path: '/member/memberList/memberDetail/:account',
                    name: '会员详情',
                    component: MemberDetail,
                    meta:{
                      parentRouterName:'会员列表',
                      parentMenuModule:'MemberList'
                    }
                },
                {
                    path: '/member/memberList/memberAdd',
                    name: '新增用户',
                    component: MemberAdd,
                    meta:{
                      parentRouterName:'会员列表',
                      parentMenuModule:'MemberList'
                    }
                },
                {
                    path: 'operation',
                    name: '报表查询',
                    meta: {
                        icon: 'iconfont icon-yunying',
                        menuModule:'ReportManage'
                    },
                },
                {
                    path: '/operation/gameReport',
                    name: '游戏报表',
                    component: GameReport,
                    meta:{
                      menuModule:'GameReport'
                    }
                },
                {
                    path: '/operation/fundsReport',
                    name: '资金账变',
                    component: FundsReport,
                    meta:{
                      menuModule:'FundsReport'
                    }
                },
                {
                    path: '/operation/compReport',
                    name: '公司账单',
                    component: CompReport,
                    meta:{
                      menuModule:'compReport'
                    }
                },
                {
                    path: '/operation/betRecord',
                    name: '投注记录',
                    component: BetRecord,
                    meta:{
                      menuModule:'BetRecord'
                    }
                },
                {
                    path: '/operation/betRecord/betDetails/gameId=:gameId&recordId=:recordId',
                    name: '投注详情',
                    component: BetDetails,
                    meta:{
                      parentRouterName:'投注记录',
                      parentMenuModule:'BetRecord'
                    }
                },
                {
                    path: 'game',
                    name: '游戏管理',
                    meta:{
                      menuModule:'GameManage'
                    }
                },
                {
                    path: '/game/gameList',
                    name: '游戏列表',
                    component: GameList,
                    meta:{
                      menuModule:'GameList'
                    }
                },
                {
                    path: '/game/gameGroup',
                    name: '游戏分组',
                    component: GameGroup,
                    meta:{
                      menuModule:'GameGroup'
                    }
                },
                {
                    path: '/game/gameList/gameRoomList/:id',
                    name: '游戏房间管理',
                    component: GameRoomList,
                    meta:{
                      parentRouterName:'游戏列表',
                      parentMenuModule:'GameList'
                    }
                },
                {
                    path: 'finance',
                    name: '财务管理',
                    meta:{
                      menuModule:'FinanceManage'
                    }
                },
                {
                    path: '/finance/manualOperate',
                    name: '人工存提',
                    component: ManualOperate,
                    meta:{
                      menuModule:'ManualOperate'
                    }
                },
                {
                    path: '/finance/AuditRecord',
                    name: '稽核查询',
                    component: AuditRecord,
                    meta:{
                      menuModule:'AuditRecord'
                    }
                },
                {
                    path: '/finance/officialCharge',
                    name: '官方充值',
                    component: OfficialCharge,
                    meta:{
                      menuModule:'OfficialCharge'
                    }
                },
                {
                    path: '/finance/onlinePay',
                    name: '线上支付',
                    component: OnlinePay,
                    meta:{
                      menuModule:'OnlinePay'
                    }
                },
                {
                    path: '/finance/aliPayPaymentReview',
                    name: '支付宝出款审核',
                    component: AlipayPaymentReview,
                    meta:{
                      menuModule:'AlipayPaymentReview'
                    }
                },
                {
                    path: '/finance/bankCardPaymentReview',
                    name: '银行卡出款审核',
                    component: BankPaymentReview,
                    meta:{
                      menuModule:'BankPaymentReview'
                    }
                },
                {
                    path: '/finance/drawRecord',
                    name: '自动出款交易记录',
                    component: DrawRecord,
                    meta:{
                      menuModule:'DrawRecord'
                    }
                },
                {
                    path: '/finance/financeConf',
                    name: '出入款配置',
                    component: FinanceConf,
                    meta:{
                      menuModule:'FinanceConf'
                    }
                },
                {
                    path: '/finance/manualOperate/manualList/deposit',
                    name: '人工存款记录',
                    component: ManualListDeposit,
                    meta:{
                      parentRouterName:'人工存提',
                      parentMenuModule:'ManualOperate'
                    }
                },
                {
                    path: '/finance/manualOperate/manualList/withdrawal',
                    name: '人工提款记录',
                    component: ManualListWithdrawal,
                    meta:{
                      parentRouterName:'人工存提',
                      parentMenuModule:'ManualOperate'
                    }
                },
                {
                    path: 'message',
                    name: '消息管理',
                    meta:{
                      menuModule:'MessageManage'
                    }
                },
                {
                    path: '/message/announceList',
                    name: '系统广播',
                    component: AnnounceList,
                    meta:{
                      menuModule:'AnnounceList'
                    }
                },
                {
                    path: '/message/internalMessage',
                    name: '邮箱系统',
                    component: InternalMessage,
                    meta:{
                      menuModule:'InternalMessage'
                    }
                },
                {
                    path: 'spread',
                    name: '推广管理',
                    meta:{
                      menuModule:'SpreadManage'
                    }
                },
                {
                    path: '/spread/spreadUser',
                    name: '推广玩家',
                    component: SpreadUser,
                    meta:{
                      menuModule:'SpreadUser'
                    }
                },
                {
                    path: '/spread/spreadProfit',
                    name: '推广返利',
                    component: SpreadProfit,
                    meta:{
                      menuModule:'SpreadProfit'
                    }
                },
                {
                    path: '/spread/spreadParameter',
                    name: '推广参数',
                    component: SpreadParameter,
                    meta:{
                      menuModule:'SpreadParameter'
                    }
                },
                {
                    path: '/spread/profitConf',
                    name: '返利设置',
                    component: ProfitConf,
                    meta:{
                      menuModule:'ProfitConf'
                    }
                },
                {
                    path: '/spread/spreadReport',
                    name: '推广报表',
                    component: SpreadReport,
                    meta:{
                      menuModule:'SpreadReport'
                    }
                },
                {
                    path: '/spread/SpreadReview', //添加推广审核
                    name: '推广审核',
                    component: SpreadReview,
                    meta:{
                      menuModule:'SpreadReview'
                    }
                },
                {
                    path: '/spread/spreadReport/SpreadReportPersonal',///subordinateTopId=:subordinateTopId/subordinateLevel=:subordinateLevel/queryType=:queryType
                    name: '个人推广报表',
                    component: SpreadReportPersonal,
                    meta: {
                        parentRouterName: '推广报表',
                        parentMenuModule:'SpreadReport'
                    }
                },
                {
                    path: '/spread/spreadReport/SpreadReportNewDetails',///:accountId/type=:type/:accountId/type=:type/subordinateLevel=:subordinateLevel/subordinateTopId=:subordinateTopId
                    name: '报表详情',
                    component: DailySpreadReport,
                    meta: {
                        parentRouterName: '推广报表',
                        parentMenuModule:'SpreadReport'
                    }
                },
                {
                  path: '/spread/spreadReport/SpreadReportNewDetailsUnlimited',///:accountId/type=:type/:accountId/type=:type/subordinateLevel=:subordinateLevel/subordinateTopId=:subordinateTopId
                  name: '团队报表',
                  component: SpreadReportNewDetailsUnlimited,
                  meta: {
                    parentRouterName: '推广报表',
                    parentMenuModule:'SpreadReport'
                   }
                },
                {
                  path: '/spread/spreadReport/SpreadReportNewDetailEverys',///:accountId/type=:type/:accountId/type=:type/subordinateLevel=:subordinateLevel/subordinateTopId=:subordinateTopId
                  name: '团队报表',
                  component: SpreadReportNewDetailEverys,
                  meta: {
                    parentRouterName: '推广报表',
                    parentMenuModule:'SpreadReport'
                   }
                },
                {
                    path: '/spread/spreadReport/SpreadReportNewDetails',///:accountId/:accountId/type=:type/:accountId/type=:type/subordinateLevel=:subordinateLevel/subordinateTopId=:subordinateTopId
                    name: '报表详情',
                    component: DailySpreadReport,
                    meta: {
                        parentRouterName: '个人推广报表',
                        parentMenuModule:'SpreadReportPersonal'
                    }
                },
                {
                    path: 'system',
                    name: '系统设置',
                    meta:{
                      menuModule:'SystemConf'
                    }
                },
                {
                    path: '/system/subAccount',
                    name: '厅主子账号管理',
                    component: SubAccount,
                    meta:{
                      menuModule:'SubAccount'
                    }
                },
                {
                    path: '/system/roleManage',
                    name: '角色管理',
                    component: RoleManage,
                    meta:{
                      menuModule:'RoleManage'
                    }
                },
                {
                    path: '/system/domainManage',
                    name: '域名管理',
                    component: DomainManage,
                    meta:{
                      menuModule:'DomainManage'
                    }
                },
                {
                    path: '/system/globalParam',
                    name: '全局参数',
                    component: GlobalParam,
                    meta:{
                      menuModule:'GlobalParam'
                    }
                },
                {
                    path: '/system/downloadConf',
                    name: '下载设置',
                    component: DownloadConf,
                    meta:{
                      menuModule:'DownloadConf'
                    }
                },
                {
                    path: '/system/operateLog',
                    name: '操作日志',
                    component: OperateLog,
                    meta:{
                      menuModule:'OperateLog'
                    }
                },
                {
                    path: '/system/userProfile',
                    name: '个人资料设置',
                    component: UserProfile,
                    meta:{
                      menuModule:'UserProfile'
                    }
                },
                {
                    path: 'activty',
                    name: '活动管理',
                    meta:{
                      menuModule:'ActivtyManage'
                    }
                },
                {
                    path: '/activty/commonActivty',
                    name: '常规活动',
                    component: CommonActivty,
                    meta:{
                      menuModule:'CommonActivty'
                    }
                },
                {
                    path: '/activty/activtyList',
                    name: '活动列表',
                    component: ActivtyList,
                    meta:{
                      menuModule:'ActivtyList'
                    }
                },
                {
                    path: '/activty/activtyList/addActivty',//type=:activityType
                    name: '添加活动',
                    component: AddActivty,
                    meta: {
                        parentRouterName: '活动列表',
                        parentMenuModule:'ActivtyList'
                    }
                },
                {
                    path: '/activty/activtyList/editActivty/:id',
                    name: '编辑活动',
                    component: AddActivty,
                    meta: {
                        parentRouterName: '活动列表',
                        parentMenuModule:'ActivtyList'
                    }
                },
                {
                    path: '/activty/activtyReport',
                    name: '活动报表',
                    component: ActivtyReport,
                    meta:{
                      menuModule:'ActivtyReport'
                    }
                },
                {
                    path: 'website',
                    name: '网站管理',
                    meta:{
                      menuModule:'WebsiteManage'
                    }
                },
                {
                    path: '/website/adSetting',
                    name: '广告图设置',
                    component: AdSetting,
                    meta:{
                      menuModule:'AdSetting'
                    }
                },
                {
                    path: '/website/bannerSetting',
                    name: '轮播图设置',
                    component: BannerSetting,
                    meta:{
                      menuModule:'BannerSetting'
                    }
                },
                {
                    path: '/controlSystem',
                    name: '控制系统',
                    meta:{
                      menuModule:'ControlSystem'
                    }
                },
                {
                    path: '/controlSystem/playerSingleControl',
                    name: '玩家单控',
                    component: PlayerSingleControl,
                    meta:{
                      menuModule:'PlayerSingleControl'
                    }
                },
                {
                    path: '/controlSystem/gameControl',
                    name: '游戏控制',
                    component: GameControl,
                    meta:{
                      menuModule:'GameControl'
                    }
                },
                {
                    path: '/controlSystem/inventoryGear',
                    name: '库存档位',
                    component: InventoryGear,
                    meta:{
                      menuModule:'InventoryGear'
                    }
                },
                {
                    path: '/controlSystem/controlSystemLog',
                    name: '日志',
                    component: Log,
                    meta:{
                      menuModule:'ControlSystemLog'
                    }
                },
            ]
        },
    ],
    scrollBehavior: () =>({y: 0})
    })
