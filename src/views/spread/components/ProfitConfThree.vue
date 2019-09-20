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
      <el-table-column label="等级名称" prop="rebateName"></el-table-column>
      <el-table-column label="一级返点(%)" prop="rebateRatio1">
        <template slot-scope="scope">{{scope.row.rebateRatio1}}</template>
      </el-table-column>
      <el-table-column label="二级返点(%)" prop="rebateRatio2">
        <template slot-scope="scope">{{scope.row.rebateRatio2}}</template>
      </el-table-column>
      <el-table-column label="三级返点(%)" prop="rebateRatio3">
        <template slot-scope="scope">{{scope.row.rebateRatio3}}</template>
      </el-table-column>
      <el-table-column label="所需经验" prop="experience"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="editRow(scope.row)" v-hasauth:ProfitConfEditBtn>编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑返利设置对话框 -->
    <el-dialog :title="dialogState === 'add'?'新增返利等级':'编辑返利设置'" :visible.sync="dialogVisible" width="37%" @closed="dialogClosed">
      <el-form :model="dialogData" label-width="100px" ref="dialogForm" :rules="rules">
        <el-form-item label="等级名称：" prop="rebateName">
          <el-input v-model="dialogData.rebateName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="一级返点：" prop="rebateRatio1">
          <el-input v-model="dialogData.rebateRatio1">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="二级返点：" prop="rebateRatio2">
          <el-input v-model="dialogData.rebateRatio2">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="三级返点：" prop="rebateRatio3">
          <el-input v-model="dialogData.rebateRatio3">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="所需经验：" prop="experience">
          <el-input v-model="dialogData.experience"></el-input>
        </el-form-item>
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
      :visible.sync="expDialogVisible"
      width="40%"
      @closed="expDialogClosed"
    >
      <el-form
        :inline="true"
        :model="expDialogData"
        label-width="80px"
        ref="expDialogForm"
        :rules="expRules"
      >
        <el-form-item label="充值" prop="charge">
          <el-input v-model="expDialogData.charge">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="可获得" prop="exp">
          <el-input v-model="expDialogData.exp">
            <template slot="append">经验</template>
          </el-input>
        </el-form-item>
      </el-form>
      <template slot="footer">
        <el-row type="flex" justify="space-around">
          <el-button @click="expDialogVisible = false">取消</el-button>
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
  name: "ProfitConf",
  data() {
    return {
      tableData: [],
      loading: false,
      rules: {
        rebateName: [
          { required: true, message: "等级名称不能为空", trigger: "blur" }
        ],
        rebateRatio1: [{ validator: validator.rebateRatio, trigger: "blur" }],
        rebateRatio2: [{ validator: validator.rebateRatio, trigger: "blur" }],
        rebateRatio3: [{ validator: validator.rebateRatio, trigger: "blur" }],
        experience: [{ validator: validator.experience, trigger: "blur" }]
      },
      expRules: {
        charge: [
            { required: true, message: "不能为空", trigger: "blur" },
            { validator: validator.manualoperatemoney, trigger: ["blur","change"] }
            ],
        exp: [
            { required: true, message: "不能为空", trigger: "blur" },
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

      expDialogVisible: false,
      expDialogData: {
        charge: 1,
        exp: 1,
        id:null
      },
      expDialogSaveLoading: false
    };
  },
  methods: {
    getPromotionRebatesExperience(){  //已设置推广经验设置
      spreadRequest.getPromotionRebatesExperience().then((res) => {
        if(res.code == 200){
          this.expDialogData.charge = res.data.amount;
          this.expDialogData.exp = res.data.experience;
          this.expDialogData.id = res.data.id;
        }else{
          this.$notify({
            type:'warning',
            title:res.msg
          })
        }
        this.loading = false;
      }).catch(err => {
        console.log(err)
        this.loading = false;
      })
    },
    queryHandle() {
      //查询返利设置列表
      this.loading = true;
      let data = {
        limit: this.pageSize,
        offset: (this.pageNum - 1) * this.pageSize,
        sort: "experience",
        sortOrder: "desc",
        conditionsMap: {}
      };
      spreadRequest
        .getRebateConfig(data)
        .then(res => {
          if (res.rows) {
            this.pageNum = res.offset / res.limit + 1;
            this.pageSize = res.limit;
            this.total = res.total;
            this.tableData = res.rows;
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
      //返利经验设置
      this.expDialogVisible = true;
    },
    addBtnHandle() {
      //新增等级
      this.dialogState = 'add';
      this.dialogData = {};
      this.dialogVisible = true;
    },
    editRow(row) {
      //编辑等级
      this.dialogState = 'edit'
      this.dialogData = Object.assign({}, row);
      this.dialogVisible = true;
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
      let sum =
        parseInt(this.dialogData.rebateRatio1) +
        parseInt(this.dialogData.rebateRatio2) +
        parseInt(this.dialogData.rebateRatio3);
      if (sum > 100) {
        this.$notify({
          type: "warning",
          title: "三级返点合计不能超过百分之百"
        });
        return;
      }
      this.$refs.dialogForm.validate().then(resolve => {
        this.dialogSaveLoading = true;
        let data = {
          rebateName : this.dialogData.rebateName,
          rebateRatio1: parseInt(this.dialogData.rebateRatio1),
          rebateRatio2: parseInt(this.dialogData.rebateRatio2),
          rebateRatio3: parseInt(this.dialogData.rebateRatio3),
          experience: this.dialogData.experience
        };
        if(this.dialogState == 'edit'){
          data.id = this.dialogData.id
        }
        spreadRequest.updateOrAddRebateConfig(data).then(res => {
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
    expDialogSaveHandle() { //返利经验设置弹窗保存
      this.$refs.expDialogForm
        .validate()
        .then(() => {
          this.expDialogSaveLoading = true;
          let data = {
            id:this.expDialogData.id,
            amount:this.expDialogData.charge,
            experience:this.expDialogData.exp,
          };
          spreadRequest
            .updateRebateExperienceConfig(data)
            .then(res => {
              if (res.code == 200) {
                this.$notify({
                  type: "success",
                  title: '保存成功'
                });
                this.expDialogVisible = false;
                this.getPromotionRebatesExperience();
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
    this.getPromotionRebatesExperience();
    this.queryHandle();
  }
};
</script>