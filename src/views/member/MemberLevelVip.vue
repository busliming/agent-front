<template>
    <div style="width:100%;overflow: auto;" id="memberLevel">
        <el-form :model="tableData" ref="tableData" :rules="rules"  v-loading="savaBtnLoading">
            <el-row>

                    <el-form-item label="状态"
                                  size="small"
                                  style="margin-left: 4%"
                    >
                        <el-select  v-model="tableData.status" placeholder="请选择" @change="ChangeValue" :disabled="true">
                            <el-option label="启用" :value="1">启用</el-option>
                            <el-option label="禁用" :value="0">禁用</el-option>
                        </el-select>
                    </el-form-item>
            </el-row>
            <el-row  type="flex" justify="start">
                <el-form-item  style="margin-left: 4%">
                    <el-radio-group v-model="isCheck" @change="ChangeValue">
                        <el-radio label="1" >稽核</el-radio>
                        <el-radio label="0" >不稽核</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="打码倍数" label-width="160px" prop="checkMultip" :rules="[
                                          { validator: emptyOrNum,trigger:'blur'}
                                        ]" style="margin-left:15px;" >
                    <el-input v-model="tableData.checkMultip" placeholder="打码倍数" style="width: 160px;" clearable @change="ChangeValue"></el-input>
                </el-form-item>
                <el-form-item label-width="20px">
                    <el-tooltip effect="light" class="item"  placement="top-start">
                        <div slot="content">
                            a.提款VIP赠送金额需要的打码倍数。<br/>
                            b.最终打码量=VIP打码倍数*VIP赠送金额。<br/>
                            c.VIP赠送金额包括：VIP晋级礼金、VIP周礼金、VIP月礼金。
                        </div>
                        <i class="el-icon-info" style="font-size: 14px;"></i>
                    </el-tooltip>
                </el-form-item>
            </el-row>
            <el-row>
                <el-col :span="24">
                <el-table
                        :data="tableData.vipLevelList"
                        style="width: 90%;margin-left: 4%; border-left:1px solid #ddd;"
                        border
                        class="signTab"
                        :fit='true'
                        size="medium"
                        :cell-style='{textAlign:"center",width:"180px", borderRight:"1px solid #ddd",borderBottom:"1px solid #ddd",padding:"10px 0"}'
                        :header-cell-style='{textAlign:"center",borderRight:"1px solid #ddd"}'
                >
                    <el-table-column label="VIP等级">
                        <template slot-scope="scope">
                            <el-form-item
                                    :prop="'vipLevelList[' + scope.$index + '].vipLevel'"
                                    size="small"
                            >
                                <el-input  v-model="scope.row.vipLevel" placeholder="请输入VIP等级" disabled></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="晋级打码量">
                        <template slot-scope="scope">
                            <el-form-item
                                    :prop="'vipLevelList[' + scope.$index + '].vipBet'"
                                    size="small"
                                    :rules="[
                                          { validator: emptyOrNum,trigger:'blur'}
                                        ]">
                                <el-input  v-model="scope.row.vipBet" placeholder="请输入打码量" clearable @change="ChangeLevel" :disabled="scope.$index ==0?true:false"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="hongbao"
                            label="晋级礼金"
                    >
                        <template slot-scope="scope">

                                 <el-form-item
                                                 :prop="'vipLevelList[' + scope.$index + '].levelAmount'"
                                                 size="small"
                                                 :rules="[
                                          { validator: money,trigger:'blur'}
                                        ]">
                                <el-input  v-model="scope.row.levelAmount" placeholder="输入晋级礼金" clearable @change="ChangeLevel" :disabled="scope.$index ==0?true:false"></el-input>

                                 </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="rewardIntegral"
                            label="周礼金"
                    >
                        <template slot-scope="scope">
                            <el-form-item
                                    :prop="'vipLevelList[' + scope.$index + '].weekAmount'"
                                    size="small"
                                    :rules="[
                                          { validator: money,trigger:'blur'}
                                        ]">
                                <el-input  v-model="scope.row.weekAmount" placeholder="请输入周礼金" clearable @change="ChangeLevel" :disabled="scope.$index ==0?true:false"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="rewardIntegral"
                            label="月礼金"
                    >
                        <template slot-scope="scope">
                            <el-form-item
                                    :prop="'vipLevelList[' + scope.$index + '].monthAmount'"
                                    size="small"
                                    :rules="[
                                          { validator: money,trigger:'blur'}
                                        ]">
                                <el-input  v-model="scope.row.monthAmount" placeholder="请输入月礼金" clearable @change="ChangeLevel" :disabled="scope.$index ==0?true:false"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="rewardIntegral"
                            label="存款加速通道"
                    >
                        <template slot-scope="scope">
                            <el-form-item
                                    :prop="'vipLevelList[' + scope.$index + '].fastChannel'"
                                    size="small"
                                    >
                                <el-select  v-model="scope.row.fastChannel" placeholder="请选择" @change="ChangeLevel" :disabled="scope.$index ==0?true:false">
                                    <el-option label="显示" :value="1">显示</el-option>
                                    <el-option label="不显示" :value="0">不显示</el-option>
                                </el-select>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="rewardIntegral"
                            label="专属客服经理"
                    >
                        <template slot-scope="scope">
                            <el-form-item
                                    :prop="'vipLevelList[' + scope.$index + '].customerService'"
                                    size="small"
                                    >
                                <el-select  v-model="scope.row.customerService" placeholder="请选择" @change="ChangeLevel" :disabled="scope.$index ==0?true:false">
                                    <el-option label="显示" :value="1">显示</el-option>
                                    <el-option label="不显示" :value="0">不显示</el-option>
                                </el-select>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column >
                        <template slot-scope="scope">
                                <el-button
                                        v-if="scope.$index == tableData.vipLevelList.length-1 && scope.$index !=0"
                                        size="small" icon="el-icon-minus" circle
                                        @click='tableData.vipLevelList.splice(scope.$index,1);MinusData()'
                                ></el-button>

                                <el-button
                                        v-if="(scope.$index == tableData.vipLevelList.length-1 || (tableData.vipLevelList.length==1 && scope.$index ==0)) && tableData.vipLevelList.length <=9"
                                        size="small" type="primary" icon="el-icon-plus" circle
                                        @click="AddData"
                                ></el-button>
                        </template>
                    </el-table-column>
                </el-table>
                </el-col>
                <!--<el-col :span="1"
                        style="margin-right:10px;"
                        v-if="tableData.dayList.length > 1"
                >
                    <el-button
                            size="small" icon="el-icon-minus" circle
                            @click='tableData.dayList.splice(idx,1)'
                    ></el-button>
                </el-col>-->
                <!--<el-col :span="1"
                        style="margin-right:10px;"
                >
                    <el-button
                            size="small" type="primary" icon="el-icon-plus" circle
                            @click="tableData.dayList.push('')"
                    ></el-button>
                </el-col>-->
            </el-row>
            <el-row>
                <el-aside style="width:64%;margin-left: 4%;margin-top:10px;margin-bottom:10px;font-size:12px;color:red;line-height:20px">
                    <p>*VIP等级配置必须连读</p>
                    <p>*高等级打码量配置数值必须大于等于低等级打码量</p>
                    <p>*高等级礼金配置数值必须大于等于低等级礼金</p>
                    <p>*VIP数据进行修改后，需要通知技术重启服务器后才会生效</p>
                </el-aside>
            </el-row>
            <el-row>

                    <el-form-item  label="说明文字"
                            size="small"
                            style="margin-left: 4%;width: 76%;"
                            >
                        <el-input type="textarea"  @change="ChangeValue"
                                  :rows="6"
                                    v-model="tableData.vipContent" placeholder="说明文字选填，输入后将显示到游戏端的VIP晋级模式页面中，换行请敲回车键" clearable></el-input>
                    </el-form-item>

            </el-row>
        </el-form>
        <el-container>
            <el-aside width="38%"></el-aside>
            <el-main >
                <el-button type="primary" size="medium" @click="saveBtnClick" :loading="savaBtnLoading">保存</el-button>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    import ElOption from "element-ui/packages/select/src/option";
    import memberRequest from '@/request/member'
    export default {
        components: {ElOption},
        name: "member-level-vip",
        data() {
            return {
                tableData:{
                    vipLevelList:[
                        {
                            vipLevel: 1,
                            vipBet: 0,
                            levelAmount: 0,
                            weekAmount: 0,
                            monthAmount: 0,
                            fastChannel: 1,//存款加速通道
                            customerService: 1
                        }],//
                     updateLevelTime: 0,//更新VIP等级时间
                     updateTime: 0,//更新VIP特权时间
                     checkMultip:50,status:1,//状态禁用0  启用1
                     vipContent:"",
                     id:null

                },
                isCheck:"1",//是否稽核 1 稽核 0 不稽核
                savaBtnLoading:false,
              //  tableData1:{},//用于与tableData比较
                rules:{}
            }
        },
        watch:{
            'tableData.checkMultip':{
                handler(newval){
                    if(newval == 0){
                        this.isCheck = "0";
                    }else if(newval > 0 ){
                        this.isCheck = "1";
                    }
                }
            },
            isCheck:{
                handler(newval){
                    if(newval == "0"){
                        this.tableData.checkMultip = 0;
                    }
                }
            },
        },
        methods:{
            _moneyFormatter2(val) {//当不需要返回加减号 需要除以1000 需要截取保留2位小数
                //console.log(val);
                if (!val) return 0;
                let str = String(val / 1000);
                let idx = str.indexOf('.') + 3;
                if (str.indexOf('.') > -1) {
                    if (str.length > 4) {
                        str = str.slice(0, idx);
                    }
                }
                return str;//.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            },
            _moneyFormatter(val) {//当不需要返回加减号 需要除以1000 需要截取保留2位小数
               // console.log(val);
                if (!val) return "0.00";
                let str = String(val / 1000);
                let idx = str.indexOf('.') + 3;
                if (str.indexOf('.') > -1) {
                    if (str.length > 4) {
                        str = str.slice(0, idx);
                    }
                }
                return str;//.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            },
            emptyOrNum(r,v,c) { // 数值或者空
                let reg = new RegExp(/^[0-9]+$/);
                if(!v&&parseInt(v)!=0){
                    return c(new Error('必填项'));

                }
               else if(!reg.test(v)){
                    return c(new Error('请输入合法值！'));

                }
               else if(v > 1000000000){
                    return c(new Error('不能超过1000000000！'));

                }
                return  c();
            },
            money(r,v,c) {  //最多两位小数
                let reg = new RegExp(/^(([0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/);
                if(!v&&parseInt(v)!=0){
                    return c(new Error('礼金为必填项目'));

                }
                else if(!reg.test(v)){
                    return c(new Error('请输入合法值,最多两位小数'));

                }
               else if(v > 1000000000){
                    return  c(new Error('不能超过1000000000！'));

                }
               return c();
            },
            ChangeValue(){
                this.tableData.updateTime = new Date().getTime();//毫秒数
            },
            ChangeLevel(){
                this.tableData.updateLevelTime = new Date().getTime();//毫秒数
            },
            getSiteVip(){
                memberRequest.getSiteVip().then(res =>{

                    if(res.code == "200"){
                       if(res.data !=null){
                           this.tableData.status = res.data.status!=null&&res.data.status==1?res.data.status:0;//此处强制做了状态为启用
                           this.tableData.id=res.data.id;
                           this.tableData.updateTime = 0;
                           this.tableData.updateLevelTime = 0;
                           this.tableData.vipContent = res.data.vipContent!=null&&res.data.vipContent!=""?res.data.vipContent .split("\\n")
                               .join("\n"):"";
                           this.tableData.checkMultip = res.data.checkMultip!=null?res.data.checkMultip:50;
                           this.tableData.vipLevelList =  res.data.vipLevelList!=null&& res.data.vipLevelList.length>0?res.data.vipLevelList:this.tableData.vipLevelList;
                           if(this.tableData.vipLevelList.length>0) {
                               for (var i = 0; i < this.tableData.vipLevelList.length; i++) {
                                   this.tableData.vipLevelList[i].vipBet = this._moneyFormatter2(this.tableData.vipLevelList[i].vipBet);
                                   this.tableData.vipLevelList[i].levelAmount = this._moneyFormatter(this.tableData.vipLevelList[i].levelAmount);
                                   this.tableData.vipLevelList[i].weekAmount = this._moneyFormatter(this.tableData.vipLevelList[i].weekAmount);
                                   this.tableData.vipLevelList[i].monthAmount = this._moneyFormatter(this.tableData.vipLevelList[i].monthAmount);
                               }
                           }
                          if(this.tableData.checkMultip ==0){
                              this.isCheck = "0";
                          }
                          if(this.tableData.checkMultip>0){
                              this.isCheck = "1";
                          }
                       }
                    }else{
                        this.$notify.warning({title:res.msg})
                    }
                }).catch(err => {
                    this.$notify.warning({title:err});
                });
            },
            AddData(){
                this.tableData.vipLevelList.push({
                    vipLevel: this.tableData.vipLevelList.length + 1,
                    vipBet: 0,
                    levelAmount: 0,
                    weekAmount: 0,
                    monthAmount: 0,
                    fastChannel:1,
                    customerService:1
                });
               this. ChangeLevel();
            },
            MinusData(){
                this. ChangeLevel();
            },
            saveBtnClick(){
               // let valid2 = this.$refs.tableData.validate();
               // let validate1 = this.$refs['tableData'].validate();
                //Promise.all([valid2]).then(res => {
                //Promise.all([validate1]).then(() => {

                this.$refs["tableData"].validate(valid => {
                    if (valid) {
                        if (this.isCheck == '1' && this.tableData.checkMultip == 0) {
                            this.$message.warning({message: '已选择稽核请输入打码倍数'})
                            return
                        }
                        for (var i = 0; i < this.tableData.vipLevelList.length; i++) {
                            if (this.tableData.vipLevelList.length > 1 && (i+1) < this.tableData.vipLevelList.length) {// && this.tableData.vipLevelList[i].length < this.tableData.vipLevelList.length - 1
                                //console.log(this.tableData.vipLevelList[i].vipBet);
                                //console.log(this.tableData.vipLevelList[i + 1].vipBet);
                                if (Number(this.tableData.vipLevelList[i].vipBet) > Number(this.tableData.vipLevelList[i + 1].vipBet)) {
                                    this.$message.warning({message: '高等级晋级打码量配置数值必须大于等于低等级晋级打码量'});
                                    return
                                }
                                else if (
                                    Number(this.tableData.vipLevelList[i].levelAmount) > Number(this.tableData.vipLevelList[i + 1].levelAmount)
                                ) {
                                    this.$message.warning({message: '高等级晋级礼金配置数值必须大于等于低等级晋级礼金'});
                                    return
                                }
                                else if (
                                    Number(this.tableData.vipLevelList[i].weekAmount) > Number(this.tableData.vipLevelList[i+1].weekAmount)
                                ) {
                                    this.$message.warning({message: '高等级周礼金配置数值必须大于等于低等级周礼金'});
                                    return
                                }
                                else if (
                                    Number(this.tableData.vipLevelList[i].monthAmount) > Number(this.tableData.vipLevelList[i+1].monthAmount)
                                ) {
                                    this.$message.warning({message: '高等级月礼金配置数值必须大于等于低等级月礼金'});
                                    return
                                }
                            }
                        }
                        let content = this.tableData.vipContent;//防止界面在点击的时候变成一行
                        if(content.includes("\n\n")){
                            content = content.split(/\n\n/).join("\\n");
                        }else {
                            content = content.split(/\n/).join("\\n");
                        }
                        this.$confirm(
                            'VIP数据进行修改后，需要通知技术重启服务器后才会生效,\n请确认是否要保存数据?',
                            '提示',
                            {
                                confirmButtonText:'确定',
                                cancelButtonText:'取消',
                                type:'warning',
                                center:true
                            }
                        ).then(() => {
                            this.savaBtnLoading = true;
                            let data = {
                                checkMultip: this.isCheck == "0" ? 0 : this.tableData.checkMultip,
                                status: this.tableData.status,
                                vipContent: content,
                                vipLevelList: this.tableData.vipLevelList,
                                updateTime: this.tableData.updateTime,
                                updateLevelTime: this.tableData.updateLevelTime,
                                id: this.tableData.id
                            }
                            // console.log(data);
                            memberRequest.addOrUpdateSiteVip(data).then(res => {
                                if (res.code == 200) {
                                    this.$notify.success({title: '保存成功!'})
                                    this.savaBtnLoading = false;
                                    this.getSiteVip();

                                } else {
                                    this.$notify.warning({title: res.msg})
                                    this.savaBtnLoading = false;
                                }

                            }).catch(err => {
                                this.savaBtnLoading = false;
                            });
                        }).catch(() => {
                        });
                    }else {
                        this.$message.warning({message:'校验不通过，请检查页面错误提示'});
                    }
                })
                   /* .catch(err=>{
                   // console.log(err);

                })*/
            }
        },
       created(){
            this.getSiteVip();//获取VIP特权列表
       }
    }
</script>

<style scoped lang="scss">
   #memberLevel{
       .el-form-item__error {
           position: relative;
       }
   }

</style>