<template>
    <el-card>
        <el-form :inline="true">
            <!--<el-form-item label="会员类型：">
                <el-select v-model="memberType" clearable>
                    <el-option label="单个会员" :value="1"></el-option>
                    <el-option label="全部会员" :value="2"></el-option>
                </el-select>
            </el-form-item>-->
            <el-form-item
                    prop="account"
            >
                <el-input
                        clearable
                        v-model='account'
                        style="width:340px"
                        maxlength="16"
                        placeholder="请输入">
                    <div slot="prepend">
                        <el-select v-model="accountType"  style="width:120px;">
                            <el-option label="会员ID" value="1"></el-option>
                            <el-option label="账号" value="2"></el-option>
                        </el-select>
                    </div>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button
                        type="primary"
                        size="medium"
                        icon="el-icon-search"
                        @click="searchHandle"
                >查询
                </el-button>
            </el-form-item>
        </el-form>
        <el-row type="flex" jusitify="space-between" style="align-items:center;">
            <el-col >
                <el-button size="medium" type="primary" @click='addBtnHandle'
                >
                    <i class="el-icon-circle-plus"></i>
                    <span>添加</span>
                </el-button>
                <!--<el-button size="medium" type="primary" @click='addBtnDelete' v-loading="deleteLoading"
                >
                    <i class=""></i>
                    <span>批量删除</span>
                </el-button>-->
            </el-col>
            <el-col style="height: 36px;line-height: 36px;" >
                <el-tag  style="height: 36px;line-height: 36px;float: right;">
                <div style="font-size: 14px;">调整会员输赢金额，代表玩家在游戏中派发或扣除奖励，调整的金额要收取费用，请谨慎调整</div>
                </el-tag>
            </el-col>
        </el-row>
        <el-table
                :data='tableData'
                style="width: 100%;margin-top:15px"
                :border="true"
                :fit="true"
                size="medium"
                stripe
                :cell-style="{textAlign:'center'}"
                :header-cell-style="{textAlign:'center'}"
                v-loading="tableLoading"
        >
            <!--<el-table-column
                    type="selection"
                    width="55"
            >
            </el-table-column>-->
            <el-table-column  width="100px"
                    prop="account"
                    label="游戏账号"
            ></el-table-column>
            <el-table-column  width="100px"
                    prop="accountId"
                    label="玩家ID"
            ></el-table-column>
            <el-table-column width="120px"
                             prop="winRateBattleBet"
                             label="对战类与下注类胜率"
                             sortable
            >
                <template slot-scope="scope" v-if="scope.row.winRateBattleBet>=0">
                    <div slot="reference" >
                        {{ scope.row.winRateBattleBet==0?'0%':scope.row.winRateBattleBet==null?'':scope.row.winRateBattleBet+'%'}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column width="75px"
                             prop="winRateFish"
                             label="捕鱼类胜率"
                             sortable
            >
                <template slot-scope="scope" v-if="scope.row.winRateFish>=0">
                    <div slot="reference" >
                        {{ scope.row.winRateFish==0?'0%':scope.row.winRateFish==null?'':scope.row.winRateFish+'%'}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column width="120px"
                    prop="winLose"
                    label="输赢"
                    sortable
            >
                <template slot-scope="scope">
                        <div slot="reference" :style="scope.row.winLose*1<0?'color: #5adbc9':'color:red '" >
                            {{scope.row.winLose | _moneyFormatterMin}}
                        </div>
                </template>
            </el-table-column>
            <el-table-column width="120px"
                             prop="leftWinLose"
                             label="剩余输赢"
                             sortable
            >
                <template slot-scope="scope">
                    <div slot="reference" :style="scope.row.leftWinLose*1<0?'color: #5adbc9':'color:red '" >
                        {{scope.row.leftWinLose | _moneyFormatterMax}}
                    </div>
                </template>
            </el-table-column>

            <el-table-column width="80px"
                    prop="controlCount"
                    label="历史控制次数"
                    sortable
            ></el-table-column>
            <el-table-column width="140px"
                    prop="totalWinLose"
                    label="累计盈亏"
                    sortable
            >
                <template slot-scope="scope">
                    <div slot="reference" :style="scope.row.totalWinLose*1<0?'color: #5adbc9':'color:red '" >
                        {{scope.row.totalWinLose | _moneyFormatterMax}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column width="120px"
                    prop="totalRecharge"
                    label="总充值"
                    sortable
            >
                <template slot-scope="scope">
                    {{scope.row.totalRecharge | _moneyFormatter}}
                </template>
            </el-table-column>
            <el-table-column width="120px"
                    prop="totalWithdrawal"
                    label="总取款"
                    sortable
            >
                <template slot-scope="scope">
                        {{scope.row.totalWithdrawal | _moneyFormatter}}
                </template>
            </el-table-column>
            <el-table-column width="120px"
                    prop="updateBy"
                    label="操作人"
            ></el-table-column>
            <el-table-column width="110px"
                    prop="operatorDate"
                    label="最新操作时间"
            ></el-table-column>
            <el-table-column label="操作" width="200px">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.controlId==null"
                               size="mini"
                               @click="handleEdit(scope.row,'add')">添加</el-button>
                    <el-button v-if="scope.row.controlId!=null"
                            size="mini"
                            @click="handleEdit(scope.row,'update')">编辑</el-button>
                    <el-button v-if="scope.row.controlId!=null"
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.row)">删除</el-button>
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
                    :total="total">
            </el-pagination>
        </el-row>

        <!-- 添加玩家单控弹框 -->
        <el-dialog
                title="添加玩家单控"
                :visible.sync="dialogVisible"
                width="50%"
        >
            <el-form :model="dialogData"
                     label-width="100px"
                     ref="dialogData"
                     :rules="rules"
                     v-loading="dialogLoading"
            >
                <el-row type="flex" justify="center">
                    <el-form-item
                            prop="account" label=" " label-width="50px"   style="margin-bottom: 40px;width: 100%"
                    >
                        <el-input
                                clearable
                                v-model='dialogData.account'
                                style="width: 100%"
                                maxlength="16"
                                placeholder="请输入">
                            <div slot="prepend">
                                <el-select v-model="dialogData.accountType"  style="width:130px;">
                                    <el-option label="会员ID" value="1"></el-option>
                                    <el-option label="账号" value="2"></el-option>
                                </el-select>
                            </div>
                        </el-input>
                    </el-form-item>
                </el-row>
                <el-row type="flex" justify="center">
                    <el-form-item label="输赢：" label-width="180px"  prop="winLoseMoney" style="margin-bottom: 40px;width: 100%">
                        <el-input placeholder="请输入输赢" type="number" v-model.number="dialogData.winLoseMoney" clearable ></el-input>
                    </el-form-item>
                </el-row>
                <el-row type="flex" justify="center">
                    <el-form-item label="对战类与下注类胜率：" label-width="180px" prop="probability" required style="width: 100%" >
                        <el-select v-model="dialogData.probability" filterable placeholder="请选择"  >
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                            <!--<el-option label="50%" value="50"></el-option>
                            <el-option label="60%" value="60"></el-option>
                            <el-option label="70%" value="70"></el-option>
                            <el-option label="80%" value="80"></el-option>
                            <el-option label="90%" value="90"></el-option>
                            <el-option label="100%" value="100"></el-option>-->
                        </el-select>
                    </el-form-item>
                </el-row>
                <el-row  type="flex" justify="center">
                    <el-form-item label="捕鱼类胜率："label-width="180px" prop="fishProbability" required style="width: 100%">
                        <el-input placeholder="请输入捕鱼类胜率" type="number" v-model.number="dialogData.fishProbability" clearable onkeyup="this.value=this.value.replace(/\D/g,'')"  onblur="this.value=this.value.replace(/\D/g,'')" style="width: 90%">
                            <template slot="append">%</template>
                        </el-input>
                        <el-tooltip class="item" effect="light" content="填写120时，代表玩家提升了20%的命中率，填写200，代表玩家提升了100%的命中率" placement="top-start" style="margin-left:10px;">
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                    </el-form-item>
                </el-row>
                <el-row type="flex" justify="center">
                    <el-card >
                        <div style="text-align: center;">
                            请谨慎填写“输赢”，建议多次少量的金额调整玩家的输赢金额<br/>

                            填写正数代表玩家需要赢到金额，填写负数代表玩家要输的金额<br/>

                            对战类与下注类游戏胜率：代表全部的对战类游戏与全部的下注类游戏<br/>

                            捕鱼类输赢胜率：代表全部的捕鱼游戏
                        </div>
                    </el-card>
                </el-row>
            </el-form>
            <template slot="footer">
                <el-button size="medium"
                           @click='resetAdd'
                >取消</el-button>
                <el-button size="medium"
                           :loading="dialogLoading"
                           @click='saveWarningValue'
                >保存</el-button>
            </template>
        </el-dialog>

        <!--编辑玩家单控-->
        <el-dialog
                :title="dialogState === 'add'?'添加玩家单控':'编辑玩家单控'"
                :visible.sync="dialogVisible_edit"
                width="50%"
        >
            <el-form :model="dialogData1"
                     label-width="100px"
                     ref="dialogData1"
                     :rules="rules1"
                     v-loading="dialogLoading_edit"
            >
                <el-row type="flex" justify="space-around">
                    <el-form-item label="输赢："  label-width="200px" prop="winLoseMoney1" style="width: 100%;">
                        <el-input placeholder="请输入输赢" type="number" v-model.number="dialogData1.winLoseMoney1" clearable></el-input>
                    </el-form-item>
                </el-row>
                <el-row type="flex" justify="space-around">
                    <el-form-item label="对战类与下注类游戏胜率：" label-width="200px" prop="probability1" required style="width: 100%;" >
                        <el-select v-model="dialogData1.probability1" filterable placeholder="请选择"  >
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                            <!--<el-option label="50%" value="50"></el-option>
                            <el-option label="60%" value="60"></el-option>
                            <el-option label="70%" value="70"></el-option>
                            <el-option label="80%" value="80"></el-option>
                            <el-option label="90%" value="90"></el-option>
                            <el-option label="100%" value="100"></el-option>-->
                        </el-select>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="捕鱼类输赢胜率："  label-width="200px" prop="fishProbability1" required style="width: 100%;" >
                        <el-input placeholder="请输入捕鱼类输赢胜率" type="number" v-model.number="dialogData1.fishProbability1" clearable style="width: 90%">
                            <template slot="append">%</template>
                        </el-input>
                        <el-tooltip class="item" effect="light" content="填写120时，代表玩家提升了20%的命中率，填写200，代表玩家提升了100%的命中率" placement="top-start" style="margin-left:10px;">
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                    </el-form-item>
                </el-row>
            </el-form>
            <template slot="footer">
                <el-button size="medium"
                           @click='resetEdit'
                >取消</el-button>
                <el-button size="medium"
                           :loading="dialogLoading_edit"
                           @click='editSaveValue'
                >保存</el-button>
            </template>
        </el-dialog>
    </el-card>
</template>

<script>
    import controlSystem from '@/request/controlSystem'
    import times from '@/tool/times'
   // import tableHeight from "@/tool/tableHeight";
    export default {
        data() {

            var checkWinLoseMoney = (rule, value, callback) => {//验证输赢
                let reg = new RegExp(/^((-[1-9]{1,6}|-[1-9]{1}[0-9]{1,5})|([1-9]{1,6}|[1-9]{1}[0-9]{1,5}))$/);
                //let reg = new RegExp(/^(-[1-9]{1}[0-9]{1,5}|[1-9]{1}[0-9]{1,5})$/);//正数 负数 分别最多6位
                if (!reg.test(value)) {
                    callback(new Error('只可以填写正数与负数的数值（不包含小数点）,最多可6位!'));
                }else {
                    callback();
                }
            };
            var checkProbability = (rule, value, callback) => {//验证输赢胜率
                let reg = new RegExp(/^([0-9]{1,3}|1000)$/);//只能输入0-1000的整数
                if (!reg.test(value)) {
                  return  callback(new Error('只能输入0-1000的整数!'));
                }
                callback();
            };
            return {
                options: [ {
                    value: '50',
                    label: '50%'
                }, {
                    value: '60',
                    label: '60%'
                }, {
                    value: '70',
                    label: '70%'
                }, {
                    value: '80',
                    label: '80%'
                },
                    {
                        value: '90',
                        label: '90%'
                    },
                    {
                        value: '100',
                        label: '100%'
                    },],
                //查询条件
                account: '',//账号or会员ID 绑定值
                accountId: '',//会员ID
                //memberType:"1",//默认单个会员1 选择项单个会员 全部会员2  本地使用 接口未使用
                accountType:"1",//默认会员ID未1  选择项会员ID 账号为2
                deleteLoading:false,//批量删除的loading
                gameList: [
                    ],//游戏名称列表
                roomList:[
                    ],//游戏房间名称列表
                pageNum: 1,
                pageSize: 10,
                total: 0,
                sortBy:"",//默认排序
                tableLoading: false, //表格的加载状态
                tableData: [
                   ],
                multipleSelection:[],//列表选择
                //添加玩家单控
                dialogVisible:false,//添加玩家单控显示状态默认false
                dialogLoading:false,//玩家添加loading默认false
                dialogData:{account:"",accountType:"1",winLoseMoney:"",probability:"60",fishProbability:120},//捕鱼胜率默认120
                rules:{
                    account:[
                        { required: true, message: '必填项', trigger: 'blur' },
                    ],
                    gameName:[
                        { required: true, message: '必选项', trigger: 'change' },
                    ],
                    roomName:[
                        { required: true, message: '必选项', trigger: 'change' },
                    ],
                    winLoseMoney:[
                        { required: true, message: '必填项', trigger: 'blur' },
                        { validator: checkWinLoseMoney, trigger: ['blur','change'] }
                    ],

                    fishProbability:[
                        { required: true, message: '必填项', trigger: 'blur' },
                        { validator: checkProbability, trigger: ['blur','change'] }
                    ],
                    probability:[ { required: true, message: '必填项', trigger: 'change' }]
                },
                rules1:{
                    winLoseMoney1:[
                        { required: true, message: '必填项', trigger: 'blur' },
                        { validator: checkWinLoseMoney, trigger: ['blur','change'] }
                    ],
                    fishProbability1:[
                        { required: true, message: '必填项', trigger: 'blur' },
                        { validator: checkProbability, trigger: ['blur','change'] }
                    ],
                    probability1:[ { required: true, message: '必填项', trigger: 'change' }]
                },
                //编辑
                dialogState:"add",//默认修改弹窗的初始化标题为新增
                dialogData1:{accountType:"1",account:"",winLoseMoney1:"",probability1:"60",fishProbability1:120},//编辑 //捕鱼胜率默认120
                dialogVisible_edit:false,//玩家单控显示状态默认false
                dialogLoading_edit:false,//玩家编辑loading默认false
            }
        },
        filters: {
            /*moneyFormatter(val) {
                if (!val) return '0.00';
                val = parseFloat(val).toFixed(2);
                val= val.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                return val.includes("-")?val:"+"+val;
            },*/
            _moneyFormatterMin(val) {//当需要返回加减号 不需要除以1000 需要截取保留2位小数
                if (!val) return '0.00';
                let str = String(val);
                let idx = str.indexOf('.') + 3;
                if(str.indexOf('.') > -1){
                    if(str.length>4){
                        str = str.slice(0,idx);
                    }
                }
                str= str.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                return str.includes("-")?str:str!="0.00"?"+"+str:str;
            },
            _moneyFormatter(val){//当不需要返回加减号 不需要除以1000 需要截取保留2位小数
                if (!val) return "0.00";
                let str = String(val);
                let idx = str.indexOf('.') + 3;
                if(str.indexOf('.') > -1){
                    if(str.length>4){
                        str = str.slice(0,idx);
                    }
                }
                return str.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            },
            _moneyFormatterMax(val){//当需要返回加减号 需要除以1000 需要截取保留2位小数
                if (!val) return "0.00";
                let str = String(val/1000);
                let idx = str.indexOf('.') + 3;
                if(str.indexOf('.') > -1){
                    if(str.length>4){
                        str = str.slice(0,idx);
                    }
                }
                str= str.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                return str.includes("-")?str:str!="0.00"?"+"+str:str;
            },
        },
        methods: {
            searchHandle(){
                this.pageNum = 1;
                if(this.accountType=="1"&&this.account.trim().length>9){
                    this.$message.warning({message: "会员ID只能输入9位以内!"});
                    return false;
                }
               /* if(this.account.trim()==""){//单个会员
                    this.$message.warning({message: "请输入查询条件"});
                    return false;
                }*/
                this.queryHandle();
            },
            queryHandle() {
                this.tableLoading = true;
                let data = {
                    "limit":this.pageSize,
                    "offset":(this.pageNum -1)*this.pageSize,
                    "sort":this.sortBy=="totalWinLose"?"totalWinLose":"createDate",
                    "sortOrder":"desc",
                    conditionsMap:{
                        account: this.accountType=="2"?this.account.trim():"",
                        accountId: this.accountType=="1"?this.account.trim():"",
                        //accountType: this.memberType=="1"? 1:2//会员类型 1=单个会员 2=全部会员 默认初始化全部
                    }
                }
                controlSystem.getPlayerSingleControlList(data).then(res => {
                    if(res.rows)
                {
                    this.tableData = res.rows;
                    this.tableLoading = false;
                    if(res.limit!=0){
                        this.pageSize = res.limit;
                        this.pageNum = res.offset / res.limit + 1;
                    }
                    this.total = res.total;

                }else
                {
                    this.$notify.warning({title: res.msg})
                    this.tableLoading = false;
                }
                })
            },
            sizeChangeHandle(size) {  //表格显示条数改变
                this.pageSize = size;
                this.queryHandle();
            },
            currentChangeHandle(crtpage) {  //表格显示页数改变
                this.pageNum = crtpage;
                this.queryHandle();
            },
            /*handleSelectionChange(val){//列表选择
                this.multipleSelection = val;
            },*/
            addBtnHandle(){//玩家单控弹框显示
                this.dialogVisible=true;
            },
            saveWarningValue(){//玩家单控添加
                this.$refs["dialogData"].validate(valid => {
                    if (valid) {

                        if(this.dialogData.accountType=="1"&&this.dialogData.account.trim().length>9){
                            this.$message.error({message: "会员ID只能输入9位以内!"});
                            return false;
                        }
                        if(this.dialogData.accountType=="1"&&isNaN(parseInt(this.dialogData.account.trim()))){
                            this.$message.error({message: "会员ID输入格式有误，可以尝试选择会员账号!"});
                            return false;
                        }
                        if(this.dialogData.accountType=="2"&&this.dialogData.account.trim().length>16){
                            this.$message.error({message: "会员账号只能输入16位以内!"});
                            return false;
                        }
                           this.dialogLoading = true;
                           let data = {
                               account: this.dialogData.accountType=="2"?this.dialogData.account.trim():"",//账号
                               accountId: this.dialogData.accountType=="1"?parseInt(this.dialogData.account.trim()):0,//会员ID
                               accountType:parseInt(this.dialogData.accountType),
                               winLose: this.dialogData.winLoseMoney,//输赢
                               winRateBattleBet:parseInt(this.dialogData.probability.trim()),//对战类与下注类胜率
                               winRateFish: this.dialogData.fishProbability,//捕鱼类胜率
                            };

                            controlSystem
                                .addPlayerSingleControl(data)
                                .then(res => {
                                if (res.code == "200") {
                                    this.$notify.success({title: res.msg});
                                    this.dialogLoading = false;
                                    this.dialogVisible = false;
                                    this.queryHandle(); //重新查询
                                }else {
                                    this.$notify.warning({title: res.msg});
                                    this.dialogLoading = false;
                                    this.dialogVisible = false;
                                }
                            })
                            .catch(err => {
                                    console.log(err);
                            });
                    }else {
                        this.$message.error({message: "验证不通过，请检查错误提示"});
                        this.dialogLoading = false;
                    }
                });
            },
            resetAdd(){//添加弹框重置
                this.$refs["dialogData"].resetFields();
                this.dialogVisible=false;
            },
            handleEdit(row,type){//编辑玩家单控弹框显示
                //console.log(row);
                this.dialogData1.id=row.id;
                this.dialogState = type;//弹框标题顶部显示
                this.dialogData1.account=row.account;//游戏账号
                this.dialogData1.accountId=row.accountId;//accountId
                this.dialogData1.controlId=row.controlId;//控制id
                this.dialogData1.accountType=row.accountType;//账号类型
                if(type=="add"){
                    this.dialogData1.probability1="60";
                    this.dialogData1.fishProbability1=120;
                }else {
                    this.dialogData1.probability1=row.winRateBattleBet!=null?row.winRateBattleBet.toString():"";//对战下注胜率
                    this.dialogData1.fishProbability1=row.winRateFish!=null?row.winRateFish:"";//捕鱼胜率
                }
                this.dialogData1.winLoseMoney1=row.winLose!=null?row.winLose:"";//输赢

                this.dialogVisible_edit=true;
               //console.log(row);
                //console.log(this.dialogData);
            },
            editSaveValue(){//玩家单控编辑保存
                this.$refs["dialogData1"].validate(valid => {
                    if (valid) {
                        this.dialogLoading_edit = true;
                        if(this.dialogState == "add"){
                            let data = {
                                //account: this.dialogData1.accountType=="2"?this.dialogData1.account:"",//账号
                                accountId: parseInt(this.dialogData1.accountId),//会员ID
                                accountType:1,//parseInt(this.dialogData1.accountType),
                                winLose: this.dialogData1.winLoseMoney1,//输赢
                                winRateBattleBet:parseInt(this.dialogData1.probability1.trim()),//对战类与下注类胜率
                                winRateFish: this.dialogData1.fishProbability1,//捕鱼类胜率
                            };
                            //console.log(data);

                            controlSystem
                                .addPlayerSingleControl(data)
                                .then(res => {
                                    if (res.code == "200") {
                                        this.$notify.success({title: res.msg});
                                        this.dialogLoading_edit = false;
                                        this.dialogVisible_edit = false;
                                        this.queryHandle(); //重新查询
                                        this.dialogData1={accountType:"1",account:"",winLoseMoney1:"",probability1:"60",fishProbability1:"120"};
                                    }else {
                                        this.$notify.warning({title: res.msg});
                                        this.dialogLoading_edit = false;
                                        this.dialogVisible_edit = false;
                                    }

                                })
                                .catch(err => {
                                    console.log(err);
                                    this.dialogLoading_edit = false;
                                });
                        }
                        if(this.dialogState == "update") {
                            let data = {
                                //accountType: 1,//会员类型 1=会员ID 2=会员账号 与后台确认编辑不需要传此字段，接口上此字段编辑不用传 但是添加需要因需求变动
                                controlId: this.dialogData1.controlId,//单控ID
                                winLose: this.dialogData1.winLoseMoney1,//输赢
                                winRateBattleBet: parseInt(this.dialogData1.probability1.trim()),//对战，下注类型输赢胜率
                                winRateFish: this.dialogData1.fishProbability1 //捕鱼类型输赢胜率
                            };
                            controlSystem
                                .updatePlayerSingleControl(data)
                                .then(res => {
                                    if (res.code == "200") {
                                        this.$notify.success({title: res.msg});
                                        this.dialogLoading_edit = false;
                                        this.dialogVisible_edit = false;
                                        this.queryHandle(); //重新查询
                                        this.dialogData1={accountType:"1",account:"",winLoseMoney1:"",probability1:"60",fishProbability1:"120"};
                                    } else {
                                        this.$notify.warning({title: res.msg});
                                        this.dialogLoading_edit = false;
                                        this.dialogVisible_edit = false;
                                    }
                                })
                                .catch(err => {
                                    console.log(err);
                                    this.dialogLoading_edit = false;
                                });
                        }
                    } else {
                        this.$message.error({message: "验证不通过，请检查错误提示"});
                        this.dialogLoading_edit = false;
                    }
                });
            },
            resetEdit(){//玩家单控编辑取消
                this.$refs["dialogData1"].resetFields();
                this.dialogVisible_edit=false;
            },
            handleDelete(row){//单条删除
                //console.log(row);
                let data={
                    controlId:[row.controlId]
                }
                //console.log(data);
                this.tableLoading = true;
                controlSystem.deletePlayerSingleControl(data).then(res => {
                    this.loading = false;
                if (res.code == 200) {
                    this.$notify.success({title: '删除成功！'});
                    this.tableLoading=false;
                    this.queryHandle();
                }
                else {
                    this.$notify.warning({title: res.msg});
                    this.tableLoading=false;
                }
            });

            },
            /*addBtnDelete(){//批量删除
                if(this.multipleSelection.length==0){
                    this.$message.warning({message:'请至少选择一项需要操作的数据！'})
                    return
                }
                console.log(this.multipleSelection);
                let list=[];//存储ID的值
                this.multipleSelection.forEach(item=>{
                    list.push(item.controlId);
                })
                console.log(list);
                let data={
                    controlId:list
                }
                console.log(data);

                this.deleteLoading=true;
                this.tableLoading=true;
                controlSystem.deletePlayerSingleControl(data)
                    .then(res=>{
                        if (res.code == "200") {
                            this.$notify.success({title: "删除成功!"});
                            this.deleteLoading = false;
                            this.tableLoading=false;
                            this.queryHandle(); //重新查询
                        } else {
                            this.$notify.warning({title: res.msg});
                            this.deleteLoading = false;
                            this.tableLoading=false;
                        }
                })
            }*/
        },
        created() {
            //this.memberType=2;//初始化的时候查询全部会员
            this.sortBy="totalWinLose";//默认按照累计盈亏排序
            this.queryHandle();
        }
    }
</script>

<style lang="scss">
       .bottom {
           height: auto;
       }

</style>
