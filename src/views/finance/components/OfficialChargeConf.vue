<template>
    <div>
        <el-form label-width="90px">
            <el-row type="flex" justify="space-between">
                <el-col :span="6">
                    <el-form-item label="银行名称">
                        <el-input v-model="queryChantName"
                                  clearable
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="卡号">
                        <el-input v-model="queryChantAccount"
                                  clearable
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="状态">
                        <el-select v-model="queryStatus">
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
                新增入款银行卡
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
                    prop="chantName"
                    label="银行名称"
            ></el-table-column>
            <el-table-column
                    prop="chantAccount"
                    label="卡号"
            ></el-table-column>
            <el-table-column
                    prop="userLevel"
                    label="会员等级"
                    :formatter="displayLevels"
            ></el-table-column>
            <el-table-column
                    prop="state"
                    label="状态"
            >
                <template slot-scope="scope">
                    <el-tag
                            :type="scope.row.state == '1' ? 'success' : 'danger'"
                            disable-transitions>{{ (scope.row.state == 1)? '正常' : '禁用' }}
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
                            :type="scope.row.state == 1 ? 'danger' : 'success'"
                            @click="changeState(scope.row)">{{ (scope.row.state == 1)? '禁用' : '开启' }}
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

        <!-- 官方入款配置对话框 -->
        <el-dialog
                :title="(dialogForm.state == 'add'?'新增官方入款值配置':'编辑官方入款值配置')"
                :visible.sync="dialogForm.visible"
                :close-on-click-modal="false"
                @close="close"
                center
                top="2vh"
        >
            <el-form
                    v-loading="modalLoading"
                    label-width="120px"
                    :model="formData"
                    ref="formData"
                    :rules="formRules"
            >
                <el-form-item
                        label="银行名称："
                        prop="chantName"
                >
                    <el-input placeholder="请输入银行名称" v-model="formData.chantName"></el-input>
                </el-form-item>
                <el-form-item
                        label="银行卡号："
                        prop="chantAccount"
                >
                    <el-input placeholder="请输入银行卡号" v-model="formData.chantAccount"></el-input>
                </el-form-item>

                <el-form-item
                        label="户主名称："
                        prop="ower"
                >
                    <el-input placeholder="请输入户主名称" v-model="formData.ower"></el-input>
                </el-form-item>
                <el-form-item label="别名：" prop="alias">
                    <el-input placeholder="请输入别名" v-model="formData.alias"></el-input>
                </el-form-item>
                <el-form-item
                        label="开户银行："
                        prop="bankAccount"
                >
                    <el-input placeholder="请输入开户银行" v-model="formData.bankAccount"></el-input>
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

                <el-form-item label="会员标签：">
                    <el-checkbox
                            :indeterminate="dialogForm.isAllLabels"
                            v-model="dialogForm.checkAllLabels"
                            @change="checkAllLabelsEv"
                    >全选/全不选
                    </el-checkbox>

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
                                >
                                    {{label.labelName}}
                                </el-checkbox>
                            </el-checkbox-group>
                            <template v-else>
                                没有会员标签，请新增！
                            </template>
                        </el-form-item>
                    </div>
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
                                    v-if="(levels && levels.length >0)"
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

                <el-form-item label="状态：" prop="state">
                    <el-select v-model="formData.state" placeholder="请选择">
                        <el-option label="正常" :value="true"></el-option>
                        <el-option label="禁用" :value="false"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item
                        label="使用终端："
                        prop="interfaceType"
                >
                    <el-select v-model.number="formData.interfaceType" placeholder="请选择">
                        <el-option label="全部" :value="0"></el-option>
                        <el-option label="电脑端" :value="1"></el-option>
                        <el-option label="手机端" :value="2"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item
                        label="显示排序："
                        prop="sort"
                >
                    <el-input type="number" v-model.number="formData.sort" placeholder="数字越小排名越靠前"></el-input>
                </el-form-item>

                <el-form-item
                        label="充值说明"
                        prop="remark"
                >
                    <el-input type="textarea" :rows="2" v-model="formData.remark"></el-input>
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
        props: ['labels', 'levels', 'displayLevels'],
        data() {
            let maxQuotaCheck = (r, v, c) => {
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
            return {
                //查询条件
                queryChantName:'',//银行名称
                queryChantAccount:'',//卡号
                queryStatus:2,//状态 1正常 0禁用 2全部

                tableData1: [],
                loading: false,
                modalLoading: false,

                dialogForm: {
                    visible: false,
                    state: 'add', //add新增  edit编辑
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
                    chantName: '',
                    chantAccount: '',
                    ower: '',
                    bankAccount: '',
                    minQuota: null,
                    maxQuota: null,
                    state: true,
                    userLevel: '',
                    userLabel: '',
                    interfaceType: '',
                    sort: '',
                    remark: '',
                    alias:''
                },

                pageNum:1,
                pageSize:10,
                total:0,

                formRules: {
                    alias:[
                        {validator: validator.alias, trigger: ['blur','change']},
                    ],
                    chantName: [
                        {validator: validator.validateBankNamehave, trigger: 'change'},
                    ],
                    chantAccount: [ //bug单号2658 后改为10-20位长度校验
                        {validator: validator.validateBankAccounthave, trigger: 'change'},
                    ],
                    ower: [ // bug单号 2703 不做限制
                        {required:true,message:'请输入户主名称',trigger:'blur'}
                        // {validator: validator.validateNamehove, trigger: 'change'},
                    ],
                    bankAccount: [ //bug单号2724 不做长度限制
                        {required:true,message:'请输入开户行',trigger:'blur'}
                        // {validator: validator.bankAccount, trigger: 'change'},
                    ],
                    minQuota: [//金额
                        {validator: validator.minQuotaCheck, trigger: 'change'}
                    ],
                    maxQuota: [
                        {validator: maxQuotaCheck, trigger: 'change'}
                    ],
                    userLevel: {required: true, message: '请选择会员等级', trigger: 'change'},
                    // userLabel: {required: true, message: '请选择会员标签', trigger: 'change'},
                    state: {required: true, message: '请选择状态', trigger: 'change'},
                    interfaceType: {required: true, message: '请选择使用终端', trigger: 'change'},
                    // sort: {validator: validator.sortNum, trigger: 'change'},
                    remark: {validator: validator.remarks, trigger: 'change'}
                },

            }
        },
        watch: {
            'dialogForm.checkedLabels'(val) {
                let str = '';
                for (let k in val) {
                    if (k > 0)
                        str += ','
                    str += val[k].toString();
                }
                this.formData.userLabel = str;
            },
            'dialogForm.checkedLevels'(val) {
                let str = '';
                for (let k in val) {
                    if (k > 0)
                        str += ','
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
            'labels'(val){
                console.log(val);
                this.dialogForm.labelList = [];
                if(val.length>0 && this.dialogForm.labelList.length == 0){
                    for (let labelsItem of this.labels){
                        this.dialogForm.labelList.push(labelsItem.id);
                    }
                }
            },
        },
        methods: {
            searchHandle(){
                // 官方入款列表
                this.pageNum = 1;
                this.queryList();
            },
            queryList() {
                // tableHeight(this); //计算表格高度
                this.loading = true;
                let data = {
                    "conditionsMap": {
                        chantName: this.queryChantName,
                        chantAccount: this.queryChantAccount,
                        status: this.queryStatus
                    },
                    "limit": this.pageSize,
                    "offset": (this.pageNum -1)*this.pageSize,
                    "sort": "createDate",
                    "sortOrder": "desc"
                };
                depositsConf.getListByBank(data).then(res => {
                    console.log(res.rows);
                    this.tableData1 = res.rows;
                    this.pageNum = res.offset/res.limit +1;
                    this.pageSize = res.limit;
                    this.total = res.total;
                    this.loading = false;
                })
            },
            // 选择会员等级+标签事件
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
            // 添加代理充值配置
            addConf() {
                this.setModalData({});
                this.dialogForm.state = 'add';
                this.dialogForm.visible = true;
                this.dialogForm.checkAllLabels=false;
                this.dialogForm.checkAllLevels=false;
            },
            // 修改配置
            editConf(row) {
                console.log(this.tableData1);
                let vm = this;
                depositsConf.getAgentById(row).then(res => {
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
                // if (vm.formData.sort=== undefined || vm.formData.sort === '' || vm.formData.sort === null) {
                //     vm.formData.sort = vm.total + 1;
                // }else{
                //     vm.formData.sort = data.sort;
                // }
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
                if (data.userLabel !== undefined && data.userLabel !== null) {
                    if (data.userLabel.length > 0) {
                        var charcode=  data.userLabel.substr(data.userLabel.length-1,1)
                        if(charcode==","){
                            data.userLabel=data.userLabel.slice(0,-1);
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
                    vm.dialogForm.isAllLabels = false
                }
            },
            // 保存信息
            submit(formName) {
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$confirm('你确定保存？', '操作提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            center: true,
                            type: 'info'
                        }).then(() => {
                            this.modalLoading = true;
                            // if (vm.formData.sort === '' && (vm.total && vm.total!== null)) {
                            //     if (vm.formData.id !== '' && vm.formData.id !== undefined && vm.formData.id !== null){
                            //         vm.formData.sort = vm.total;
                            //     } else {
                            //         vm.formData.sort = vm.total + 1
                            //     }
                            // }
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
                            depositsConf.submitBank(vm.formData).then(res => {
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

                        }).catch((err) => {
                            console.log(err)
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
            // 禁用||开启
            changeState(row) {
                let vm = this;
                let data = {id: row.id, operation: row.state};
                let msg = (row.state == 1) ? '你确定禁用此官方入款配置吗？' : '你确定开启此官方入款配置吗？';
                let type = (row.state == 1) ? 'error' : 'info';
                this.$confirm(msg, '操作提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    center: true,
                    type: type
                }).then(() => {
                    this.loading = true;
                    depositsConf.changeAgentState(data).then(res => {
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
                }).catch(() => {});
            },
            // 删除配置
            deleteConf(id) {
                let vm = this;
                let data = {id: id};
                this.$confirm('你确定删除此官方入款配置吗？', '操作提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    center: true,
                    type: 'error'
                }).then(() => {
                    this.loading = true;
                    depositsConf.deleteAgent(data).then(res => {
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
                }).catch(() => {});
            },
            sizeChangeHandle(sz) {
                this.pageSize = sz;
                this.queryList();
            }, //分页当前条数变更
            currentChangeHandle(crt) {
                this.pageNum = crt;
                this.queryList();
            }, //分页  页码改动
            gitFinance(){ //解决window.setTimeout还是有问题 12514
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
            this.dialogForm.levelList=[];
            this.dialogForm.labelList=[];
            this.gitFinance();
        },
        activated(){
            this.queryList();
            this.dialogForm.levelList=[];
            this.dialogForm.labelList=[];
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
