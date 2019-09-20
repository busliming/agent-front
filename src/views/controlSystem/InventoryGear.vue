<template>
    <el-card>
        <el-row>
            <el-form :inline="true">
                <el-col :span="22">
                    <el-form-item label="游戏名称：">
                        <el-select v-model="gameId" clearable>
                            <el-option
                                    v-for="game in gameList"
                                    :key="game.gameId"
                                    :label="game.gameName"
                                    :value="game.gameId"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="游戏房间：">
                        <el-select v-model="roomName" clearable>
                            <el-option value="" label="全部"></el-option>
                            <template>
                                <el-option v-for="room in roomList" :value="room.gameRoom" :label="room.gameRoom" :key="room.$index"></el-option>
                            </template>
                        </el-select>
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
                </el-col>
                <el-col :span="2">
                    <el-form-item >
                        <el-tooltip effect="light" class="item"  content="游戏房间库存达到这个库存档位后,中奖的概率读取设置的概率;" placement="top-end">
                            <i class="el-icon-question" style="font-size: 24px;"></i>
                        </el-tooltip>
                    </el-form-item>
                </el-col>
            </el-form>
        </el-row>
        <el-row>
            <el-col :span="22">
                <el-button size="medium" type="primary" @click='addBtnHandle'
                >
                    <i class="el-icon-circle-plus"></i>
                    <span>新增</span>
                </el-button>
                <el-button size="medium" type="primary" @click='addBtnBet' v-loading="betLoading"
                >
                    <i class=""></i>
                    <span>下注类人数设置</span>
                </el-button>
            </el-col>

            <!--<el-col :span="2">
                <el-button size="medium" type="primary" @click='addVolumeSet'
                >
                    <i class=""></i>
                    <span>批量设置</span>
                </el-button>
            </el-col>-->
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
                    label="全选"
            >
            </el-table-column>-->

            <el-table-column
                             prop="gameName"
                             label="游戏名称"
            ></el-table-column>
            <el-table-column
                             prop="gameRoom"
                             label="游戏房间"
            >
                <template slot-scope="scope" >
                    <el-tag size="medium" type="" v-if="scope.row.gameId==5"
                >
                        {{ scope.row.gameRoom }} - {{ scope.row.multiple | multipleFormatter}}
                    </el-tag>
                    <el-tag size="medium" type="" v-else
                    >
                        {{ scope.row.gameRoom }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column
                             prop="stockStart"
                             label="起始库存"
            ></el-table-column>
            <el-table-column
                             prop="stockGear"
                             label="库存档位"
            >
                <template slot-scope="scope">
                    <el-tag size="medium" type=""
                    >
                        {{ scope.row.stockGear | _moneyFormatterMin }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column
                             prop="probability"
                             label="概率%"
            ></el-table-column>
            <el-table-column label="操作" >
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            @click="handleEdit(scope.row)">修改</el-button>
                    <el-button
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

        <!-- 新增弹框 -->
        <el-dialog
                :title="dialogState === 'add'?'新增':'修改'"
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
                    <el-form-item label="游戏名称：" label-width="120px" style="width: 100%;">
                        <el-select v-model="dialogData.gameIdAdd" @change="GetGameRoomList">
                            <el-option label="无" value=""></el-option>
                            <el-option
                                    v-for="game in gameAddList"
                                    :key="game.gameId"
                                    :label="game.gameName"
                                    :value="game.gameId"
                            ></el-option>
                        </el-select>
                    </el-form-item>

                </el-row>
                <el-row type="flex" justify="center">
                    <el-form-item label="游戏房间：" prop="roomName" label-width="120px" style="width: 100%;">
                        <el-select v-model="dialogData.roomName">
                            <el-option label="无" value=""></el-option>
                            <template >
                                <el-option v-for="room in roomAddList" :value="room.gameRoom" :label="room.gameRoom" :key="room.$index"></el-option>
                            </template>
                        </el-select>
                    </el-form-item>
                </el-row>
                <el-row type="flex" justify="center" v-if="dialogData.gameIdAdd==5">
                    <el-form-item label="游戏倍场：" prop="beiChang" label-width="120px" style="width: 100%;">
                        <el-select v-model="dialogData.roomMultiple">
                            <el-option label="4倍场" value="4"></el-option>
                            <el-option label="10倍场" value="10"></el-option>
                        </el-select>
                    </el-form-item>
                </el-row>
                <el-row type="flex" justify="center">
                    <el-form-item label="起始值：" prop="start" required label-width="120px" style="width: 100%;" >
                        <el-input placeholder="请输入起始值" type="number" v-model.number="dialogData.start" clearable></el-input>
                    </el-form-item>
                </el-row>
                <el-row type="flex" justify="center">
                    <el-form-item label="库存档位(元)：" prop="inventoryGear" required label-width="120px" style="width: 100%;" >
                        <el-input placeholder="请输入库存档位" type="number" v-model.number="dialogData.inventoryGear" clearable ></el-input>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="概率%：" prop="probability" required label-width="120px" style="width: 100%;" >
                        <el-input placeholder="请输入概率" type="number" v-model.number="dialogData.probability" clearable>
                            <template slot="append">%</template>
                        </el-input>
                    </el-form-item>
                </el-row>
            </el-form>
            <template slot="footer">
                <el-button size="medium"
                           @click='reset1'
                >取消</el-button>
                <el-button size="medium"
                           :loading="dialogLoading"
                           @click='saveValue1'
                >保存</el-button>
            </template>
        </el-dialog>

        <!--下注类人数设置-->
        <el-dialog
                title="下注类人数设置"
                :visible.sync="dialogVisible2"
                width="50%"
        >
            <el-form :model="dialogData2"
                     label-width="100px"
                     ref="dialogData2"
                     :rules="rules2"
                     v-loading="dialogLoading2"
            >
                <el-row type="flex" justify="space-around"  >
                    <el-form-item label="低于此人数：" prop="num11" label-width="110px" style="width: 50%;">
                        <el-input type="number" v-model.number="dialogData2.num11" placeholder="最低值" clearable style="width: 100%;"></el-input>

                    </el-form-item>
                    <el-form-item label-width="10px"  style="text-align:center;color:#000">~</el-form-item>
                    <el-form-item   label-width="10px" prop="num22"  style="width: 50%;">
                        <el-input type="number" v-model.number="dialogData2.num22" placeholder="最高值" clearable style="width: 90%;"></el-input>
                    </el-form-item>
                </el-row>
                <el-row type="flex" justify="space-around">
                    <el-form-item label="触发概率：" prop="probability22"  label-width="110px"  required style="width: 100%;">
                        <el-input placeholder="请输入触发概率" type="number" v-model.number="dialogData2.probability22" clearable>
                            <template slot="append">%</template>
                        </el-input>
                    </el-form-item>
                </el-row>
            </el-form>
            <template slot="footer">
                <el-button size="medium"
                           @click='reset2'
                >取消</el-button>
                <el-button size="medium"
                           :loading="dialogLoading2"
                           @click='SaveValue2'
                >保存</el-button>
            </template>
        </el-dialog>

        <!--批量设置-->
        <!--<el-dialog
                title="批量设置"
                :visible.sync="dialogVisible3"
                width="50%"
        >
            <el-form :model="dialogData3"
                     label-width="100px"
                     ref="dialogData3"
                     :rules="rules3"
                     v-loading="dialogLoading3"
            >
                <el-row type="flex" justify="center">
                    <el-form-item label="起始值：" prop="start" required label-width="120px" style="width: 100%;" >
                        <el-input placeholder="请输入起始值" type="number" v-model.number="dialogData3.start" clearable ></el-input>
                    </el-form-item>

                </el-row>
                <el-row type="flex" justify="center">
                    <el-form-item label="库存档位(元)：" prop="inventoryGear22" required label-width="120px" style="width: 100%;" >
                        <el-input  placeholder="请输入库存档位"  type="number" v-model.number="dialogData3.inventoryGear22" clearable ></el-input>
                    </el-form-item>

                </el-row>
                <el-row>
                    <el-form-item label="概率%：" prop="probability11" required label-width="120px" style="width: 100%;" >
                        <el-input placeholder="请输入概率" type="number" v-model.number="dialogData3.probability11" clearable >
                            <template slot="append">%</template>
                        </el-input>
                    </el-form-item>
                </el-row>
            </el-form>
            <template slot="footer">
                <el-button size="medium"
                           @click='reset3'
                >取消</el-button>
                <el-button size="medium"
                           :loading="dialogLoading3"
                           @click='SaveValue3'
                >保存</el-button>
            </template>
        </el-dialog>-->
    </el-card>
</template>

<script>
    import controlSystem from '@/request/controlSystem'
    import times from '@/tool/times'

    export default {
        data() {
            var checkstart = (rule, value, callback) => {//验证起始值

                //let reg = new RegExp(/^[0-9]+$/);
                let reg = new RegExp(/^(^(\-|\+)?\d{1,8})$/);
                if (!reg.test(value)) {
                  return  callback(new Error('只可以填写正数与负数的数值（不包含小数点）,最多可8位!'));
                }
               /* if(parseInt(value)==0){
                    return callback(new Error('只可以填写正数与负数的数值（不包含小数点）,最多可8位!'));
                }*/
                    callback();
            };
            var checkinventoryGear = (rule, value, callback) => {//验证库存档位

                let reg = new RegExp(/^(^(\-|\+)?\d{1,8})$/);
                //let reg = new RegExp(/^(-[1-9]{1}[0-9]{1,7}|[1-9]{1}[0-9]{1,7})$/);//正数 负数 分别最多8位
                if (!reg.test(value)) {
                    return callback(new Error('只可以填写正数与负数的数值（不包含小数点）,最多可8位!'));
                }
                /*if(parseInt(value)==0){
                    return callback(new Error('只可以填写正数与负数的数值（不包含小数点）,最多可8位!'));
                }*/
                if(parseInt(value)<= parseInt(this.dialogData.start)){
                    return callback(new Error('库存档位填写必须大于起始值!'));
                }
                    callback();
            };

            var checkinventoryGear3 = (rule, value, callback) => {//验证库存档位

                let reg = new RegExp(/^(^(\-|\+)?\d{1,8})$/);
                if (!reg.test(value)) {
                    return callback(new Error('只可以填写正数与负数的数值（不包含小数点）,最多可8位!'));
                }
                /*if(parseInt(value)==0){
                    return callback(new Error('只可以填写正数与负数的数值（不包含小数点）,最多可8位!'));
                }*/
                if(parseInt(value)<= parseInt(this.dialogData3.start)){
                    return callback(new Error('库存档位填写必须大于起始值!'));
                }
                callback();
            };

            /*var checkProbability = (rule, value, callback) => {//验证概率

                let reg = new RegExp(/^([1-9]{1,2}|([1-9]{1}[0-9]{1})|100)$/);//只能输入1-100的整数
                if (!reg.test(value)) {
                    return callback(new Error('只能输入1-100的整数!'));
                }
                    callback();

            };*/

            var checkProbability = (rule, value, callback) => {//验证概率
                let reg = new RegExp(/^(?:[1-9]?\d|100)$/);
                //let reg = new RegExp(/^([0-9]{1,2}|100)$/);//只能输入1-100的整数
                //let reg = new RegExp(/^(0|[1-9]{1,2}|([1-9]{1}[0-9]{1})|100)$/);//只能输入0-100的整数

                if (!reg.test(value) || parseInt(value) < 0 || parseInt(value) > 100 || (value + '').indexOf('.') > -1) {
                    callback(new Error('只能输入0-100的整数'))
                }
                callback();
            };

            var checknum = (rule, value, callback) => {//验证
                let reg = new RegExp(/^[0-9]|[1-9][0-9]*$/);//(/^[1-9]|[1-9][0-9]*$/);//0以上的正整数
                if (!reg.test(value)|| parseInt(value) < 0 || parseInt(value) > 99 || (value + '').indexOf('.') > -1) {
                    return callback(new Error('只可以填写0-99(包含)之间的正整数!'));
                }
               else if(parseInt(this.dialogData2.num22)<parseInt(this.dialogData2.num11)){
                    return callback(new Error('后者不能小于前者!'));
                }
                 else{
                    return callback();
                }
            };

            return {
                //查询条件
                account: '',//账号
                accountId: '',//会员ID
                gameId:"",//游戏ID
                gameName:"",
                roomName:'',//房间
                roomId:"",//房间ID
                gameList: [
                    ],//游戏名称列表
                roomList:[
                    ],//游戏房间名称列表
                gameAddList:[
                    ],//添加
                roomAddList:[
                    ],//添加房间列表
                pageNum: 1,
                pageSize: 10,
                total: 0,

                tableLoading: false, //表格的加载状态
                tableData: [
                   ],
                multipleSelection:[],//列表选择
                //添加
                dialogVisible:false,//添加玩家单控显示状态默认false
                dialogLoading:false,//玩家添加loading默认false
                dialogData:{gameIdAdd:"",roomName:"",roomMultiple:4,start:"",inventoryGear:"",probability:"",roomNameSearch:""},
                dialogState:'add',//弹框状态

                betLoading:false,//下注人数设置加载状态
                rules:{
                    start:[
                        { required: true, message: '该项必填', trigger: 'blur' },
                        { validator: checkstart, trigger: ['blur','change'] }
                    ],
                    inventoryGear:[
                        { required: true, message: '该项必填', trigger: 'blur' },
                        { validator: checkinventoryGear, trigger: ['blur','change'] }
                    ],
                    probability:[
                        { required: true, message: '该项必填', trigger: 'blur' },
                        { validator: checkProbability, trigger: ['blur','change'] }
                    ]
                },
                //dialogData2
                dialogData2:{probability22:null,num11:null,num22:null},
                dialogVisible2:false,
                dialogLoading2:false,
                rules2:{
                    num11:[
                        { required: true, message: '该项必填', trigger: 'blur' },
                        { validator: checknum, trigger: ['blur','change'] }
                    ],
                    num22:[
                        { required: true, message: '该项必填', trigger: 'blur' },
                        { validator: checknum, trigger: ['blur','change'] }
                    ],
                    probability22:[
                        { required: true, message: '该项必填', trigger: 'blur' },
                        { validator: checkProbability, trigger: ['blur','change'] }
                    ]
                },
                //dialogData3
                dialogData3:{start:"",inventoryGear22:"",probability11:""},
                dialogLoading3:false,
                dialogVisible3:false,
                rules3:{
                    start:[
                        { required: true, message: '该项必填', trigger: 'blur' },
                        { validator: checkstart, trigger: ['blur','change'] }
                    ],
                    inventoryGear22:[
                        { required: true, message: '该项必填', trigger: 'blur' },
                        { validator: checkinventoryGear3, trigger: ['blur','change'] }
                    ],
                    probability11:[
                        { required: true, message: '该项必填', trigger: 'blur' },
                        { validator: checkProbability, trigger: ['blur','change'] }
                    ]

                },
            }
        },
        watch: {
            gameId(val) {
                this.GetGameRoomList(val);
            },
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
            multipleFormatter(val){
                if(!val) return '';
                let  result = val==4?"4倍场":"10倍场";
                return result;
            }
        },
        methods: {
            searchHandle() {
                this.pageNum = 1;
                this.queryHandle();
            },
            queryHandle() {
                let data = {
                    conditionsMap: {
                        gameId: this.gameId,
                        gameRoom:this.roomName
                    },
                    limit: this.pageSize,
                    offset: (this.pageNum - 1) * this.pageSize,
                    sort: 'createDate',
                    sortOrder: 'desc',
                };

                 this.tableLoading = true;
                controlSystem.getInventoryGear(data).then(res => {
                    if(res.rows){
                        this.pageSize = res.limit;// todo 处理页码
                        this.pageNum = res.offset / res.limit + 1;
                        this.total = res.total;
                        this.tableData = res.rows;
                        this.total = res.total;
                    }else{
                        console.log("获取失败");
                    }
                     this.tableLoading = false;
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
            /*handleSelectionChange(val) {//列表选择
                this.multipleSelection = val;
            },*/
            addBtnHandle() {//添加弹框显示

                this.dialogVisible = true;
                this.dialogState = "add";

                this.dialogData.gameIdAdd = "";//默认为无
                this.dialogData.roomMultiple=4;
                this.dialogData.start="";
                this.dialogData.inventoryGear="";
                this.dialogData.probability="";
                this.dialogData.roomNameSearch=this.roomName;//将房间名称重新赋值
                //console.log(this.dialogData.roomNameSearch);

            },
            saveValue1() {//添加保存
                if(this.dialogData.gameIdAdd==""){
                    this.$message.warning({message:"请选择游戏名称"});
                    return;
                }
                if(this.dialogData.roomName==""){
                    this.$message.warning({message:"请选择游戏房间"});
                    return;
                }
                if(this.dialogData.gameIdAdd == 5 && this.dialogData.roomMultiple==""){
                    this.$message.warning({message:"请选择游戏倍场"});
                    return;
                }
                this.$refs["dialogData"].validate(valid => {
                    if(valid) {
                        this.dialogLoading = true;
                        if(this.dialogState == "add"){
                            let data = {
                                gameId:parseInt(this.dialogData.gameIdAdd),
                                gameRoom:this.dialogData.roomName,
                                probability:this.dialogData.probability,//概率
                                stockGear:this.dialogData.inventoryGear,//库存档位
                                stockStart:this.dialogData.start,//起始值
                                multiple:this.dialogData.gameIdAdd==5?this.dialogData.roomMultiple:""//百人牛牛
                            };
                            controlSystem
                                .addInventoryGear(data)
                                .then(res => {
                                if (res.code == "200") {
                                this.$notify.success({title: res.msg});
                            } else {
                                this.$notify.warning({title: res.msg});
                            }
                                this.dialogLoading = false;
                                this.dialogVisible = false;
                                //console.log(this.dialogData.roomNameSearch);
                                this.roomName=this.dialogData.roomNameSearch;
                                this.queryHandle(); //重新查询

                            })
                            .catch(err => {
                                    console.log(err);
                                this.dialogLoading = false;
                            });
                        }
                        else if(this.dialogState == "update"){
                            /*let arry=[];//获取保存选中项值
                            this.multipleSelection.forEach(item=>{
                                arry.push(item.id);
                        })*/

                            let data = {
                                id:this.dialogData.id,
                                gameId:parseInt(this.dialogData.gameIdAdd),
                                roomName:this.dialogData.roomName,
                                gearId:[this.dialogData.id],
                                probability:this.dialogData.probability,//概率
                                stockGear:this.dialogData.inventoryGear,//库存档位
                                stockStart:this.dialogData.start,//起始值
                                multiple:this.dialogData.gameIdAdd==5?this.dialogData.roomMultiple:""//百人牛牛 需要传倍场
                            };

                            controlSystem
                                .updateInventoryGear(data)
                                .then(res => {
                                if (res.code == "200") {
                                this.$notify.success({title: res.msg});
                            } else {
                                this.$notify.warning({title: res.msg});
                            }
                            this.dialogLoading = false;
                            this.dialogVisible = false;
                            this.queryHandle(); //重新查询
                                    this.dialogData.roomMultiple=4;
                                    this.dialogData.start="";
                                    this.dialogData.inventoryGear="";
                                    this.dialogData.probability="";
                                    this.dialogData.roomNameSearch="";//将房间名称重新赋值
                                    console.log(this.dialogData);
                        })
                        .catch(err => {
                                console.log(err);
                            this.dialogLoading = false;
                        });
                        }





                    } else {
                        this.$message.error({message: "验证不通过，请检查错误提示"});
                        this.dialogLoading = false;
                    }
                })
            },
            reset1() {//添加弹框重置
                this.dialogVisible = false;
                this.$refs["dialogData"].resetFields();

            },
            handleEdit(row) {//编辑弹框显示
                //console.log(row);
                this.dialogData.id = row.id;
                this.dialogData.gameIdAdd=row.gameId;
                this.dialogData.roomName=row.gameRoom;
                this.dialogData.probability=row.probability;
                this.dialogData.inventoryGear=row.stockGear;
                this.dialogData.start=row.stockStart;
                if(this.dialogData.gameIdAdd==5){//当游戏为百人牛牛时，需要倍场
                    this.dialogData.roomMultiple = row.multiple?row.multiple.toString():'';
                }
                this.dialogVisible = true;
                this.dialogState = "update";
            },
            addBtnBet() {//下注类人数设置
                this.betLoading = true;
                //先查询下注类人数设置
                let data = {};//由于是查询 所以不用传任何参数
                controlSystem
                    .getBetPeopleNumber(data)
                    .then(res => {
                    if (res.code == "200") {
                        if(res.data){
                            //console.log(res.data);
                            this.dialogData2.num11= res.data.startNumber;
                            this.dialogData2.num22 = res.data.endNumber;
                            this.dialogData2.probability22 = res.data.probability;
                            this.dialogData2.id = res.data.id;
                            this.dialogVisible2 = true;
                            this.betLoading=false;
                        }
                    } else {
                        this.$notify.warning({title: res.msg});
                        this.betLoading=false;
                        }
                    })
            },
            SaveValue2() {//下注类人数设置保存
                this.$refs["dialogData2"].validate(valid => {
                    if(valid) {
                        this.dialogLoading2 = true;
                       let data = {
                           id:this.dialogData2.id,
                           startNumber:this.dialogData2.num11,
                           endNumber:this.dialogData2.num22,
                           probability: this.dialogData2.probability22,
                        };
                        controlSystem
                           .setBetPeopleNumber(data)
                           .then(res => {
                           if (res.code == "200") {
                            this.$notify.success({title: res.msg});
                       } else {
                            this.$notify.warning({title: res.msg});
                       }
                       this.dialogLoading2 = false;
                       this.dialogVisible2 = false;
                       this.queryHandle(); //重新查询
                               //重新初始化，避免产生0.00
                               this.dialogData2.probability22=null;
                               this.dialogData2.num11=null;
                               this.dialogData2.num22=null;
                       })
                       .catch(err => {
                               console.log(err);
                       });
                    } else {
                        this.$message.error({message: "验证不通过，请检查错误提示"});
                        this.dialogLoading2 = false;
                    }
            })
                ;
            },
            reset2() {//添加弹框取消
                this.dialogVisible2 = false;
                this.$refs["dialogData2"].resetFields();

            },
            handleDelete(row) {//单条删除
                this.tableLoading = true;
                let data = {
                    gameId:row.gameId,
                    gearId:row.id,//此处专门放查询出来的row.id
                    id:row.id,
                    roomName:row.gameRoom,
                    stockStart:row.stockStart,
                    multiple:row.gameId == 5? row.multiple :null
                }
                controlSystem.deleteStockGear(data).then(res => {
                   if(res.code=="200"){
                    this.$notify.success({title: "删除成功!"});
                    this.tableLoading = false;
                    this.queryHandle();
                }else{
                    this.$notify.warning({title: res.msg});
                    this.tableLoading = false;
                }
            })

            },
            /*addVolumeSet() {//点击批量设置按钮

                if(this.multipleSelection.length==0) {
                    this.$message.warning({message: "请先选中保存项!"});
                    return;
                }
                this.dialogVisible3 = true;
            },*/
            /*reset3() {//批量设置取消
                this.$refs["dialogData3"].resetFields();
                this.dialogVisible3 = false;
            },*/
            /*SaveValue3() {//批量设置保存
                //console.log(this.multipleSelection);

                this.$refs["dialogData3"].validate(valid => {
                    if(valid) {
                        this.dialogLoading3 = true;
                        let arry=[];//获取保存选中项值
                        this.multipleSelection.forEach(item=>{
                            arry.push(item.id);
                        })

                        let data = {
                            gameId:this.gameId,
                            roomName:this.roomName,
                            gearId:arry,
                            probability:this.dialogData3.probability11,//概率
                            stockGear:this.dialogData3.inventoryGear22,//库存档位
                            stockStart:this.dialogData3.start,//起始值
                        };
                        console.log(data);
                        controlSystem
                            .setVolume(data)
                            .then(res => {
                            if (res.code == "200") {
                            this.$notify.success({title: res.msg});
                        } else {
                            this.$notify.warning({title: res.msg});
                        }
                        this.dialogLoading3 = false;
                        this.dialogVisible3 = false;
                        this.queryHandle(); //重新查询
                    })
                    .catch(err => {
                            console.log(err);
                    });
                    } else {
                        this.$message.error({message: "验证不通过，请检查错误提示"});
                        this.dialogLoading3 = false;
                }
            })
                ;
            },*/
            getAllGameList() {//顶部筛选获取所有游戏列表
                let data = {};
                this.gameList = [];
                controlSystem.getGameList(data).then(res => {
                    //过滤掉捕鱼类游戏
                    if(res.data)
                    {
                        res.data = res.data.filter(item => {
                            return item.gameType != 2;
                        })
                        res.data = res.data.filter(item => {
                            return item.gameId != 3 && item.gameId !=19 && item.gameId != 13;
                            //return item.gameName != "金蟾捕鱼"&&item.gameName != "哪吒闹海"&&item.gameName != "李逵劈鱼";
                        })

                        this.gameList = res.data;
                        this.gameName = res.data[0].gameName;
                        this.gameId = res.data[0].gameId;

                        //
                        this.gameAddList = res.data;//添加页面游戏列表赋值
                        this.dialogData.gameIdAdd = res.data[0].gameId;
                    }
                })
            },
            GetGameRoomList(gameId) {//根据游戏ID获取所有的房间类型
                this.roomList=[];
                let data = {gameId: gameId};
                controlSystem.getGameRoomList(data).then(res => {
                    if(res.data)
                    {
                        //将房间名称一样的过滤掉
                        let arrList=[];

                        var hash = {};
                        arrList = res.data.reduce(function(item, next) {
                            hash[next.gameRoom] ? '' : hash[next.gameRoom] = true && item.push(next);
                            return item
                        }, [])

                        this.roomList = arrList;//顶部搜索游戏列表赋值

                        this.roomName = "";

                        this.roomAddList = arrList;//添加页面游戏列表赋值
                        this.dialogData.roomName = "" ;//this.roomAddList[0].roomName;

                        if(!this.tableData.length>0) {//当数据为空的时候 就去执行查询
                            this.queryHandle();
                        }
                    }
                })
            },
        },
        created() {
           this.getAllGameList();//获取游戏列表
        },

    }
</script>

<style lang="scss">

    /* .el-form-item__content{
         margin-left: 0px !important;
     }*/


</style>
