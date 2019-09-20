<template>
    <div>
        <el-row>
            <el-button size="medium" type="primary" icon="el-icon-circle-plus" @click='addQrCode'>
                添加固码配置
            </el-button>
        </el-row>

        <el-table
                border
                fit
                stripe
                v-loading="loading"
                :data='tableData6'
                style="margin-top:15px"
                :cell-style="{textAlign:'center'}"
                :header-cell-style="{textAlign:'center'}"
        >
            <el-table-column prop="bankType" label="固码类型" :formatter="displayQrType">
            </el-table-column>

            <el-table-column prop="qrCodeName" label="固码名称">
            </el-table-column>

            <el-table-column prop="qrCode" label="二维码图片">
                <template slot-scope="scope">
                    <el-button type="text" @click="previewQrCode(scope.row.qrCode)">预览</el-button>
                </template>
            </el-table-column>

            <el-table-column prop="userLevel" label="会员等级" :formatter="displayLevels">
            </el-table-column>

            <el-table-column prop="state" label="状态">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.state == '1' ? 'success' : 'danger'" disable-transitions>
                        {{ (scope.row.state == 1)? '正常' : '禁用' }}
                    </el-tag>
                </template>
            </el-table-column>

            <el-table-column prop="action" label="操作"
                             width="220"
            >
                <template slot-scope="scope">
                    <el-button size="mini" @click="editQrCode(scope.row)">
                        编辑
                    </el-button>
                    <el-button size="mini"
                               :type="scope.row.state == 1 ? 'danger' : 'success'"
                               @click="changeQrState(scope.row)">
                        {{ (scope.row.state == 1)? '禁用' : '开启' }}
                    </el-button>
                    <el-button size="mini" type="danger" @click="deleteQrCode(scope.row.id)">
                        删除
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

        <!-- 固码入款配置对话框 -->
        <el-dialog
                :title="(dialogForm.state == 'add'?'添加固码入款配置':'编辑固码入款配置')"
                :visible.sync="dialogForm.visible"
                :close-on-click-modal="false"
                center
                @close="dialogClosed"
                @closed="dialogClosed"
                top="2vh"
        >
            <el-form label-width="150px" :model="formData" ref="formData" :rules="formRules" v-loading="modalLoading">
                <el-form-item label="固码类型：" prop="bankType">
                    <el-select v-model.number="formData.bankType" placeholder="请选择">
                        <el-option label="支付宝收款码" :value="31"></el-option>
                        <el-option label="微信收款码" :value="32"></el-option>
                        <el-option label="QQ收款码" :value="33"></el-option>
                        <el-option label="云闪付收款码" :value="34"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="固码名称：" prop="qrCodeName">
                    <el-input placeholder="请输入固码名称" v-model="formData.qrCodeName" maxlength="15"></el-input>
                </el-form-item>

                <el-form-item label="二维码：" prop="qrCode">
                    <div class="form-group">
                        <el-upload
                                ref="uploader"
                                action='string'
                                :http-request='fileUpload'
                                :on-preview="handlePreview"
                                :before-upload="beforeFileUpload"
                                accept='image/*'
                                :file-list="fileList"
                                list-type="picture"
                                :disabled='fileList.length>0'
                        >
                            <el-button size="small" type="primary" slot="trigger"
                                       :disabled='fileList.length>0'
                            >{{fileList.length>0?'已选择':'点击上传'}}</el-button>
                            <el-button size="small" @click='delFile' type="danger"
                                       v-if="fileList.length>0"
                                       style="margin-left:10px;"
                            >删除已上传图片</el-button>
                            <div slot="tip" class="el-upload__tip">说明：支持上传JPG、PNG、GIF文件,大小500kb以内。点击链接可以预览</div>
                        </el-upload>
                    </div>
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
                                没有会员等级，请新增！
                            </template>
                        </el-form-item>
                    </div>
                </el-form-item>

                <el-form-item label="使用终端：" prop="interfaceType">
                    <el-select v-model.number="formData.interfaceType" placeholder="请选择">
                        <el-option label="全部" :value="0"></el-option>
                        <el-option label="电脑端" :value="1"></el-option>
                        <el-option label="手机端" :value="2"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="显示排序：" prop="sort">
                    <el-input type="number" v-model.number="formData.sort" placeholder="数字越小排名越靠前"
                    ></el-input>
                </el-form-item>

                <el-form-item label="充值说明" prop="remark">
                    <el-input type="textarea" :rows="2" v-model="formData.remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeDialog('formData')">取 消</el-button>
                <el-button type="primary" @click="submit('formData')" :loading="modalLoading">保 存</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    import depositsConf from '@/request/finance/depositsConf'
    import changeUrl from '@/tool/strUtil'
    import validator from '@/tool/validate'

    export default {
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
                tableData6: [],
                loading: false,
                modalLoading: false,

                fileList: [{
                    name: '',
                    url: ''
                }],
                uploading: false,

                pageSize:10,
                pageNum:1,
                total:0,

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
                    bankType: null,
                    qrCodeName: '',
                    qrCode: '',
                    minQuota: null,
                    maxQuota: null,
                    userLevel: '',
                    userLabel: '',
                    interfaceType: null,
                    sort: null,
                    remark: ''
                },
                fileImage:null,
                formRules: {
                    bankType: [
                        {required: true, message: '请选择固码类型', trigger: 'change'},
                    ],
                    qrCodeName: [
                        {required: true, message: '请输入固码名称', trigger: 'blur'},
                    ],
                    qrCode: [
                        {required: true, message: '请上传二维码', trigger: 'blur'},
                    ],
                    minQuota: [
                        {validator: validator.minQuotaCheck, trigger: 'blur'}
                    ],
                    maxQuota: [
                        {validator: maxQuotaCheck, trigger: 'blur'}
                    ],
                    userLevel: {validator: validator.userLevelCheck, trigger: 'blur'},
                    // userLabel: {validator: validator.userLabelCheck, trigger: 'blur'},
                    interfaceType: {required: true, message: '请选择使用终端', trigger: 'change'},
                    // sort: {required: true, message: '请输入显示排序', trigger: 'blur'},
                    remark: {max: 50, message: '输入不能超过50位', trigger: 'change'}
                }
            }
        },
        watch: {
            'formData.minQuota'(val) {
                if (val) {
                    val = val.toString();
                    // this.formData.minQuota = validate.toFixed2(val);
                    this.formData.minQuota = validator.rmvFirst0(val);
                }
            },
            'dialogForm.checkedLabels'(val) {
                let str = '';
                for (let k in val) {
                    if (k > 0)
                        str += ',';
                    str += val[k].toString();
                }
                this.formData.userLabel = str;
            },
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
            beforeFileUpload(file){ //图片上传之前检查格式
                if(file.type != "image/png" && file.type != "image/jpeg" && file.type != "image/bmp" && file.type != "image/gif"){
                    this.$message.warning({message:'图片格式只能是jpg/jpeg/png/bmp/gif其中的一种'});
                    return false;
                }
            },
            // 弹窗关闭
            dialogClosed() {
                this.$refs.uploader.clearFiles();
            },
            // 固码配置列表
            queryQrList() {
                this.loading = true;
                let data = {
                    "conditionsMap": {},
                    "limit": this.pageSize,
                    "offset": (this.pageNum -1)*this.pageSize,
                    "sort": "createDate",
                    "sortOrder": "desc"
                }
                depositsConf.getListByQrCode(data).then(res => {
                    this.loading = false;
                    this.tableData6 = res.rows;
                    this.total = res.total;
                    this.pageSize = res.limit;
                    this.pageNum = res.offset/res.limit +1;
                })
            },
            // 在列表里面显示固码类型
            displayQrType(row) {
                if (row.bankType === "31") {
                    return '支付宝收款码'
                }
                if (row.bankType === "32") {
                    return '微信收款码'
                }
                if (row.bankType === "33") {
                    return 'QQ收款码'
                }
                if (row.bankType === "34") {
                    return '云闪付收款码'
                }
            },
            // 再列表里面显示固码
            previewQrCode(url) {
                this.$alert('<img src="' + url + '" alt=""' +
                    ' style="width:200px;' +
                    'height:200px">',
                    '固码图片',
                    {
                        dangerouslyUseHTMLString: true,
                        center: true
                    }
                ).then(() => {})
                    .catch(() => {});
            },
            addQrCode() {
                this.setModalData({});
                this.dialogForm.state = 'add';
                this.dialogForm.visible = true;
                this.dialogForm.checkAllLabels=false;
                this.dialogForm.checkAllLevels=false;
            },
            editQrCode(row) {
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
            // 获取个配置信息
            setModalData(data) {
                let vm = this;
                this.dialogForm.checkedLevels = [];
                this.dialogForm.checkedLabels = [];
                this.checkLevelEv([]);
                this.checkLabelEv([]);

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
                if (data.qrCode != undefined) {
                    this.fileList = [{
                        name: data.qrCode,
                        url: data.qrCode
                    }]
                    this.fileImage = data.qrCode;

                } else {
                    this.fileList = []
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
            fileUpload(item){    //图片上传
                if(item.file.size > 512000){
                    this.$notify({
                        type:'warning',
                        title:'图片文件大小超过500kb，无法上传'
                    })
                    this.fileList = [];
                }else{
                    this.uploadFile(item.file,5)
                }
            },
            uploadFile(file,pathType){
                let data = {
                    file:file,
                    pathType:pathType,
                }

                depositsConf.uploadFile(data).then(res => {
                    if(res.code == 200){
                        /*this.fileList = [
                            {
                                name:res.data.url,
                                url:changeUrl(res.data.url)
                            }
                        ]
*/
                        this.formData.qrCode = pathType;//changeUrl(res.data.url)
                        this.fileImage = changeUrl(res.data.url);

                        this.$notify({
                            type:'success',
                            title:'图片上传成功'
                        })
                    }else{
                        this.fileList = []
                        this.formData.qrCode = '';
                        this.$notify({
                            type:'warning',
                            title:res.msg
                        })
                    }
                }).catch(err => {
                    console.log(err);
                    this.fileList = []
                })
            },
            //所有二维码上传事件
            handleProgress(event, file, fileList) {
                this.uploading = true;
            },
            handlePreview(file){
                let message = '<div style="width:370px;height:370px;background:url('+file.url+') no-repeat center;background-size:contain;" >';
                this.$alert(message, '预览', {
                    dangerouslyUseHTMLString:true,
                    closeOnClickModal:true,
                    closeOnPressEscape:true,
                    center:true
                }).catch(err => {})
            },
            delFile(){   //删除二维码
                this.fileList = [];
                this.formData.qrCode = '';
            },
            // handleSuccess(res, file, fileList) {
            //     this.uploading = false;
            //     if (res.code == 200) {
            //         this.$message({
            //             type: 'success',
            //             message: res.msg,
            //             center: true
            //         });
            //         this.formData.qrCode = '//' + res.data.url;
            //     }
            //     else {
            //         this.$message({
            //             type: 'error',
            //             message: res.msg,
            //             center: true
            //         });
            //         return false;
            //     }
            // },
            // handleError(err, file, fileList) {
            //     this.uploading = false;
            //     this.$message({
            //         type: 'error',
            //         message: err.msg,
            //         center: true
            //     });
            //     return false;
            // },
            // handleRemove(file, fileList) {
            //     file = null;
            //     fileList = null;
            //     this.fileList = [];
            //     this.formData.qrCode = null;
            // },
            // handleExceed() {
            //     this.$notify.error('只能上传一个文件');
            // },

            // 保存
            submit(formData) {

                let vm = this;
                this.$refs[formData].validate((valid) => {
                    if (valid) {
                        this.$confirm('你确定保存？', '操作提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            center: true,
                            type: 'info'
                        }).then(() => {
                            debugger;
                            this.modalLoading = true;
                            vm.formData.qrCode = this.fileImage!=null? this.fileImage.slice(this.fileImage.lastIndexOf('/')+1):null;//vm.formData.qrCode.slice(vm.formData.qrCode.lastIndexOf('/')+1);
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
                            depositsConf.submitQrCode(vm.formData).then(res => {
                                this.modalLoading = false;
                                if (res.code == 200) {
                                    this.$message({
                                        type: 'success',
                                        message: res.msg,
                                        center: true
                                    });
                                    vm.queryQrList();
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
                            return false;
                        });
                    } else {
                        return false;
                    }
                });
            },
            changeQrState(row) {
                let vm = this;
                let data = {id: row.id, operation: row.state};
                let msg = (row.state == 1) ? '你确定禁用此固码入款配置吗？' : '你确定开启此固码入款配置吗？';
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
                            vm.queryQrList()
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

            deleteQrCode(id) {
                let vm = this;
                let data = {id: id};
                this.$confirm('你确定删除此固码配置吗？', '操作提示', {
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
                            vm.queryQrList()
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
            sizeChangeHandle(val) {
                this.pageSize = val;
                this.queryQrList();
            }, //分页当前条数变更
            currentChangeHandle(val) {
                this.pageNum = val;
                this.queryQrList();
            }, //分页  页码改动
            closeDialog(formData) {
                this.dialogForm.visible = false;
                this.$refs[formData].resetFields();
            },
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
            this.queryQrList();
            this.gitFinance();
        },
        activated() {
            this.queryQrList();
            this.gitFinance();
        }
    }
</script>

<style lang="scss" scoped>

</style>
