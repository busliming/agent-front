<template>
  <div class="withdraw-conf">
    <el-row type="flex" justify="end">
      <el-button type="primary" size="medium" @click="addNew">新增出款模板</el-button>
    </el-row>
    <el-table
            :data="tableData"
            v-loading="loading"
            :border="true"
            :fit="true"
            size="medium"
            stripe
            style="margin-top:10px;"
            highlight-current-row
            :cell-style="{textAlign:'center'}"
            :header-cell-style="{textAlign:'center'}"
    >
      <el-table-column label="顺序" prop="sort" width="200"></el-table-column>
      <el-table-column label="名称" prop="templateName"></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="{row}">
          <el-row type="flex" justify="space-around">
            <el-button type="primary" size="mini"
                       @click="editRow(row)"
            >编辑</el-button>
            <el-button type="danger" size="mini" v-if="row.defaultTag != 1"
                       @click='delDrawPayConfig(row)'
            >删除</el-button>
          </el-row>
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

    <!-- 新增/编辑出款模板弹窗 -->
    <el-dialog title="出入款模板" width="50%" :visible.sync="dialogVisible"
               @closed='dialogClosed'
               :close-on-click-modal="false"
    >
      <el-form
              class="finance_conf_with_draw_conf_dialog_form"
              :model="dialogData"
              v-loading='dialogLoading'
              ref="dialogForm"
              :rules="rules"
      >
        <el-card header="模板名称" shadow="never">
          <el-row type="flex" justify="center">
            <el-form-item label="模板名称" label-width="80px" prop='templateName'>
              <el-input size="medium" clearable placeholder="请输入" v-model="dialogData.templateName" maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="排序" label-width="60px" prop="sort">
              <el-input size="medium" clearable placeholder="请输入" v-model.number="dialogData.sort" maxlength="5"></el-input>
            </el-form-item>
          </el-row>
        </el-card>
        <el-card header="出款手续费" shadow="never">
          <el-row type="flex" justify="center">
            <el-form-item label="出款手续费" label-width="130px" prop="charge">
              <el-input
                      size="medium"
                      type="number"
                      maxlength="8"
                      clearable
                      placeholder="请输入"
                      v-model.number="dialogData.charge"
              ></el-input>
            </el-form-item>

          </el-row>
          <el-row type="flex" justify="center">
            <el-form-item label="手续费类型:" label-width="100px" prop="chargeType">
              <el-radio-group v-model.number="dialogData.chargeType">
                <el-radio :label="1">免手续费</el-radio>
                <el-radio :label="2">每次收取手续费</el-radio>
                <el-radio :label="3">自定义</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-row>
          <el-row type="flex"  justify="center" v-if="dialogData.chargeType == 3">
            <el-row type="flex" justify="center">
              <el-form-item label="自定义手续费:" label-width="110px" prop="hours">
                <el-input
                        size="medium"
                        clearable
                        v-model.number="dialogData.hours"
                        style="width:160px;"
                >
                  <template slot="append">小时内</template>
                </el-input>
              </el-form-item>
              <el-form-item prop="times">
                <el-input
                        size="medium"
                        clearable
                        v-model.number="dialogData.times"
                        style="width:240px;"
                >
                  <template slot="prepend">取款</template>
                  <template slot="append">次免收手续费</template>
                </el-input>
              </el-form-item>
            </el-row>
          </el-row>
          <el-row type="flex" justify="center" >
            <el-row type="flex" justify="center">
              <el-form-item label="会员单次取款限额" label-width="130px" prop='withdrawMin'>
                <el-input
                        size="medium"
                        clearable
                        placeholder="下限"
                        v-model="dialogData.withdrawMin"
                        style="width:120px;"
                ></el-input>
              </el-form-item>
              <el-form-item label="~" label-width="12px"  prop='withdrawMax'>
                <el-input
                        size="medium"
                        clearable
                        placeholder="上限"
                        v-model="dialogData.withdrawMax"
                        style="width:126px;"
                ></el-input>
              </el-form-item>
            </el-row>

          </el-row>
        </el-card>
        <el-card header="出款设定" shadow="never">
          <el-row type="flex" justify="center">
            <el-col :span="4">
              <el-form-item label="充值稽核："></el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="线上存款" label-width="90px" prop="olCheckRate">
                <el-input
                        size="medium"
                        clearable
                        placeholder="请输入"
                        v-model.number="dialogData.olCheckRate"
                        maxlength="8"
                >
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="公司入款" label-width="90px" prop="coCheckRate">
                <el-input
                        size="medium"
                        clearable
                        placeholder="请输入"
                        v-model.number="dialogData.coCheckRate"
                        maxlength="8"
                >
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center">
            <el-col :span="4">
              <el-form-item label="充值稽核行政费：" label-width="125px"></el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="线上存款" label-width="90px" prop='olServeRate'>
                <el-input
                        size="medium"
                        clearable
                        placeholder="请输入"
                        v-model.number="dialogData.olServeRate"
                        maxlength="8"
                >
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="公司入款" label-width="90px" prop='coServeRate'>
                <el-input
                        size="medium"
                        clearable
                        placeholder="请输入"
                        v-model.number="dialogData.coServeRate"
                        maxlength="8"
                >
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center">
            <el-col :span="4">
              <el-form-item label="优惠稽核："></el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="线上存款" label-width="90px" prop='olCheckMultip'>
                <el-input
                        size="medium"
                        clearable
                        placeholder="请输入"
                        v-model.number="dialogData.olCheckMultip"
                        maxlength="8"
                >
                  <template slot="append">倍</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="公司入款" label-width="90px" prop='coCheckMultip'>
                <el-input
                        size="medium"
                        clearable
                        placeholder="请输入"
                        v-model.number="dialogData.coCheckMultip"
                        maxlength="8"
                >
                  <template slot="append">倍</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
        <el-card header="入款设定" shadow="never">
          <el-row type="flex" justify="center">
            <el-col :span="4">
              <el-form-item label="最低优惠标准：" label-width="110px"></el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="线上存款" label-width="90px" prop='olRechargeMin'>
                <el-input
                        size="medium"
                        clearable
                        placeholder="请输入"
                        v-model.number="dialogData.olRechargeMin"
                        maxlength="8"
                >
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="公司入款" label-width="90px" prop='coRechargeMin'>
                <el-input
                        size="medium"
                        clearable
                        placeholder="请输入"
                        v-model.number="dialogData.coRechargeMin"
                        maxlength="8"
                >
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center">
            <el-col :span="4">
              <el-form-item label="优惠百分比："></el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="线上存款" label-width="90px" prop='olDiscountsRate'>
                <el-input
                        size="medium"
                        clearable
                        placeholder="请输入"
                        v-model.number="dialogData.olDiscountsRate"
                        maxlength="8"
                >
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="公司入款" label-width="90px" prop='coDiscountsRate'>
                <el-input
                        size="medium"
                        clearable
                        placeholder="请输入"
                        v-model.number="dialogData.coDiscountsRate"
                        maxlength="8"
                >
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center">
            <el-col :span="4">
              <el-form-item label="优惠笔数："></el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="线上存款" label-width="90px" prop='olDiscountsTimes'>
                <el-input
                        size="medium"
                        clearable
                        placeholder="请输入"
                        v-model.number="dialogData.olDiscountsTimes"
                        maxlength="8"
                >
                  <template slot="append">笔</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="公司入款" label-width="90px" prop='coDiscountsTimes'>
                <el-input
                        size="medium"
                        clearable
                        placeholder="请输入"
                        v-model.number="dialogData.coDiscountsTimes"
                        maxlength="8"
                >
                  <template slot="append">笔</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
        <el-card header="自动出款设定" shadow="never">
          <el-row type="flex" justify="space-between">
            <el-form-item label="当提现金额小于或等于：" label-width="170px" prop="autoLimit">
              <el-input
                      size="medium"
                      clearable
                      placeholder="请输入"
                      v-model="dialogData.autoLimit"
              >
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="第三方出款渠道" label-width="120px">
              <el-select
                      v-model.number="dialogData.merchantId"
                      placeholder="无"
                      clearable
                      size="medium"
              >
                <el-option
                        v-for="item in channelOptions"
                        :key="item.id"
                        :label="item.merchantName"
                        :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-row>
        </el-card>
        <el-card header="提现说明" shadow="never">
          <el-form-item label-width="0">
            <el-input
                    size="medium"
                    clearable
                    maxlength="30"
                    placeholder="可输入30个文字"
                    v-model="dialogData.remark"
            ></el-input>
          </el-form-item>
        </el-card>
        <el-row type="flex" justify="center" style="margin-top:15px;">
          <el-col :span="6">
            <el-row type="flex" justify="space-between">
              <el-button size="medium" plain
                         @click="dialogVisible = false"
              >取消</el-button>
              <el-button size="medium" type="primary"
                         @click="dialogSave"
              >保存</el-button>
            </el-row>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
    import depositsConf from "@/request/finance/depositsConf";
    // import validator from '@/tool/validate'

    export default {
        name: "withdrawConf",
        data() {
            const isPositiveInteger = (r,v,c) => { //正整数 不包含0
                let reg = new RegExp(/^\+?[1-9][0-9]*$/)
                if(!v){
                    c();
                }
                if(!reg.test(v)){
                    c(new Error('请输入正整数'))
                }else{
                    c();
                }
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
            const isIntegerFixed2 = (r,v,c) => { //小数点后两位
                let reg = new RegExp(/^[0-9]+(.[0-9]{2})?$/);
                if(!v){
                    c();
                }
                if(!reg.test(v)){
                    c(new Error('请输入正数,小数点后两位'))
                }else{
                    c();
                }
            };
            return {
                loading: false, //列表loading状态
                tableData: [], //列表数据
                channelOptions: [
                    //第三方出款渠道
                ],

                dialogVisible: false, //弹窗可视状态
                dialogData: {//表单数据
                    templateName:'', //模板名称
                    sort:null, //排序
                    charge:50, //出款手续费
                    chargeType:1, //手续费类型
                    withdrawMin:null,
                    withdrawMax:null,
                    hours:null,
                    times:null,
                    olCheckRate:100,
                    coCheckRate:100,
                    olServeRate:null,
                    coServeRate:null,
                    olCheckMultip:null,
                    coCheckMultip:null,
                    olRechargeMin:null,
                    coRechargeMin:null,
                    olDiscountsRate:null,
                    coDiscountsRate:null,
                    olDiscountsTimes:null,
                    coDiscountsTimes:null,
                    autoLimit:null,
                    merchantId:''
                },
                dialogLoading:false, //弹窗加载
                rules: {
                    templateName:[
                        {required:true,message:'请输入模板名称',trigger:'blur'}
                    ],
                    sort:[
                        {required:true,message:'请输入排序',trigger:'blur'},
                        {validator:isPositiveInteger,trigger:'change'}
                    ],
                    charge:[
                        {validator:isInteger,trigger:'change'}
                    ],
                    chargeType:[
                        {required:true,message:'请选择手续费类型',trigger:'blur'}
                    ],
                    withdrawMin:[
                        {validator:isIntegerFixed2,trigger:'change'},
                    ],
                    withdrawMax:[
                        {validator:isIntegerFixed2,trigger:'change'},
                    ],
                    hours:[
                        {required:true,message:'请输入',trigger:'blur'},
                        {validator:isInteger,trigger:'change'}
                    ],
                    times:[
                        {required:true,message:'请输入',trigger:'blur'},
                        {validator:isInteger,trigger:'change'}
                    ],
                    olCheckRate:[
                        {validator:isInteger,trigger:'change'}
                    ],
                    coCheckRate:[
                        {validator:isInteger,trigger:'change'}
                    ],
                    olServeRate:[
                        {validator:isInteger,trigger:'change'}
                    ],
                    coServeRate:[
                        {validator:isInteger,trigger:'change'}
                    ],
                    olCheckMultip:[
                        {validator:isInteger,trigger:'change'}
                    ],
                    coCheckMultip:[
                        {validator:isInteger,trigger:'change'}
                    ],
                    olRechargeMin:[
                        {validator:isInteger,trigger:'change'}
                    ],
                    coRechargeMin:[
                        {validator:isInteger,trigger:'change'}
                    ],
                    olDiscountsRate:[
                        {validator:isInteger,trigger:'change'}
                    ],
                    coDiscountsRate:[
                        {validator:isInteger,trigger:'change'}
                    ],
                    olDiscountsTimes:[
                        {validator:isInteger,trigger:'change'}
                    ],
                    coDiscountsTimes:[
                        {validator:isInteger,trigger:'change'}
                    ],
                    autoLimit:[
                        {validator:isIntegerFixed2,trigger:'change'},
                    ],
                },

                pageNum: 1,
                pageSize: 10,
                total: 0
            };
        },
        methods: {
            getDrawPayConfigPageList() {
                //获取列表数据
                this.loading = true;
                let data = {
                    limit: this.pageSize,
                    offset: (this.pageNum - 1) * this.pageSize
                };
                depositsConf
                    .getDrawPayConfigPageList(data)
                    .then(res => {
                        if (res.code == 200) {
                            this.tableData = Object.assign([], res.data.rows);
                            this.total = res.data.total;
                            this.pageSize = res.data.limit;
                            this.pageNum = res.data.offset / res.data.limit + 1;
                        } else {
                            this.$notify.warning({ title: res.msg });
                        }
                        this.loading = false;
                    })
                    .catch(e => {
                        console.log(e);
                        this.loading = false;
                    });
            },
            getDrawMerchantList(){
                //获取第三方出款渠道
                depositsConf
                    .getDrawMerchantList()
                    .then(res => {
                        if (res.code == 200) {
                            this.channelOptions = res.data;
                        } else {
                            this.$notify.warning({ title: res.msg });
                        }
                    })
                    .catch(e => {
                        console.log(e);
                    });
            },
            addNew() {
                //新增出款模板
                this.dialogVisible = true;
                this.dialogData.id = null;
            },
            editRow(row){ //编辑模板
                this.dialogVisible = true;
                this.dialogLoading = true;
                let data = {
                    id:row.id
                }
                depositsConf.getDrawPayConfigDetail(data).then(res => {
                    if(res.code == 200){
                        this.dialogData = res.data;
                        if (res.data.merchantId == 0) {
                            this.dialogData.merchantId = null //后端返回0 - 显示：无
                        }else{
                            let idx = this.channelOptions.findIndex(
                                function (item){
                                    return item.id == res.data.merchantId
                                }
                            )
                            if(idx<0){  //已经禁用的渠道显示为空
                                this.dialogData.merchantId = null
                            }
                        }
                    }else{
                        this.$notify.warning({ title: res.msg });
                        this.dialogVisible = false;
                    }
                    this.dialogLoading = false;
                }).catch(e => {
                    console.log(e);
                    this.dialogVisible = false;
                    this.dialogLoading = false;
                })
            },
            dialogSave(){ //对话框保存
                this.$refs.dialogForm.validate().then(() => {
                    this.dialogLoading = true;
                    let data = this.dialogData;
                    (data.merchantId == '')&&(data.merchantId = 0) //后端需要0
                    depositsConf.addOrUpdateDrawPayConfig(data).then(res => {
                        if(res.code == 200){
                            this.$notify.success({title:'保存成功'})
                            this.dialogVisible = false;
                            this.getDrawPayConfigPageList();
                        }else{
                            this.$notify.warning({title:res.msg})
                        }
                        this.dialogLoading = false;
                    })
                }).catch(e => {
                    this.$notify.warning({title:'校验不通过，请检查错误提示'})
                })
            },
            dialogClosed(){ //弹窗关闭
                this.$refs.dialogForm.resetFields();
            },
            delDrawPayConfig(row){ //删除行
                this.$confirm(
                    `确认删除该出款模板:${row.templateName}吗？`,
                    '提示',
                    {
                        confirmButtonText:'确认',
                        cancleButtonText:'取消',
                        type:'warning '
                    }
                ).then(() => {
                    this.loading = true;
                    let data = {
                        id:row.id
                    }
                    depositsConf.delDrawPayConfig(data).then(res => {
                        if(res.code == 200){
                            this.$notify.success({title:'删除成功'})
                            this.getDrawPayConfigPageList();
                        }else{
                            this.$notify.warning({title:res.msg})
                        }
                        this.loading = false;
                    }).catch(e => {
                        console.log(e);
                        this.loading = false;
                    })
                })
            },
            sizeChangeHandle(size) {
                //切换表格显示条数
                this.pageSize = size;
                this.getDrawPayConfigPageList();
            },
            currentChangeHandle(crtpage) {
                //切换表格当前页
                this.pageNum = crtpage;
                this.getDrawPayConfigPageList();
            }
        },
        created() {
            this.getDrawPayConfigPageList();
            this.getDrawMerchantList();
        }
    };
</script>

<style lang="scss">
  .finance_conf_with_draw_conf_dialog_form {
    .el-card__header {
      padding: 10px 20px;
      text-align: center;
      background: #eee;
    }
    .el-card + .el-card {
      margin-top: 10px;
    }
    .el-input-group__prepend {
      padding: 5px;
    }
    .el-input-group__append {
      padding: 5px;
    }
    input[type="number"] {
      -moz-appearance: textfield;
    }
    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
</style>
