<template>
  <el-card>
    <el-row type="flex" justify="start">
      <el-button type="primary" size="medium" @click="addBtnHandle">新增</el-button>
      <el-button type="primary" size="medium" @click="settingBtnHandle">返利经验设置</el-button>
    </el-row>
    <el-table
      :data="tableData"
      fit
      border
      stripe 
      highlight-current-row
      :header-cell-style="{'text-align':'center'}"
      :cell-style="{'text-align':'center'}"
      v-loading="loading"
      style="margin-top:10px"
    >
      <el-table-column label="等级名称" prop="name"></el-table-column>
      <el-table-column label="返利比例(%)" prop="rebateRatio">
      </el-table-column>
      <el-table-column label="所需经验" prop="experience"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="editRow(scope.row)" >编辑</el-button>
          <el-button type="danger" v-if="scope.row.serial!==0" size="mini" @click="remorow(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑返利设置对话框 -->
    <el-dialog :title="dialogState === 'add'?'新增返利等级':'编辑返利设置'" :visible.sync="dialogVisible" width="37%" @closed="dialogClosed">
      <el-form :model="dialogData" label-width="100px" ref="dialogForm" :rules="rules">
        <el-form-item label="等级名称：" prop="name">
          <el-input v-model="dialogData.name" placeholder="请输入" :maxlength="20" clearable></el-input>
        </el-form-item>
        <el-form-item label="返利比例:" prop="rebateRatio">
          <el-input v-model="dialogData.rebateRatio" clearable>
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="所需经验：" prop="experience">
          <el-input v-model="dialogData.experience" clearable></el-input>
        </el-form-item>
        <el-row :gutter="20" type="flex" justify="start">
             <el-col > 
                <el-form-item label="稽核设置：">
                        <el-radio-group v-model="dialogData.audit">
                                <el-radio border  label="2">不稽核</el-radio>
                                <el-radio border  label="1">稽核</el-radio>
                        </el-radio-group>
                </el-form-item>
             </el-col>
             <el-col  v-if="dialogData.audit=='1'" >
                 <el-form-item prop="auditMultiple">
                     <el-input placeholder="请输入稽核倍数" type="number"  v-model="dialogData.auditMultiple" clearable>
                                <span slot="suffix" style="line-height: 40px;">倍</span>
                      </el-input>
                 </el-form-item>
             </el-col>
              <el-col  v-else>
                  <el-input placeholder="请输入绩效倍数" type="number"  value="0" disabled>
                                <span slot="suffix" style="line-height: 40px;">倍</span>
                </el-input>
             </el-col>
        </el-row>
        <el-row >
            <el-col> 
                <el-form-item label="审核方式：" >
                            <el-radio-group v-model="dialogData.checkMethod">
                                    <el-radio border  label="1">系统审核</el-radio>
                                    <el-radio border  label="2">人工审核</el-radio>
                                    <el-radio border  label="3">自定义审核</el-radio>
                            </el-radio-group>
                </el-form-item>
             </el-col>
        </el-row>
        <el-row v-if="dialogData.checkMethod=='3'">
            <el-col :span="14">
                    <el-form-item
                    label="会员返利金额高于"
                    label-width='160px'
                    prop="selfCheckRebate"
                    >
                    <el-input placeholder="请输入金额" v-model="dialogData.selfCheckRebate" clearable></el-input>
                    </el-form-item>
            </el-col>
            <el-col :span="10">
                  <el-radio-group v-model="dialogData.checkMethod">
                                    <el-radio border  label="3">人工审核</el-radio>
                 </el-radio-group>

            </el-col>
        </el-row>
      </el-form>
      <template slot="footer">
        <el-row type="flex" justify="space-around">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button @click="dialogSaveHandle" :loading="dialogSaveLoading" type="primary">保存</el-button>
        </el-row>
      </template>
    </el-dialog>
    <!-- 返利经验设置对话框 -->
    <el-dialog
      title="返利经验设置"
      :visible.sync="expDialogVisibletc"
      width="45%"
      @closed="expDialogClosed"
    >
      <el-form
        :inline="true"
        :model="expDialogData"
        label-width="100px"
        ref="expDialogForm"
        :rules="expRules"
      >
          <el-form-item label="团队充值" prop="recharge">
          <el-input v-model="expDialogData.recharge">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="可获得" prop="rechargeExperience">
          <el-input v-model="expDialogData.rechargeExperience">
            <template slot="append">经验</template>
          </el-input>
        </el-form-item>
        <el-form-item label="团队打码量" prop="bet">
          <el-input v-model="expDialogData.bet">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="可获得" prop="betExperience">
          <el-input v-model="expDialogData.betExperience">
            <template slot="append">经验</template>
          </el-input>
        </el-form-item>
      </el-form>
      <template slot="footer">
        <el-row type="flex" justify="space-around">
          <el-button @click="expDialogVisibletc = false">取消</el-button>
          <el-button @click="expDialogSaveHandle" :loading="expDialogSaveLoading" type="primary">确认</el-button>
        </el-row>
      </template>
    </el-dialog>
  </el-card>
</template>

<script>
import spreadRequest from "@/request/spread";
import validator from "@/tool/validate";
import tableHeight from "@/tool/tableHeight";

export default {
  name: "ProfitConfEvery",
  data() {
    return {
      tableData: [],
      loading: false,
      rules: {
        name: [{ required: true, message: "等级名称不能为空", trigger: "blur" }],
        rebateRatio: [{ required: true,validator: validator.tdrebateRatio, trigger: "blur" }],
        experience: [{required: true, validator: validator.experience, trigger: "blur" }],
        auditMultiple:[{ validator: validator.auditMultiple,  trigger: "blur" }],
        selfCheckRebate:[{ validator: validator.selfCheckRebate,  trigger: "blur" }],
      },
      expRules: {
        bet: [
            { validator: validator.manualoperatemoney, trigger: ["blur","change"] }
            ],
        betExperience: [
            { validator: validator.experience, trigger: ["blur","change"] }
            ],
        recharge: [
            { validator: validator.manualoperatemoney, trigger: ["blur","change"] }
            ],
        rechargeExperience: [
            { validator: validator.experience, trigger: ["blur","change"] }
            ]
      },

      total:0,
      pageNum:1,
      pageSize:10,

      dialogVisible: false, //新增/编辑弹框可见
      dialogState:'', //add 新增  edit编辑
      dialogData: {},
      dialogSaveLoading: false,

      expDialogVisibletc: false,
      expDialogData:{
          bet:1,
          betExperience:10,
          recharge:10,
          rechargeExperience:20,

      },
      expDialogSaveLoading: false
    };
  },
  methods: {
    queryHandle() {
      //查询返利设置列表
      this.loading = true;
      let vm = this
      spreadRequest.getsiteInfiniteTaxRebateConfig()
        .then(res => {
          if (res.code =='200') {
              this.tableData = res.data;
          } else {
            this.$notify({
              type: "warning",
              title: res.msg
            });
          }
          // tableHeight(this);
        })
        .catch(err => {
          console.log(err);
        });
      this.loading = false;
    },
    settingBtnHandle() {
      this.expDialogVisibletc = true;
    },
    huoqutaxexperience(){   //无限税收推广等级经验查询
        spreadRequest.infinitetaxexperience().then((res) => {
           if(res.code=='200'){
               if(res.data){
                 this.expDialogData=res.data
               }
                //无限税收推广等级经验查询
           }else{
                this.$notify({
                    type: "warning",
                    title: res.msg
                });
           }
      })
    },
    addBtnHandle() {
      //新增等级
      this.dialogState = 'add';
      this.dialogData = {
           audit:'2', 
           checkMethod:'1', // 审核方式选项
           auditMultiple:1, //审核倍数
      };
      this.dialogVisible = true;
    },
    editRow(row) {
      //编辑等级
      this.dialogState = 'edit'
      this.dialogData = Object.assign({}, row);
      this.dialogData.audit = row.audit == true ? '1':'2'
      this.dialogData.checkMethod = row.checkMethod +''
      this.dialogVisible = true;
    },
    remorow(row){
       //删除等级
      const h = this.$createElement;
        this.$msgbox({
          title: '删除',
          message: h('p', {style:'text-align:center'}, [
            h('span', {style:'font-size: 24px;line-height: 60px'}, '你确定删除？'),
            h('div', { style: 'color: red' }, '提示：如果删除本等级，本等级玩家则会降级')
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(action => {
            spreadRequest.deletesiteInfiniteTaxRebateConfig([row.id]).then(res => {
                if(res.code=='200'){
                    this.$notify({
                            type: "success",
                            title: res.msg
                    });
                     this.queryHandle();
                }
            })
        }).catch((e) => {
          console.log(e)     
        });
    },
    dialogClosed() {
      //弹窗关闭
      this.$refs.dialogForm.resetFields();
    },
    expDialogClosed() {
      //经验设置弹窗关闭
      this.$refs.expDialogForm.clearValidate();
    },
    dialogSaveHandle() {
      //弹框保存
      let sum = parseInt(this.dialogData.rebateRatio);
      this.$refs.dialogForm.validate().then(resolve => {
        this.dialogSaveLoading = true;
        let data = {
          audit:this.dialogData.audit=='1' ? true : false, //稽核设置
          auditMultiple:this.dialogData.audit == '1' ? Number(this.dialogData.auditMultiple) : null,//稽核倍数
          checkMethod:this.dialogData.checkMethod,  //审核方式:1代表系统审核;2代表人工审核;3代表自定义审核
          experience: this.dialogData.experience, //所需经验
          name : this.dialogData.name,
          rebateRatio: parseInt(this.dialogData.rebateRatio),
          selfCheckRebate:this.dialogData.checkMethod =='3' ? Number(this.dialogData.selfCheckRebate) : null, //number自定义审核高于多少开始人工审核

        };
        if(this.dialogState == 'edit'){
          data.id = this.dialogData.id
        }
        spreadRequest.setsiteInfiniteTaxRebateConfig(data).then(res => {
            if (res.code == 200) {
              this.dialogVisible = false;
              this.queryHandle();
              this.$notify({
                type: "success",
                title: res.msg
              });
            } else {
              this.$notify({
                type: "warning",
                title: res.msg
              });
            }
            this.dialogSaveLoading = false;
          })
          .catch(err => {
            console.log(err);
            this.dialogSaveLoading = false;
          });
      })
      .catch(err => {
        this.$notify({
          type: "warning",
          title: "校验不通过，请检查页面错误提示"
        });
        this.dialogSaveLoading = false;
      });
    },
    expDialogSaveHandle() { //无限税收推广等级经验修改
      this.$refs.expDialogForm
        .validate()
        .then(() => {
          this.expDialogSaveLoading = true;
          let data = {
            bet:this.expDialogData.bet,
            betExperience:this.expDialogData.bet == 0 ? 0 : this.expDialogData.betExperience,
            recharge:this.expDialogData.recharge,
            rechargeExperience:this.expDialogData.recharge == 0 ? 0 :this.expDialogData.rechargeExperience,
          };
          spreadRequest.infinitetaxexperienceupdate(data).then(res => {
              if (res.code == 200) {
                this.$notify({
                  type: "success",
                  title: '保存成功'
                });
                this.expDialogVisibletc = false;
                 this.huoqutaxexperience();
              } else {
                this.$notify({
                  type: "warning",
                  title: res.msg
                });
              }
              this.expDialogSaveLoading = false;
            })
            .catch(e => {
              console.log(e);
              this.expDialogSaveLoading = false;
            });
        })
        .catch(e => {
          this.$notify({
            type: "warning",
            title: "校验不通过，请检查页面错误提示"
          });
        });
    },

    sizeChange(size) {
      this.pageSize = size;
      this.queryHandle();
    },
    currentChange(crt) {
      this.pageNum = crt;
      this.queryHandle();
    }
  },
  created() {
    // this.getPromotionRebatesExperience();
    this.queryHandle();
    this.huoqutaxexperience()
  }
};
</script>

