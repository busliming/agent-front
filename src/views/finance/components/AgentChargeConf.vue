<template>
    <div>
        <el-row>
            <el-button
                    size="medium"
                    type="primary"
                    icon="el-icon-circle-plus"
                    @click='addConf'
            >
                新增代理充值
            </el-button>
            <el-button
                    size="medium"
                    type="default"
                    icon="el-icon-setting"
                    @click='editReportInfo'
            >
                举报人设置
            </el-button>
        </el-row>
        <el-table
                v-loading="loading"
                border
                fit
                stripe
                :data='tableData1'
                style="margin-top:15px"
                :cell-style="{textAlign:'center'}"
                :header-cell-style="{textAlign:'center'}"

        ><!--:max-height="TABLEMAXHEIGHT"-->
            <el-table-column
                    prop="chantName"
                    label="代理充值名称"
            ></el-table-column>
            <el-table-column
                    prop="chantAccount"
                    label="微信号码"
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

        <!-- 代理充值配置对话框 -->
        <el-dialog
                :title="(dialogForm.state == 'add'?'新增代理充值配置':'编辑代理充值配置')"
                :visible.sync="dialogForm.visible"
                @close="close"
                :close-on-click-modal="false"
                center
                top="2vh"
        >
            <el-form
                    v-loading="modalLoading"
                    label-width="100px"
                    :model="formData"
                    :rules="rules"
                    ref="formData"
            >
                <el-form-item
                        label="代理名称："
                        prop="merchantName"
                >
                    <el-input
                            placeholder="请输入代理名称"
                            v-model="formData.merchantName"
                    ></el-input>
                </el-form-item>
                <el-form-item
                        label="充值微信号："
                        prop="merchantNo"
                >
                    <el-input
                            placeholder="请输入微信号"
                            v-model="formData.merchantNo"
                    ></el-input>
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
                                没有会员等级，请新增！
                            </template>
                        </el-form-item>
                    </div>
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
                    <el-input
                            type="number"
                            v-model.number="formData.sort"
                            placeholder="数字越小排名越靠前"
                    ></el-input>
                </el-form-item>
                <el-form-item
                        label="充值说明"
                        prop="remark"
                >
                    <el-input type="textarea" :rows="2" v-model="formData.remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog('formData')">取 消</el-button>
        <el-button type="primary" @click="submit('formData')" :loading="modalLoading">保 存</el-button>
      </span>
        </el-dialog>

        <el-dialog title="举报人设置" :visible.sync="dialogForm2.visible" center width="400px" :close-on-click-modal="false">
            <el-form :model="formData2"
                     :rules="formRules2"
                     ref="formData2"
                     label-width="100px"
                     v-loading="modalLoading2">
                <el-form-item label="联系方式：" prop="accountType">
                    <el-select v-model.number="formData2.accountType">
                        <el-option :value="1" label="QQ">QQ</el-option>
                        <el-option :value="2" label="微信">微信</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="联系账号：" prop="account">
                    <el-input v-model="formData2.account"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="closeDialog('formData2')">取 消</el-button>
            <el-button size="mini" type="primary" @click="updateReportInfo('formData2')" :loading="modalLoading2">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
    import tableHeight from '@/tool/tableHeight'
    import depositsConf from '@/request/finance/depositsConf';
    import validator from '@/tool/validate';

    export default {
        name: 'AgentChargeConf',
        props: ['labels', 'levels', 'displayLevels'],
        data() {
            return {
                tableData1: [],
                loading: false,
                modalLoading: false,
                modalLoading2: false,

                dialogForm: {
                    visible: false,
                    state: 'add', //add新增  edit编辑
                    isAllLevels: false,
                    checkAllLevels: false,
                    checkedLevels: [],
                    levelList: [],
                    isAllLabels: false,
                    checkAllLabels: false,
                    checkedLabels: [],
                    labelList: []
                },
                formData: {
                    id: null,
                    merchantName: '',
                    merchantNo: '',
                    userLabel: '',
                    userLevel: '',
                    interfaceType: '',
                    sort: null,
                    remark: ''
                },

                dialogForm2: {
                    visible: false
                },
                formData2: {
                    account: '',
                    accountType: ''
                },
                formRules2: {
                    account: [
                        {required: true, message: '请输入联系账号', trigger: 'change'},
                        {max: 20, message: '输入账号最多20位', trigger: 'change'}
                    ],
                    accountType: [
                        {required: true, message: '请选择联系方式', trigger: 'change'},
                    ]
                },

                pageNum: 1,
                pageSize: 10,
                total: 0,


                rules: {
                    merchantName: [
                        {validator: validator.merchantName, trigger: 'change'}
                    ],
                    merchantNo: [
                        {validator: validator.validateWechathave, trigger: 'change'}
                    ],
                    // userLabel: [
                    //     {required: true, message: '请选择会员标签', trigger: 'change'}
                    // ],
                    userLevel: [
                        {required: true, message: '请选择会员等级', trigger: 'change'}
                    ],
                    interfaceType: [
                        {required: true, message: '请选择使用终端', trigger: 'change'}
                    ],
                    // sort: [
                    //     {validator: validator.sortNum, trigger: 'change'}
                    // ],
                    remark: {validator: validator.remarks, trigger: 'change'}

                },

                TABLEMAXHEIGHT: 0,
            }
        },
        watch: {
            'dialogForm.checkedLabels'(val) {
                let str = '';
                for (let k in val) {
                    if (k > 0)
                        str += ',';
                    str += val[k].toString();
                }
                this.formData.userLabel = str.trim(',');
            },
            'dialogForm.checkedLevels'(val) {
                let str = '';
                for (let k in val) {
                    if (k > 0)
                        str += ',';
                    str += val[k].toString();
                }
                this.formData.userLevel = str.trim(',');
            },
            'levels'(val){
                console.log(val);
                this.dialogForm.levelList=[];
                if(val.length>0 && this.dialogForm.levelList.length == 0){
                    for (let levelsItem of this.levels){
                        this.dialogForm.levelList.push(levelsItem.id);
                    }
                }
            },
            'labels'(val){
                console.log(val);
                this.dialogForm.labelList=[];
                if(val.length>0 && this.dialogForm.labelList.length == 0){
                    for (let labelsItem of this.labels){
                        this.dialogForm.labelList.push(labelsItem.id);
                    }
                }
            },
        },
        methods: {
            // 代理充值列表
            queryList() {
                this.loading = true;
                let data = {
                    "conditionsMap": {},
                    "limit": this.pageSize,
                    "offset": (this.pageNum - 1) * this.pageSize,
                    "sort": "createDate",
                    "sortOrder": "desc"
                }
                depositsConf.getListByAgent(data).then(res => {
                    this.loading = false;
                    this.tableData1 = res.rows;
                    this.total = res.total;
                    this.pageSize = res.limit;
                    this.pageNum = res.offset / res.limit + 1;
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
            // 添加配置
            addConf() {
                this.setModalData({});
                this.dialogForm.state = 'add';
                this.dialogForm.visible = true;
                this.dialogForm.checkAllLabels=false;
                this.dialogForm.checkAllLevels=false;
            },
            // 修改配置
            editConf(row) {
                let vm = this;
                window.setTimeout(()=>{
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
                },1000)
            },
            // 获取个配置信息
            setModalData(data) {
                let vm = this;
                console.log(data);
                //reset form data
                vm.dialogForm.checkedLevels = [];
                vm.dialogForm.checkedLabels = [];
                vm.checkLevelEv([]);
                vm.checkLabelEv([]);
                //then set form data
                for (let key in vm.formData) {
                    if (vm.formData.hasOwnProperty(key)) {
                        vm.formData[key] = data[key];
                    }
                }
                // if (vm.formData.sort === undefined || vm.formData.sort === '' || vm.formData.sort === null) {
                //     vm.formData.sort = vm.total + 1;
                // } else {
                //     vm.formData.sort = data.sort;
                // }
                if (data.userLevel !== undefined && data.userLevel !== null) {

                    if (data.userLevel.length > 0) {
                        // data.userLevel=data.userLevel.slice(0,-1);
                        var charcode=  data.userLevel.substr(data.userLevel.length-1,1)
                        if(charcode==","){
                            data.userLevel=data.userLevel.slice(0,-1);
                        }
                        let temp = JSON.parse('[' + data.userLevel + ']');
                        if(vm.dialogForm.levelList.length==0){
                            vm.dialogForm.levelList=[];
                            vm.dialogForm.levelList = vm.$store.getters.levelList;
                            /*for (let levelsItem of temp){
                                this.dialogForm.levelList.push(levelsItem);
                            }*/
                        }
                        console.log(vm.$store.getters.levelList);
                        console.log(vm.dialogForm.levelList);
                        /*for (let i in temp) {
                            if (this.dialogForm.levelList.indexOf(temp[i]) !== -1) {
                                temp[i] = parseInt(temp[i], 10);
                            } else {
                                temp.splice(i, 1)
                            }
                        }*/
                        var arrList=[];
                        for(var i=0;i<temp.length;i++){
                            for(var j=0;j<vm.dialogForm.levelList.length;j++){
                                if(vm.dialogForm.levelList[j]==temp[i]){
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
                        //debugger;
                        var charcode=  data.userLabel.substr(data.userLabel.length-1,1)
                        if(charcode==","){
                            data.userLabel=data.userLabel.slice(0,-1);
                        }
                        let temp1 = JSON.parse('[' + data.userLabel + ']');

                        if(vm.dialogForm.labelList.length==0){
                            vm.dialogForm.labelList=[];
                            vm.dialogForm.labelList =vm.$store.getters.labelList;
                            /*for (let labelsItem of temp){
                                this.dialogForm.labelList.push(labelsItem);
                            }*/
                        }
                        console.log(vm.$store.getters.labelList);
                        console.log(vm.dialogForm.labelList);
                        /*for (let i in temp) {
                            if (this.dialogForm.labelList.indexOf(temp[i]) !== -1) {
                                temp[i] = parseInt(temp[i], 10);
                            } else {
                                temp.splice(i, 1)
                            }
                        }*/
                        var arrList1=[];
                        for(var i=0;i<temp1.length;i++){
                            for(var j=0;j<vm.dialogForm.labelList.length;j++){
                                if(vm.dialogForm.labelList[j]==temp1[i]){
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

                vm.formData.merchantName = data.chantName;
                vm.formData.merchantNo = data.chantAccount;
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
                            vm.modalLoading = true;
                            console.log(vm.formData);
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
                            depositsConf.submitAgent(vm.formData).then(res => {
                                vm.modalLoading = false;
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

            // 禁用||开启状态
            changeState(row) {
                let vm = this;
                let data = {id: row.id, operation: row.state};
                let msg = (row.state == 1) ? '你确定禁用此代理充值配置吗？' : '你确定开启此代理充值配置吗？';
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
                    })
                }).catch(() => {
                });
            },
            // 删除配置
            deleteConf(id) {
                let vm = this;
                let data = {id: id};
                this.$confirm('你确定删除此代理配置吗？', '操作提示', {
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
                }).catch(() => {
                });
            },
            editReportInfo() {
                depositsConf.getReportInfo().then(res => {
                    if (res.code == 200) {
                        this.formData2.accountType = (res.data !== null) ? res.data.accountType : '';
                        this.formData2.account = (res.data !== null) ? res.data.account : '';
                        this.dialogForm2.visible = true
                    } else {
                        this.$message.error(res.msg);
                    }
                });
            },
            updateReportInfo(formData) {
                let vm = this;
                this.$refs[formData].validate((valid) => {
                    if (valid) {
                        this.modalLoading2 = true;
                        console.log(vm.formData2);
                        depositsConf.saveReportInfo(vm.formData2).then(res => {
                            this.modalLoading2 = false;
                            if (res.code == 200) {
                                this.$message.success(res.msg);
                                vm.dialogForm2.visible = false
                            } else {
                                this.$message.error(res.msg)
                            }
                        })
                    }
                    else {
                        return false;
                    }
                })
            },
            closeDialog(formData) {
                this.dialogForm.visible = false;
                this.dialogForm2.visible = false;
                this.$refs[formData].resetFields();
            },
            sizeChangeHandle(sz) { //分页当前条数变更
                this.pageSize = sz;
                this.queryList();
            },
            currentChangeHandle(crt) { //分页  页码改动
                this.pageNum = crt;
                this.queryList();
            },
            gitFinance(){ //解决window.setTimeout还是有问题 12514

                this.$nextTick(()=>{
                    this.dialogForm.levelList = [];
                    this.dialogForm.labelList = [];
                    for (let levelsItem of this.levels){
                        this.dialogForm.levelList.push(levelsItem.id);
                    }
                    for (let labelsItem of this.labels){
                        this.dialogForm.labelList.push(labelsItem.id);
                    }
                    console.log(this.dialogForm.levelList);
                    console.log(this.dialogForm.labelList);
                },8000)
            }
        },
        mounted() {
            this.dialogForm.levelList = [];
            this.dialogForm.labelList = [];
            this.gitFinance();
            window.setTimeout(()=>{
                this.queryList();
            },1000)

        },
        activated() {
            this.dialogForm.levelList = [];
            this.dialogForm.labelList = [];
            this.gitFinance();
            window.setTimeout(()=>{
                this.queryList();
            },1000)
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
