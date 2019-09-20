<template>
  <div>
    <el-form label-width="90px">
      <el-row type="flex" justify="space-between">
        <el-col :span="6">
          <el-form-item label="商户名称">
            <el-input v-model="bankName" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="支付类型">
            <el-select v-model="bankID">
              <el-option value label="全部">全部</el-option>
              <el-option
                      v-for="item in dialogForm.payTypeList"
                      :key="item.payType"
                      :value="item.payType"
                      :label="item.payName"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="状态">
            <el-select v-model="status">
              <el-option :value="2" label="全部">全部</el-option>
              <el-option :value="1" label="正常">正常</el-option>
              <el-option :value="0" label="禁用">禁用</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-row type="flex" justify="end">
            <el-button size="medium" type="primary" icon="el-icon-search" @click="searchHandle">查询</el-button>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
    <el-row style="margin-top:15px">
      <el-button size="medium" type="primary" icon="el-icon-circle-plus" @click="addConf">新增入款商户</el-button>
      <el-button
              size="medium"
              type="primary"
              icon="el-icon-setting"
              @click="editDepositsPrams"
      >充值参数配置</el-button>
    </el-row>
    <el-table
            border
            fit
            stripe
            v-loading="loading"
            :data="tableData1"
            style="margin-top:15px"
            :cell-style="{textAlign:'center'}"
            :header-cell-style="{textAlign:'center'}"
    >
      <el-table-column prop="merchantName" label="商户名称"></el-table-column>
      <el-table-column prop="type" label="支付类型">
        <template slot-scope="scope">
          <div>{{scope.row.payType | PayTypeFormatter}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="merchantNo" label="商户号"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag
                  :type="scope.row.status == '1' ? 'success' : 'danger'"
                  disable-transitions
          >{{ (scope.row.status == 1)? '正常' : '禁用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="action" label="操作" width="220">
        <template slot-scope="scope">
          <el-button size="mini" @click="editConf(scope.row)">编辑</el-button>
          <el-button
                  size="mini"
                  :type="scope.row.status == 1 ? 'danger' : 'success'"
                  @click="changeState(scope.row)"
          >{{ (scope.row.status == 1)? '禁用' : '开启' }}</el-button>
          <el-button size="mini" type="danger" @click="deleteConf(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="center">
      <el-pagination
              @size-change="sizeChangeHandle"
              @current-change="currentChangeHandle"
              :page-sizes="[10,20,50,100,200]"
              :page-size.sync="pageSize"
              :current-page="pageNum"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
      ></el-pagination>
    </el-row>

    <!-- 新增线上入款配置对话框 -->
    <el-dialog
            :title="(dialogForm.state == 'add'?'新增线上入款值配置':'编辑线上入款值配置')"
            :visible.sync="dialogForm.visible"
            @close="close"
            center
            top="2vh"
            :close-on-click-modal="false"
    >
      <el-form
              v-loading="modalLoading"
              label-width="100px"
              :model="formData"
              ref="formData"
              :rules="formRules"
      >
        <el-form-item label="支付类型：" prop="payType">
          <el-select v-model.number="formData.payType" placeholder="请选择" @change="paySystemList">
            <el-option
                    v-for="item in dialogForm.payTypeList"
                    :key="item.payType"
                    :label="item.payName"
                    :value="item.payType"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="银行卡转账：" prop="paySystemId">
          <el-select v-model.number="formData.paySystemId" placeholder="请选择">
            <el-option
                    v-for="item in dialogForm.payTypeChildList"
                    :key="item.id"
                    :label="item.payName"
                    :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商户名称：" prop="merchantName">
          <el-input placeholder="请输入商户名称" v-model="formData.merchantName"></el-input>
        </el-form-item>
        <el-form-item label="别名：" prop="alias">
          <el-input placeholder="请输入别名" v-model="formData.alias"></el-input>
        </el-form-item>
        <el-form-item label="商户号：" prop="merchantNo">
          <el-input placeholder="请输入商户号" v-model="formData.merchantNo"></el-input>
        </el-form-item>

        <el-form-item label="密钥：" prop="merchantKey">
          <el-input placeholder="请输入密钥" v-model="formData.merchantKey"></el-input>
        </el-form-item>

        <el-form-item label="公钥：" prop="merchantConsole">
          <el-input placeholder="请输入公钥" v-model="formData.merchantConsole"></el-input>
        </el-form-item>

        <el-form-item label="支付网关：" prop="gateway">
          <el-input placeholder="请输入支付网关" v-model="formData.gateway"></el-input>
        </el-form-item>

        <el-form-item label="支付限额：" required>
          <el-col :span="11">
            <el-form-item prop="minQuota">
              <el-input
                      type="number"
                      v-model.number="formData.minQuota"
                      style="width: 100%;"
                      placeholder="最低"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2" align="center">-</el-col>
          <el-col :span="11">
            <el-form-item prop="maxQuota">
              <el-input
                      type="number"
                      placeholder="最高"
                      v-model.number="formData.maxQuota"
                      style="width: 100%;"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="会员标签：">
          <el-checkbox
                  :indeterminate="dialogForm.isAllLabels"
                  v-model="dialogForm.checkAllLabels"
                  @change="checkAllLabelsEv"
          >全选/全不选</el-checkbox>

          <div class="form-group">
            <el-form-item prop="userLabel">
              <el-checkbox-group
                      v-if="(labels && labels.length >0)"
                      v-model="dialogForm.checkedLabels"
                      @change="checkLabelEv"
                      size="medium"
                      class="flexdisplaydiv"
              >
                <el-checkbox
                        v-for="(label,index) in labels"
                        :label="label.id"
                        :key="index"
                        :value="label.id"
                        border
                >{{label.labelName}}</el-checkbox>
              </el-checkbox-group>
              <template v-else>没有会员标签，请新增！</template>
            </el-form-item>
          </div>
        </el-form-item>

        <el-form-item label="会员等级：" required>
          <el-checkbox
                  :indeterminate="dialogForm.isAllLevels"
                  v-model="dialogForm.checkAllLevels"
                  @change="checkAllLevelsEv"
          >全选/全不选</el-checkbox>
          <div class="form-group">
            <el-form-item prop="userLevel">
              <el-checkbox-group
                      v-if="(levels && levels.length >0)"
                      v-model="dialogForm.checkedLevels"
                      @change="checkLevelEv"
                      size="medium"
                      class="flexdisplaydiv"
              >
                <el-checkbox
                        v-for="(level,index) in levels"
                        :label="level.id"
                        :key="index"
                        :value="level.id"
                        border
                >{{level.levelName}}</el-checkbox>
              </el-checkbox-group>
              <template v-else>没有会员等级，清新僧！</template>
            </el-form-item>
          </div>
        </el-form-item>

        <el-form-item label="状态：" prop="status">
          <el-select v-model.number="formData.status">
            <el-option label="正常" :value="true"></el-option>
            <el-option label="禁用" :value="false"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="显示排序：" prop="sort">
          <el-input type="number" v-model.number="formData.sort" placeholder="数字越小排名越靠前"></el-input>
        </el-form-item>

        <el-form-item label="充值说明" prop="attr1">
          <el-input type="textarea" :rows="2" v-model="formData.attr1"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogForm.visible = false">取 消</el-button>
        <el-button type="primary" @click="submit('formData')" :loading="modalLoading">保 存</el-button>
      </span>
    </el-dialog>

    <el-dialog
            title="充值参数配置"
            :visible.sync="dialogForm2.visible"
            center
            width="680px"
            @close="closeT"
            :close-on-click-modal="false"
    >
      <el-form
              v-loading="modalLoading2"
              :model="dialogForm2"
              ref="dialogForm2"
              :rules="formRulesT"
              label-width="100px"
      >
        <el-form-item label="充值金额1：" prop="moneyA">
          <el-input size='medium' v-model.number="dialogForm2.moneyA">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="充值金额2：" prop="moneyB">
          <el-input size='medium' v-model.number="dialogForm2.moneyB">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="充值金额3：" prop="moneyC">
          <el-input size='medium' v-model.number="dialogForm2.moneyC">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="充值金额4：" prop="moneyD">
          <el-input size='medium' v-model.number="dialogForm2.moneyD">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-row type="flex" justify="center">
          <span style="padding:10px;margin-bottom:15px;">充值排序</span>
        </el-row>
        <el-row type="flex" justify="space-between">
          <el-form-item label="支付宝充值" prop="paySort1">
            <el-input size='medium' v-model="dialogForm2.paySort1"></el-input>
          </el-form-item>
          <el-form-item label="微信充值" prop="paySort2">
            <el-input size='medium' v-model="dialogForm2.paySort2"></el-input>
          </el-form-item>
          <el-form-item label="官方充值" prop="paySort3">
            <el-input size='medium' v-model="dialogForm2.paySort3"></el-input>
          </el-form-item>
        </el-row>
        <el-row type="flex" justify="space-between">
          <el-form-item label="代理充值" prop="paySort4">
            <el-input size='medium' v-model="dialogForm2.paySort4"></el-input>
          </el-form-item>
          <el-form-item label="网银充值" prop="paySort5">
            <el-input size='medium' v-model="dialogForm2.paySort5"></el-input>
          </el-form-item>
          <el-form-item label="QQ充值" prop="paySort6">
            <el-input size='medium' v-model="dialogForm2.paySort6"></el-input>
          </el-form-item>
        </el-row>
        <el-row type="flex" justify="space-between">
          <el-form-item label="京东充值" prop="paySort7">
            <el-input size='medium' v-model="dialogForm2.paySort7"></el-input>
          </el-form-item>
          <el-form-item label="快捷支付" prop="paySort8">
            <el-input size='medium' v-model="dialogForm2.paySort8"></el-input>
          </el-form-item>
          <el-form-item label="银联钱包" prop="paySort9">
            <el-input size='medium' v-model="dialogForm2.paySort9"></el-input>
          </el-form-item>
        </el-row>
        <el-row type="flex" justify="space-between">
          <el-form-item label="公众号充值" prop="paySort10" style="width:185px;">
            <el-input size='medium' v-model="dialogForm2.paySort10"></el-input>
          </el-form-item>
          <el-form-item label="" prop="">
          </el-form-item>
          <el-form-item label="" prop="">
          </el-form-item>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="dialogForm2.visible = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="updateParams('dialogForm2')" :loading="modalLoading2">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    import depositsConf from "@/request/finance/depositsConf";
    import validator from "@/tool/validate";

    export default {
        name: "OnlinePayConf",
        props: ["labels", "levels"],
        data() {

            let minQuotaCheck = (r, v, c) => {
                let maxMoney = 99999999.99;
                if (parseInt(v)  < 0) {
                    c(new Error("最高金额不能小于0"));
                }else if(parseFloat(v)>maxMoney){
                    c(new Error("最低金额支付限额不能超过99999999.99"));
                }
                c();
            };

            let maxQuotaCheck = (r, v, c) => {
                /* if (!v) {
                   c(new Error("请输入最高金额"));
                 }*/
                let maxMoney = 99999999.99;//允许输入的最大限额限制

                if (parseFloat(v) < this.formData.minQuota) {
                    c(new Error("最高金额不能小于最低金额"));
                } else if (v < 0) {
                    c(new Error("最高金额不能小于0"));
                } else if(parseFloat(v)>maxMoney){
                    c(new Error("最高金额支付限额不能超过99999999.99"));
                }
                c();
            };
            const sortValid = (r,v,c) => { //限制为1-10
                if(v<1 || v>10 || (v+'').indexOf('.')>-1){
                    c(new Error('请输入1-10的整数'))
                }else{
                    c();
                }
            };
            return {
                //搜索条件
                bankName: "", //商户名称
                bankID: "", //支付类型
                status: 2, //状态  1启用 0禁用 2 全部

                tableData1: [],
                loading: false,
                modalLoading: false,
                modalLoading2: false,

                dialogForm: {
                    visible: false,
                    state: 'add', //add新增  edit编辑
                    indexChange: false,
                    payTypeList: [],  //支付类型
                    payTypeChildList: [],  //支付渠道
                    isAllLevels: false,
                    checkAllLevels: '',
                    checkedLevels: [],
                    levelList: [],
                    isAllLabels: false,
                    checkAllLabels: '',
                    checkedLabels: [],
                    labelList: []
                    // levelList : ['普通会员', '超级大客户', 'VIP2', 'VIP1', 'VIP23', 'VIP3', '危险用户', '深圳5', '深圳6', '深圳7']
                },
                formData: {
                    id: null,
                    payType: null,
                    paySystemId: null,
                    merchantName: '',
                    merchantNo: '',
                    merchantKey: '',
                    merchantConsole: '',
                    minQuota: null,
                    maxQuota: null,
                    userLevel: '',
                    userLabel: '',
                    gateway: '',
                    status: true,//正常
                    sort: null,
                    attr1: '',
                    alias:''
                },
                formRules: {
                    // payType: [
                    //     { required: true, message: '请选择支付类型', trigger: 'change' },
                    // ],
                    // paySystemId: [
                    //     { required: true, message: '请选择银行卡转账', trigger: 'change' },
                    // ],
                    alias:[
                        {validator: validator.alias, trigger: ['blur','change']},
                    ],
                    merchantName: [
                        {validator: validator.merchantNamehove, trigger: 'change'},
                    ],
                    merchantNo: [
                        {validator: validator.merchantNohove, trigger: 'change'},
                    ],
                    merchantKey: [
                        { required: true, message: '密钥不能为空', trigger: 'blur' },
                    ],
                    gateway: [
                        {validator: validator.gatewayhove, trigger: 'change'},
                    ],
                    minQuota: [//金额
                        {required: true, message: '请输入最低金额', trigger: 'blur'},
                        {validator: minQuotaCheck, trigger: ['blur','change']}
                    ],
                    maxQuota: [
                        {required: true, message: '请输入最高金额', trigger: 'blur'},
                        {validator: maxQuotaCheck, trigger: ['blur','change']}
                    ],
                    userLevel: {required: true, message: '请选择会员等级', trigger: 'change'},
                    // userLabel: {required: true, message: '请选择会员标签', trigger: 'change'},
                    status: {required: true, message: '请选择状态', trigger: 'change'},
                    // interfaceType: {required: true, message: '请选择使用终端', trigger: 'change'},
                    // sort: {validator: validator.sortNum, trigger: 'change'},
                    attr1: {validator: validator.remarks, trigger: 'change'}
                },

                dialogForm2: {
                    visible: false,
                    moneyA: "",
                    moneyB: "",
                    moneyC: "",
                    moneyD: "",
                    money: ["", "", "", ""],

                    paySort1:1,  //充值排序
                    paySort2:2,
                    paySort3:3,
                    paySort4:4,
                    paySort5:5,
                    paySort6:6,
                    paySort7:7,
                    paySort8:8,
                    paySort9:9,
                    paySort10:10,
                },
                formData2: {
                    id: "",
                    moneyList: ""
                },
                formRulesT: {
                    moneyA: { validator: validator.amount, trigger: "change" },
                    moneyB: { validator: validator.amount, trigger: "change" },
                    moneyC: { validator: validator.amount, trigger: "change" },
                    moneyD: { validator: validator.amount, trigger: "change" },
                    paySort1: [
                        { required:true, message:'排序不能为空', trigger: "change" },
                        { validator: sortValid, trigger: "change" }
                    ],
                    paySort2: [
                        { required:true, message:'排序不能为空', trigger: "change" },
                        { validator: sortValid, trigger: "change" }
                    ],
                    paySort3: [
                        { required:true, message:'排序不能为空', trigger: "change" },
                        { validator: sortValid, trigger: "change" }
                    ],
                    paySort4: [
                        { required:true, message:'排序不能为空', trigger: "change" },
                        { validator: sortValid, trigger: "change" }
                    ],
                    paySort5: [
                        { required:true, message:'排序不能为空', trigger: "change" },
                        { validator: sortValid, trigger: "change" }
                    ],
                    paySort6: [
                        { required:true, message:'排序不能为空', trigger: "change" },
                        { validator: sortValid, trigger: "change" }
                    ],
                    paySort7: [
                        { required:true, message:'排序不能为空', trigger: "change" },
                        { validator: sortValid, trigger: "change" }
                    ],
                    paySort8: [
                        { required:true, message:'排序不能为空', trigger: "change" },
                        { validator: sortValid, trigger: "change" }
                    ],
                    paySort9: [
                        { required:true, message:'排序不能为空', trigger: "change" },
                        { validator: sortValid, trigger: "change" }
                    ],
                    paySort10: [
                        { required:true, message:'排序不能为空', trigger: "change" },
                        { validator: sortValid, trigger: "change" }
                    ],
                },

                pageSize: 10,
                pageNum: 1,
                total: 0
            };
        },
        filters:{
            PayTypeFormatter(val){
                if (!val) return "";
                let result ="";
                switch (val){
                    case 3:
                        result = "手机网银" ;
                        break;
                    case 4:
                        result = "手机微信" ;
                        break;
                    case 6:
                        result = "手机支付宝";
                        break;
                    case 8:
                        result = "手机QQ";
                        break;
                    case 12:
                        result ="手机银联APP";
                        break;
                    case 13:
                        result ="手机京东钱包";
                        break;
                    case 18:
                        result ="手机快捷支付";
                        break;
                    default:
                        break;
                }
                return result;
            }
        },
        watch: {
            "dialogForm.checkedLabels"(val) {
                let str = "";
                for (let k in val) {
                    if (k > 0) str += ",";
                    str += val[k].toString();
                }
                this.formData.userLabel = str;
            },
            "dialogForm.checkedLevels"(val) {
                let str = "";
                for (let k in val) {
                    if (k > 0) str += ",";
                    str += val[k].toString();
                }
                this.formData.userLevel = str;
            },
            "formData.payType"(val) {
                if (this.dialogForm.indexChange) {
                    this.formData.paySystemId = "";
                }
                this.dialogForm.indexChange = true;
            },
            'levels'(val) {
                console.log(val);
                this.dialogForm.levelList = [];
                if (val.length > 0 && this.dialogForm.levelList.length == 0) {
                    for (let levelsItem of this.levels) {
                        this.dialogForm.levelList.push(levelsItem.id);
                    }
                }
            },
            'labels'(val) {
                console.log(val);
                this.dialogForm.labelList = [];
                if (val.length > 0 && this.dialogForm.labelList.length == 0) {
                    for (let labelsItem of this.labels) {
                        this.dialogForm.labelList.push(labelsItem.id);
                    }
                }
            },
        },
        methods: {
            searchHandle() {
                this.pageNum = 1;
                this.queryList();
            },
            // 线上入款列表
            queryList() {
                this.loading = true;
                let data = {
                    conditionsMap: {
                        bankName: this.bankName,
                        bankID: this.bankID,
                        status: this.status
                    },
                    limit: this.pageSize,
                    offset: (this.pageNum - 1) * this.pageSize,
                    sort: "createDate",
                    sortOrder: "desc"
                };
                depositsConf.getListByOnlMerchant(data).then(res => {
                    if (res.rows) {
                        this.total = res.total;
                        this.pageSize = res.limit;
                        this.pageNum = res.offset / res.limit + 1;
                        this.tableData1 = res.rows;
                    } else {
                        this.$notify.warning({title: res.msg});
                    }
                    this.loading = false;
                });
            },
            //获取支付类型
            initPayChannel() {
                this.dialogForm.payTypeList = null;
                this.dialogForm.payTypeChildList = null;
                let vm = this;
                this.modalLoading = true;
                depositsConf.payTypeListAll().then(res => {
                    this.modalLoading = false;
                    if (res.code == 200) {
                        vm.dialogForm.payTypeList = res.data;
                    } else {
                        this.$notify.error({title: res.msg});
                    }
                });
            },
            //根据支付类型获取支付渠道
            paySystemList() {
                let data = {
                    bankType: this.formData.payType
                }
                depositsConf.paySystemList(data).then(res => {
                    if (res.code == 200) {
                        this.dialogForm.payTypeChildList = res.data;
                    } else {
                        this.$notify.error({title: res.msg});
                    }
                }).catch(e => {
                    console.log(e)
                })
            },
            // 选择会员等级+标签事件
            checkAllLevelsEv(val) {
                this.dialogForm.checkedLevels = val ? this.dialogForm.levelList : [];
                this.dialogForm.isAllLevels = false;
            },
            checkLevelEv(val) {
                let checkedCount = val.length;
                this.dialogForm.checkAllLevels =
                    checkedCount === this.dialogForm.levelList.length;
                this.dialogForm.isAllLevels =
                    checkedCount > 0 && checkedCount < this.dialogForm.levelList.length;
            },
            checkAllLabelsEv(val) {
                this.dialogForm.checkedLabels = val ? this.dialogForm.labelList : [];
                this.dialogForm.isAllLabels = false;
            },
            checkLabelEv(val) {
                let checkedCount = val.length;
                this.dialogForm.checkAllLabels =
                    checkedCount === this.dialogForm.labelList.length;
                this.dialogForm.isAllLabels =
                    checkedCount > 0 && checkedCount < this.dialogForm.labelList.length;
            },
            // 添加配置
            addConf() {
                this.setModalData({});
                this.dialogForm.state = "add";
                this.dialogForm.visible = true;
                this.dialogForm.checkAllLabels = false;
                this.dialogForm.checkAllLevels = false;
            },
            // 修改配置
            editConf(row) {
                let vm = this;
                depositsConf.getMerchantById(row).then(res => {
                    if (res.code == 200) {
                        vm.setModalData(res.data);
                        vm.dialogForm.state = "edit";
                        vm.dialogForm.visible = true;
                    } else {
                        this.$message({
                            type: "error",
                            message: res.msg,
                            center: true
                        });
                    }
                });
            },
            // 获取&显示个配置信息
            setModalData(data) {
                let vm = this;
                //reset form data
                this.dialogForm.checkedLevels = [];
                this.dialogForm.checkedLabels = [];
                this.checkLevelEv([]);
                this.checkLabelEv([]);
                this.dialogForm.indexChange = false;
                //then set form data
                for (let key in vm.formData) {
                    if (vm.formData.hasOwnProperty(key)) {
                        vm.formData[key] = data[key];
                    }
                }
                // if (vm.formData.sort=== undefined || vm.formData.sort === '' || vm.formData.sort === null) {
                //     vm.formData.sort = vm.total + 1;
                // }else{
                //     vm.formData.sort = data.sort;
                // }

                this.formData.payType = data.payType;
                if (this.formData.payType) {
                    this.paySystemList()  //根据支付类型获取支付渠道
                }

                if (data.paySystemId !== undefined && data.paySystemId !== null) {
                    this.formData.paySystemId = parseInt(data.paySystemId);
                }

                if (data.userLevel !== undefined && data.userLevel !== null) {
                    if (data.userLevel.length > 0) {
                        var charcode = data.userLevel.substr(data.userLevel.length - 1, 1)
                        if (charcode == ",") {
                            data.userLevel = data.userLevel.slice(0, -1);
                        }
                        let temp = JSON.parse('[' + data.userLevel + ']');
                        if(this.dialogForm.levelList.length==0){
                            this.dialogForm.levelList=[];
                            this.dialogForm.levelList = this.$store.getters.levelList;
                            /*for (let levelsItem of temp){
                                this.dialogForm.levelList.push(levelsItem);
                            }*/
                        }
                        console.log(this.$store.getters.levelList);
                        console.log(this.dialogForm.levelList);
                        /*for (let i in temp) {
                            if (this.dialogForm.levelList.indexOf(temp[i]) !== -1) {
                                temp[i] = parseInt(temp[i], 10);
                            } else {
                                temp.splice(i, 1)
                            }
                        }*/
                        var arrList=[];
                        for(var i=0;i<temp.length;i++){
                            for(var j=0;j<this.dialogForm.levelList.length;j++){
                                if(this.dialogForm.levelList[j]==temp[i]){
                                    arrList.push(temp[i]);
                                    break;//跳出此层循环
                                }
                            }
                        }
                        vm.dialogForm.checkedLevels = arrList;
                        console.log( vm.dialogForm.checkedLevels );
                        vm.checkLevelEv(arrList);
                    }
                } else {
                    vm.dialogForm.isAllLevels = false;
                }
                if (data.userLabel !== undefined && data.userLabel !== null) {
                    if (data.userLabel.length > 0) {
                        var charcode = data.userLabel.substr(data.userLabel.length - 1, 1)
                        if (charcode == ",") {
                            data.userLabel = data.userLabel.slice(0, -1);
                        }
                        let temp1 = JSON.parse('[' + data.userLabel + ']');

                        if(this.dialogForm.labelList.length==0){
                            this.dialogForm.labelList=[];
                            this.dialogForm.labelList =this.$store.getters.labelList;
                            /*for (let labelsItem of temp){
                                this.dialogForm.labelList.push(labelsItem);
                            }*/
                        }
                        console.log(this.$store.getters.labelList);
                        console.log(this.dialogForm.labelList);
                        /*for (let i in temp) {
                            if (this.dialogForm.labelList.indexOf(temp[i]) !== -1) {
                                temp[i] = parseInt(temp[i], 10);
                            } else {
                                temp.splice(i, 1)
                            }
                        }*/
                        var arrList1=[];
                        for(var i=0;i<temp1.length;i++){
                            for(var j=0;j<this.dialogForm.labelList.length;j++){
                                if(this.dialogForm.labelList[j]==temp1[i]){
                                    arrList1.push(temp1[i]);
                                    break;//跳出此层循环
                                }
                            }
                        }
                        vm.dialogForm.checkedLabels = arrList1;
                        vm.checkLabelEv(arrList1);
                    }
                } else {
                    vm.dialogForm.isAllLabels = false;
                }
            },
            // 保存信息
            submit(formName) {
                let vm = this;
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.$confirm("你确定保存？", "操作提示", {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            center: true,
                            type: "info"
                        })
                            .then(() => {
                                // if (vm.formData.sort === '' && (vm.total && vm.total!== null)) {
                                //     if (vm.formData.id !== '' && vm.formData.id !== undefined && vm.formData.id !== null){
                                //         vm.formData.sort = vm.total;
                                //     } else {
                                //         vm.formData.sort = vm.total + 1
                                //     }
                                // }
                                this.modalLoading = true;
                                let levelarr = [];
                                if(vm.formData.userLevel!=''&&vm.formData.userLevel!=undefined&&vm.formData.userLevel!=null) {
                                    levelarr = Array.from(new Set(vm.formData.userLevel.split(","))); //数组去重
                                    vm.formData.userLevel = levelarr.join(",");
                                }

                                let lablearr = [];
                                if(vm.formData.userLabel!=''&&vm.formData.userLabel!=undefined&&vm.formData.userLabel!=null) {
                                    lablearr = Array.from(new Set(vm.formData.userLabel.split(","))); //数组去重
                                    vm.formData.userLabel = lablearr.join(",");
                                }
                                depositsConf.submitPayMerchant(vm.formData).then(res => {
                                    this.modalLoading = false;
                                    if (res.code == 200) {
                                        this.$message({
                                            type: "success",
                                            message: res.msg,
                                            center: true
                                        });
                                        vm.queryList();
                                        vm.dialogForm.visible = false;
                                    } else {
                                        this.$message({
                                            type: "error",
                                            message: res.msg,
                                            center: true
                                        });
                                    }
                                });
                                //
                            })
                            .catch(() => {
                            });
                    } else {
                        this.$notify({
                            type: "warning",
                            title: "验证不通过，请检查错误提示"
                        });
                        return false;
                    }
                });
            },

            changeState(row) {
                let vm = this;
                let data = {id: row.id, operation: row.status};
                let msg =
                    row.status == 1
                        ? "你确定禁用此线上入款配置吗？"
                        : "你确定开启此线上入款配置吗？";
                let type = row.status == 1 ? "error" : "info";
                this.$confirm(msg, "操作提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    center: true,
                    type: type
                })
                    .then(() => {
                        this.loading = true;
                        depositsConf.changeOnlPayState(data).then(res => {
                            this.loading = false;
                            if (res.code == 200) {
                                this.$message({
                                    type: "success",
                                    message: res.msg,
                                    center: true
                                });
                                vm.queryList();
                            } else {
                                this.$message({
                                    type: "error",
                                    message: res.msg,
                                    center: true
                                });
                            }
                        });
                        //
                    })
                    .catch(() => {
                    });
            },
            deleteConf(id) {
                let vm = this;
                let data = {id: id};
                this.$confirm("你确定删除此线上入款配置吗？", "操作提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    center: true,
                    type: "error"
                })
                    .then(() => {
                        this.loading = true;
                        depositsConf.deletePayMerchant(data).then(res => {
                            this.loading = false;
                            if (res.code == 200) {
                                this.$message({
                                    type: "success",
                                    message: "删除成功！",
                                    center: true
                                });
                                vm.queryList();
                            } else {
                                this.$message({
                                    type: "error",
                                    message: res.msg,
                                    center: true
                                });
                            }
                        });
                        //
                    })
                    .catch(() => {
                    });
            },
            editDepositsPrams() {
                let vm = this;
                depositsConf.showSiteAmountConfig().then(res => {
                    if (res.code == 200) {
                        if (res.data !== null) {
                            vm.formData2.id = res.data.id;
                            if (res.data.moneyList !== null) {
                                let moneyList = JSON.parse("[" + res.data.moneyList + "]");
                                for (let item in vm.dialogForm2.money) {
                                    if (moneyList[item]) {
                                        vm.dialogForm2.money[item] = moneyList[item];
                                    } else {
                                        vm.dialogForm2.money[item] = "";
                                    }
                                }
                                this.dialogForm2.moneyA = this.dialogForm2.money[0];
                                this.dialogForm2.moneyB = this.dialogForm2.money[1];
                                this.dialogForm2.moneyC = this.dialogForm2.money[2];
                                this.dialogForm2.moneyD = this.dialogForm2.money[3];
                            }
                            if (res.data.rechargeSort) {
                                let sortArr = res.data.rechargeSort.split(',');
                                this.dialogForm2.paySort1 = sortArr[0];
                                this.dialogForm2.paySort2 = sortArr[1];
                                this.dialogForm2.paySort3 = sortArr[2];
                                this.dialogForm2.paySort4 = sortArr[3];
                                this.dialogForm2.paySort5 = sortArr[4];
                                this.dialogForm2.paySort6 = sortArr[5];
                                this.dialogForm2.paySort7 = sortArr[6];
                                this.dialogForm2.paySort8 = sortArr[7];
                                this.dialogForm2.paySort9 = sortArr[8];
                                this.dialogForm2.paySort10 = sortArr[9];
                            }
                        }
                        this.dialogForm2.visible = true;
                    } else {
                        this.$message.error(res.msg);
                    }
                });
            },
            updateParams(formName) {
                this.dialogForm2.money[0] = this.dialogForm2.moneyA;
                this.dialogForm2.money[1] = this.dialogForm2.moneyB;
                this.dialogForm2.money[2] = this.dialogForm2.moneyC;
                this.dialogForm2.money[3] = this.dialogForm2.moneyD;
                let temp = "";
                for (let item in this.dialogForm2.money) {
                    if (item > 0) {
                        temp += ",";
                    }
                    if (this.dialogForm2.money[item] !== "") {
                        temp += this.dialogForm2.money[item].toString();
                    } else {
                        temp += "0";
                    }
                }
                this.formData2.moneyList = temp;   //整理后的充值金额

                let sortArr = [];
                sortArr.push(parseInt(this.dialogForm2.paySort1));
                sortArr.push(parseInt(this.dialogForm2.paySort2));
                sortArr.push(parseInt(this.dialogForm2.paySort3));
                sortArr.push(parseInt(this.dialogForm2.paySort4));
                sortArr.push(parseInt(this.dialogForm2.paySort5));
                sortArr.push(parseInt(this.dialogForm2.paySort6));
                sortArr.push(parseInt(this.dialogForm2.paySort7));
                sortArr.push(parseInt(this.dialogForm2.paySort8));
                sortArr.push(parseInt(this.dialogForm2.paySort9));
                sortArr.push(parseInt(this.dialogForm2.paySort10));
                let sortSet = new Set(sortArr);
                if (sortArr.length != sortSet.size) {
                    this.$message.warning('充值排序不可输入重复的数值，请修改');
                    return;
                }
                let temp2 = sortArr.join(',');
                this.formData2.rechargeSort = temp2; //整理后的充值排序
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.modalLoading2 = true;
                        depositsConf.addOrUpdateSiteAmount(this.formData2).then(res => {
                            this.modalLoading2 = false;
                            if (res.code == 200) {
                                this.$message.success(res.msg);
                            } else {
                                this.$message.error({title: res.msg});
                            }
                            this.dialogForm2.visible = false;
                        });
                    } else {
                        this.$notify({
                            type: "warning",
                            title: "验证不通过，请检查错误提示"
                        });
                        return false;
                    }
                });
            },
            close() {
                //表单弹窗点击关闭解除验证
                this.$refs.formData.clearValidate();
            },
            closeT() {
                //表单弹窗点击关闭解除验证
                this.$refs.dialogForm2.clearValidate();
            },
            sizeChangeHandle(val) {
                this.pageSize = val;
                this.queryList();
            }, //分页当前条数变更
            currentChangeHandle(val) {
                this.pageNum = val;
                this.queryList();
            }, //分页  页码改动
            gitFinance() { //解决window.setTimeout还是有问题 12514
                this.$nextTick(()=> {
                    this.dialogForm.levelList = [];
                    this.dialogForm.labelList = [];
                    for (let levelsItem of this.levels) {
                        this.dialogForm.levelList.push(levelsItem.id);
                    }
                    for (let labelsItem of this.labels) {
                        this.dialogForm.labelList.push(labelsItem.id);
                    }
                },3000)
            }
        },
        mounted() {
            this.queryList();
            this.initPayChannel();
            this.gitFinance();
        },
        activated() {
            this.queryList();
            this.initPayChannel();
            this.gitFinance();
        },
    };
</script>

<style lang='scss' scoped>
  .label {
    text-align: right;
    color: rgb(96, 98, 102);
    font-size: 14px;
  }

  .line {
    text-align: center;
  }

  .form-group {
    padding: 13px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }

  .form-group:hover,
  .form-group:focus {
    border-color: #409eff;
  }
</style>


