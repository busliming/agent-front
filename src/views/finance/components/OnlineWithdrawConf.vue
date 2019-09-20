<template>
    <div class="onl-withdraw">
        <el-form label-width="90px">
            <el-row type="flex" justify="space-between">
                <el-col :span="6">
                    <el-form-item label="商户名称">
                        <el-input v-model="bankName" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="支付类型">
                        <el-select v-model="bankID" clearable>
                            <el-option value="" label="全部">全部</el-option>
                            <el-option
                                    v-for="item in dialogForm.drawTypeList"
                                    :key="item.drawName"
                                    :value="item.id"
                                    :label="item.drawName">
                            </el-option>
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
            <el-button size="medium" type="primary" icon="el-icon-circle-plus" @click='addConf'>
                新增出款商户
            </el-button>
        </el-row>
        <el-table
                border
                fit
                stripe
                v-loading="loading"
                :data='tableData1'
                style="margin-top:15px"
                :cell-style="{textAlign:'center'}"
                :header-cell-style="{textAlign:'center'}"
        >
            <el-table-column
                    prop="merchantName"
                    label="商户名称"
            ></el-table-column>
            <el-table-column
                    prop="drawName"
                    label="支付类型"
            >
                <!--<template slot-scope="{row}">
                    <span v-if="row.drawType == 1">银行卡</span>
                    <span v-if="row.drawType == 2">支付宝</span>
                </template>-->
            </el-table-column>
            <el-table-column
                    prop="merchantNo"
                    label="商户号"
            ></el-table-column>
            <el-table-column
                    prop="status"
                    label="状态"
            >
                <template slot-scope="scope">
                    <el-tag
                            :type="scope.row.status == 1 ? 'success' : 'danger'"
                            disable-transitions>{{ (scope.row.status == 1)? '正常' : '禁用' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column
                    prop="action"
                    label="操作"
                    width="220"
            >
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            @click="editConf(scope.row)">编辑
                    </el-button>
                    <el-button
                            size="mini"
                            :type="scope.row.status == 1 ? 'danger' : 'success'"
                            @click="changeState(scope.row)">{{ (scope.row.status == 1)? '禁用' : '开启' }}
                    </el-button>
                    <el-button
                            size="mini"
                            type="danger"
                            @click="deleteConf(scope.row.id)">删除
                    </el-button>
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
                    :total="total">
            </el-pagination>
        </el-row>

        <!-- 弹框 -->
        <el-dialog
                :title="(dialogForm.state == 'add'?'新增线上出款值配置':'编辑线上出款值配置')"
                :visible.sync="dialogForm.visible"
                :close-on-click-modal="false"
                @close="close"
                center
                top="2vh"
        >
            <el-form
                    v-loading="modalLoading"
                    label-width="140px"
                    :model="formData"
                    ref="formData"
                    :rules="formRules"

            >
                <el-form-item
                        label="支付类型："
                        prop="drawSystemId"
                >
                    <el-select v-model.number="formData.drawSystemId">
                        <el-option
                                v-for="item in dialogForm.drawTypeList"
                                :key="item.drawName"
                                :value="item.id"
                                :label="item.drawName">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item
                        label="商户名称："
                        prop="merchantName"
                >
                    <el-input placeholder="请输入商户名称" v-model="formData.merchantName"></el-input>
                </el-form-item>

                <el-form-item
                        label="商户号："
                        prop="merchantNo"
                >
                    <el-input placeholder="请输入商户号" v-model="formData.merchantNo"></el-input>
                </el-form-item>

                <el-form-item
                        label="密钥："
                        prop="merchantKey"
                >
                    <el-input placeholder="请输入密钥" v-model="formData.merchantKey"></el-input>
                </el-form-item>

                <el-form-item
                        label="公钥："
                        prop="merchantConsole"
                >
                    <el-input placeholder="请输入公钥" v-model="formData.merchantConsole"></el-input>
                </el-form-item>

                <el-form-item
                        label="支付网关："
                        prop="gateway"
                >
                    <el-input placeholder="请输入支付网关" v-model="formData.gateway"></el-input>
                </el-form-item>

                <el-form-item
                        label="周末T0手续费："
                        required
                >

                    <el-row>
                        <el-col :span="11">
                            <el-form-item prop="weekRateType">
                                <el-select v-model.number="formData.weekRateType">
                                    <el-option :value="1" label="百分比收取">百分比收取</el-option>
                                    <el-option :value="2" label="固定收取">固定收取</el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>


                    <template v-if="formData.weekRateType == 1">
                        <el-row>
                            <el-col :span="11">
                                <el-form-item prop="weekRatePercent">
                                    <el-input type="number" placeholder="请输入" v-model.number="formData.weekRatePercent"
                                              style="width: 100%;"
                                    >
                                        <template slot="append">%</template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col class="line" :span="2" align="center">-</el-col>
                            <el-col :span="11">
                                <el-form-item prop="weekLestRate">
                                    <el-input type="number" placeholder="请输入最低收取" v-model.number="formData.weekLestRate"
                                              style="width: 100%;">
                                        <template slot="append">元</template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </template>
                    <template v-if="formData.weekRateType == 2">
                        <el-row>
                            <el-col :span="11">
                                <el-form-item prop="weekLestRate">
                                    <el-input type="number" placeholder="请输入最低收取" v-model.number="formData.weekLestRate"
                                              style="width: 100%;">
                                        <template slot="append">元</template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </template>



                </el-form-item>

                <el-form-item
                        label="手续费："
                        required
                >
                    <el-row>
                        <el-col :span="11">
                            <el-form-item prop="rateType">
                                <el-select v-model.number="formData.rateType">
                                    <el-option :value="1" label="百分比收取">百分比收取</el-option>
                                    <el-option :value="2" label="固定收取">固定收取</el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <template v-if="formData.rateType == 1">
                        <el-row>
                            <el-col :span="11">
                                <el-form-item prop="ratePercent">
                                    <el-input type="number" placeholder="请输入" v-model.number="formData.ratePercent"
                                              style="width: 100%;">
                                        <template slot="append">%</template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col class="line" :span="2" align="center">-</el-col>
                            <el-col :span="11">
                                <el-form-item prop="lestRate">
                                    <el-input type="number" placeholder="请输入最低收取" v-model.number="formData.lestRate"
                                              style="width: 100%;">
                                        <template slot="append">元</template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </template>
                    <template v-if="formData.rateType == 2">
                        <el-row>
                            <el-col :span="11">
                                <el-form-item prop="lestRate">
                                    <el-input type="number" placeholder="请输入最低收取" v-model.number="formData.lestRate"
                                              style="width: 100%;">
                                        <template slot="append">元</template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </template>

                </el-form-item>

                <el-form-item
                        label="手续费精度保留："
                        prop="valueType"
                >
                    <el-select v-model.number="formData.valueType">
                        <el-option :value="1" label="四舍五入">四舍五入</el-option>
                        <el-option :value="2" label="向下取整">向下取整</el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="支付限额：" required>
                    <el-col :span="11">
                        <el-form-item prop="minQuota">
                            <el-input type="number" v-model.number="formData.minQuota" style="width: 100%;"
                                      placeholder="最低">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="line" :span="2" align="center">-</el-col>
                    <el-col :span="11">
                        <el-form-item prop="maxQuota">
                            <el-input type="number" placeholder="最高" v-model.number="formData.maxQuota"
                                      style="width: 100%;">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-form-item>

                <el-form-item label="会员等级：" required>
                    <el-checkbox
                            :indeterminate="dialogForm.isAllLevels"
                            v-model="dialogForm.checkAllLevels"
                            @change="checkAllLevelsEv"
                    >
                        全选/全不选
                    </el-checkbox>
                    <div class="form-group">
                        <el-form-item prop="userLevel">
                            <el-checkbox-group
                                    v-if="levels"
                                    v-model="dialogForm.checkedLevels"
                                    @change="checkLevelEv"
                                    size="medium"
                                    class="flexdisplaydiv">
                                <el-checkbox
                                        v-for="(level,index) in levels"
                                        :label="level.id"
                                        :key="index"
                                        :value="level.id"
                                        border>
                                    {{level.levelName}}
                                </el-checkbox>
                            </el-checkbox-group>
                            <template v-else>
                                没有会员等级，清新僧！
                            </template>
                        </el-form-item>
                    </div>
                </el-form-item>

                <el-form-item
                        label="状态："
                        prop="status"
                >
                    <el-select v-model.number="formData.status">
                        <el-option label="正常" :value="true"></el-option>
                        <el-option label="禁用" :value="false"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item
                        label="充值说明"
                        prop="attr1"
                >
                    <el-input type="textarea" :rows="2" v-model="formData.attr1"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogForm.visible = false">取 消</el-button>
                <el-button type="primary" @click="submit('formData')" :loading="modalLoading">保 存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import depositsConf from '@/request/finance/depositsConf'
    import validator from '@/tool/validate'

    export default {
        name: 'AgentChargeConf',
        props: ['levels'],
        data() {
            let maxQuotaCheck = (r, v, c) => {
                if (!v) {
                    c(new Error('请输入最高金额'));
                }
                if (parseInt(v) < this.formData.minQuota) {
                    c(new Error('最高金额不能小于最低金额'));
                } else if (v < 0) {
                    c(new Error('最高金额不能小于0'));
                } else {
                }
                c();
            };
            return {
                //查询条件
                bankName:'', //商户名称
                bankID:'', //支付类型
                status:2, //状态  默认全部 1启动 0禁用

                tableData1: [],
                loading: false,
                modalLoading: false,

                dialogForm: {
                    visible: false,
                    state: 'add', //add新增  edit编辑
                    drawTypeList: [],
                    drawSystemId: '',
                    isAllLevels: false,
                    checkAllLevels: '',
                    checkedLevels: [],
                    levelList: [],
                    isAllLabels: false,
                    checkAllLabels: '',
                    checkedLabels: [],
                    labelList: []
                },

                formData: {
                    id: '',
                    // drawType: '', //银行卡出款
                    // create_by: '',
                    drawSystemId: null,   //支付渠道
                    merchantName: '',   //商户名称
                    merchantNo: '',     //商户号
                    merchantKey: '',    //密钥
                    merchantConsole: '',    //公钥
                    gateway: '',    //支付网关
                    minQuota: null,   //支付限额 最小
                    maxQuota: null,   //支付限额 最大
                    status: true,     //状态
                    weekRateType: null,   //周末T0手续费 类型（1:百分比 2：固定)
                    weekRatePercent: null,    //周末出款手续费百分比
                    weekLestRate: null,   //周末T0手续费
                    rateType: null,   //手续费 类型（1:百分比 2：固定)
                    lestRate: null,   //手续费
                    ratePercent: null,    // 平时出款手续费百分比
                    valueType: null,  //手续费精度保留（1:向下取值 2：四舍五入
                    userLevel: '',  //会员等级
                    attr1: '',  //充值说明
                },

                pageNum: 1,
                pageSize: 10,
                total: 0,

                //表单验证
                formRules: {
                    drawSystemId: [
                        {required: true, message: '请选择支付类型', trigger: 'change'},
                    ],
                    merchantName: [
                        {validator: validator.merchantNamehove, trigger: 'change'},
                    ],
                    merchantNo: [
                        {validator: validator.merchantNohove, trigger: 'change'},
                    ],
                    merchantKey: [
                        {required: true, message: '请输入密钥', trigger: 'blur'},
                        // {validator: validator.merchantKeyhove, trigger: 'change'},
                    ],
                    // merchantConsole: [
                    //     {validator: validator.merchantConsolehove, trigger: 'change'},
                    // ],
                    gateway: [
                        {validator: validator.gatewayhove, trigger: 'change'},
                    ],
                    weekRateType: [
                        {required: true, message: '请选择周末T0手续费', trigger: 'change'},
                    ],
                    weekRatePercent: [
                        {required: true, message: '请输入', trigger: 'change'},
                    ],

                    weekLestRate: [
                        {validator: validator.amountck, trigger: 'change'},
                    ],
                    rateType: [
                        {required: true, message: '请选择手续费', trigger: 'change'},
                    ],

                    ratePercent: [
                        {required: true, message: '请输入', trigger: 'change'},
                    ],

                    lestRate: [
                        {validator: validator.amountck, trigger: 'change'},
                    ],
                    valueType: [
                        {required: true, message: '请选择手续费精度保留', trigger: 'change'},
                    ],


                    minQuota: [//金额
                        {validator: validator.minQuotaCheck, trigger: 'change'}
                    ],
                    maxQuota: [
                        {validator: maxQuotaCheck, trigger: 'change'}
                    ],
                    userLevel: {required: true, message: '请选择会员等级', trigger: 'change'},
                    status: {required: true, message: '请选择状态', trigger: 'change'},
                    attr1: {validator: validator.remarks, trigger: 'change'}
                },


            }
        },
        watch: {
            'dialogForm.checkedLevels'(val) {
                let str = '';
                for (let k in val) {
                    if (k > 0)
                        str += ',';
                    str += val[k].toString();
                }
                this.formData.userLevel = str;
            },
            'levels'(val){
                console.log(val);
                this.dialogForm.levelList = [];
                if(val.length>0 && this.dialogForm.levelList.length == 0){
                    for (let levelsItem of this.levels){
                        this.dialogForm.levelList.push(levelsItem.id);
                    }
                }
            },
        },
        methods: {
            searchHandle(){// 线上出款列表
                this.pageNum = 1;
                this.queryList();
            },
            queryList() {
                this.loading = true;
                let data = {
                    "conditionsMap": {
                        bankName: this.bankName,
                        bankID: this.bankID,
                        status: this.status
                    },
                    "limit": this.pageSize,
                    "offset": (this.pageNum -1)*this.pageSize,
                    "sort": "createDate",
                    "sortOrder": "desc"
                };
                depositsConf.getListByOnlWithdrawMerchant(data).then(res => {
                    this.tableData1 = res.rows;
                    this.pageSize = res.limit;
                    this.pageNum = res.offset/res.limit +1;
                    this.total = res.total;
                    this.loading = false;
                })
            },
            //获取支付类型
            initWithdrawChannel() {
                let vm = this;
                depositsConf.initWithdrawChannel().then(res => {
                    vm.dialogForm.drawTypeList = res.data;
                });
            },
            checkAllLevelsEv(val) {
                this.dialogForm.checkedLevels = val ? this.dialogForm.levelList : [];
                this.dialogForm.isAllLevels = false;
            },
            checkLevelEv(val) {
                let checkedCount = val.length;
                this.dialogForm.checkAllLevels = checkedCount === this.dialogForm.levelList.length;
                this.dialogForm.isAllLevels = checkedCount > 0 && checkedCount < this.dialogForm.levelList.length;
            },
            checkAllLabelsEv(val) {
                this.dialogForm.checkedLabels = val ? this.dialogForm.labelList : [];
                this.dialogForm.isAllLabels = false;
            },
            checkLabelEv(val) {
                let checkedCount = val.length;
                this.dialogForm.checkAllLabels = checkedCount === this.dialogForm.labelList.length;
                this.dialogForm.isAllLabels = checkedCount > 0 && checkedCount < this.dialogForm.labelList.length;
            },
            // 添加配置
            addConf() {
                this.setModalData({});
                this.initWithdrawChannel();
                this.dialogForm.state = 'add';
                this.dialogForm.visible = true;
                //this.dialogForm.checkAllLabels=false;
                this.dialogForm.checkAllLevels=false;
            },
            // 修改配置
            editConf(row) {
                let vm = this;
                depositsConf.getOnlWithdrawMerchantById(row).then(res => {
                    if (res.code == 200) {
                        vm.setModalData(res.data);
                        vm.dialogForm.state = 'edit';
                        vm.dialogForm.visible = true;
                    }
                    else {
                        this.$message({
                            type: 'error',
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
                //then set form data
                for (let key in vm.formData) {
                    if (vm.formData.hasOwnProperty(key)) {
                        vm.formData[key] = data[key];
                    }
                }

                if (data.userLevel !== undefined && data.userLevel !== null) {
                    if (data.userLevel.length > 0) {
                        var charcode=  data.userLevel.substr(data.userLevel.length-1,1)
                        if(charcode==","){
                            data.userLevel=data.userLevel.slice(0,-1);
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
                    vm.dialogForm.isAllLevels = false
                }
                // if (data.userLabel !== undefined && data.userLabel !== null) {
                //     if (data.userLabel.length > 0) {
                //         let temp = JSON.parse('[' + data.userLabel + ']');
                //         for (let i in temp) {
                //             if (this.dialogForm.labelList.indexOf(temp[i]) !== -1) {
                //                 temp[i] = parseInt(temp[i], 10);
                //             } else {
                //                 temp.splice(i, 1)
                //             }
                //         }
                //         vm.dialogForm.checkedLabels = temp;
                //         vm.checkLabelEv(temp);
                //     }
                // } else {
                //     vm.dialogForm.isAllLabels = false
                // }
            },
            // 保存信息
            submit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let vm = this;
                        if (this.formData.weekRateType == 2) {
                            this.formData.weekRatePercent = this.formData.weekLestRate
                        }
                        if (this.formData.rateType == 2) {
                            this.formData.ratePercent = this.formData.lestRate
                        }
                        this.$confirm('你确定保存？', '操作提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            center: true,
                            type: 'info'
                        }).then(() => {
                            this.modalLoading = true;
                            let levelarr = [];
                            if(vm.formData.userLevel!=''&&vm.formData.userLevel!=undefined&&vm.formData.userLevel!=null) {
                                levelarr = Array.from(new Set(vm.formData.userLevel.split(","))); //数组去重
                                vm.formData.userLevel = levelarr.join(",");
                            }
                            depositsConf.submitOnlWithdrawConf(vm.formData).then(res => {
                                this.modalLoading = false;
                                if (res.code == 200) {
                                    this.$message({
                                        type: 'success',
                                        message: res.msg,
                                        center: true
                                    });
                                    vm.queryList();
                                    vm.dialogForm.visible = false;
                                }
                                else {
                                    this.$message({
                                        type: 'error',
                                        message: res.msg,
                                        center: true
                                    });
                                }
                            });
                            //
                        }).catch(() => {
                        });
                    } else {
                        this.$notify({
                            type: 'warning',
                            title: '验证不通过，请检查错误提示'
                        });
                        return false;
                    }


                })


            },

            close() { //表单弹窗点击关闭解除验证
                this.$refs.formData.clearValidate();
            },

            changeState(row) {
                let vm = this;
                let data = {id: row.id, operation: row.status};
                let msg = (row.status == 1) ? '你确定禁用此线上出款配置吗？' : '你确定开启此线上出款配置吗？';
                let type = (row.status == 1) ? 'error' : 'info';
                this.$confirm(msg, '操作提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    center: true,
                    type: type
                }).then(() => {
                    this.loading = true;
                    depositsConf.changeOnlWithdrawConf(data).then(res => {
                        this.loading = false;
                        if (res.code == 200) {
                            this.$message({
                                type: 'success',
                                message: res.msg,
                                center: true
                            });
                            vm.queryList()
                        }
                        else {
                            this.$message({
                                type: 'error',
                                message: res.msg,
                                center: true
                            });
                        }
                    });
                    //
                }).catch(() => {
                });
            },
            deleteConf(id) {
                let vm = this;
                let data = {id: id};
                this.$confirm('你确定删除此线上出款配置吗？', '操作提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    center: true,
                    type: 'error'
                }).then(() => {
                    this.loading = true;
                    depositsConf.deleteWithdrawConf(data).then(res => {
                        this.loading = false;
                        if (res.code == 200) {
                            this.$message({
                                type: 'success',
                                message: '删除成功！',
                                center: true
                            });
                            vm.queryList()
                        }
                        else {
                            this.$message({
                                type: 'error',
                                message: res.msg,
                                center: true
                            });
                        }
                    });
                    //
                }).catch(() => {
                });
            },
            sizeChangeHandle(sz) {
                this.pageSize = sz;
                this.queryList();
            }, //分页当前条数变更
            currentChangeHandle(crt) {
                this.pageNum = crt;
                this.queryList();
            }, //分页  页码改动
            gitFinance() { //解决window.setTimeout还是有问题 12514
                this.$nextTick(()=> {
                    this.dialogForm.levelList = [];
                    for (let levelsItem of this.levels) {
                        this.dialogForm.levelList.push(levelsItem.id);
                    }
                },3000)
            }
        },
        mounted() {
            this.queryList();
            this.initWithdrawChannel();
            this.gitFinance();
        },
        activated() {
            this.queryList();
            this.initWithdrawChannel();
            this.gitFinance();
        }
    }
</script>

<style lang='scss' scoped>
    .label {
        text-align: right;
        color: rgb(96, 98, 102);
        font-size: 14px;
    }

    .line {
        text-align: center
    }

    .form-group {
        padding: 13px;
        border: 1px solid #ddd;
        border-radius: 5px
    }

    .form-group:hover, .form-group:focus {
        border-color: #409EFF;
    }
</style>


