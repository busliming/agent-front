<template>
  <div style="width:100%;margin:auto;overflow: auto;" id="qiandao">
    <el-form :model="formData" ref="formData" label-width="100px" :rules="rules" status-icon v-loading="savaBtnLoading">
      <el-row type="flex">
        <el-form-item label="状态：">
            <el-select v-model="formData.state" placeholder="请选择" >
                <el-option label="启用" :value="1"></el-option>
                <el-option label="禁用" :value="0"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label-width="10px">
          <el-radio-group v-model="isCheck">
            <el-radio label="1">稽核</el-radio>
            <el-radio label="0">不稽核</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="稽核倍数" prop="checkMultip" v-if="isCheck == 1">
          <el-input v-model.number="formData.checkMultip" placeholder="稽核倍数" clearable></el-input>
        </el-form-item>
      </el-row>

      <el-form-item label="活动时间：">
        <el-radio-group v-model="formData.timetype">
          <el-radio label="永久">永久</el-radio>
          <el-radio label="时间范围">时间范围</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label v-if="formData.timetype == '时间范围'">
        <el-date-picker
          v-model="formData.daterange"
          type="datetimerange"
          value-format="timestamp"
          format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="选择开始日期"
          end-placeholder="选择结束日期"
          range-separator="~"
        ></el-date-picker>
      </el-form-item>
        <el-row>
            <el-form-item label="签到保护："   >

                 <el-radio-group v-model="formData.signLimit" style=" margin-right:30px">
                    <el-radio :label="1">开启</el-radio>
                    <el-radio :label="2">不开启</el-radio>
                </el-radio-group>
                <el-checkbox v-model="formData.firstNeed">是否开启必须充值后才能领取奖励</el-checkbox>
                <el-checkbox v-model="formData.circulationProtect">是否开启循环保护功能</el-checkbox>
                <el-tooltip class="item" effect="light" content="未充值用户只可领取前X天的签到奖励，X天后的奖励需要完成Y笔充值后才可继续领取" placement="right">
                    <i class="el-icon-question"></i>
                </el-tooltip>
            </el-form-item>
        </el-row>
        <!-- <el-row>
            <el-form-item label="" >
                <el-radio-group v-model="formData.signLimit">
                    <el-radio :label="1">开启</el-radio>
                    <el-radio :label="2">不开启</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-row> -->
        <el-row type="flex" v-if="formData.signLimit == '1'">
            <el-form-item label="保护天数：" prop="signDay" >
                <el-input v-model="formData.signDay" placeholder="请输入" clearable></el-input>
            </el-form-item>
            <el-form-item label="" label-width="10px" >
                天
            </el-form-item>
            <el-form-item label="充值次数：" prop="signCount"  >
                <el-input v-model="formData.signCount" placeholder="请输入" clearable></el-input>
            </el-form-item>
            <el-form-item label="" label-width="10px" >
                次
            </el-form-item>

        </el-row>
    </el-form>
    <el-form :model="tableData" ref="tableData" label-width="100px">
            <el-form-item label="奖励配置：">
                <el-table
                        :data="tableData.dayList"
                        v-loading="savaBtnLoading"
                        width="80%"
                        border
                        class="signTab"
                        :fit='true'
                        size="medium"
                        :cell-style='{textAlign:"center",borderTop:"1px solid #e2e3ea",borderLeft:"1px solid #e2e3ea"}'
                        :header-cell-style='{textAlign:"center",border:"none", borderLeft:"1px solid #e2e3ea"}'
                >
                    <el-table-column
                            prop="signDay"
                            label="签到天数"
                            width="80"
                    >
                    </el-table-column>
                    <el-table-column label="奖励金币">
                        <template slot-scope="scope">
                            <el-form-item
                                    :prop="'dayList[' + scope.$index + '].rewardGold'"
                                    size="small"
                                    :rules="[
                                          { validator: rewardGold,trigger:'blur'}
                                        ]">
                                <el-input type="number"  v-model="scope.row.rewardGold" placeholder="请输入奖励金币" clearable></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="hongbao"
                            label="奖励红包"
                            width="470"
                    >
                        <template slot-scope="scope">
                            <el-row type="flex">
                                <el-form-item label="随机" label-width="40px"></el-form-item>
                                 <el-form-item
                                    :prop="'dayList[' + scope.$index + '].rewardMin'"
                                    size="small"
                                    :rules="[
                                          { validator: rewardMin,trigger:'blur'}
                                        ]">
                                <el-input type="number"  v-model="scope.row.rewardMin" placeholder="输入红包金额" clearable></el-input>
                            </el-form-item>
                                <el-form-item label="" >~</el-form-item>
                                <el-form-item
                                        :prop="'dayList[' + scope.$index + '].rewardMax'"
                                        size="small"
                                        :rules="[
                                          { validator: rewardMin,trigger:'blur'}
                                        ]">
                                    <el-input  type="number"  v-model="scope.row.rewardMax" placeholder="输入红包金额" clearable></el-input>
                                </el-form-item>
                                <el-form-item label="金额" label-width="45px"></el-form-item>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="rewardIntegral"
                            label="奖励幸运转盘积分"
                    >
                        <template slot-scope="scope">
                            <el-form-item
                                    :prop="'dayList[' + scope.$index + '].rewardIntegral'"
                                    size="small"
                                    :rules="[
                                          { validator: emptyOrNum,trigger:'blur'}
                                        ]">
                                <el-input type="number"  v-model="scope.row.rewardIntegral" placeholder="请输入奖励幸运夺宝积分" clearable></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>

      </el-form>
    <el-container>
        <el-aside style="width:64%;margin-left:100px;margin-top:10px;font-size:12px;color:red;line-height:20px">
            <p>备注：1.上表中，奖励配置自定义，配置几个奖励将显示几个奖励</p>
            <p style="margin-left:36px;">2.随机值当配置成1-1时，表示红包随机的金额固定为1</p>
            <p style="margin-left:36px;">3.配置为0或者留空时，表示无此奖励，玩家不会看到此奖励</p>
            <p style="margin-left:36px;">4.可输入大于等于0，小于1000000的数字，最多保留两位小数</p>
        </el-aside>
        <el-main>
             <el-button type="primary" size="medium" @click="saveBtnClick" :loading="savaBtnLoading">保存</el-button>
        </el-main>
    </el-container>
  </div>
</template>

<script>
import activityRequest from "@/request/activty";
import validator from "@/tool/validate";
export default {
  name: "shouchongsong",
  data() {
    return {
      formData: {
        checkMultip:10,//827改为10倍
        timetype: "永久",
        daterange: null,
        state: 0,//1// 10173 默认禁用 0
        signLimit:2,//默认不开启
        firstNeed:false,  //是否开启必须充值后才能领取奖励
        circulationProtect:false, //是否开启循环保护功能
        signDay:7,//默认保护天数7天
        signCount:1,//默认充值次数1
      },
      SaveTime:null,
      tableData:{
        dayList:[]
      },
      isCheck:'1', //是否稽核 827改为默认稽核
      savaBtnLoading: false,
      rules: {
        checkMultip:[
          {required:true,message:'请输入稽核倍数',trigger:'blur'},
          { validator: this.audit, trigger: "blur" }
        ],
          signDay:[
            {required:true,message:'请输入保护天数',trigger:'blur'},
            { validator: this.signDay, trigger: ["blur","change"]}
            ],
          signCount:[
              {required:true,message:'请输入充值次数',trigger:'blur'},
              { validator: this.signCount, trigger: ["blur","change"]}
          ]
      }
    };
  },
  methods: {
    getSiteActivityDetail() {
      let data = {
        activityType: 5 // 签到
      };
      this.savaBtnLoading = true;
      activityRequest
        .getSiteSignDetail(data)
        .then(res => {
          if (res.code == "200") {
            let data = res.data;
            if (data) {
              this.formData.id = data.id;
              this.formData.siteId = data.siteId;
              this.formData.checkMultip = data.checkMultip;
              if(this.formData.checkMultip == 0){
                  this.isCheck = "0";
              }
              this.formData.timetype =
                data.activityFlag == "1" ? "永久" : "时间范围";
              this.formData.daterange = [data.activityBegin, data.activityEnd];
              this.SaveTime = [data.activityBegin, data.activityEnd];
              this.formData.state = data.status;
              this.formData.signLimit = data.signLimit?data.signLimit:this.formData.signLimit;
              this.formData.firstNeed=data.firstNeed?data.firstNeed:this.formData.firstNeed;
              this.formData.circulationProtect=data.circulationProtect?data.circulationProtect:this.formData.circulationProtect;
              this.formData.signCount = data.signCount?data.signCount:this.formData.signCount;
              this.formData.signDay = data.signDay?data.signDay:this.formData.signDay;
              if(Array.isArray(data.dayList) && data.dayList.length) {
                this.tableData.dayList = data.dayList;
              } else {
                this.creatData();
              }
            }
          } else {
            this.$notify({
              type: "warning",
              title: res.msg
            });
          }
          this.savaBtnLoading = false;
        })
        .catch(err => {
          this.savaBtnLoading = false;
        });
    },
    saveBtnClick() {
      if(this.isCheck == '1' && this.formData.checkMultip == 0){
        this.$message.warning({message:'已选择稽核请输入稽核倍数'})
        return
      }
      for(let i = 0; i < this.tableData.dayList.length; i++){
          if(!(
            Number(this.tableData.dayList[i].rewardGold) ||
            Number(this.tableData.dayList[i].rewardIntegral) ||
            Number(this.tableData.dayList[i].rewardMax) ||
            Number(this.tableData.dayList[i].rewardMin))){
              this.$message.warning({message:'单日奖励不能全部为0或空'});
              return
          }
          else if(Number(this.tableData.dayList[i].rewardMax) < Number(this.tableData.dayList[i].rewardMin)){
              this.$message.warning({message:'请修改随机值为由小到大的次序'});
              return
          }
      }
     /* if(this.formData.state == "1"){
          this.$message.warning({message:'签到活动数据调整中，暂时无法开启！'});
          return
      }*/

      let data = {
        activityBegin: this.formData.daterange ? this.formData.daterange[0] : "",
        activityEnd: this.formData.daterange ? this.formData.daterange[1] : "",
        activityFlag: this.formData.timetype == "永久" ? 1 : 2,
        activityName: "签到",
        activityType: 5,
        checkMultip: this.formData.checkMultip,
        dayList: this.tableData.dayList,
        status: this.formData.state,
        signLimit:this.formData.signLimit,
        firstNeed:this.formData.firstNeed,
        circulationProtect:this.formData.circulationProtect,
        signDay: this.formData.signLimit == 1?this.formData.signDay:null,
        signCount: this.formData.signLimit == 1?this.formData.signCount:null,
      };
      let valid1 = this.$refs.formData.validate();
      let valid2 = this.$refs.tableData.validate();
      if (this.formData.id) {
        data.id = this.formData.id;
      }
      if (this.formData.siteId) {
        data.siteId = this.formData.siteId;
      }
      Promise.all([valid1,valid2]).then(res => {
            this.savaBtnLoading = true;
            activityRequest.addOrUpdateSiteSignActivity(data).then(res =>{
                if(res.code == 200){
                    this.$notify({
                        type:'success',
                        title:'保存成功!'
                    })
                    this.SaveTime=this.formData.daterange
                }else{
                    this.$notify({
                        type:'warning',
                        title:res.msg
                    })
                }
                this.savaBtnLoading = false;
            }).catch(err => {
                this.savaBtnLoading = false;
            });
        }).catch(err => {
          this.$message.warning({message:'校验不通过，请检查页面错误提示'});
        });
    },
    emptyOrNum(r,v,c) { // 数值或者空
      let reg = new RegExp(/^[0-9]+$/);
         if(v==0  || v=='' ){
            c();
            return
        }
        if(!reg.test(v)){
            c(new Error('请输入正整数'));
            return
        }
       if(Number(v)>1000000){
            c(new Error('幸运转盘积分不能超过1000000积分'));
            return
        }
        c();
    },
    rewardMin(r,v,c) { // 数值或者空
      var flo = ((v+'').indexOf('.') > -1)&&((v+'').split('.')[1]) || '';
        // if(!v){
        //     c(new Error('请输入奖励红包'));
        // }
        if(flo.length > 2){
          c(new Error('小数点后不能超过2位'));
          return
        }
        if(Number(v)>1000000){
            c(new Error('奖励红包不能超过1000000红包'));
            return
        }
        if(v==0  || v=='' ){
            c();
            return
        }
        c();
    },
     rewardGold(r,v,c) { // 数值或者空
      var flo = ((v+'').indexOf('.') > -1)&&((v+'').split('.')[1]) || '';
        // if(!v){
        //     c(new Error('请输入奖励金币'));
        // }
        if(flo.length > 2){
          c(new Error('小数点后不能超过2位'));
          return
        }
         if(Number(v)>1000000){
            c(new Error('奖励金币不能超过1000000金币'));
            return
        }
        if(v==0 || v==''){
            c();
            return
        }
        c();
    },
    audit(r,v,c) { // 奖励金额、红包、积分
      let reg = new RegExp(/^[0-9]{1,3}$/);
      if(!reg.test(v)){
        c(new Error('请输入1000以内的非负整数'));
        return
      }
      c();
    },
      signDay(r,v,c) { // 保护天数
          let reg = new RegExp(/^[0-9]+$/);
          if(!reg.test(v)){
              c(new Error('保护天数可配置数值区间1-30'));
              return
          }
          if(v > 30){
              this.formData.signDay = 30;
          }
          if(v < 1){
                this.formData.signDay = 1;
          }
          c();
      },
      signCount(r,v,c) { // 保护天数
        let reg = new RegExp(/^[0-9]+$/);
        if(!reg.test(v)){
            c(new Error('充值次数可配置数值区间1-99'));
            return
        }
        if(v > 99){
            this.formData.signCount = 99;
        }
        if(v < 1){
            this.formData.signCount = 1;
        }
        c();
},
    creatData(){ // 生成默认数据
      if(Array.isArray(this.tableData.dayList) && !this.tableData.dayList.length){
        this.tableData.dayList = [];
        for(var i = 0; i < 7; i++){
          this.tableData.dayList.push({
            signDay: i + 1,
            rewardGold: '',
            rewardMin: '',
            rewardMax: '',
            rewardIntegral: '',
            activityId: this.formData.id
          });
        }
      }
    }
  },
  watch: {
    "formData.timetype": {
      handler(newval, oldval) {
        if (newval == "永久") {
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
    isCheck(val){
      if(val == '0'){
        this.formData.checkMultip = 0;
      }
    },
    'formData.checkMultip':{
      handler(newval){
        if(newval>0){
          this.isCheck = '1'
        }
      }
    }
  },
  created() {
    this.getSiteActivityDetail();
    this.creatData();
  }
};
</script>
<style lang="scss">
    #qiandao{
       /* el-card__body .el-table--border {
            border-top:1px solid #e2e3ea;
        }*/
        .signTab.el-table .cell{
            line-height:28px;
        }
    }  
    html body .bottom > .el-container > .el-card > .el-card__body #qiandao .el-table--border{
        border-top: 1px solid #e2e3ea;
    }
    html body .bottom > .el-container > .el-card > .el-card__body #qiandao .el-table__header {
        border-bottom: 0 none;
    }
</style>

