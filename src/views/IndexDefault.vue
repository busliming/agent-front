<template>
<el-card class="shouye">
  <el-row style="margin-top:17px;">
    <span style="font-size:14px">选择时间区间</span>
    <el-date-picker 
      type="daterange"
      v-model="daterange" 
      range-separator="~"
      size="small"
      value-format="yyyy-MM-dd"
      format="yyyy-MM-dd"
      start-placeholder="选择开始日期"
      end-placeholder="选择结束日期"
      clearable
      style="margin:0 5px;margin-right:15px;"
    ></el-date-picker>
    <el-button size="small" type="primary"
      @click='queryHandle'
    >
      <i class="el-icon-search"></i>
      搜索
    </el-button>
    <el-button size="small" type="" plain=""
      @click="DateChange('jint')"
      :loading="Isloading"
    >今天</el-button>
    <el-button size="small" type="" plain=""
      @click="DateChange('zuot')"
      :loading="Isloading"
    >昨天</el-button>
    <el-button size="small" type="" plain=""
      @click="DateChange('benz')"
      :loading="Isloading"
    >本周</el-button>
    <el-button size="small" type="" plain=""
      @click="DateChange('shangz')"
      :loading="Isloading"
    >上周</el-button>
    <el-button size="small" type="" plain=""
      @click="DateChange('beny')"
      :loading="Isloading"
    >本月</el-button>
    <el-button size="small" type="" plain=""
      @click="DateChange('shangy')"
      :loading="Isloading"
    >上月</el-button>
  </el-row>
  <el-row
    :gutter="20"
    style="margin-top:40px;"
  >
    <el-col :span="6">
      <div class="count count1">
        <div class="inner">
          <p>
            总盈亏
            <!-- <el-tooltip class="item" effect="dark" content="总下注-总中奖-总税收" placement="top">
              <i class="el-icon-info"></i>
            </el-tooltip> -->
          </p>
          <p>￥{{homeData.totalAmountProfit | betNumberFormatter}}</p>
          <p>本月日均盈利 <span>¥{{homeData.dayTotalAmountProfit | betNumberFormatter}}</span></p>
        </div>
      </div>
    </el-col>
    <el-col :span="6">
      <div class="count count2">
        <div class="inner">
          <p>
            总入款额
            <el-tooltip class="item" effect="dark" content="人工充值（人工充值，不包含优惠充值）+官方充值+线上支付" placement="top">
              <i class="el-icon-info"></i>
            </el-tooltip>
          </p>
          <p>￥{{homeData.totalRechargeAmount}}</p>
          <p>本月日均入款额 <span>¥{{homeData.dayTotalRechargeAmount}}</span></p>
        </div>
      </div>
    </el-col>
    <el-col :span="6">
      <div class="count count3">
        <div class="inner">
          <p>
            总出款额
            <el-tooltip class="item" effect="dark" content="银行卡出款+支付宝出款+自动出款+人工提现（人工提现、误存提现、行政提现）" placement="top">
              <i class="el-icon-info"></i>
            </el-tooltip>
          </p>
          <p>￥{{homeData.totalWithdrawalAmount}}</p>
          <p>本月日均出款额 <span>¥{{homeData.dayTotalWithdrawalAmount}}</span></p>
        </div>
      </div>
    </el-col>
    <el-col :span="6">
      <div class="count count4">
        <div class="inner">
          <p>
            有效下注
            <el-tooltip class="item" effect="dark" content="显示会员查询时间段有效下注" placement="top">
              <i class="el-icon-info"></i>
            </el-tooltip>
          </p>
          <p>￥{{homeData.validMember | betNumberFormatter}}</p>
          <p>本月日均有效下注 <span>¥{{homeData.dayValidMember | betNumberFormatter}}</span></p>
        </div>
      </div>
    </el-col>
  </el-row>
  <el-row
    style="margin-top:40px;"
  >
    <ul
      class="first_page_count_wrapper"
    >
      <li><span>充值金额：</span>{{homeData.rechargeAmount}}元/{{homeData.rechargePeopleCount}}人</li>
      <li><span>首充人数：</span>{{homeData.firstDepositPeople}}人/{{homeData.firstDepositAmount}}元</li>
      <li><span>二次充值：</span>{{homeData.twoCount}}人/{{homeData.twoAmount}}元</li>
      <li><span>充值笔数：</span>{{homeData.rechargeCount}}笔/{{homeData.rechargePeopleCount}}人</li>
      <li><span>提现金额：</span>{{homeData.withdrawalAmount}}元/{{homeData.withdrawalPeople}}人</li>
      <li><span>提现笔数：</span>{{homeData.withdrawalCount}}笔/{{homeData.withdrawalPeople}}人</li>
      <li><span>拒绝出款：</span>{{homeData.refuseAmount}}元/{{homeData.refuseNumber}}人</li>
      <li><span>会员余额/保险箱：</span>{{homeData.memberBalance | betNumberFormatter}}元/{{homeData.safeBalance | betNumberFormatter}}元</li>
      <li><span>下注金额：</span>{{homeData.betAmount2 | betNumberFormatter}}元/{{homeData.betAmount2Number}}人</li>
      <li><span>有效下注金额：</span>{{homeData.betAmount | betNumberFormatter}}元/{{homeData.betAmount2Number}}人</li>
      <li><span>下注人数：</span>{{homeData.betNumber}}人/{{homeData.betCount}}局</li>
      <li><span>税收：</span>{{homeData.taxAmount | betNumberFormatter}}元/{{homeData.taxNumber}}人</li>
      <li><span>返利金额：</span>{{homeData.rebateAmount | betNumberFormatter}}元/{{homeData.rebateNumber}}人</li>
      <li><span>活动优惠：</span>{{homeData.activityAmount | betNumberFormatter}}元/{{homeData.activityNumber}}人</li>
      <li><span>充值时间：</span>{{homeData.rechargetime}}</li>
      <li><span>取款时间：</span>{{homeData.withdrawaltime}}</li>
    </ul>
  </el-row>
  <el-row
    :gutter="20"
    style="margin-top:40px;"
  >
    <el-col
      :span="18"
    >
      <el-card
        :body-style="{height:'395px',padding:0}"
      >
        <div slot="header">笔数/人数</div>
        <el-row
          style="height:100%"
        >
          <el-col 
            :span="4"
            style="height:100%;"
          >
            <div class="leftdata">
              <div class="data1">
                <p>累计充值笔数</p>
                <p>{{bishuData.chargeCount}}/{{bishuData.chargePeopleCount}}</p>
              </div>
              <div class="data2">
                <p>累计提现笔数</p>
                <p>{{bishuData.withdrawCount}}/{{bishuData.withdrawPeopleCount}}</p>
              </div>
              <div class="data3">
                <p>累计首充笔数</p>
                <p>{{bishuData.firstPeopleCount}}</p>
              </div>
            </div>
          </el-col>
          <el-col 
            :span="20"
            style="height:100%;"
          >
            <div class="rightdata">
              <el-row
                type="flex"
                justify="space-between"
              >
                <el-col
                  :span="3"
                >近期状况</el-col>
                <el-col
                  :span="15"
                >
                  <el-row
                    type="flex"
                    justify="space-between"
                  >
                    <el-button size="mini" plain
                      @click='bishuDateChange("jint")'
                    >今日</el-button>
                    <el-button size="mini" plain
                      @click='bishuDateChange("benz")'
                    >本周</el-button>
                    <el-button size="mini" plain
                      @click='bishuDateChange("beny")'
                    >本月</el-button>
                    <el-date-picker
                      v-model="bishudate"
                      type="daterange"
                      range-separator="~"
                      size="mini"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      style="width:320px;margin-left:20px;"
                      start-placeholder="开始时间"
                      end-placeholder="结束时间"
                      @change="GameHomeCountStatistics"
                    ></el-date-picker>
                  </el-row>
                </el-col>
              </el-row>

              <ve-line 
                :data="chartData"
                :settings="chartSettings"
                :legend-visible='false'
                height='300px'
              ></ve-line>

              <el-row
                type="flex"
                justify="center"
              >
                <el-button size="mini" plain :type="chartData == bishuList.withdrawList?'primary':''"
                  @click='chartData = bishuList.withdrawList'
                >提现笔数</el-button>
                <el-button size="mini" plain :type="chartData == bishuList.chargeList?'primary':''"
                  @click='chartData = bishuList.chargeList'
                >充值笔数</el-button>
                <el-button size="mini" plain :type="chartData == bishuList.firstList?'primary':''"
                  @click='chartData = bishuList.firstList'
                >首充笔数</el-button>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </el-card>
      <el-card
        :body-style="{height:'395px',padding:0}"
      >
        <div slot="header">充提</div>
        <el-row
          style="height:100%"
        >
          <el-col 
            :span="4"
            style="height:100%;"
          >
            <div class="leftdata">
              <div class="data1">
                <p>累计充值金额</p>
                <p>{{chongtiData.totalChargeCount}}</p>
              </div>
              <div class="data2">
                <p>累计提现金额</p>
                <p>{{chongtiData.totalWithdrawCount}}</p>
              </div>
              <div class="data3">
                <p>累计首充金额</p>
                <p>{{chongtiData.totalFirstPeopleCount}}</p>
              </div>
            </div>
          </el-col>
          <el-col 
            :span="20"
            style="height:100%;"
          >
            <div class="rightdata">
              <el-row
                type="flex"
                justify="space-between"
              >
                <el-col
                  :span="3"
                >近期状况</el-col>
                <el-col
                  :span="15"
                >
                  <el-row
                    type="flex"
                    justify="space-between"
                  >
                    <el-button size="mini" plain 
                      @click="chongtiDateChange('jint')"
                    >今日</el-button>
                    <el-button size="mini" plain
                      @click="chongtiDateChange('benz')"
                    >本周</el-button>
                    <el-button size="mini" plain
                      @click="chongtiDateChange('beny')"
                    >本月</el-button>
                    <el-date-picker
                      v-model="chongtidate"
                      type="daterange"
                      range-separator="~"
                      size="mini"
                      value-format="yyyy-MM-dd"
                      format="yyyy-MM-dd"
                      style="width:320px;margin-left:20px;"
                      start-placeholder="开始时间"
                      end-placeholder="结束时间"
                      @change="GameHomeMoneyStatistics"
                    ></el-date-picker>
                  </el-row>
                </el-col>
              </el-row>

              <ve-line 
                :data="chartData2"
                :settings="chartSettings"
                :legend-visible='false'
                height='300px'
              ></ve-line>

              <el-row
                type="flex"
                justify="center"
              >
                <el-button size="mini" plain :type="chartData2 == chongtiList.totalWithdrawList?'primary':''"
                  @click='chartData2 = chongtiList.totalWithdrawList'
                >提现金额</el-button>
                <el-button size="mini" plain :type="chartData2 == chongtiList.totalChargeList?'primary':''"
                  @click='chartData2 = chongtiList.totalChargeList'
                >充值金额</el-button>
                <el-button size="mini" plain :type="chartData2 == chongtiList.totalFirstList?'primary':''"
                  @click='chartData2 = chongtiList.totalFirstList'
                >首充金额</el-button>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </el-card>
      <el-card
        :body-style="{height:'395px',padding:0}"
      >
        <div slot="header">盈亏</div>
        <el-row
          style="height:100%"
        >
          <el-col 
            :span="4"
            style="height:100%;"
          >
            <div class="leftdata">
              <div class="data1">
                <p>累计系统盈亏</p>
                <p>{{yingkuiData.systemMoney | betNumberFormatter}}</p>
              </div>
              <div class="data2">
                <p>累计推广返水</p>
                <p>{{yingkuiData.promotionRebate | betNumberFormatter}}</p>
              </div>
              <div class="data3">
                <p>累计服务税收</p>
                <p>{{yingkuiData.serviceTax | betNumberFormatter}}</p>
              </div>
            </div>
          </el-col>
          <el-col 
            :span="20"
            style="height:100%;"
          >
            <div class="rightdata">
              <el-row
                type="flex"
                justify="space-between"
              >
                <el-col
                  :span="3"
                >近期状况</el-col>
                <el-col
                  :span="15"
                >
                  <el-row
                    type="flex"
                    justify="space-between"
                  >
                    <el-button size="mini" plain
                      @click='yingkuiDateChange("jint")'
                    >今日</el-button>
                    <el-button size="mini" plain
                      @click='yingkuiDateChange("benz")'
                    >本周</el-button>
                    <el-button size="mini" plain
                      @click='yingkuiDateChange("beny")'
                    >本月</el-button>
                    <el-date-picker
                      v-model="yingkuidate"
                      type="daterange"
                      range-separator="~"
                      size="mini"
                      value-format="yyyy-MM-dd"
                      format="yyyy-MM-dd"
                      style="width:320px;margin-left:20px;"
                      start-placeholder="开始时间"
                      end-placeholder="结束时间"
                      @change="GameHomeProfitLossStatistics"
                    ></el-date-picker>
                  </el-row>
                </el-col>
              </el-row>

              <ve-line 
                :data="chartData3"
                :settings="chartSettings"
                :legend-visible='false'
                height='300px'
              ></ve-line>

              <el-row
                type="flex"
                justify="center"
              >
                <el-button size="mini" plain :type="chartData3 == yingkuiList.systemMoneyList?'primary':''"
                  @click='chartData3 = yingkuiList.systemMoneyList'
                >系统盈亏</el-button>
                <el-button size="mini" plain :type="chartData3 == yingkuiList.promotionMoneyList?'primary':''"
                  @click='chartData3 = yingkuiList.promotionMoneyList'
                >推广返水</el-button>
                <el-button size="mini" plain :type="chartData3 == yingkuiList.serviceMoneyList?'primary':''"
                  @click='chartData3 = yingkuiList.serviceMoneyList'
                >服务税收</el-button>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </el-card>
      <!-- <el-card
        :body-style="{height:'395px',padding:0}"
      >
        <div slot="header">在线人数</div>
        <el-row
          style="height:100%"
        >
          <el-col 
            :span="4"
            style="height:100%;"
          >
            <div class="leftdata">
              <div class="data1">
                <p>累计在线会员</p>
                <p>{{zaixianData.totalOnlineNumber}}</p>
              </div>
            </div>
          </el-col>
          <el-col 
            :span="20"
            style="height:100%;"
          >
            <div class="rightdata">
              <el-row
                type="flex"
                justify="space-between"
              >
                <el-col
                  :span="3"
                >近期状况</el-col>
                <el-col
                  :span="15"
                >
                  <el-row
                    type="flex"
                    justify="space-between"
                  >
                    <el-button size="mini" plain
                      @click="zaixianDateChange('jint')"
                    >今日</el-button>
                    <el-button size="mini" plain
                      @click="zaixianDateChange('benz')"
                    >本周</el-button>
                    <el-button size="mini" plain
                      @click="zaixianDateChange('beny')"
                    >本月</el-button>
                    <el-date-picker
                      v-model="zaixiandate"
                      type="daterange"
                      range-separator="~"
                      size="mini"
                      value-format="yyyy-MM-dd"
                      format="yyyy-MM-dd"
                      style="width:320px;margin-left:20px;"
                      start-placeholder="开始时间"
                      end-placeholder="结束时间"
                      @change="GameHomeOnlineStatistics"
                    ></el-date-picker>
                  </el-row>
                </el-col>
              </el-row>

              <ve-line 
                :data="chartData4"
                :settings="chartSettings"
                :legend-visible='false'
                height='300px'
              ></ve-line>
            </div>
          </el-col>
        </el-row>
      </el-card> -->
    </el-col>
    <el-col
      :span="6"
    >
      <el-card
        :body-style="{height:'395px',padding:'10px'}"
      >
        <div slot="header">注册人数</div>
        <el-table 
          :data="homeData.registered"
          fit
          stripe
          max-height="370"
        >
          <el-table-column
            label="日期"
            prop="registeredDate"
          ></el-table-column>
          <el-table-column
            label="人数"
            prop="registeredCount"
          ></el-table-column>
        </el-table>
      </el-card>
      <el-card
        :body-style="{height:'395px',padding:'10px'}"
      >
        <div slot="header">游戏热度</div>
        <el-tabs 
          v-model="youxireduactiveName" 
        >
          <el-tab-pane label="有效下注" name="first">
            <el-table 
              :data="GameHeatData.heatDataMoney"
              fit
              stripe
              max-height="320"
            >
              <el-table-column
                label="排名"
                type='index'
                width="48px"
              ></el-table-column>
              <el-table-column
                label="名称"
                prop="gameName"
              ></el-table-column>
              <el-table-column
                label="金额"
                prop="gameMoney"
              >
                <template slot-scope="{row}">
                  {{row.gameMoney | betNumberFormatter}}
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="人数" name="second">
            <el-table 
              :data="GameHeatData.heatDataCount"
              fit
              stripe
              max-height="320"
            >
              <el-table-column
                label="排名"
                type='index'
                width="48px"
              ></el-table-column>
              <el-table-column
                label="名称"
                prop="gameName"
              ></el-table-column>
              <el-table-column
                label="人数"
                prop="gameCount"
              ></el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <el-card
        :body-style="{height:'395px',padding:'10px'}"
      >
        <div slot="header">流量分布</div>
        <el-tabs 
          v-model="liuliangfenbuactiveName" 
          @tab-click='liuliangTabClick'
        >
          <el-tab-pane label="Android" name="Android">
            <el-table 
              :data="liuliangfenbuAndroidTD"
              fit
              stripe
              max-height="320"
            >
              <el-table-column
                label="日期"
                prop="operDate"
              ></el-table-column>
              <el-table-column
                label="人数"
                prop="count"
              ></el-table-column>
              <el-table-column
                label="下载数量"
                prop="downloadCount"
              ></el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="iOS" name="iOS">
            <el-table 
              :data="liuliangfenbuIosTD"
              fit
              stripe
              max-height="320"
            >
              <el-table-column
                label="日期"
                prop="operDate"
              ></el-table-column>
              <el-table-column
                label="人数"
                prop="count"
              ></el-table-column>
              <el-table-column
                label="下载数量"
                prop="downloadCount"
              ></el-table-column>
            </el-table>
          </el-tab-pane>
          <!-- <el-tab-pane label="Web" name="Windows">
            <el-table 
              :data="liuliangfenbuWebTD"
              fit
              stripe
              max-height="320"
            >
              <el-table-column
                label="日期"
                prop="operDate"
              ></el-table-column>
              <el-table-column
                label="人数"
                prop="count"
              ></el-table-column>
              <el-table-column
                label="下载数量"
                prop="downloadCount"
              ></el-table-column>
            </el-table>
          </el-tab-pane> -->
        </el-tabs>
      </el-card>
    </el-col>
    
  </el-row>
</el-card>
</template>

<script>
import homeRequest from '@/request/home'
import time from '@/tool/times'
import {moneyFormater} from '@/tool/moneyFormater'

export default {
  name:'IndexDefault',
  data(){
    return {
      Isloading:false,
      daterange:[
      ],
      bishudate:[
      ],
      chongtidate:[
      ],
      yingkuidate:[
      ],
      zaixiandate:[
      ],
      chartSettings : { //线形图样式
        area: true,
        labelMap: {
          withdrawCount: '提现笔数',
          chargeCount: '充值笔数',
          firstPeopleCount: '首充笔数',

          withdrawMoney: '提现金额',
          chargeMoney: '充值金额',
          firstMoney: '首充金额',

          systemMoney:'累计系统盈亏',
          promotionRebate:'累计推广返水',
          serviceTax:'累计服务税收',

          totalOnlineNumber:'在线人数'
        }
      },
      bishuData:{  //笔数数据
        chargeCount:'', //累计充值笔数
        chargePeopleCount:'', //充值人数
        withdrawCount:'', //提现笔数
        withdrawPeopleCount:'', //提现人数
        firstPeopleCount:'', //首充笔数
      },
      chongtiData:{  //充提
        totalChargeCount:'', //累计充值金额
        totalWithdrawCount:'', //累计提现金额
        totalFirstPeopleCount:'', //累计首充金额
      },
      yingkuiData:{ //盈亏
        systemMoney:'', //累计系统盈亏
        promotionRebate:'', //累计推广返水
        serviceTax:'', //累计服务税收
      },
      zaixianData:{ //在线人数
        totalOnlineNumber:'' // 累计在线人数
      },


      chartData: {  //笔数/人数图形数据模型
      },
      bishuList:{  //笔数/人数 图形数据
        withdrawList:{
          columns: ['createDate', 'withdrawCount'],
          rows: [
          ]
        },
        chargeList:{
          columns: ['createDate', 'chargeCount'],
          rows: [
          ]
        },
        firstList:{
          columns: ['createDate', 'firstPeopleCount'],
          rows: [
          ]
        },
      },
      chartData2: {  //充提 图形数据模型
      },
      chongtiList:{  //充提 图形数据
        totalWithdrawList:{
          columns: ['createDate', 'withdrawMoney'],
          rows: [
          ]
        },
        totalChargeList:{
          columns: ['createDate', 'chargeMoney'],
          rows: [
          ]
        },
        totalFirstList:{
          columns: ['createDate', 'firstMoney'],
          rows: [
          ]
        },
      },
      chartData3: {  //盈亏 图形数据模型
      },
      yingkuiList:{  //盈亏 图形数据
        systemMoneyList:{
          columns: ['createDate', 'systemMoney'],
          rows: [
          ]
        },
        promotionMoneyList:{
          columns: ['createDate', 'promotionRebate'],
          rows: [
          ]
        },
        serviceMoneyList:{
          columns: ['createDate', 'serviceTax'],
          rows: [
          ]
        },
      },
      chartData4: {  //人数 图形数据模型
      },
      zaixianList:{  //人数 图形数据
        onlineList:{
          columns: ['operDate', 'count'],
          rows: [
          ]
        },
      },

      youxireduactiveName:'first',

      liuliangfenbuactiveName:'Android',

      liuliangfenbuAndroidTD:[
      ],
      liuliangfenbuIosTD:[
      ],
      liuliangfenbuWebTD:[
      ],
      homeData:{
        "totalAmountProfit": "0.00", //总盈亏
        "dayTotalAmountProfit": "0.00", //日均盈亏
        "totalRechargeAmount": "0.00", //总入款
        "dayTotalRechargeAmount": "0.00", //日均入款
        "totalWithdrawalAmount": "0.00", //总出款
        "dayTotalWithdrawalAmount": "0.00", //日均出款
        "firstDepositPeople": "0", //有效会员
        "dayFirstDepositPeople": "0", //日均有效会员
        "registered": [ //注册人数
          {
            "registeredCount": 0,
            "registeredDate": "string"
          }
        ]
      },
      GameHeatData:{  //游戏热度
        "heatDataCount": [    //游戏热度-人数
          {
            "flowCount": "string",
            "flowDate": "string",
            "gameCount": "string",
            "gameMoney": 0,
            "gameName": "string"
          }
        ],
        "heatDataMoney": [   //游戏热度-金额
          {
            "flowCount": "string",
            "flowDate": "string",
            "gameCount": "string",
            "gameMoney": 0,
            "gameName": "string"
          }
        ]
      }
    }
  },
  filters:{
    betNumberFormatter(val){
      if (!val) return "0";
      let str = String(val/1000);
      let idx = str.indexOf('.') + 3;
      if(str.indexOf('.') > -1){
        if(str.length>4){
          return str.slice(0,idx);
        }else{
          return str
        }
      }else{
        return str
      }
    },
  },
  methods:{
    moneyFormater,
    numberFormatter(val){
      if (!val) return "0";
      let str = String(val/1000);
      let idx = str.indexOf('.') + 3;
      if(str.indexOf('.') > -1){
        if(str.length>4){
          return str.slice(0,idx);
        }else{
          return str
        }
      }else{
        return str
      }
    },
    newGameMoneyStatistics(){ //首页营收等统计
      let startDate,endDate;
      if(JSON.stringify(this.daterange[0]).length == 12){
        startDate = this.daterange[0];
        endDate = this.daterange[1];
      }else{
        startDate = time.DateToYMD(this.daterange[0]);
        endDate = time.DateToYMD(this.daterange[1]);
      }
      let data = {
        "conditionsMap":{
          "startDate":startDate,
          "endDate":endDate,
        },
        'limit':0,
        'offset':0,
        'sort':'',
        'sortOrder':'',
      }
      homeRequest.newGameMoneyStatistics(data).then(res => {
        // console.log(res)
        this.Isloading = false
        if(res.code == 200){
          this.homeData = Object.assign({},res.data);
        }else{
          this.$notify({
            type:'warning',
            title:res.msg
          })
        }
      }).catch(err => {
        console.log(err);
        this.$notify({
          type:'error',
          title:err
        })
      })
    },
    GameHeatStatistics(){ //游戏热度
      let startDate,endDate;
      if(JSON.stringify(this.daterange[0]).length == 12){
        startDate = this.daterange[0];
        endDate = this.daterange[1];
      }else{
        startDate = time.DateToYMD(this.daterange[0]);
        endDate = time.DateToYMD(this.daterange[1]);
      }
      let data = {
        "conditionsMap":{
          "startDate":startDate,
          "endDate":endDate,
        },
        'limit':0,
        'offset':0,
        'sort':'',
        'sortOrder':'',
      }
      homeRequest.GameHeatStatistics(data).then(res => {
        // console.log(res)
        this.Isloading=false
        if(res.code == 200){
          let data = res.data;
          this.GameHeatData = Object.assign({},data);
        }else{
          this.$notify({
            type:'warning',
            title:res.msg
          })
        }
      }).catch(err => {
        console.log(err)
        this.$notify({
          type:'error',
          title:err
        })
      })
    },
    GameFlowStatistics(){ //游戏流量
      let startDate,endDate;
      if(JSON.stringify(this.daterange[0]).length == 12){
        startDate = this.daterange[0];
        endDate = this.daterange[1];
      }else{
        startDate = time.DateToYMD(this.daterange[0]);
        endDate = time.DateToYMD(this.daterange[1]);
      }
      let data = {
        "conditionsMap":{
          "startDate":startDate,
          "endDate":endDate,
          'deviceName':this.liuliangfenbuactiveName
        },
        'limit':0,
        'offset':0,
        'sort':'',
        'sortOrder':'',
      }
      homeRequest.GameFlowStatistics(data).then(res => {
        // console.log(res)
        this.Isloading=false
        if(res.code == 200){
          this.liuliangfenbuAndroidTD = res.data.flowAndroidList;
          this.liuliangfenbuIosTD = res.data.flowIOSList;
          this.liuliangfenbuWebTD = res.data.flowWindowsList;
        }else{
          this.$notify({
            type:'warning',
            title:res.msg
          })
        }
      }).catch(err => {
        console.log(err)
        this.$notify({
          type:'error',
          title:err
        })
      })
    },

    DateChange(type){   //首页数据时间点击按钮改变
      this.daterange = [];
      this.Isloading=true
      switch (type) {
        case 'jint':
          this.daterange.push(new Date());
          this.daterange.push(new Date());
          break;
        case 'zuot':
          let zuotstart = new Date().getTime() - 3600 * 1000 * 24 * 1;
          let zuotend = new Date().getTime() - 3600 * 1000 * 24 * 1;
          this.daterange.push(new Date(zuotstart));
          this.daterange.push(new Date(zuotend));
          break;
        case 'benz':
          let benznow = new Date(); 
          let day = benznow.getDay();
          let benzMondayTime;
          if(day == 0){
            benzMondayTime = benznow.getTime() - 6*3600 * 1000 * 24 ;
          }else{
            benzMondayTime = benznow.getTime() - (day-1)*3600 * 1000 * 24 ;
          }
          this.daterange.push(new Date(benzMondayTime));
          this.daterange.push(benznow);
          break;
        case 'shangz':
          let shangznow = new Date(); 
          let shangzday = shangznow.getDay();
          let shangzMondayTime;
          if(shangzday == 0){
            shangzMondayTime = shangznow.getTime() - 6*3600 * 1000 * 24 ;  //本周一
          }else{
            shangzMondayTime = shangznow.getTime() - (shangzday-1)*3600 * 1000 * 24 ;  //本周一
          }
          let prevMondayTime = shangzMondayTime - 7*3600 * 1000 * 24; //上周一
          let prevSundayTime = shangzMondayTime - 1*3600 * 1000 * 24; //上周日
          this.daterange.push(new Date(prevMondayTime));
          this.daterange.push(new Date(prevSundayTime));
          break;
        case 'beny':
          let benyend = new Date();
          let benystart = new Date();
          let firstDay = benystart.getTime()-(benystart.getDate()-1)*3600*1000*24;//本月一号
          this.daterange.push(new Date(firstDay));
          this.daterange.push(benyend);
        break;
        case 'shangy':
          let shangystart = new Date();
          let prevLastDay = shangystart.getTime()-(shangystart.getDate())*3600*1000*24;//上月最后一天
          let prevFirstDay = prevLastDay-(new Date(prevLastDay).getDate()-1)*3600*1000*24//上月第一天
          this.daterange.push(new Date(prevFirstDay));
          this.daterange.push(new Date(prevLastDay));
        break;
      }
      this.queryHandle();
    },
    bishuDateChange(type){  //笔数时间点击按钮改变
      this.bishudate = [];
      switch (type) {
        case 'jint':
          this.bishudate.push(new Date());
          this.bishudate.push(new Date());
          break;
        case 'benz':
          let benznow = new Date(); 
          let day = benznow.getDay();
          let benzMondayTime;
          if(day == 0){
            benzMondayTime = benznow.getTime() - 6*3600 * 1000 * 24 ;
          }else{
            benzMondayTime = benznow.getTime() - (day-1)*3600 * 1000 * 24 ;
          }
          this.bishudate.push(new Date(benzMondayTime));
          this.bishudate.push(benznow);
          break;
        case 'beny':
          let benyend = new Date();
          let benystart = new Date();
          let firstDay = benystart.getTime()-(benystart.getDate()-1)*3600*1000*24;//本月一号
          this.bishudate.push(new Date(firstDay));
          this.bishudate.push(benyend);
        break;
      }
      this.GameHomeCountStatistics();
    },
    chongtiDateChange(type){  //充提时间点击按钮改变
      this.chongtidate = [];
      switch (type) {
        case 'jint':
          this.chongtidate.push(new Date());
          this.chongtidate.push(new Date());
          break;
        case 'benz':
          let benznow = new Date(); 
          let day = benznow.getDay();
          let benzMondayTime;
          if(day == 0){
            benzMondayTime = benznow.getTime() - 6*3600 * 1000 * 24 ;
          }else{
            benzMondayTime = benznow.getTime() - (day-1)*3600 * 1000 * 24 ;
          }
          this.chongtidate.push(new Date(benzMondayTime));
          this.chongtidate.push(benznow);
          break;
        case 'beny':
          let benyend = new Date();
          let benystart = new Date();
          let firstDay = benystart.getTime()-(benystart.getDate()-1)*3600*1000*24;//本月一号
          this.chongtidate.push(new Date(firstDay));
          this.chongtidate.push(benyend);
        break;
      }
      this.GameHomeMoneyStatistics();
    },
    yingkuiDateChange(type){  //盈亏时间点击按钮改变
      this.yingkuidate = [];
      switch (type) {
        case 'jint':
          this.yingkuidate.push(new Date());
          this.yingkuidate.push(new Date());
          break;
        case 'benz':
          let benznow = new Date(); 
          let day = benznow.getDay();
          let benzMondayTime;
          if(day == 0){
            benzMondayTime = benznow.getTime() - 6*3600 * 1000 * 24 ;
          }else{
            benzMondayTime = benznow.getTime() - (day-1)*3600 * 1000 * 24 ;
          }
          this.yingkuidate.push(new Date(benzMondayTime));
          this.yingkuidate.push(benznow);
          break;
        case 'beny':
          let benyend = new Date();
          let benystart = new Date();
          let firstDay = benystart.getTime()-(benystart.getDate()-1)*3600*1000*24;//本月一号
          this.yingkuidate.push(new Date(firstDay));
          this.yingkuidate.push(benyend);
        break;
      }
      this.GameHomeProfitLossStatistics();
    },
    // zaixianDateChange(type){  //在线人数时间点击按钮改变
    //   this.zaixiandate = [];
    //   switch (type) {
    //     case 'jint':
    //       this.zaixiandate.push(new Date());
    //       this.zaixiandate.push(new Date());
    //       break;
    //     case 'benz':
    //       let benznow = new Date(); 
    //       let day = benznow.getDay();
    //       let benzMondayTime;
    //       if(day == 0){
    //         benzMondayTime = benznow.getTime() - 6*3600 * 1000 * 24 ;
    //       }else{
    //         benzMondayTime = benznow.getTime() - (day-1)*3600 * 1000 * 24 ;
    //       }
    //       this.zaixiandate.push(new Date(benzMondayTime));
    //       this.zaixiandate.push(benznow);
    //       break;
    //     case 'beny':
    //       let benyend = new Date();
    //       let benystart = new Date();
    //       let firstDay = benystart.getTime()-(benystart.getDate()-1)*3600*1000*24;//本月一号
    //       this.zaixiandate.push(new Date(firstDay));
    //       this.zaixiandate.push(benyend);
    //     break;
    //   }
    //   this.GameHomeOnlineStatistics();
    // },

    GameHomeCountStatistics(){ //笔数/人数
      let startDate,endDate;
      if(JSON.stringify(this.bishudate[0]).length == 12){
        startDate = this.bishudate[0];
        endDate = this.bishudate[1];
      }else{
        startDate = time.DateToYMD(this.bishudate[0]);
        endDate = time.DateToYMD(this.bishudate[1]);
      }
      let data = {
        "conditionsMap":{
          "startDate":startDate,
          "endDate":endDate,
        },
        'limit':0,
        'offset':0,
        'sort':'',
        'sortOrder':'',
      }
      homeRequest.GameHomeCountStatistics(data).then(res => {
        if(res.code == 200){
          let data = res.data;
          if((!data) || (!data.withdrawList) || data.withdrawList.length == 0){ //提现笔数无数据
            this.bishuList.withdrawList.rows = [
              {createDate:'暂无数据',withdrawCount:0}
            ];
            this.bishuData.withdrawCount = 0;
            this.bishuData.withdrawPeopleCount = 0;
          }else{
            this.bishuData.withdrawCount = data.withdrawCount;
            this.bishuData.withdrawPeopleCount = data.withdrawPeopleCount;
            this.bishuList.withdrawList.rows = data.withdrawList;
          }

          if((!data) || (!data.chargeList) || data.chargeList.length == 0){ //充值笔数无数据
            this.bishuList.chargeList.rows = [
              {createDate:'暂无数据',chargeCount:0}
            ];
            this.bishuData.chargeCount = 0;
            this.bishuData.chargePeopleCount = 0;
          }else{
            this.bishuData.chargeCount = data.chargeCount;
            this.bishuData.chargePeopleCount = data.chargePeopleCount;
            this.bishuList.chargeList.rows = data.chargeList;
          }

          if((!data) || (!data.firstList) || data.firstList.length == 0){ //首充无数据
            this.bishuList.firstList.rows = [
              {createDate:'暂无数据',firstPeopleCount:0}
            ];
            this.bishuData.firstPeopleCount = 0;
          }else{
            this.bishuData.firstPeopleCount = data.firstPeopleCount;
            this.bishuList.firstList.rows = data.firstList;
          }
          
          this.chartData = this.bishuList.chargeList; //默认显示充值笔数
        }else{
          this.$notify({
            type:'warning',
            title:res.msg
          })
        }
      }).catch(err => {
        console.log(err);
      })
    },
    GameHomeMoneyStatistics(){ //充提
      let startDate,endDate;
      if(JSON.stringify(this.chongtidate[0]).length == 12){
        startDate = this.chongtidate[0];
        endDate = this.chongtidate[1];
      }else{
        startDate = time.DateToYMD(this.chongtidate[0]);
        endDate = time.DateToYMD(this.chongtidate[1]);
      }
      let data = {
        "conditionsMap":{
          "startDate":startDate,
          "endDate":endDate,
        },
        'limit':0,
        'offset':0,
        'sort':'',
        'sortOrder':'',
      }
      homeRequest.GameHomeMoneyStatistics(data).then(res => {
        if(res.code == 200){
          let data = res.data;
          if(!data || !data.totalWithdrawCount){
            this.chongtiData.totalWithdrawCount = 0;
          }else{
            this.chongtiData.totalWithdrawCount = data.totalWithdrawCount;
          }
          
          if(!data || !data.totalChargeCount){
            this.chongtiData.totalChargeCount = 0;
          }else{
            this.chongtiData.totalChargeCount = data.totalChargeCount;
          }

          if(!data || !data.totalFirstPeopleCount){
            this.chongtiData.totalFirstPeopleCount = 0;
          }else{
            this.chongtiData.totalFirstPeopleCount = data.totalFirstPeopleCount;
          }


          if((!data) || (!data.totalWithdrawList) || data.totalWithdrawList.length == 0){ //提现金额无数据
            this.chongtiList.totalWithdrawList.rows = [
              {createDate:'暂无数据',withdrawMoney:0}
            ];
          }else{
            this.chongtiList.totalWithdrawList.rows = data.totalWithdrawList;
          }

          if((!data) || (!data.totalChargeList) || data.totalChargeList.length == 0){ //充值金额无数据
            this.chongtiList.totalChargeList.rows = [
              {createDate:'暂无数据',chargeMoney:0}
            ];
          }else{
            this.chongtiList.totalChargeList.rows = data.totalChargeList;
          }

          if((!data) || (!data.totalFirstList) || data.totalFirstList.length == 0){ 
            this.chongtiList.totalFirstList.rows = [
              {createDate:'暂无数据',firstMoney:0}
            ];
          }else{
            this.chongtiList.totalFirstList.rows = data.totalFirstList;
          }

          this.chartData2 = this.chongtiList.totalChargeList; //默认显示充值金额
        }else{
          this.$notify({
            type:'warning',
            title:res.msg
          })
        }
      }).catch(err => {
        console.log(err);
      })
    },
    GameHomeProfitLossStatistics(){ //盈亏
      let startDate,endDate;
      if(JSON.stringify(this.yingkuidate[0]).length == 12){
        startDate = this.yingkuidate[0];
        endDate = this.yingkuidate[1];
      }else{
        startDate = time.DateToYMD(this.yingkuidate[0]);
        endDate = time.DateToYMD(this.yingkuidate[1]);
      }
      let data = {
        "conditionsMap":{
          "startDate":startDate,
          "endDate":endDate,
        },
        'limit':0,
        'offset':0,
        'sort':'',
        'sortOrder':'',
      }
      homeRequest.GameHomeProfitLossStatistics(data).then(res => {
        if(res.code == 200){
          let data = res.data;
          if(!data || !data.systemMoney){
            this.yingkuiData.systemMoney = 0;
          }else{
            this.yingkuiData.systemMoney = data.systemMoney;
          }
          if(!data || !data.promotionRebate){
            this.yingkuiData.promotionRebate = 0;
          }else{
            this.yingkuiData.promotionRebate = data.promotionRebate;
          }
          if(!data || !data.serviceTax){
            this.yingkuiData.serviceTax = 0;
          }else{
            this.yingkuiData.serviceTax = data.serviceTax;
          }

          if((!data)||(!data.systemMoneyList) || data.systemMoneyList.length == 0){ //系统盈亏无数据
            this.yingkuiList.systemMoneyList.rows = [
              {createDate:'暂无数据',systemMoney:0}
            ];
          }else{
            this.yingkuiList.systemMoneyList.rows = data.systemMoneyList.map((item)=>{
              return {
                createDate:item.createDate,
                systemMoney:this.numberFormatter(item.systemMoney)
              }
            });
          }

          if((!data) || (!data.promotionMoneyList) || data.promotionMoneyList.length == 0){ //推广返水无数据
            this.yingkuiList.promotionMoneyList.rows = [
              {createDate:'暂无数据',promotionRebate:0}
            ];
          }else{
            this.yingkuiList.promotionMoneyList.rows = data.promotionMoneyList.map((item)=>{
              return {
                createDate:item.createDate,
                promotionRebate:this.numberFormatter(item.promotionRebate)
              }
            });
          }

          if((!data) || (!data.serviceMoneyList) || data.serviceMoneyList.length == 0){ //服务税收无数据
            this.yingkuiList.serviceMoneyList.rows = [
              {createDate:'暂无数据',serviceTax:0}
            ];
          }else{
            this.yingkuiList.serviceMoneyList.rows = data.serviceMoneyList.map((item)=>{
              return {
                createDate:item.createDate,
                serviceTax:this.numberFormatter(item.serviceTax)
              }
            });
          }
          this.chartData3 = this.yingkuiList.promotionMoneyList; //默认显示推广返水
        }else{
          this.$notify({
            type:'warning',
            title:res.msg
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // GameHomeOnlineStatistics(){ //在线人数
    //   let startDate,endDate;
    //   if(JSON.stringify(this.zaixiandate[0]).length == 12){
    //     startDate = this.zaixiandate[0];
    //     endDate = this.zaixiandate[1];
    //   }else{
    //     startDate = time.DateToYMD(this.zaixiandate[0]);
    //     endDate = time.DateToYMD(this.zaixiandate[1]);
    //   }
    //   let data = {
    //     "conditionsMap":{
    //       "startDate":startDate,
    //       "endDate":endDate,
    //     },
    //     'limit':0,
    //     'offset':0,
    //     'sort':'',
    //     'sortOrder':'',
    //   }
    //   homeRequest.GameHomeOnlineStatistics(data).then(res => {
    //     if(res.code == 200){
    //       let data = res.data;
    //      if(!data || !data.onlineCount){
    //        this.zaixianData.onlineCount = 0;
    //      }else{
    //        this.zaixianData.onlineCount = data.onlineCount;
    //      }

    //       if((!data) || (!data.onlineList) || data.onlineList.length == 0){ //无数据
    //         this.zaixianList.onlineList.rows = [
    //           {operDate:'暂无数据',count:0}
    //         ];
    //         this.zaixianData.totalOnlineNumber = 0;
    //       }else{
    //         this.zaixianData.totalOnlineNumber = data.totalOnlineNumber;
    //         this.zaixianList.onlineList.rows = data.onlineList;
    //       }
    //       this.chartData4 = this.zaixianList.onlineList; 
    //     }else{
    //       this.$notify({
    //         type:'warning',
    //         title:res.msg
    //       })
    //     }
    //   }).catch(err => {
    //     console.log(err);
    //   })
    // },
    liuliangTabClick(tab){    //流量分布切换标签卡  重新获取数据
     // this.GameFlowStatistics(); //2010 代理首页统计接口屏蔽 暂时隐藏
    },
    queryHandle(){
      this.newGameMoneyStatistics();  //首页报表
      this.GameHeatStatistics();      //游戏热度数据
    //  this.GameFlowStatistics();      //流量分布 //2010 代理首页统计接口屏蔽 暂时隐藏
    },
    chartsQueryHandle(){
      this.bishuDateChange('jint'); 
      this.chongtiDateChange('jint');
      this.yingkuiDateChange('jint');
      // this.zaixianDateChange('jint');
    }
  },
  mounted(){
    this.DateChange('jint');
    this.chartsQueryHandle();
  },
}
</script>

<style lang="scss">
.bottom > .el-container > .el-card.shouye{
  >.el-card__body{
    background: transparent;
    padding: 0;
    overflow: scroll;
    overflow-x: hidden;
    &::-webkit-scrollbar{
      display: none;
      visibility: hidden;
    }
    .el-card+.el-card{
      margin-top: 20px;
    }
  }
  .el-button{
    box-shadow: 0px 10px 15px 0px rgba(49, 54, 88, 0.05);
    border-radius: 2px;
    border:none;
  }
  .count{
    height: 148px;
    box-shadow: 0px 10px 15px 0px rgba(49, 54, 88, 0.2);
    border-radius: 2px;
    color:#fff;
    .inner{
      width: 100%;
      height: 100%;
      padding:35px 25px 0 25px;
      p:first-child{
        width: 100%;
        line-height: 14px;
        font-size: 14px;
        margin-bottom: 25px;
        i{
          font-size: 12px;
        }
      }
      p:nth-child(2){
        width: 100%;
        line-height: 24px;
        font-size: 24px;
        margin-bottom: 7px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      p:nth-child(3){
        line-height: 14px;
        font-size: 14px;
        margin-top: 20px;
        span:nth-child(1){
          margin-left: 10px;
        }
      }
    }
    &.count1{
      background-image: linear-gradient(90deg, #ee7647 0%, #e65e5a 47%, #dd466d 100%),linear-gradient(#ffffff, #ffffff);
      .inner{
        background: url('~@/assets/icon/img_1.png') no-repeat right bottom;
        background-size: 140px 121px;
      }
    }
    &.count2{
      background-image: linear-gradient(90deg, #8d6ef3 0%, #6079db 47%, #3383c3 100%), linear-gradient(#ffffff, #ffffff);
      .inner{
        background: url('~@/assets/icon/img_2.png') no-repeat right bottom;
        background-size: 134px 122px;
      }
    }
    &.count3{
      background-image: linear-gradient(90deg, #39cfc0 0%, #25b5c9 47%, #119bd2 100%),linear-gradient(#ffffff, #ffffff);
      .inner{
        background: url('~@/assets/icon/img_3.png') no-repeat right bottom;
        background-size: 135px 114px;
      }
    }
    &.count4{
      background-image: linear-gradient(90deg, #e870eb 0%, #b36af2 50%, #8363f9 100%),linear-gradient(#ffffff, #ffffff);
      .inner{
        background: url('~@/assets/icon/img_4.png') no-repeat right bottom;
        background-size: 154px 118px;
      }
    }
  }
  .leftdata{
    padding: 20px;
    height: 100%;
    border-right: 1px solid #eee;
    >div{
      margin-bottom: 40px;
      >p:nth-child(1){
        font-size: 12px;
        color: rgb(152,152,152)
      }
      >p:nth-child(2){
        font-size: 28px;
        color: rgb(102,102,102)
      }
    }
  }
  .rightdata{
    padding: 20px;
  }
  .first_page_count_wrapper{
    background-color: #fff;
    width: 100%;
    list-style: none;
    display: flex;
    justify-content: start;
    align-content: center;
    flex-flow: row wrap;
    border: 1px solid #ddd;
    border-bottom: none;
    border-right: none;
    >li{
      width: 25%;
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      padding: 0 5px;
      border-bottom: 1px solid #ddd;
      border-right: 1px solid #ddd;
      font-weight: bold;
      >span{
        float: left;
        width: 32%;
        text-align: right;
        margin-right: 5px;
        font-weight: normal;
      }
    }
  }
}
</style>

