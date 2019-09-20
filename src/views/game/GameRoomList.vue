<template>
  <el-card>
    <el-form label-width="90px">
      <el-row type="flex" justify="space-between">
        <el-col :span="6">
          <el-form-item label="房间名称：">
            <el-input v-model="roomName" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="房间类型：">
            <el-select v-model="roomType" clearable style="width:100%">
              <el-option value label="全部"></el-option>
              <el-option value="1" label="体验类"></el-option>
              <el-option value="2" label="财富类"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label-width="0">
            <el-button
              type="primary"
              size="medium"
              icon="el-icon-search"
              @click="searchHandle"
              style="width:100%"
            >搜索</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label-width="0">
            <el-button
              type="info"
              size="medium"
              icon="el-icon-caret-left"
              plain
              @click="backBtnHandle"
              style="width:100%"
            >返回上一级</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table
        :data="tableData"
        v-loading="isloading"
        style="width: 100%;margin-top:10px;"
        :border="true"
        :fit="true"
        size="medium"
        stripe
        :cell-style="{textAlign:'center'}"
        :header-cell-style="{textAlign:'center'}"
        highlight-current-row
        :default-sort="{prop: 'onLineAccountNumber', order: 'descending'}">
        <el-table-column prop="roomName" label="房间名称"></el-table-column>
        <el-table-column :key="Math.random()" prop="multiples" label="游戏倍场" sortable v-if="gameType == 1 && gameId == 5">
            <template slot-scope="scope">
                <span v-if='scope.row.multiples == 1'>4倍场</span>
                <span v-if='scope.row.multiples == 2'>10倍场</span>
            </template>
        </el-table-column>
        <el-table-column :key="Math.random()" label="结算方式" sortable v-if="gameType == 3 && gameId == 27">
            <template slot-scope="scope">
                <span v-if="scope.row.roomPerformance == 1">加番</span>
                <span v-if="scope.row.roomPerformance == 2">乘番</span>
                <span>-</span>
                <span v-if="scope.row.selfSetting == 1">自摸加底</span>
                <span v-if="scope.row.selfSetting == 2">自摸加番</span>
            </template>
        </el-table-column>
        <el-table-column :key="Math.random()" prop="toppingSeal" label="房间场次" sortable v-if="gameType == 3 && gameId == 27">
            <template slot-scope="scope">
                <span v-if='scope.row.toppingSeal == 1'>4番场</span>
                <span v-if='scope.row.toppingSeal == 2'>无限番场</span>
            </template>
        </el-table-column>
        <el-table-column prop="roomField" label="游戏底分" v-if="gameType != 1 && gameId != 7"></el-table-column>
        <el-table-column prop="roomStatus" :key="Math.random()" label="房间状态">
            <template slot-scope="scope">
            <el-tag size="medium" type="danger" v-if="scope.row.roomStatus == 2">禁用</el-tag>
            <el-tag size="medium" type="success" v-if="scope.row.roomStatus == 1">正常</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="roomType" label="房间类型" :key="Math.random()">
            <template slot-scope="prop">{{prop.row.roomType == '1'?'体验类':'财富类'}}</template>
        </el-table-column>
        <el-table-column prop="minMoney" label="最低携带金额" :key="Math.random()"></el-table-column>
        <el-table-column prop="" :key="Math.random()" label="下注限红" v-if="gameType == 1">
            <template slot-scope="scope">
                <span v-if="scope.row.bottomRed2 > 0">
                    {{scope.row.bottomRed1+'~'+scope.row.bottomRed2}}
                </span>
                <span v-else>不限</span>
            </template>
        </el-table-column>
        <el-table-column prop="roomPersons" label="房间人数"></el-table-column>
        <el-table-column prop='taxRatio' label="税收(%)"></el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button size="mini" @click="editHandle(scope.row)">编辑</el-button>
                <!-- <el-button size="mini" @click="editHandle(scope.row)">查看</el-button> -->
                <el-button
                    
                        size="mini"
                        :type="scope.row.roomStatus == 1 ? 'danger' : 'success'"
                        @click="changeRoomState(scope.row)"
                >{{ (scope.row.roomStatus == 1)? '禁用' : '开启' }}</el-button>
                <!--:disabled="true"-->
            </template>
        </el-table-column>
    </el-table>
    <el-row type="flex" justify="center">
        <el-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="pageNum"
            :page-sizes="[10,20,50,100,200]"
            :page-size.sync="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
        ></el-pagination>
    </el-row>
    <el-dialog :visible.sync="dialog.visible" width="880px" top="2vh" :close-on-click-modal="false" title="房间配置">
        <!-- 下注类游戏 -->
        <template v-if="dialog.type == 1">
            <el-row >
                <el-form label-width="120px" :rules='rules' :model="formData.type1"  ref='form0'>
                    <h3 style="margin:25px">筹码设置：</h3>
                    <el-col :span="8">
                      <el-form-item label="筹码1:" prop="chips1">
                          <el-input clearable type="number" size="small" v-model="formData.type1.chips1"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="筹码2:" prop="chips2">
                          <el-input clearable type="number" size="small" v-model="formData.type1.chips2"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="筹码3:" prop="chips3">
                          <el-input clearable type="number" size="small" v-model="formData.type1.chips3"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="筹码4:" prop="chips4">
                          <el-input clearable type="number" size="small" v-model="formData.type1.chips4"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="筹码5:" prop="chips5">
                          <el-input clearable type="number" size="small" v-model="formData.type1.chips5"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="筹码6:" prop="chips6">
                          <el-input clearable type="number" size="small" v-model="formData.type1.chips6"></el-input>
                      </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
            <el-row v-if="gameId != 26">
                <el-form label-width="120px" :rules='rules' :model="formData.type1"  ref='form1'>
                    <h3 style="margin:25px">上庄配置</h3>
                    <el-col :span="11">
                        <el-form-item label="上庄条件:" prop="bankerCond">
                            <el-input type="number" size="small" v-model.number="formData.type1.bankerCond"></el-input>
                        </el-form-item>
                        <el-form-item label="额外条件:" prop="addedCond">
                            <el-input type="number" size="small" v-model.number="formData.type1.addedCond"></el-input>
                        </el-form-item>
                        <el-form-item label="" label-width="25px">
                            <el-checkbox v-model="formData.type1.sysBanker">允许玩家上庄</el-checkbox>
                        </el-form-item>
                    </el-col>
                    <el-col :span="1">
                        <el-form-item label="" label-width="20px" v-for="i in [1,2]" :key="i">
                            <el-tooltip class="item" effect="dark" :content="msg[i]" placement="right">
                                <i class="el-icon-question"></i>
                            </el-tooltip>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="坐庄局数:" prop="bankerTime">
                            <el-input type="number" size="small" v-model.number="formData.type1.bankerTime"></el-input>
                        </el-form-item>
                        <el-form-item label="额外局数:" prop="addedTime">
                            <el-input type="number" size="small" v-model.number="formData.type1.addedTime"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="1">
                        <el-form-item label="" label-width="20px" v-for="i in [3,4]" :key="i">
                            <el-tooltip class="item" effect="dark" :content="msg[i]" placement="right">
                                <i class="el-icon-question"></i>
                            </el-tooltip>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
            <el-row>
                <el-form label-width="120px" :rules='rules' :model="formData.type1"  ref='form2'>
                    <el-col :span="11" v-if="gameId != 26">
                        <h3 style="margin:25px">上庄机器人配置</h3>
                        <el-form-item label="" label-width="25px">
                            <el-checkbox v-model="formData.type1.sysGold">允许机器人上庄</el-checkbox>
                        </el-form-item>
                        <el-form-item label="上庄携带金币:" style="margin-bottom:0">
                            <el-col :span="11">
                                <el-form-item prop="goldCoin1">
                                    <el-input type="number" size="small" style="width:120px" v-model.number="formData.type1.goldCoin1"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col class="line" :span="1">至</el-col>
                            <el-col :span="11">
                                <el-form-item prop="goldCoin2">
                                    <el-input type="number" size="small" style="width:120px" v-model.number="formData.type1.goldCoin2"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="上庄数量:" style="margin-bottom:0">
                            <el-col :span="11">
                                <el-form-item prop="goldCount1">
                                    <el-input type="number" size="small" style="width:120px" v-model.number="formData.type1.goldCount1"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col class="line" :span="1">至</el-col>
                            <el-col :span="11">
                                <el-form-item prop="goldCount2">
                                    <el-input type="number" size="small" style="width:120px" v-model.number="formData.type1.goldCount2"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="1" style="margin-top:72px" v-if="gameId != 26">
                        <el-form-item label="" :label-width="i == 5 ? '-220px' : '20px'" v-for="i in [5,6,7]" :key="i">
                            <el-tooltip class="item" effect="dark" :content="msg[i]" placement="right">
                                <i class="el-icon-question"></i>
                            </el-tooltip>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <h3 style="margin:25px">机器人配置</h3>
                        <el-form-item label="" label-width="25px">
                            <el-checkbox v-model="formData.type1.robotJoining">允许机器人加入</el-checkbox>
                        </el-form-item>
                        <el-form-item label="机器人携带金币:" style="margin-bottom:0">
                            <el-col :span="11">
                                <el-form-item prop="robotGold1">
                                    <el-input type="number" size="small" style="width:120px" v-model.number="formData.type1.robotGold1"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col class="line" :span="1">至</el-col>
                            <el-col :span="11">
                                <el-form-item prop="robotGold2">
                                    <el-input type="number" size="small" style="width:120px" v-model.number="formData.type1.robotGold2"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="机器人数量:" style="margin-bottom:0">
                            <el-col :span="11">
                                <el-form-item prop="robotCount1">
                                    <el-input type="number" size="small" style="width:120px" v-model.number="formData.type1.robotCount1"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col class="line" :span="1">至</el-col>
                            <el-col :span="11">
                                <el-form-item prop="robotCount2">
                                    <el-input type="number" size="small" style="width:120px" v-model.number="formData.type1.robotCount2"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="1" style="margin-top:72px">
                        <el-form-item label="" :label-width="i == 8 ? '-220px' : '20px'" v-for="i in [8,30,10]" :key="i">
                            <el-tooltip class="item" effect="dark" :content="msg[i]" placement="right">
                                <i class="el-icon-question"></i>
                            </el-tooltip>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
            <el-row>
                <el-form label-width="120px" :rules='rules' :model="formData.type1"  ref='form3'>
                    <h3 style="margin:25px">房间基本配置</h3>
                    <el-col :span="11">
                        <el-form-item label="房间人数:" prop="roomPersons">
                            <el-input type="number" size="small" v-model.number="formData.type1.roomPersons"></el-input>
                        </el-form-item>
                        <el-form-item label="下注时间(秒):" prop="betTime">
                            <el-input type="number" size="small" v-model.number="formData.type1.betTime"></el-input>
                        </el-form-item>
                        <el-form-item label="最低携带金额:" prop="minMoney">
                            <el-input type="number" size="small" v-model.number="formData.type1.minMoney"></el-input>
                        </el-form-item>
                        <el-form-item label="倍数场次:" v-if="gameId == 5" prop="multiples">
                            <el-select size="small" style="width: 100%" v-model="formData.type1.multiples">
                                <!--<el-option value="1" label="4倍场">4倍场</el-option>
                                <el-option value="2" label="10倍场">10倍场</el-option>-->
                                <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                        >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="1">
                        <el-form-item label="" label-width="20px" v-for="i in [11,12,13]" :key="i">
                            <el-tooltip class="item" effect="dark" :content="msg[i]" placement="right">
                                <i :class="['el-icon-question', msg[i] == '' ? 'hidden' : '']"></i>
                            </el-tooltip>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="税收比例(%):" prop="taxRatio">
                            <el-input type="number" size="small" v-model.number="formData.type1.taxRatio"></el-input>
                        </el-form-item>
                        <el-form-item label="空闲时间(秒):" prop="freeTime">
                            <el-input type="number" size="small" v-model.number="formData.type1.freeTime"></el-input>
                        </el-form-item>
                        <el-form-item label="下注限红:" style="margin-bottom:0">
                            <el-col :span="11">
                                <el-form-item prop="bottomRed1">
                                    <el-input type="number" size="small" v-model.number="formData.type1.bottomRed1"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col class="line" :span="1">至</el-col>
                            <el-col :span="11">
                                <el-form-item prop="bottomRed2">
                                    <el-input type="number" size="small" v-model.number="formData.type1.bottomRed2"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="1">
                        <el-form-item label="" label-width="20px" v-for="i in [14,15,16]" :key="i">
                            <el-tooltip class="item" effect="dark" :content="msg[i]" placement="right">
                                <i :class="['el-icon-question', msg[i] == '' ? 'hidden' : '']"></i>
                            </el-tooltip>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
        </template>
        <!-- 捕鱼类游戏 -->
        <template v-if="dialog.type == 2">
            <el-row>
                <el-form label-width="120px" :rules='rules' :model="formData.type2"  ref='form4'>
                    <h3 style="margin:25px">房间基本配置</h3>
                    <el-col :span="11">
                        <el-form-item label="游戏底分:" prop="roomField">
                            <el-input type="number" size="small" v-model.number="formData.type2.roomField"></el-input>
                        </el-form-item>
                        <el-form-item label="最低携带金额:" prop="minMoney">
                            <el-input type="number" size="small" v-model.number="formData.type2.minMoney"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="1">
                        <el-form-item label="" label-width="20px" v-for="i in [17,18]" :key="i">
                            <el-tooltip class="item" effect="dark" :content="msg[i]" placement="right">
                                <i :class="['el-icon-question', msg[i] == '' ? 'hidden' : '']"></i>
                            </el-tooltip>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="房间人数:" prop="roomPersons">
                            <el-input type="number" size="small" v-model.number="formData.type2.roomPersons"></el-input>
                        </el-form-item>
                        <!-- <el-form-item label="税收比例(%):" prop="taxRatio">
                            <el-input type="number" size="small" v-model.number="formData.type2.taxRatio"></el-input>
                        </el-form-item> -->
                        <el-form-item label="抽水" prop="pumpRate">
                            <el-input type="number" size="small" v-model.number="formData.type2.pumpRate"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="1">
                        <!-- <el-form-item label="" label-width="20px" v-for="i in [19,14]" :key="i">
                            <el-tooltip class="item" effect="dark" :content="msg[i]" placement="right">
                                <i :class="['el-icon-question', msg[i] == '' ? 'hidden' : '']"></i>
                            </el-tooltip>
                        </el-form-item> -->
                        <el-form-item label="" label-width="20px" v-for="i in [19,31]" :key="i">
                            <el-tooltip class="item" effect="dark" :content="msg[i]" placement="right">
                                <i :class="['el-icon-question', msg[i] == '' ? 'hidden' : '']"></i>
                            </el-tooltip>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
            <el-row>
                <el-form label-width="120px" :rules='rules' :model="formData.type2"  ref='form5'>
                    <h3 style="margin:25px">机器人配置</h3>
                    <el-col :span="11">
                        <el-form-item label="" label-width="25px">
                            <el-checkbox v-model="formData.type2.robotJoining">允许机器人加入</el-checkbox>
                        </el-form-item>
                        <el-form-item label="机器人携带金币:" style="margin-bottom:0">
                            <el-col :span="11">
                                <el-form-item prop="robotGold1">
                                    <el-input type="number" size="small" style="width:120px" v-model.number="formData.type2.robotGold1"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col class="line" :span="1">至</el-col>
                            <el-col :span="11">
                                <el-form-item prop="robotGold2">
                                    <el-input type="number" size="small" style="width:120px" v-model.number="formData.type2.robotGold2"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="机器人数量:">
                            <el-col :span="11">
                                <el-form-item prop="robotCount1">
                                    <el-input type="number" size="small" style="width:120px" v-model.number="formData.type2.robotCount1"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col class="line" :span="1">至</el-col>
                            <el-col :span="11">
                                <el-form-item prop="robotCount2">
                                    <el-input type="number" size="small" style="width:120px" v-model.number="formData.type2.robotCount2"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="1">
                        <el-form-item label="" :label-width="i == 8 ? '-220px' : '20px'" v-for="i in [8,9,10]" :key="i">
                            <el-tooltip class="item" effect="dark" :content="msg[i]" placement="right">
                                <i class="el-icon-question"></i>
                            </el-tooltip>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
        </template>
        <!-- 对战类游戏 -->
        <template v-if="dialog.type == 3">
            <el-row>
                <el-form label-width="120px" :rules='rules' :model="formData.type3"  ref='form6'>
                    <h3 style="margin:25px">房间基本配置</h3>
                    <el-col :span="11">
                        <el-form-item label="房间人数:" prop="roomPersons">
                            <el-input type="number" size="small" v-model.number="formData.type3.roomPersons"></el-input>
                        </el-form-item>
                        <el-form-item label="最低携带金额:" v-if="gameId != 15 && gameId != 22" prop="minMoney">
                            <el-input type="number" size="small" v-model.number="formData.type3.minMoney"></el-input>
                        </el-form-item>
                        <el-form-item label="携带金额:" style="margin-bottom:0" v-else>
                            <el-col :span="11">
                                <el-form-item prop="texasMoney1">
                                    <el-input type="number" size="small" style="width:120px" v-model.number="formData.type3.texasMoney1"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col class="line" :span="1">至</el-col>
                            <el-col :span="11">
                                <el-form-item prop="texasMoney2">
                                    <el-input type="number" size="small" style="width:120px" v-model.number="formData.type3.texasMoney2"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="1" v-if="gameId != 15 && gameId != 22">
                        <el-form-item label="" label-width="20px" v-for="i in [11,21]" :key="i">
                            <el-tooltip class="item" effect="dark" :content="msg[i]" placement="right">
                                <i :class="['el-icon-question', msg[i] == '' ? 'hidden' : '']"></i>
                            </el-tooltip>
                        </el-form-item>
                    </el-col>
                    <el-col :span="1" v-else>
                        <el-form-item label="" label-width="20px" v-for="i in [11,22]" :key="i">
                            <el-tooltip class="item" effect="dark" :content="msg[i]" placement="right">
                                <i :class="['el-icon-question', msg[i] == '' ? 'hidden' : '']"></i>
                            </el-tooltip>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="税收比例(%):" prop="taxRatio">
                            <el-input type="number" size="small" v-model.number="formData.type3.taxRatio"></el-input>
                        </el-form-item>
                        <el-form-item label="游戏底分:" v-if="gameId != 7 && gameId != 11" prop="roomField">
                            <el-input type="number" size="small" v-model.number="formData.type3.roomField"></el-input>
                        </el-form-item>
                        <el-form-item label="游戏底分:" v-if="gameId == 11" style="margin-bottom:0">
                            <el-col :span="11">
                                <el-form-item prop="roomField">
                                    <el-input type="number" size="small" style="width:120px" v-model.number="formData.type3.roomField" placeholder="底注"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col class="line" :span="1">至</el-col>
                            <el-col :span="11">
                                <el-form-item prop="roomLimit">
                                    <el-input type="number" size="small" style="width:120px" v-model.number="formData.type3.roomLimit" placeholder="封顶"></el-input>
                                </el-form-item>  
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="1" v-if="gameId != 11">
                        <el-form-item label="" label-width="20px" v-for="i in [14]" :key="i">
                            <el-tooltip class="item" effect="dark" :content="msg[i]" placement="right">
                                <i :class="['el-icon-question', msg[i] == '' ? 'hidden' : '']"></i>
                            </el-tooltip>
                        </el-form-item>
                    </el-col>
                    <el-col :span="1" v-else>
                        <el-form-item label="" label-width="20px" v-for="i in [14,20]" :key="i">
                            <el-tooltip class="item" effect="dark" :content="msg[i]" placement="right">
                                <i :class="['el-icon-question', msg[i] == '' ? 'hidden' : '']"></i>
                            </el-tooltip>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
            <el-row>
                <el-form label-width="135px" :rules='rules' :model="formData.type3"  ref='form7'>
                    <h3 style="margin:25px">时间配置</h3>
                    <el-col :span="11">
                        <el-form-item label="匹配时间(秒):" prop="startTime">
                            <el-input type="number" size="small" v-model.number="formData.type3.startTime"></el-input>
                        </el-form-item>
                        <el-form-item label="叫分/抢庄时间(秒):" v-if="gameId != 15 && gameId != 17 && gameId != 11 && gameId != 20 && gameId != 22 && gameId != 27" prop="callTime">
                            <el-input type="number" size="small" v-model.number="formData.type3.callTime"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="1" v-if="gameId != 15 && gameId != 17 && gameId != 11 && gameId != 20 && gameId != 22 && gameId != 27">
                        <el-form-item label="" label-width="20px" v-for="i in [23,25]" :key="i">
                            <el-tooltip class="item" effect="dark" :content="msg[i]" placement="right">
                                <i class="el-icon-question"></i>
                            </el-tooltip>
                        </el-form-item>
                    </el-col>
                    <el-col :span="1" v-else>
                        <el-form-item label="" label-width="20px" v-for="i in [23]" :key="i">
                            <el-tooltip class="item" effect="dark" :content="msg[i]" placement="right">
                                <i class="el-icon-question"></i>
                            </el-tooltip>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="出牌/下注时间(秒):" prop="betTime">
                            <el-input type="number" size="small" v-model.number="formData.type3.betTime"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="1">
                        <el-form-item label="" label-width="20px" v-for="i in [24]" :key="i">
                            <el-tooltip class="item" effect="dark" :content="msg[i]" placement="right">
                                <i class="el-icon-question"></i>
                            </el-tooltip>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
            <!-- 扎金花其他设置 -->
            <el-row v-if="gameId == 11">
                <el-form  label-width="120px">
                    <h3 style="margin:25px">其他设置</h3>
                    <el-col :span="24">
                        <!--<el-form-item label="" label-width="25px">
                            <el-checkbox v-model="formData.type3.firstView">首家首轮不允许看牌</el-checkbox>
                        </el-form-item>-->
                        <el-row>
                            <el-col :span="3">
                                <el-form-item label="" label-width="25px">
                                    <el-checkbox v-model="formData.type3.openMoney">开启喜钱</el-checkbox>
                                </el-form-item>
                            </el-col>
                            <el-col :span="1">
                                <el-form-item label="" label-width="20px" v-for="i in [28]" :key="i">
                                    <el-tooltip class="item" effect="dark" :content="msg[i]" placement="right">
                                        <i class="el-icon-question"></i>
                                    </el-tooltip>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="11">
                                <el-form-item label="豹子(三条A):">
                                    <el-input type="number" size="small" v-model.number="formData.type3.leopardThree"></el-input>
                                </el-form-item>
                            </el-col>

                            <el-col :span="1">
                                <el-form-item label="" label-width="20px" v-for="i in [27]" :key="i">
                                    <el-tooltip class="item" effect="dark" :content="msg[i]" placement="right">
                                        <i class="el-icon-question"></i>
                                    </el-tooltip>
                                </el-form-item>
                            </el-col>
                            <el-col :span="11">
                                <el-form-item label="豹子:">
                                    <el-input type="number" size="small" v-model.number="formData.type3.leopard"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="1">
                                <el-form-item label="" label-width="20px" v-for="i in [29]" :key="i">
                                    <el-tooltip class="item" effect="dark" :content="msg[i]" placement="right">
                                        <i class="el-icon-question"></i>
                                    </el-tooltip>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-col>
                   <!-- <el-col :span="1">
                        <el-form-item label="" :label-width="i == 28 ? '-250px' : '20px'" v-for="i in [28,29]" :key="i">
                            <el-tooltip class="item" effect="dark" :content="msg[i]" placement="right">
                                <i class="el-icon-question"></i>
                            </el-tooltip>
                        </el-form-item>
                    </el-col>-->
                </el-form>
            </el-row>
            <el-row>
                <el-form label-width="120px" :rules='rules' :model="formData.type3" ref='form8'>
                    <h3 style="margin:25px">机器人配置</h3>
                    <el-col :span="11">
                        <el-form-item label="" label-width="25px">
                            <el-checkbox v-model="formData.type3.robotJoining">允许机器人加入</el-checkbox>
                        </el-form-item>
                        <el-form-item label="机器人携带金币:" style="margin-bottom:0">
                            <el-col :span="11">
                                <el-form-item prop="robotGold1">
                                    <el-input type="number" size="small" style="width:120px" v-model.number="formData.type3.robotGold1"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col class="line" :span="1">至</el-col>
                            <el-col :span="11">
                                <el-form-item prop="robotGold2">
                                    <el-input type="number" size="small" style="width:120px" v-model.number="formData.type3.robotGold2"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="机器人数量:">
                            <el-col :span="11">
                                <el-form-item prop="robotCount1">
                                    <el-input type="number" size="small" style="width:120px" v-model.number="formData.type3.robotCount1"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col class="line" :span="1">至</el-col>
                            <el-col :span="11">
                                <el-form-item prop="robotCount2">
                                    <el-input type="number" size="small" style="width:120px" v-model.number="formData.type3.robotCount2"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="1">
                        <el-form-item label="" :label-width="i == 8 ? '-220px' : '20px'" v-for="i in [8,9,10]" :key="i">
                            <el-tooltip class="item" effect="dark" :content="msg[i]" placement="right">
                                <i class="el-icon-question"></i>
                            </el-tooltip>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
        </template>
        <span slot="footer" class="dialog-footer">
            <span style="color: red;margin-right: 40px;" v-if="this.dialog.typeButtonClick==false">{{this.dialog.message}}</span>
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="submit" :disabled="this.dialog.typeButtonClick==false?true:false">保 存</el-button>
            <!-- <el-button type="primary" @click="submit">保 存</el-button> -->
        </span>
    </el-dialog>
  </el-card>
</template>

<script>
import gameRequest from "@/request/game";
import validator from "@/tool/validate";
import tableHeight from "@/tool/tableHeight";
import defaultData from './defaultRoomSettings';

export default {
  name: "GameRoomList",
  data() {
    var isBlankValidator = (rule, value, callback) => { //是否为空相关验证
        //console.log(value)
        if ((!value)&&(value !== 0)) {
            return callback(new Error("请完善表单信息！"));
        }else{
            callback()
        }
    };
    var numtime = (rule, value, callback) => { //是否为空 且为整数相关验证（时间、机器人个数）
        let reg = new RegExp(/^\d+$/);
        let n = this.dialog.type
        if (!value) {
            return callback(new Error("请完善表单信息！"));
        }else if (!reg.test(value)) {
            return callback(new Error("该项只能填写整数"));
        }else{
            callback()
        }
    };
    var person = (rule, value, callback) => { //是否为空 且为整数相关验证（房间人数）
        let reg = new RegExp(/^\d+$/);
        let n = this.dialog.type
        if (!value) {
            return callback(new Error("请完善表单信息！"));
        }else if (!reg.test(value)) {
            return callback(new Error("该项只能填写整数"));
        }else if(this.gameId == 11 && this.formData.type3.roomPersons % 2 != 0){ //扎金花房间人数为2的倍数
            return callback(new Error("房间人数需为2的倍数"));
        }else if(this.formData['type'+n].roomPersons*1 < 1){
            return callback(new Error("房间人数不得小于1"));
        }else if(this.formData['type'+n].roomPersons*1 > 500){
            return callback(new Error("房间人数不得大于500"));
        }else{
            callback()
        }
    };
    var shangzhuang1Validator = (rule, value, callback) => { //允许玩家上庄相关验证
        if (!value) {
            return callback(new Error("请完善表单信息！"));
        }else{
            callback()
        }
    };
    var shangzhuang2Validator = (rule, value, callback) => { //允许玩家上庄相关验证
        let reg = new RegExp(/^\d+$/);
        if(!value){
            return callback(new Error("请完善表单信息！"));
        }else if(!reg.test(value)){
            return callback(new Error("该项只能填写整数"));
        }else{
            callback()
        }
    };
    var robotShangzhuang1Validator = (rule, value, callback) => { //允许机器人上庄相关验证
        if(this.formData.type1.sysGold){
            if (!value) {
                return callback(new Error("请完善表单信息！"));
            }else if(this.formData.type1.goldCoin2*1 < this.formData.type1.goldCoin1*1){
                return callback(new Error("后者不得小于前者"));
            }else if(this.formData.type1.goldCoin1*1 < this.formData.type1.bankerCond*1){
                return callback(new Error("不能低于上庄条件"));
            }else{
                callback()
            }
        }else{
            callback()
        }
    };
    var robotShangzhuang2Validator = (rule, value, callback) => { //允许机器人上庄相关验证
        let reg = new RegExp(/^\d+$/);
        if(this.formData.type1.sysGold){
            if(!value){
                return callback(new Error("请完善表单信息！"));
            }else if(this.formData.type1.goldCount2*1 < this.formData.type1.goldCount1*1){
                return callback(new Error("后者不得小于前者"));
            }else if(!reg.test(value)){
                return callback(new Error("该项只能填写整数"));
            }else{
                callback()
            }
        }else{
            callback()
        }
    };
    var robotJoining1Validator = (rule, value, callback) => { //允许机器人加入相关验证
        let n = this.dialog.type
        if(this.formData['type'+n].robotJoining){
            if (!value) {
                return callback(new Error("请完善表单信息！"));
            }else if(this.formData['type'+n].robotGold2*1 < this.formData['type'+n].robotGold1*1){
                return callback(new Error("后者不得小于前者"));
            }else if(this.gameId != 15 && this.gameId != 22 && this.formData['type'+n].robotGold1*1 < this.formData['type'+n].minMoney*1){
                return callback(new Error("不得小于最低携带金额"));
            }else if((this.gameId == 15 || this.gameId == 22) && (this.formData.type3.robotGold1*1 < this.formData.type3.texasMoney1*1)){
                return callback(new Error("不得小于最低携带金额"));
            }else{
                callback()
            }
        }else{
            callback()
        }
    };
    var robotJoining2Validator = (rule, value, callback) => { //允许机器人加入相关验证
        let n = this.dialog.type
        let reg = new RegExp(/^\d+$/);
        if(this.formData['type'+n].robotJoining){
            if(!value){
                return callback(new Error("请完善表单信息！"));
            }else if(this.formData['type'+n].robotCount2*1 < this.formData['type'+n].robotCount1*1){
                return callback(new Error("后者不得小于前者"));
            }else if(!reg.test(value)){
                return callback(new Error("该项只能填写整数"));
            }else if(this.formData['type'+n].robotCount1*1 < 50){
                return callback(new Error("数量不得小于50"));
            }else if(this.formData['type'+n].robotCount1*2 > 500){
                return callback(new Error("数量不得大于500"));
            }else{
                callback()
            }
        }else{
            callback()
        }
    };
    var redValidator = (rule, value, callback) => { //下注限红相关验证
        if (!value) {
            return callback(new Error("请填写下注限红"));
        }else if(this.formData.type1.bottomRed2*1 < this.formData.type1.bottomRed1*1){
            return callback(new Error("后者不得小于前者"));
        }else{
            callback()
        }
    };
    var dezhouValidator = (rule, value, callback) => { //德州 21点 携带金额 相关验证
        if (!value) {
            return callback(new Error("请填写携带金额"));
        }else if(this.formData.type3.texasMoney2*1 < this.formData.type3.texasMoney1*1){
            return callback(new Error("后者不得小于前者"));
        }else{
            callback()
        }
    };
    var roomFieldValidator = (rule, value, callback) => { //游戏底分相关验证
       // console.log(this.formData.type3.roomLimit*1);
       // console.log(this.formData.type3.roomField*1);
        if (!value) {
            return callback(new Error("请完善表单信息！"));
        }
        else if(this.gameId == 11 && this.formData.type3.roomField*1 < 0.01){
            return callback(new Error("下注最小为0.01"));
        }
        else if(this.gameId == 11 && this.formData.type3.roomField*1 <= 0.1 && this.formData.type3.roomLimit*1 <0.5){
            return callback(new Error("当底注小于等于0.1时,顶注不能低于0.5"));
        }
        else if(this.gameId == 11 && this.formData.type3.roomField*1 > 0.1 && this.formData.type3.roomLimit*1  < this.formData.type3.roomField*1*5){
            return callback(new Error("当底注大于0.1时,顶注必须不能低于底注的5倍"));
        }
        /*else if(this.gameId == 11 && this.formData.type3.roomLimit*1 - this.formData.type3.roomField*1 <= 6){  //扎金花底注顶注
            return callback(new Error("顶注减底注需大于6"));
        }*/
        else{
            callback()
        }
    };
    var taxRatioValidator = (rule, value, callback) => { //税收比例相关验证
        let reg = /^\d+(\.\d{0,2})?$/;
        if ((!value)) {
            return callback(new Error("请完善表单信息！"));
        }
        else if (!reg.test(value)) {
            return callback(new Error("必须是数字且大于0最多包含两位小数！"));
        }
        else if(value*1 < 0){
            return callback(new Error("不得小于0最多包含两位小数"));
        }
        else if(value*1 > 5){
            return callback(new Error("不得大于5最多包含两位小数"));
        }
        else {
            callback()
        }
        /*if ((!value)&&(value !== 0)) {
          return callback(new Error("请完善表单信息！"));
      }
      else if(value*1 < 0){
          return callback(new Error("不得小于0"));
      }else if(value*1 > 5){
          return callback(new Error("不得大于5"));
      }*/
    };
    const isInteger = (r,v,c) => { //整数 包含0
      let reg = new RegExp(/^\d+$/);
      if(!v){
        c();
      }
      if(!reg.test(v)){
        c(new Error('请输入整数'))
      }else{
        c();
      }
    };
      const isIntegerChips = (r,v,c) => { //整数  bug 12397 去掉绑定number
          let reg = new RegExp(/^\+?[1-9][0-9]*$/);//(/^\d+$/);
          if (v === null || v === "" || v === undefined) {
              c(new Error('不能为空'))
          }
          else if (v === 0 || !reg.test(v)) {//不包含0
              c(new Error('请输入正整数'))
          } else {
              c();
          }
      };
    return {
        gameType: "",
        gameId:"",
        roomConfigId:'',
        roomId:'',

        roomName: "", //查询条件
        roomType: "", //查询条件

        pageSize: 10,
        total: 0,
        pageNum: 1,

        tableData: [],
        isloading: false,

        //弹框属性
        dialog: {  
            type: 1,
            visible: false,
            loading: false,
            typeButtonClick:true,//默认保存按钮可以点击 当保存按钮时禁用时 则不可点击
            message:"需要先禁用房间，才能保存新的配置参数！",
        },
        options: [{
            value: '1',
            label: '4倍场'
        }, {
            value: '2',
            label: '10倍场',
        }],
        //表单信息
        formData: {
            type1:{//下注类
                gameRoomId:"",
                siteId: '',
                gameId: '',
                id:'',//该条数据信息id

                minMoney:'',//最低携带金额
                roomPersons:'',//房间人数
                bottomRed1:'',//下注限红1
                bottomRed2:'',//下注限红2
                taxRatio:'',//税收比例
                multiples:'',//倍数场次
                freeTime: '',//空闲时间
                betTime: '',//下注时间

                chips1:0,//筹码1
                chips2:0,//筹码2
                chips3:0,//筹码3
                chips4:0,//筹码4
                chips5:0,//筹码5
                chips6:0,//筹码6

                bankerCond:'',//上庄条件
                addedCond:'',//额外条件
                bankerTime:'',//坐庄局数
                addedTime:'',//额外局数
                sysBanker:'',//是否允许玩家上庄 1允许 2不允许

                sysGold:'',//是否允许机器人上庄 1允许 2不允许
                goldCoin1:'',//上庄携带金币1
                goldCoin2:'',//上庄携带金币2
                goldCount1:'',//上庄数量1
                goldCount2:'',//上庄数量2

                robotJoining:'',//是否允许机器人加入 1允许 2不允许
                robotGold1:'',//机器人携带金币1
                robotGold2:'',//机器人携带金币2
                robotCount1:'',//机器人数量1
                robotCount2:'',//机器人数量2
            },
            type2:{//捕鱼类
                gameRoomId:"",
                siteId: '',
                gameId: '',
                id:'',//该条数据信息id

                roomField: '',//游戏底分
                minMoney:'',//最低携带金额
                roomPersons:'',//房间人数
                taxRatio: '', //税收比例
                pumpRate:'', //抽水比例

                robotJoining:'',//是否允许机器人加入 1允许 2不允许
                robotGold1:'',//机器人携带金币1
                robotGold2:'',//机器人携带金币2
                robotCount1:'',//机器人数量1
                robotCount2:'',//机器人数量2
            },
            type3:{//对战类
                gameRoomId:"",
                siteId:"",
                gameId:"",

                roomPersons:'',//房间人数
                taxRatio:'',//税收比例
                roomField: '',//游戏底分
                minMoney:'',//最低携带金额
                roomLimit:'',//封顶
                texasMoney1:'',//携带金额1 德州
                texasMoney2:'',//携带金额2 德州
                
                leopardThree:'',//AAA
                leopard:'',//豹子
                //firstView:'',//首家不许看牌
                openMoney:'',//开启喜钱
                Maxchip:'',//最大下注金币

                startTime:'',//开始时间
                callTime: '',//叫分时间
                betTime:'',//下注时间

                robotJoining:'',//是否允许机器人加入 1允许 2不允许
                robotGold1:'',//机器人携带金币1
                robotGold2:'',//机器人携带金币2
                robotCount1:'',//机器人数量1
                robotCount2:'',//机器人数量2
            }
        },
        msg:defaultData.msg,
        rules:{  //表单验证器
            chips1:[
                { validator:isIntegerChips, trigger: 'blur' }
            ],
            chips2:[
                { validator:isIntegerChips, trigger: 'blur' }
            ],
            chips3:[
                { validator:isIntegerChips, trigger: 'blur' }
            ],
            chips4:[
                { validator:isIntegerChips, trigger: 'blur' }
            ],
            chips5:[
                { validator:isIntegerChips, trigger: 'blur' }
            ],
            chips6:[
                { validator:isIntegerChips, trigger: 'blur' }
            ],
            bankerCond:[
                { validator:shangzhuang1Validator, trigger: 'blur' }
            ],
            addedCond:[
                { validator:shangzhuang1Validator, trigger: 'blur' }
            ],
            bankerTime:[
                { validator:shangzhuang2Validator, trigger: 'blur' }
            ],
            addedTime:[
                { validator:shangzhuang2Validator, trigger: 'blur' }
            ],
            goldCoin1:[
                { validator:robotShangzhuang1Validator, trigger: 'blur' }
            ],
            goldCoin2:[
                { validator:robotShangzhuang1Validator, trigger: 'blur' }
            ],
            goldCount1:[
                { validator:robotShangzhuang2Validator, trigger: 'blur' }
            ],
            goldCount2:[
                { validator:robotShangzhuang2Validator, trigger: 'blur' }
            ],
            robotGold1:[
                { validator:robotJoining1Validator, trigger: 'blur' }
            ],
            robotGold2:[
                { validator:robotJoining1Validator, trigger: 'blur' }
            ],
            robotCount1:[
                { validator:robotJoining2Validator, trigger: 'blur' }
            ],
            robotCount2:[
                { validator:robotJoining2Validator, trigger: 'blur' }
            ],
            roomPersons:[
                {  validator:person, trigger: 'blur' }
            ],
            betTime:[
                {  validator:numtime, trigger: 'blur' }
            ],
            freeTime:[
                {  validator:numtime, trigger: 'blur' }
            ],
            taxRatio:[
                {  validator:taxRatioValidator, trigger: 'blur' }
            ],
            pumpRate:[
                {  validator:taxRatioValidator, trigger: 'blur' },
                //{  validator:isInteger, trigger: 'blur' }
            ],
            minMoney:[
                {  validator:isBlankValidator, trigger: 'blur' }
            ],
            roomField:[
                {  validator:roomFieldValidator, trigger: 'blur' }
            ],
            multiples:[
                {  validator:isBlankValidator, trigger: 'blur' }
            ],
            bottomRed1:[
                { validator:redValidator, trigger: 'blur' }
            ],
            bottomRed2:[
                { validator:redValidator, trigger: 'blur' }
            ],
            texasMoney1:[
                { validator:dezhouValidator, trigger: 'blur' }
            ],
            texasMoney2:[
                { validator:dezhouValidator, trigger: 'blur' }
            ],
            roomLimit:[
                { validator:roomFieldValidator, trigger: 'blur' }
            ],
            startTime:[
                { validator:numtime, trigger: 'blur' }
            ],
            callTime:[
                { validator:numtime, trigger: 'blur' }
            ],
        }
    };
  },
  created() {
    this.queryHandle();
  },
  activated() {
    this.queryHandle();
  },
  methods: {
    searchHandle() {
      //查询游戏房间
      this.pageNum = 1;
      this.queryHandle();
    },
    queryHandle() {
        this.isloading = true;
        this.gameId = this.$route.params.id
        let data = {
            conditionsMap: {
                gameId: this.$route.params.id,
                roomName: this.roomName.trim(),
                roomType: this.roomType
            },
            // "pageSize": this.pageSize,
            // "pageNum": this.pageNum,
            sort: "id",
            sortOrder: "desc",
            offset: (this.pageNum - 1) * this.pageSize,
            limit: this.pageSize
        };
        gameRequest.getRoomPage(data).then(res => {
            // console.log(res);
            for(var item of res.rows){
                if(this.gameId == 15 || this.gameId == 22){ //德州 21点列表数据-最低携带金额显示为携带金额1
                    item.minMoney = item.texasMoney1
                }
                item.taxRatio = item.taxRatio*10000*100/10000
            }
            this.tableData = res.rows;
            this.total = res.total;
            this.pageNum = res.offset / res.limit + 1;
            this.pageSize = res.limit;
            this.gameType = res.rows[0].gameType;
            this.isloading = false;
        })
        .catch(err => {
            this.isloading = false;
        });
    },
    //编辑按钮
    editHandle(row) {
        //console.log(row)
        this.dialog.type = row.gameType;
        this.dialog.loading = true
        var data = {
            gameId:this.gameId,
            gameType:row.gameType,
            roomId:row.id,
        }
        var str = ''
        if(row.gameType == 1){ //查询下注类
            str = 'editRoomConfig'
        }
        if(row.gameType == 2){ //查询捕鱼类
            str = 'editFishRoomConfig'
        }
        if(row.gameType == 3){ //查询对战类
            str = 'addDouDiZhuRoomConfig'
        }
        //row.roomStatus == 1 启用 row.roomStatus == 2 禁用
        this.dialog.typeButtonClick =row.roomStatus == 2?true:false;
        gameRequest[str](data).then(res => {
            if(res.code == '200'){
                this.dialog.visible = true
                this.dialog.loading = false
                this.roomId = res.data.roomId
                this.roomConfigId = res.data.roomConfigId
                res.data.roomField = String(res.data.roomField)
                //res.data.firstView =  res.data.firstView == 2 ? true : false
                res.data.openMoney =  res.data.openMoney == 1 ? true : false
                res.data.sysBanker =  res.data.sysBanker == 1 ? true : false
                res.data.sysGold =  res.data.sysGold == 1 ? true : false
                res.data.robotJoining =  res.data.robotJoining == 1 ? true : false
                res.data.taxRatio = res.data.taxRatio !=null ? res.data.taxRatio*1000000/10000 : null;
                res.data.pumpRate = res.data.pumpRate !=null ? res.data.pumpRate*1000000/10000 : null;
                this.setDialogData(res.data)
            }else {
                this.$notify.error(res.error);
            }
        })
    },
    setDialogData(obj){
        //console.log(obj);
        for (let item in this.formData['type'+this.dialog.type]) {
            if(item == "multiples"){

                this.formData['type'+this.dialog.type][item] = obj[item]!=null? obj[item].toString() : ''
            }else {
                this.formData['type'+this.dialog.type][item] = obj[item]!=null ? obj[item] : ''
            }

        }
    },
    //保存按钮
    submit(){
        var str = ""
        var arr = []
        if(this.dialog.type == 1){
            //筹码设置验证
            if(Number(this.formData.type1.chips1) < this.formData.type1.bottomRed1){
              this.$message.warning('筹码1设置不能小于下注限红下限');
              return
            }
            if(Number(this.formData.type1.chips6) > this.formData.type1.bottomRed2){
              this.$message.warning('筹码6设置不能大于下注限红上限');
              return
            }
            if(
              !(Number(this.formData.type1.chips1)<Number(this.formData.type1.chips2)) ||
              !(Number(this.formData.type1.chips2)<Number(this.formData.type1.chips3)) ||
              !(Number(this.formData.type1.chips3)<Number(this.formData.type1.chips4)) ||
              !(Number(this.formData.type1.chips4)<Number(this.formData.type1.chips5)) ||
              !(Number(this.formData.type1.chips5)<Number(this.formData.type1.chips6))
            ){
              this.$message.warning('筹码1~6请按照从小到大的数值输入');
              return
            }
            if(this.gameId != 26){ //森林舞会无上庄
                let validate0 = this.$refs['form0'].validate();
                let validate1 = this.$refs['form1'].validate();
                let validate2 = this.$refs['form2'].validate();
                let validate3 = this.$refs['form3'].validate();
                arr = [validate0,validate1,validate2,validate3]
            }else{
                let validate0 = this.$refs['form0'].validate();
                let validate2 = this.$refs['form2'].validate();
                let validate3 = this.$refs['form3'].validate();
                arr = [validate0,validate2,validate3]
            }
            if(this.formData.type1.minMoney*1 < Number(this.formData.type1.chips1)*1){
                this.$message.warning('最低携带金额需大于等于筹码1');
                return
            }
            str = "addBetRoomConfig"
            var {...data} = this.formData.type1;
            data.chips1 = Number(data.chips1);
            data.chips2 = Number(data.chips2);
            data.chips3 = Number(data.chips3);
            data.chips4 = Number(data.chips4);
            data.chips5 = Number(data.chips5);
            data.chips6 = Number(data.chips6);
            data.sysBanker = this.formData.type1.sysBanker ? 1 : 2           //是否允许玩家上庄
            data.sysGold = this.formData.type1.sysGold ? 1 : 2               //是否允许机器人上庄
            data.robotJoining = this.formData.type1.robotJoining ? 1 : 2     //是否允许机器人加入
            data.taxRatio = this.formData.type1.taxRatio/100
        }
        if(this.dialog.type == 2){
            let validate4 = this.$refs['form4'].validate();
            let validate5 = this.$refs['form5'].validate();
            str = "addFishRoomConfig"
            var {...data} = this.formData.type2
            arr = [validate4,validate5]
            data.robotJoining = this.formData.type2.robotJoining ? 1 : 2     //是否允许机器人加入
            data.taxRatio = this.formData.type2.taxRatio/100
            data.pumpRate = this.formData.type2.pumpRate/100
        }
        if(this.dialog.type == 3){
            let validate6 = this.$refs['form6'].validate();
            let validate7 = this.$refs['form7'].validate();
            let validate8 = this.$refs['form8'].validate();

            str = "editDouDiZhuRoomConfig"
            var {...data} = this.formData.type3
            arr = [validate6,validate7,validate8]
            //data.firstView = this.formData.type3.firstView ? 2 : 1  //扎金花首轮看牌
            data.openMoney = this.formData.type3.openMoney ? 1 : 2  //扎金花开启喜钱
            data.robotJoining = this.formData.type3.robotJoining ? 1 : 2     //是否允许机器人加入
            data.taxRatio = this.formData.type3.taxRatio/100
        }
        
        this.dialog.loading = true
        Promise.all(arr).then( () => {
            data.roomId = this.roomId
            data.roomConfigId = this.roomConfigId
            data.gameId = this.gameId
            gameRequest[str](data).then(res => {
                if(res.code === '200'){
                    this.dialog.loading = false
                    this.$notify.success({title:res.msg});
                    this.dialog.visible = false;
                    this.queryHandle();
                    this.reset()
                }else{
                    this.$notify.error({title:res.msg});
                }
            })
        }).catch( () => {
            this.$notify({
                type:'warning',
                title: '验证不通过，请检查错误提示',
            });
            this.dialog.loading = false;
        })
    },
    //取消按钮
    cancel(){
        this.reset()
        this.dialog.visible = false
    },
    //重置验证状态
    reset(){
        if(this.dialog.type == 1){
            this.$refs['form0'].clearValidate();
            if(this.gameId != 26){ //森林舞会无上庄
                this.$refs['form1'].clearValidate();
            }
            this.$refs['form2'].clearValidate();
            this.$refs['form3'].clearValidate();
        }
        if(this.dialog.type == 2){
            this.$refs['form4'].clearValidate();
            this.$refs['form5'].clearValidate();
        }
        if(this.dialog.type == 3){
            this.$refs['form6'].clearValidate();
            this.$refs['form7'].clearValidate();
            this.$refs['form8'].clearValidate();
        }
    },
    changeRoomState(row) {
        let msg = row.roomStatus == '1' ? '请确认是否要禁用房间' : '请确认是否要启用房间';
        let msgType = row.roomStatus == '1' ? 'error' : 'warning';
        this.$confirm(msg, '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            center: true,
            type: msgType
        }).then(() => {
            var data = {
                roomStatus: row.roomStatus == 1 ? 2 : 1,
                id: row.id,
                gameId:row.gameId
            }
            this.isloading = true;
            gameRequest.updateRoomConfig(data).then(res => {
                this.isloading = false;
                if (res.code == 200) {
                    this.$notify.success({title:res.msg});
                    this.queryHandle();
                } else {
                    this.$notify.error({title:res.msg})
                }
            })
        }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消'
            });
        });
    },
    sizeChangeHandle(sz) {
      this.pageSize = sz;
      this.queryHandle();
    },
    currentChangeHandle(crt) {
      this.pageNum = crt;
      this.queryHandle();
    },
    backBtnHandle() {
      //点击返回
      this.$store.dispatch("navGoBack", {
        name: "游戏房间管理"
      });
    }
  }
};
</script>

<style lang="scss">
.el-dialog {
  min-width: 400px;
}

.form-group {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-evenly;
}

.el-button {
  margin-top: 3px;
}

.el-card {
  margin: 10px auto;
}

.hidden{visibility: hidden;}

.line{margin:0 8px 0 3px;}
</style>