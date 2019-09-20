<template>
  <el-card v-loading="dialogSaveLoading">
     <div style="margin-bottom: 20px;">棋牌游戏/捕鱼游戏/街机电玩</div>
     <el-form label-width="40px" :model="dialogData" ref="dialogForm" :rules="rules">
         <el-row :gutter="20" type="flex" justify="start" v-for="(item,index) in dialogData.tbSiteRebateConfigDetails" :key="index">
                <el-col :span="5">
                    <el-form-item
                            :label="'推广等级'+(index+1)"
                            label-width='90px'
                            :prop="'tbSiteRebateConfigDetails['+index+'].name'"
                            :rules="domainRule"
                    >
                            <el-input placeholder="请输入推广等级" v-model="dialogData.tbSiteRebateConfigDetails[index].name" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="5" style="position: relative; margin-right: 25px;">
                    <el-form-item
                            label="业绩金额"
                            label-width='70px'
                            :prop="'tbSiteRebateConfigDetails['+index+'].bet'"
                            :rules="money"
                    >
                            <el-input placeholder="请输入业绩金额金额" type="number"  v-model="dialogData.tbSiteRebateConfigDetails[index].bet" clearable>
                                <span slot="suffix" class="">元</span>
                            </el-input>
                            <span style="position: absolute;right:-30px;">且</span>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item
                            label="推荐人数"
                            label-width='70px'
                            :prop="'tbSiteRebateConfigDetails['+index+'].subordinateCount'"
                            :rules="subordinateCount"
                    >
                            <el-input placeholder="请输入推荐人数" type="number" v-model="dialogData.tbSiteRebateConfigDetails[index].subordinateCount" clearable>
                                <span slot="suffix" class="">人</span>
                            </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item
                            label="每万返佣"
                            label-width='70px'
                            :prop="'tbSiteRebateConfigDetails['+index+'].commissionPer'"
                            :rules="commissionPer"
                    >
                            <el-input placeholder="请输入返佣金额" type="number"  v-model="dialogData.tbSiteRebateConfigDetails[index].commissionPer">
                                <span slot="suffix" class="">元</span>
                            </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="1" v-if="dialogData.tbSiteRebateConfigDetails.length > 1">
                        <el-form-item
                            label-width="0"
                            
                            style="margin-left:20px"
                        >
                            <el-button circle size="medium" @click="deleteLine(index)">&nbsp;-&nbsp;</el-button>
                        </el-form-item>
                </el-col>
                <el-col :span="1" v-if="(index === dialogData.tbSiteRebateConfigDetails.length-1)&&(dialogData.tbSiteRebateConfigDetails.length < 20)">
                        <el-form-item
                            label-width="0"
                            
                            style="margin-left:20px"
                        >
                            <el-button circle size="medium" @click="addLine">&nbsp;+&nbsp;</el-button>
                        </el-form-item>
                </el-col>        
         </el-row> 
         <el-row :gutter="20" type="flex" justify="start">
             <el-col :span="5" > 
                <el-form-item label="稽核倍数" label-width='70px'>
                        <el-radio-group v-model="dialogData.audit">
                                <el-radio border  label="2">不稽核</el-radio>
                                <el-radio border  label="1">稽核</el-radio>
                        </el-radio-group>
                </el-form-item>
             </el-col>
             <el-col :span="4" v-if="dialogData.audit=='1'" >
                  <el-form-item label=""  label-width='0'  prop="auditMultiple">
                            <el-input placeholder="请输入绩效倍数" type="number"  v-model="dialogData.auditMultiple" clearable>
                                  <span slot="suffix" style="line-height: 40px;">倍</span>
                            </el-input>
                  </el-form-item>
             </el-col>
              <el-col :span="4"  v-else>
                  <el-input placeholder="请输入绩效倍数" type="number"  value="0" disabled>
                                <span slot="suffix" style="line-height: 40px;">倍</span>
                </el-input>
             </el-col>
        </el-row>
        <el-row >
            <el-col :span="5"> 
                <el-form-item label="有效下级定义:" label-width='100px'>
                            <el-radio-group v-model="dialogData.subordinate">
                                    <el-radio border  label="1">需要</el-radio>
                                    <el-radio border  label="2">不需要</el-radio>
                            </el-radio-group>
                </el-form-item>
             </el-col>
        </el-row>
        <el-row v-if="dialogData.subordinate=='1'">
            <el-col :span="6" style="position: relative; margin-right: 25px;">
                    <el-form-item
                    label="业绩金额高于"
                    label-width='110px'
                    prop="subordinateBet"
                    >
                            <el-input placeholder="请输入金额" v-model="dialogData.subordinateBet" clearable>
                            </el-input>
                    </el-form-item>
                    <span style="position: absolute;right:-40px;top: 8px;">且</span>
            </el-col>
           
            <el-col :span="5">
                    <el-form-item
                    label="充值金额高于"
                    label-width='130px'
                    prop="subordinateRecharge"
                        >
                            <el-input placeholder="请输入金额" v-model="dialogData.subordinateRecharge" clearable></el-input>
                    </el-form-item>
            </el-col>
        </el-row>
        <el-row >
            <el-col :span="15"> 
                <el-form-item label="审核方式:" label-width='78px'>
                            <el-radio-group v-model="dialogData.checkMethod">
                                    <el-radio border  label="1">系统审核</el-radio>
                                    <el-radio border  label="2">人工审核</el-radio>
                                    <el-radio border  label="3">自定义审核</el-radio>
                            </el-radio-group>
                </el-form-item>
             </el-col>
        </el-row>
        <el-row v-show="dialogData.checkMethod=='3'">
            <el-col :span="6">
                    <el-form-item
                    label="会员返利金额金额高于"
                    label-width='170px'
                    prop="selfCheckRebate"
                    >
                            <el-input placeholder="请输入金额" v-model="dialogData.selfCheckRebate" clearable></el-input>
                    </el-form-item>
            </el-col>
            <el-col :span="5">
                  <el-radio-group v-model="dialogData.heithway">
                                    <el-radio border  label="2">人工审核</el-radio>
                 </el-radio-group>

            </el-col>
        </el-row>
      </el-form>
      <div  class="dialog-footer">
        <el-button @click="dialogcancel">取 消</el-button>
        <el-button type="primary" @click="dialogSaveBtn" :loading="dialogSaveLoading">保 存</el-button>
      </div>
  </el-card>
</template>

<script>
import spreadRequest from "@/request/spread";
import valide from "@/tool/validate";
export default {
  name: "ProfitConfUnlimited",
    data() {
        return{
            rules: {
                auditMultiple: [
                        { required: true, message: '请输入绩效倍数', trigger: 'blur' },
                        { validator: valide.auditMultipleset,trigger: "blur"}
                ],
                 subordinateBet: [
                        { required: true, message: '请输入业绩有效金额', trigger: 'blur' },
                        { validator: valide.amountck,trigger: "blur"},
                ],
                 subordinateRecharge: [
                        { required: true, message: '请输入充值金额', trigger: 'blur' },
                        { validator: valide.amountck,trigger: "blur"},
                ],
                 selfCheckRebate: [
                        { required: true, message: '请输入金额', trigger: 'blur' },
                        { validator: valide.amountck,trigger: "blur"},
                ],
             },
            domainRule: {
                validator: valide.ProfitConfUnlimited,
                trigger: "blur"
            },
            money: {
                validator: valide.ProfitConfUnlimitedemoney,
                trigger: "blur"
            },
            subordinateCount:{
                validator: valide.subordinateCount,
                trigger: "blur"
            },
            commissionPer:{
                validator: valide.commissionPer,
                trigger: "blur"
            },  
             dialogData: {
                tbSiteRebateConfigDetails: [
                     { name:'',bet:'',subordinateCount:'',commissionPer:''}
                ], //新增
                audit:'1', //稽核选项
                auditMultiple:0,  //稽核倍数
                subordinate:'1',  //有效定义的下级
                checkMethod:'1', // 审核方式选项
                heithway:'2', //会员返利金额金额高于
                selfCheckRebate:0, //number自定义审核高于多少开始人工审核
                subordinateBet:0, //number有效投注金额高于
                subordinateRecharge:0, // number充值金额高于
                id:null,
            },
            dialogSaveLoading:false
        }
    },
    methods: {
        deleteLine(index) {
      //新增弹窗删除一行
          this.dialogData.tbSiteRebateConfigDetails.splice(index, 1);
       },
       addLine() {
      //新增弹窗增加一行
         let data={ name:'',bet:'',subordinateCount:'',commissionPer:''}
         this.dialogData.tbSiteRebateConfigDetails.push(data);
      },
      dialogSaveBtn(){ //保存
       this.dialogSaveLoading =true
          let data={
              audit:this.dialogData.audit == '1' ? true : false ,  //boolean是否稽核
              auditMultiple:this.dialogData.audit == '1' ? Number(this.dialogData.auditMultiple) : '', //number稽核倍数
              checkMethod:this.dialogData.checkMethod,  //审核方式:1代表系统审核;2代表人工审核;3代表自定义审核
              selfCheckRebate:this.dialogData.checkMethod =='3' ? Number(this.dialogData.selfCheckRebate) : '', //number自定义审核高于多少开始人工审核
              subordinate:this.dialogData.subordinate == '1' ? true : false ,  //boolean是否需要有效下级
              subordinateBet:this.dialogData.subordinate == '1' ? Number(this.dialogData.subordinateBet):0, //number有效投注金额高于
              subordinateRecharge:this.dialogData.subordinate == '1' ?Number(this.dialogData.subordinateRecharge):0, // number充值金额高于
              tbSiteRebateConfigDetails:this.dialogData.tbSiteRebateConfigDetails,
              id:this.dialogData.id
          }
             this.$refs.dialogForm.validate().then(() => {
                let objname =[] //查看重复名
                let betsizi = -1 //排查有效投注是否低于下级
                let Countsizi = -1 //排查推荐人数是否低于下级
                let Persizi = -1 //排查每万返佣是否低于下级
                let getcongige = true
                this.dialogData.tbSiteRebateConfigDetails.map(item=>{
                     objname.push(item.name)
                     if(Number(item.bet)>=betsizi){
                         betsizi = Number(item.bet)
                     }else{
                        this.$message({
                            type: "warning",
                            message: "有效投注金额不能低于上级有效投注金额"
                        });
                        this.dialogSaveLoading = false;
                        getcongige = false
                        return ;
                     }if(Number(item.subordinateCount) >= Countsizi){
                         Countsizi = Number(item.subordinateCount)
                     }else{
                        this.$message({
                            type: "warning",
                            message: "推荐人数不能低于上级推荐人数"
                        });
                        this.dialogSaveLoading = false;
                        getcongige = false
                        return ;
                     }
                     if(Number(item.commissionPer) >= Persizi){
                         Persizi = Number(item.commissionPer)
                     }else{
                        this.$message({
                            type: "warning",
                            message: "每万返佣不能低于上级每万返佣"
                        });
                        this.dialogSaveLoading = false;
                        getcongige = false
                        return ; 
                     }
                 })
                 let set = new Set(objname);
                 if (this.dialogData.tbSiteRebateConfigDetails.length != set.size) {
                      this.$message({
                            type: "warning",
                            message: "当前添加的推广等级不能有重复"
                        });
                        getcongige = false
                        return this.dialogSaveLoading = false;
                 }else if(getcongige){
                     this.siteRebateConfig(data);
                 }
            })
            .catch(e => {
              this.$notify({
                type: "error",
                title: "校验不通过，请检查错误提示"
              });
              this.dialogSaveLoading = false;
            }); 
      },
      siteRebateConfig(data){  //保存返利设置url
        spreadRequest.siteRebateConfig(data).then((res) => {
            if (res.code == 200) {
            //   this.queryHandle();
            this.dialogSaveLoading =false
              this.$notify({
                type: "success",
                title:'保存成功'
              });
              this.siteRebateConfigGet()
            } else {
                this.dialogSaveLoading =false  
                this.$notify({
                    type: "warning",
                    title: res.msg
                });
            }
          })
      },
      siteRebateConfigGet(){
          let vm = this.dialogData
          spreadRequest.siteRebateConfigGet().then(res=>{
               if (res.data) {
                    vm.audit=res.data.audit == false ? '2' :'1'
                    vm.auditMultiple=res.data.auditMultiple
                    vm.checkMethod=res.data.checkMethod+''
                    vm.selfCheckRebate=res.data.selfCheckRebate //number自定义审核高于多少开始人工审核
                    vm.subordinate=res.data.subordinate == false ? '2' :'1' //boolean是否需要有效下级
                    vm.subordinateBet=res.data.subordinateBet+''//number有效投注金额高于
                    vm.subordinateRecharge=res.data.subordinateRecharge+''// number充值金额高于
                    vm.tbSiteRebateConfigDetails=res.data.tbSiteRebateConfigDetails
                    vm.id=res.data.id
               }else{
                     if(res.code!=='201'){
                         this.$notify({
                                type: 'warning',
                                title: res.msg
                         })
                     }
               }
          })
      },
      dialogcancel(){
           this.siteRebateConfigGet()
      }
    },    
    created(){
        this.siteRebateConfigGet()
    },
    activated() {
        this.siteRebateConfigGet()
    }
  }
</script>

