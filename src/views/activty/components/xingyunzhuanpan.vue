<template>
    <div style="width:100%;margin:auto;" id="xingyunzhuanpan"  v-loading="savaBtnLoading" >
        <el-form
                :model="formData"
                ref='formData'
                label-width="150px"
                :rules="rules"
                status-icon

        >
            <el-row type="flex" justify="start">
                <el-form-item label="转盘活动：" style="width:300px;">
                    <el-select prop="rouletteActivity" v-model="formData.rouletteActivity">
                        <el-option label="启用" :value="1"/>
                        <el-option label="关闭" :value="0"/>
                    </el-select>
                </el-form-item>
                <el-form-item label-width="0" style="margin-left:15px;width:180px">
                    <el-radio-group v-model="isAudited">
                        <el-radio label="1">稽核</el-radio>
                        <el-radio label="0">不稽核</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="checkMultip" label="打码倍数">
                    <el-input v-model="formData.checkMultip" placeholder="稽核倍数" clearable/>
                </el-form-item>
                <!--<el-form-item label="打码量：">
                    <el-input v-model="computedDamaliang" readonly/>
                </el-form-item>-->
            </el-row>
            <el-form-item label="活动时间：">
                <el-radio-group v-model="formData.timetype">
                    <el-radio label="永久">永久</el-radio>
                    <el-radio label="时间范围">时间范围</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="" v-if="formData.timetype === '时间范围'">
                <el-date-picker
                        v-model="formData.daterange"
                        type="datetimerange"
                        value-format="timestamp"
                        format="yyyy-MM-dd HH:mm:ss"
                        start-placeholder="选择开始日期"
                        end-placeholder="选择结束日期"
                        range-separator="~"
                />
            </el-form-item>
            <el-row type="flex" justify="start" style="margin-bottom: 20px;">
                <el-form-item label="奖池起始金额：" prop="poolInitVal">
                    <el-input v-model="formData.poolInitVal" placeholder="奖池起始金额" clearable :disabled="qishiDisabled" @keyup.enter.native.prevent="true" @keyup.native="editDangqianGiangchiPrice"  />
                </el-form-item>
                <el-form-item label="当前奖池金额：" prop="prizeMoney">
                    <el-input v-model="formData.prizeMoney" placeholder="奖池起始金额" clearable :disabled='dangqDisabled' />
                </el-form-item>

                <el-form-item label="大奖公告：大于等于" label-width="180px"  prop="bigPrizeStandard">
                    <el-input v-model="formData.bigPrizeStandard" placeholder="大奖公告" clearable/>
                </el-form-item>
                 <el-form-item label-width="20px" >
                    <el-tooltip effect="light" class="item" placement="top-start">
                        <div slot="content">大于配置值，会有大奖公告，填写0时，不进行大奖公告；</div>
                        <i class="el-icon-info" style="font-size: 18px;"></i>
                    </el-tooltip>
                </el-form-item>
            </el-row>
            <el-form-item label="抽奖积分：" prop="luckyDraw" class="choujiangjifen">
                <span>
                    玩家当日有效下注（打码量）X &nbsp;
                    <el-input
                            v-model="formData.luckyDraw"
                            placeholder="请输入1-10数字" clearable
                            style="width: 180px;"
                    />%
                    &nbsp;转化成抽奖积分。
                </span>
            </el-form-item>
            <div v-if="subFlag==1">
                    <el-form-item label="抽奖消耗：">
                        <el-checkbox v-model="formData.checked">积分不足,允许金币抽奖(玩家会优先使用积分)</el-checkbox>
                    </el-form-item>
                    <el-form-item v-if="formData.checked" prop="consumptionCoinX1" class="jinbi">
                        <span>
                                单次金币消耗：
                                <el-input
                                        v-model="formData.consumptionCoinX1"
                                        placeholder="单次金币" clearable
                                        style="width: 180px; margin-right: 15px"
                                        @keyup.enter.native.prevent="true"
                                        @keyup.native="disgetBulidWheelSurfs"
                                        @blur="getBulidWheelSurfs"
                                        minlength="1" maxlength="6"
                                />
                                十次金币消耗：
                                <el-input
                                        :disabled="true"
                                        v-model="formData.consumptionCoinX10"
                                        placeholder="十次金币" clearable
                                        style="width: 180px;"
                                />
                            </span>
                    </el-form-item>
                    <el-form-item  label="单次积分消耗：" label-width="150px" prop="consumptionPointX1" class="jinbi">
                        <el-input
                                v-model="formData.consumptionPointX1"
                                placeholder="单次积分" clearable
                                style="width: 180px; margin-right: 15px"
                                :disabled="formData.checked==true?true:false"
                                @keyup.enter.native.prevent="true"
                                @keyup.native="disgetBulidWheelSurfs"
                                @blur="getBulidWheelSurfs"
                                minlength="1" maxlength="8"
                        />
                        十次积分消耗：
                        <el-input
                                :disabled="true"
                                v-model="formData.consumptionPointX10"
                                placeholder="十次积分" clearable
                                style="width: 180px;"
                        />
                     </el-form-item>
            </div> 
            <el-form-item v-if="subFlag==0" label="单次积分消耗：" label-width="150px" prop="consumptionPointX1" class="jinbi">
                        <el-input
                                v-model="formData.consumptionPointX1"
                                placeholder="单次积分" clearable
                                style="width: 180px; margin-right: 15px"
                                :disabled="formData.checked==true?true:false"
                                @keyup.enter.native.prevent="true"
                                @keyup.native="disgetBulidWheelSurfs"
                                @blur="getBulidWheelSurfs"
                                minlength="1" maxlength="8"
                        />
                        十次积分消耗：
                        <el-input
                                :disabled="true"
                                v-model="formData.consumptionPointX10"
                                placeholder="十次积分" clearable
                                style="width: 180px;"
                        />
            </el-form-item>
            <el-form-item v-if="subFlag==2" prop="consumptionCoinX1" class="jinbi">
                    <span>
                        单次金币消耗：
                        <el-input
                                v-model="formData.consumptionCoinX1"
                                placeholder="单次金币" clearable
                                style="width: 180px; margin-right: 15px"
                                @keyup.enter.native.prevent="true"
                                @keyup.native="disgetBulidWheelSurfs"
                                @blur="getBulidWheelSurfs"
                                minlength="1" maxlength="6"
                        />
                        十次金币消耗：
                        <el-input
                                :disabled="true"
                                v-model="formData.consumptionCoinX10"
                                placeholder="十次金币" clearable
                                style="width: 180px;"
                        />
                    </span>
            </el-form-item>

            <el-row type="flex" justify="start" style="margin-bottom: 30px;">
                <el-form-item label="抽成金额：" label-width="150px"  prop="chouchengjine">
                    <el-input v-model="formData.chouchengjine" placeholder="抽成金额" minlength="1" maxlength="6"  style="width: 200px;" clearable
                              @keyup.enter.native.prevent="true" @keyup.native="disgetBulidWheelSurfs" @blur="getBulidWheelSurfs" />
                </el-form-item>
                <el-form-item label-width="20px">
                    <el-tooltip effect="light" class="item"  placement="top-start">
                        <div slot="content">
                            a.此为参考值，表示单次抽奖，理论上系统单次盈利；<br/>
                            b.抽成金额设置必须<单次积分消耗/100;
                        </div>
                        <i class="el-icon-info" style="font-size: 18px;"></i>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="预计放水：" label-width="150px" prop="yujiFangShui" >
                    <el-input v-model="formData.yujiFangShui" style="width: 200px;" placeholder="预计放水" :disabled="true"/>
                </el-form-item>
                <el-form-item label-width="20px" >
                    <el-tooltip effect="light" class="item" placement="top-start">
                        <div slot="content">根据抽成金额生成得参考值，表示在1000次内，理论上送出最多金币数量；</div>
                        <i class="el-icon-info" style="font-size: 18px;"></i>
                    </el-tooltip>
                </el-form-item>
            </el-row>
        </el-form>
        <el-form :model="prizeTable" ref="tableData" style="margin-bottom: 20px" label-width="150px">
            <el-form-item label="奖励配置：">
                <el-table
                        :data="prizeTable.data"
                        v-loading="saveBtnLoading"
                        border
                        class="signTab"
                        :fit='true'
                        size="medium"
                        :cell-style='{textAlign:"center",borderLeft:"1px solid #ddd",borderBottom:"1px solid #ddd",padding:"5px 0"}'
                        :header-cell-style='{textAlign:"center",borderLeft:"1px solid #ddd"}'
                >
                    <!--todo-->
                    <el-table-column prop="itemSort" label="奖励编号ID"/>
                    <el-table-column  label="奖项名称">
                        <template slot-scope="scope">
                            <!--<el-form-item
                                    :prop="'data[' + scope.$index + '].itemName'"
                                    size="small"
                                    :rules="[
                                          { validator: Jxname,trigger: ['blur','change']}
                                        ]">
                                <el-input  v-model="scope.row.itemName" placeholder="请输入奖项名称" clearable @keyup.native="ChangeJx(scope.$index,scope.row.itemName,scope.row.itemGroup)"></el-input>
                            </el-form-item>-->
                            {{scope.row.itemName}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="itemType" label="奖项类型">
                        <template slot-scope="scope">
                            {{scope.row.itemType | itemTypeFormatter}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="itemNum" label="奖励数量">
                        <template slot-scope="scope">
                            {{scope.row.itemNum | itemNumFormatter(scope.row.itemType)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="itemRate" >
                        <template slot="header" slot-scope="scope">
                            <span style="margin-right: 10px;">奖励中奖几率</span>
                            <el-tooltip effect="light" class="item"  content="采用十万比，转盘所有奖励的中奖概率配置之和是100 000" placement="top-end">
                                <i class="el-icon-info" style="font-size: 18px;"></i>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
        </el-form>

        <el-row type="flex" justify="center">
            <el-button
                    type="primary" size="medium"
                    @click='saveBtnClick'
                    :loading="isloading"
                    :disabled="isDisabled"
            >保 存
            </el-button>
        </el-row>
    </div>
</template>

<script>
    import activityRequest from '@/request/activty'
    import validator from '@/tool/validate'
    import ElFormItem from "element-ui/packages/form/src/form-item";
    //import times from '@/tool/times'

    export default {
        components: {ElFormItem},
        name: 'xiyunduobao',
        props: [
            'isloading',
            'subFlag'
        ],
        data() {
            var moneyRule = (r, v, c) => {  //存款金额验证
                let reg = new RegExp(/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/);
                 if (!reg.test(v)) {
                    c(new Error('金额应该大于0且最多包含两位小数'));
                } else {
                    c()
                }
            };
            return {
                isDisabled:false,//默认禁用按钮
                qishiDisabled:false,
                dangqDisabled:false,
                formData: {
                    rouletteActivity: 0,  //转盘活动 默认关闭
                    //amount: '',
                    timetype: '永久',
                    checkMultip: 30,//打码倍数
                    daterange: null,
                    state: 1,

                    poolInitVal: 3000.00, //奖池起始金额
                    prizeMoney:3000.00,//当前奖池金额
                    bigPrizeStandard: 0, //大奖标准
                    yujiFangShui: 0, //预计放水
                    chouchengjine:2,//抽成金额

                    luckyDraw: 0, //抽奖积分百分比
                    checked: true,
                    consumptionPointX1: 500,    //积分消耗
                    consumptionPointX10: 0,
                    consumptionCoinX1: 5,    //积分金币
                    consumptionCoinX10: 0,
                    version:null,
                },
                SaveTime:null,
                isAudited: '0', //是否稽核
                rules: {
                   /* amount: [
                        {required: true, message: '请输入金额', trigger: 'blur'},
                        {validator: moneyRule, trigger: ['blur','change']}
                    ],*/
                    checkMultip: [
                        {required: true, message: '该项不能为空', trigger: 'blur'},
                        {validator: this.audit, trigger: ['blur','change']}
                    ],
                    poolInitVal:[
                        {required: true, message: '该项不能为空', trigger: 'blur'},
                        {validator: this.emptyOrNum, trigger: ['blur','change']}
                    ],
                    prizeMoney:[
                        {required: true, message: '该项不能为空', trigger: 'blur'},
                        {validator: this._emptyOrNum, trigger: ['blur','change']}
                    ],
                    bigPrizeStandard:[

                        {required: true, message: '该项不能为空', trigger: 'blur'},
                        {validator: this.emptyOrNum2, trigger: ['blur','change']}
                    ],
                    luckyDraw:[
                        {required: true, message: '该项不能为空', trigger: 'blur'},
                        {validator: this.luckyDrawCheck, trigger: ['blur','change']}
                    ],
                    consumptionPointX1:[//积分
                        {required: true, message: '该项不能为空', trigger: 'blur'},
                        {validator: this.consumptionPointX1, trigger: ['blur','change']}
                    ],
                    consumptionCoinX1:[//金币
                        {required: true, message: '该项不能为空', trigger: 'blur'},
                        {validator: this.consumptionCoinX1, trigger: ['blur','change']}
                    ],
                    chouchengjine:[
                        {required: true, message: '该项不能为空', trigger: 'blur'},
                        {validator: this.chouchengjine, trigger: ['blur','change']}
                    ]
                },
                prizeTable: {
                    data: [
                    ]
                },
                saveBtnLoading: false
            }
        },
        filters:{
            itemTypeFormatter(type){
                var result = "";
                switch (type){
                    case 1:
                        result = "总奖池的百分比";
                        break;
                    case 2:
                        result = "金币";
                        break;
                    case 3:
                        result = "免费旋转次数";
                        break;
                    default:
                        break;
                }
                return result;
            },
            itemNumFormatter(value,type){
                if(type === 1){
                    return value!=null?value * 100 + "%":0 +"%";
                }else if(type ===3) {
                    return value +" 次";
                }else {
                    return value;
                }
            },
        },
        methods: {
            _moneyFormatter(val){//当不需要返回加减号 需要除以1000 需要截取保留2位小数
                //console.log(val);
                if (!val) return "0.00";
                let str = String(val/1000);
                let idx = str.indexOf('.') + 3;
                if(str.indexOf('.') > -1){
                    if(str.length>4){
                        str = str.slice(0,idx);
                    }
                }
                return str;//.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            },
            moneyFormatter(val){//当不需要返回加减号 不需要除以1000 需要截取保留2位小数
                //console.log(val);
                if (!val) return "0.00";
                let str = String(val);
                let idx = str.indexOf('.') + 3;
                if(str.indexOf('.') > -1){
                    if(str.length>4){
                        str = str.slice(0,idx);
                    }
                }
                return str;//.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            },
            audit(r,v,c) { // 打码倍数
                let reg = new RegExp(/^[0-9]{1,3}$/);
                if(!reg.test(v)){
                    c(new Error('请输入1000以内的非负整数'));
                    return
                }
                c();
            },
            emptyOrNum(r,v,c) { // 数值或者空
                let reg = new RegExp(/^[0-9]{1,7}(\.[0-9]{1,2})?$/);
                if(v && v != '0' && !reg.test(v)){
                    c(new Error('奖池起始金额不符合规则，请检查配置！'));
                    return
                }else if(v<2000){
                    c(new Error('奖池起始金额不低于2000,请检查配置！'));
                    return
                }
                c();
            },
            _emptyOrNum(r,v,c) { // 数值或者空
                let reg = new RegExp(/^[0-9]{1,7}(\.[0-9]{1,2})?$/);
                if(v && v != '0' && !reg.test(v)){
                    c(new Error('当前奖池金额不符合规则，请检查配置！'));
                    return
                }else if(v<2000){
                    c(new Error('当前奖池金额不低于2000,请检查配置！'));
                    return
                }
                c();
            },
            emptyOrNum2(r,v,c) { // 数值或者空
                let reg = new RegExp(/^[0-9]{1,4}(\.[0-9]{1,2})?$/);
                if(v && v != '0' && !reg.test(v)){
                    c(new Error('大奖标准不符合规则，请检查配置！'));
                    return
                }
                c();
            },
            luckyDrawCheck(r,v,c) { // 数值或者空
                let reg = new RegExp(/^[0-9]{1,2}$/);
                if(v && !reg.test(v)){
                    c(new Error('输入不符合规则，请检查配置！'));
                    return
                }else  if(v<1 || v>10){
                    c(new Error('抽奖积分推荐值1%~10%！'));
                    return
                }
                c();
            },
            consumptionPointX1(r,v,c) { // 数值或者空
                let reg = new RegExp(/^[0-9]{1,4}(\.[0-9]{1,2})?$/);
                if(v && !reg.test(v)){
                    //return c(new Error('单次积分不符合规则，请检查配置！'));
                    return  c(new Error('单次积分消耗100.00-1000.00！'));
                }else if(v < 100 || v > 1000){
                    return  c(new Error('单次积分消耗100.00-1000.00！'));
                }
                c();
            },
            consumptionCoinX1(r,v,c) { // 数值或者空
                let reg = new RegExp(/^[0-9]{1,2}(\.[0-9]{1,2})?$/);
                if(v && !reg.test(v)){
                    return  c(new Error('单次金币消耗1.00-10.00！'));
                    //c(new Error('单次金币不符合规则，请检查配置！'));
                }else if(v <1 || v > 10){
                    return  c(new Error('单次金币消耗1.00-10.00！'));
                }
                c();
            },
            chouchengjine(r,v,c) { // 数值或者空
                //debugger;
                let reg = new RegExp(/^[0-9]{1,3}(\.[0-9]{1,2})?$/);
                //console.log(v,this.formData.consumptionCoinX1);
                if(v && v != '0' && !reg.test(v)){
                    c(new Error('抽成金额不符合规则，请检查配置！'));
                    return
                }else if(this.formData.checked == true && this.formData.consumptionCoinX1 >= 0 && parseFloat(v)  >= this.formData.consumptionCoinX1){//勾选积分不足，和金币做对比 6/7日改规则 抽成金额：

                    //a.允许金币抽奖时，抽成金额设置必须<单次金币消耗；
                    //b.不允许金币抽奖时，抽成金额设置必须<单次积分消耗/100；
                    c(new Error('抽成金额不符合规则，请检查配置！'));
                    return
                }
                else if(this.formData.checked == false && this.formData.consumptionPointX1 >= 0 && parseFloat(v) >= this.formData.consumptionPointX1 *1 /100){//不勾选积分不足，和积分作对比，积分和金币有100:1的关系，所以积分除以100就是金币
                    c(new Error('抽成金额不符合规则，请检查配置！'));
                    return
                }
                c();
            },
            Jxname(r,v,c) { // 数值或者空
                if(!v){
                    c(new Error('该项不能为空！'));
                    return
                }else if(v.length>6){
                    c(new Error('该项长度不能超过6个字符！'));
                    return
                }else{
                    c();
                }
            },
            ChangeJx(index,name,group){
                if(name!=""&&group!=null && this.prizeTable.data.length>0){
                    for(var i = 0; i< this.prizeTable.data.length ; i++){
                        if(this.prizeTable.data[i].itemGroup == group){
                            this.prizeTable.data[i].itemName = name;
                        }
                    }
                }
            },
            DateToYMDHMS(date) {
                var Y = date.getFullYear() + '-';
                var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                var D = (date.getDate()+1 < 10 ? ('0'+(date.getDate()+1)) : date.getDate()+1)+' ';
                var h = "00" + ':';
                var m = '00'+":";
                var s = "00";
                //console.log(Y+M+D+h+m+s)
                var date = new Date(Y+M+D+h+m+s);
                return date.getTime();
            },
            DateToYMDHMS2(date){
                var Y = date.getFullYear() + '-';
                var M = (date.getMonth()+2 < 10 ? '0'+(date.getMonth()+2) : date.getMonth()+2) + '-';
                var D = (date.getDate()+1 < 10 ? ('0'+(date.getDate()+1)) : date.getDate()+1)+' ';
                var h = "00" + ':';
                var m = '00'+":";
                var s = "00";
               // console.log(Y+M+D+h+m+s)
                var date = new Date(Y+M+D+h+m+s);
                return date.getTime();
            },
            getSiteActivityDetail() {//获取幸运转盘详情
                let data = {
                    activityType: 6    //幸运转盘
                };
                this.savaBtnLoading = true;

                activityRequest.getSiteActivityDetail(data).then(res => {
                    if (res.code === '200') {
                        let data = res.data;
                        if (data!=null) {
                            this.formData.id = data.id;
                            //this.formData.amount = data.activityAmount;
                            this.formData.checkMultip = data.checkMultip;
                            this.isAudited = this.formData.checkMultip >0 ?"1":"0";
                            this.formData.timetype = data.activityFlag === 1 ? '永久' : '时间范围';
                            this.formData.daterange =  [data.activityBegin, data.activityEnd];
                            this.SaveTime = [data.activityBegin, data.activityEnd];
                            this.formData.rouletteActivity = data.status;//转盘活动状态

                            this.formData.poolInitVal = data.activityAmount;//data.activityAmount==null||data.activityAmount===0?3000+'.00':data.activityAmount;//奖池起始金额
                            this.formData.prizeMoney = data.prizeMoney;//data.prizeMoney==null||data.prizeMoney===0?3000.00+'.00':data.prizeMoney;//当前奖池金额
                            this.formData.bigPrizeStandard = data.bigLimit;//大奖标准
                            this.formData.yujiFangShui = this.moneyFormatter(data.predictTotal) ;//预计放水
                            this.formData.chouchengjine = data.cutAmount;//抽成金额
                            this.formData.luckyDraw = data.betRate;//抽奖积分
                            this.formData.consumptionPointX1 = data.subIntegral;//单次积分消耗
                            this.formData.consumptionPointX10 = data.subIntegral !=null? this._moneyFormatter(data.subIntegral *1000 * 10 ):0;//十次积分消耗
                            this.formData.consumptionCoinX1 = data.subAmount;//单次金币消耗
                            this.formData.consumptionCoinX10 = data.subAmount!=null?this._moneyFormatter(data.subAmount *1000 * 10) :0;//十次金币消耗
                            this.formData.checked = data.subFlag ==1?true:false;//是否开始金币抽奖1开启，0不开启

                            this.prizeTable.data = data.wheelSurfs;
                            this.formData.version = data.version;
                            if(this.formData.rouletteActivity ==1){
                                this.qishiDisabled = true;
                                this.dangqDisabled = false;
                            }else{
                                this.qishiDisabled = false;
                                this.dangqDisabled = true;
                            }
                           // this.formData.activityId = data.id;
                        }
                        this.savaBtnLoading = false;
                    } else {
                        this.$notify({
                            type: 'warning',
                            title: res.msg
                        })
                        this.savaBtnLoading = false;
                    }
                }).catch(err => {
                    console.log(err);
                    this.savaBtnLoading = false;
                })
            },
            editDangqianGiangchiPrice(){
                if(this.formData.rouletteActivity==0){
                    this.formData.prizeMoney = this.formData.poolInitVal;
                }
            },
            disgetBulidWheelSurfs(){
                this.isDisabled=true;
            },
            getBulidWheelSurfs(){//activity/bulidWheelSurfs 根据抽成金额与单词积分消耗获取奖项概率算法和预计放水值
                    this.$refs.formData.validate().then(res => { //验证
                        /* document.onkeydown = function(e) {
                        var ev = (typeof event != 'undefined') ? window.event : e;
                        if (ev.keyCode == 13) {
                            return false;
                        }
                    }*/
                        let data = {
                            cutAmount: parseFloat(this.formData.chouchengjine),
                            subIntegral: parseFloat(this.formData.consumptionPointX1),
                            wheelSurfs: this.prizeTable.data,
                        }
                        this.savaBtnLoading = true;
                        activityRequest.bulidWheelSurfs(data).then(res => {
                            //debugger;
                            if (res.code == 200) {
                                // this.prizeTable.data =  res.data.wheelSurfs;
                                if (res.data.wheelSurfs.length > 0) {
                                    for (var i = 0; i < res.data.wheelSurfs.length; i++) {
                                        this.prizeTable.data[i].itemRate = res.data.wheelSurfs[i].itemRate;
                                    }
                                }
                                this.formData.yujiFangShui = res.data != null ? this.moneyFormatter(res.data.predictTotal) : '';
                                this.savaBtnLoading = false;
                                this.isDisabled=false;
                            } else {
                                this.$notify({
                                    type: 'warning',
                                    title: res.msg
                                })
                                this.savaBtnLoading = false;
                                this.isDisabled=false;
                            }

                        }).catch(err => {
                            console.log(err)
                            this.savaBtnLoading = false;
                            this.isDisabled=false;
                        })
                    }).catch(err => {
                        /*this.$notify({
                        type: 'warning',
                        title: '校验不通过，请检查页面错误提示'
                    })*/
                    })
            },
            saveBtnClick() {//保存
                if (this.isAudited == '1' && this.formData.checkMultip == 0) {
                    this.$message.warning({message: '已选择稽核请输入打码倍数'});
                    return
                }
                if (this.formData.checkMultip < 0) {
                    this.$message.warning({message: '打码倍数不能为负数'});
                    return
                }
                let data = {
                    "activityAmount":parseFloat(this.formData.poolInitVal) ,
                    "prizeMoney":parseFloat(this.formData.prizeMoney),//当前奖池金额
                    "checkMultip": this.formData.checkMultip,
                    "activityBegin": this.formData.daterange ? this.formData.daterange[0] : '',
                    "activityEnd": this.formData.daterange ? this.formData.daterange[1] : '',
                    "activityFlag": this.formData.timetype === '永久' ? 1 : 2,
                    "activityMburl": "",
                    "activityPcurl": "",
                    "activityName": "幸运转盘",
                    "activityType": 6,
                    "remark": "",
                    "status": this.formData.rouletteActivity,
                    "bigLimit":parseFloat(this.formData.bigPrizeStandard),//大奖标准金额
                    "predictTotal":parseFloat(this.formData.yujiFangShui),//预计放水总额
                    "cutAmount":parseFloat(this.formData.chouchengjine),//抽成金额
                    "betRate":parseFloat(this.formData.luckyDraw),//抽奖积分百分比
                    "subIntegral":parseFloat(this.formData.consumptionPointX1),//单次扣减积分
                    "subAmount":this.subFlag == 0 ? '' : parseFloat(this.formData.consumptionCoinX1),//单次扣减金币金额
                    "wheelSurfs":this.prizeTable.data,//抽奖奖项
                    "subFlag":this.subFlag,   //this.formData.checked==true?1:0,//是否会允许金币抽奖
                    "version":this.formData.version,
                };
                if (this.formData.id) {
                    data.id = this.formData.id;
                }
                this.$refs.formData.validate().then(res => { //验证
                   // this.$emit('submit', data);
                    this.savaBtnLoading = true;
                    this.isDisabled = true;
                    activityRequest.addOrUpdateSiteActivity(data).then(res => {
                        if(res.code == 200){
                            this.$notify({
                                type:'success',
                                title:'保存成功!'
                            })
                            var timer = setTimeout(() => {
                                this.isDisabled = false;
                                clearTimeout(timer);
                            }, 1000)
                            this.savaBtnLoading = false;
                            this.getSiteActivityDetail();//重新获取详情

                        }else{
                            this.$notify({
                                type:'warning',
                                title:res.msg
                            })
                            this.isDisabled = false;
                            this.savaBtnLoading = false;
                        }

                    }).catch(err => {
                        console.log(err)
                        this.savaBtnLoading = false;
                        this.isDisabled = false;
                    })
                }).catch(err => {
                    this.$notify({
                        type: 'warning',
                        title: '校验不通过，请检查页面错误提示'
                    })
                })
            }
        },
        watch: {
            'formData.rouletteActivity':{
                handler(newval, oldval) {
                    if(newval===1){//启用时
                      this.qishiDisabled = true;
                      this.dangqDisabled = false;
                    }else{
                        this.qishiDisabled = false;
                        this.dangqDisabled = true;
                    }
                }
            },
            'formData.timetype': {
                handler(newval, oldval) {
                    if (newval === '永久') {
                        this.formData.daterange = [];
                        const end = new Date().getTime() + 3600 * 1000 * 24 * 365 * 100;
                        const start = new Date().getTime();
                        this.formData.daterange.push(start);
                        this.formData.daterange.push(end);
                    }else if(newval === '时间范围'){
                        if(this.formData.daterange[1] -this.formData.daterange[0] ==3600*1000*24*365*100 ){
                            if(this.SaveTime==null || this.SaveTime==''){
                                this.formData.daterange = [];
                                this.formData.daterange.push(this.DateToYMDHMS(new Date()));
                                this.formData.daterange.push(this.DateToYMDHMS2(new Date()));
                            }else{
                                this.formData.daterange = [];
                                this.formData.daterange = this.SaveTime;
                            } 
                        }
                    }
                },
                immediate: true
            },
            isAudited(val) {
                if (val == '0') {
                    this.formData.checkMultip = 0;
                }
            },
            'formData.checkMultip': {
                handler(newval) {
                    if (newval > 0) {
                        this.isAudited = '1'
                    }else {
                        this.isAudited = '0'
                    }
                }
            },
            'isAudited': {
                handler(newval) {
                    //console.log(newval)
                    if (newval == '1') {
                        if(this.formData.checkMultip === 0) {
                            this.formData.checkMultip = 30;
                        }
                    }else {
                        this.formData.checkMultip = 0;
                    }
                }
            },
            'formData.consumptionCoinX1': {
                handler(newval) {
                    if (newval > 0) {
                        this.formData.consumptionCoinX10 = this._moneyFormatter(newval *1000 *10 ) ;//先乘以1000 转换时再除以1000

                        this.formData.consumptionPointX1 = this._moneyFormatter(newval *1000 *100 );

                        this.formData.consumptionPointX10 = this._moneyFormatter(newval *1000 *100 *10 );
                    }
                }
            },
            'formData.consumptionPointX1': {
                handler(newval) {
                    if (newval > 0) {
                        this.formData.consumptionPointX10 = this._moneyFormatter(newval *1000 *10 );
                    }
                }
            },
            'formData.checked':{
                handler(newval){
                     if(newval){
                         this.formData.consumptionPointX1 = this._moneyFormatter(this.formData.consumptionCoinX1 *1000 *100 )
                     }
                }  
            },
        },
        created() {
             this.getSiteActivityDetail();
        }
    }
</script>

<style lang="scss">
    .signTab.el-table .cell {
        line-height: 32px;
    }
    .bottom > .el-container > .el-card > .el-card__body #xingyunzhuanpan .el-table--border {
        border: none;
        border-top: 1px solid #e2e3ea;
    }
    #xingyunzhuanpan .el-table__empty-block{
        border-left:1px solid #e2e3ea;
    }
    .jinbi .el-form-item__error{
        left: 102px;
    }
    .choujiangjifen .el-form-item__error{
        left: 200px;
    }
</style>
