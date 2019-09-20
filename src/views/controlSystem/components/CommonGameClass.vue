<template>
    <el-card>

        <el-button-group>
            <template v-for="(item,idx) in gameList" v-if="gameList.length>0">
                <el-button :key="idx" :index="idx" type="primary" :plain="crtType == item.gameId?false:true" size='medium'

                           @click="changeGameId(item.gameId)"
                >{{item.gameName}}</el-button>
            </template>
        </el-button-group>


        <el-table
                :data="tableData"
                v-loading="isloading"
                style="width: 100%;margin-top:20px;"
                :border='true'
                :fit='true'
                size="medium"
                stripe
                :cell-style='{textAlign:"center"}'
                :header-cell-style='{textAlign:"center"}'
                :default-sort = "{prop: 'createDate', order: 'descending'}"
        >
            <el-table-column label="房间名称" prop='roomName'
            >

                <template slot-scope="scope" >
                    <div v-if="gameId==5">
                        {{scope.row.roomName}} - {{scope.row.multiple | multipleFormatter}}
                    </div>
                    <div v-else>
                        {{scope.row.roomName}}
                    </div>
                </template>

            </el-table-column>
            <el-table-column label="房间总盈亏" prop='totalDayWinLose'
            >
                <template slot-scope="scope">
                       {{scope.row.totalDayWinLose | _moneyFormatter}}
                </template>
            </el-table-column>
            <el-table-column label="今日房间总盈亏" prop='dayWinLose'
            >
                <template slot-scope="scope">
                       {{scope.row.dayWinLose | _moneyFormatter}}
                </template>
            </el-table-column>
            <el-table-column label="房间胜率" prop='roomWinRate' v-if="crtType!=3&&crtType!=19&&crtType!=13"
            >
                <template slot-scope="scope">
                    {{scope.row.roomWinRate==0?"不控制":scope.row.roomWinRate+"%"}}
                </template>
            </el-table-column>
            <el-table-column label="操作"
            >
                <template slot-scope="scope">
                    <el-button size='mini' @click='changeState(scope.row)'
                    >修改</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--<el-row type="flex" justify="center">
            <el-pagination
                    @size-change="sizeChangeHandle"
                    @current-change="currentChangeHandle"
                    :current-page="pageNum"
                    :page-sizes="[10,20,50,100,200]"
                    :page-size.sync="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
            ></el-pagination>
        </el-row>-->
        <!-- 修改弹框 -->
        <el-dialog
                title="修改"
                :visible.sync="dialogVisible"
                width="55%"
        >
            <el-form :model="dialogData"
                     label-width="100px"
                     ref="dialogData"
                     :rules="rules"
                     v-loading="dialogLoading"
            >
                <el-row type="flex" justify="start" v-if="probabilityVisible">
                    <el-form-item
                            prop="probability" label="房间胜率："
                    >
                        <el-select v-model="dialogData.probability"  style="width:120px;">
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                            <!--<el-option label="不控制" value="0"></el-option>
                            <el-option label="10%" value="10"></el-option>
                            <el-option label="20%" value="20"></el-option>
                            <el-option label="30%" value="30"></el-option>
                            <el-option label="40%" value="40"></el-option>
                            <el-option label="50%" value="50"></el-option>
                            <el-option label="60%" value="60"></el-option>
                            <el-option label="70%" value="70"></el-option>
                            <el-option label="80%" value="80"></el-option>
                            <el-option label="90%" value="90"></el-option>
                            <el-option label="100%" value="100"></el-option>-->
                        </el-select>
                    </el-form-item>
                </el-row>
                <el-row type="flex" justify="start">
                    <el-form-item label="库存值：" style="width: 50%;" v-loading="inventoryNumberLoading">
                        <el-input  v-model="dialogData.inventoryNumber" :disabled="true" clearable></el-input>
                    </el-form-item>
                </el-row>
                <el-row type="flex" justify="space-around">
                    <el-form-item label="库存衰减：" prop="inventoryMinus1" required style="width: 50%;">
                        <el-input placeholder="请输入库存衰减" type="number"  v-model.number="dialogData.inventoryMinus1" clearable>
                            <template slot="append">%</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="累计库存衰减：" label-width="120px"   style="width: 50%;" >
                        <el-input v-model="dialogData.totalInventoryMinus" :disabled="true"></el-input>
                    </el-form-item>
                </el-row>
                <el-row type="flex" justify="center">
                    <el-card >
                        <div style="text-align: center;" v-if="crtType!=3&&crtType!=19&&crtType!=13">
                            1.房间胜率，代表机器人在房间赢的概率；<br/>

                            2.库存衰减：代表玩家玩家输的钱多少比例不进入库存；
                        </div>
                        <div style="text-align: center;" v-else>
                            捕鱼类游戏是抽水完成之后，对发射炮弹未打中的金额进行库存衰减，未打中的金额多少比例不进入库存；
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


    </el-card>
</template>

<script>
    import controlSystem from '@/request/controlSystem'
    import ElTag from "element-ui/packages/tag/src/tag";

    export default {
        //components: {ElTag},
        name: 'CommonGameClass',
        props: ['type'],
        data() {
            var checkInventoryMinus = (rule, value, callback) => {//验证输入库存衰减
                let reg = new RegExp(/^[0-5]{1}$/);
                if (!reg.test(value) || parseInt(value) < 0 || parseInt(value) > 5 || (value + '').indexOf('.') > -1) {
                 return  callback(new Error('请输入0-5的整数'))
                }
                callback();
            };

            return {
                crtType: 0,
                gameList: [],//游戏名称列表
                gameId: 0,//默认当前第一个游戏ID
                gameName: "",
                tableData: [],//
                // {gameName:"同比牛牛"}
                isloading: false,
                pageNum: 1,
                pageSize: 10,
                total: 0,
                //修改
                dialogVisible: false,
                dialogData: {probability: "0", inventoryMinus1: ""},
                dialogLoading: false,
                inventoryNumberLoading: false,//库存的Loading
                //totalInventoryMinusLoading:false,//累计库存衰减
                probabilityVisible: true,//房间胜率默认为true 只有当为捕鱼类游戏的时候隐藏
                options: [{
                    value: '0',
                    label: '不控制'
                }, {
                    value: '10',
                    label: '10%'
                }, {
                    value: '20',
                    label: '20%'
                }, {
                    value: '30',
                    label: '30%'
                }, {
                    value: '40',
                    label: '40%'
                }, {
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
                }, {
                    value: '90',
                    label: '90%'
                },
                    {
                        value: '100',
                        label: '100%'
                    }],
                rules: {
                    inventoryMinus1: [
                        {required: true, message: '必填项', trigger: 'blur'},
                        {validator: checkInventoryMinus, trigger: ['blur', 'change']}
                    ],

                },
            }
        },
        filters: {
            /*moneyFormatter(val) {
                if (!val) return "0";
                val = parseFloat(val).toFixed(2);
                if (val == "0.00") val = "0";
                return val.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            },*/
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
            multipleFormatter(val){
                if(!val) return '';
                let  result = val==4?"4倍场":"10倍场";
                return result;
            }
        },
        methods: {

            changeGameId(gameId) {//切换游戏列表
                this.crtType = gameId;
                this.gameId = gameId;
                this.queryHandle();
            },
            changeType() {  //根据游戏分组类型获取游戏列表
                this.crtType = this.gameId;//当前选中项
                this.queryHandleGameList(this.type);
            },
            queryHandleGameList(type) {//根据游戏分组类型获取游戏列表
                this.isloading = true;
                let data = {
                    gameType: parseInt(type)
                }
                controlSystem.getGameList(data).then(res => {
                    if (res.data) {
                        this.gameList = res.data;
                        this.crtType = res.data[0].gameId;//通过游戏分组获取游戏列表的默认值
                        this.gameId = res.data[0].gameId;//获取第1个游戏ID
                        this.queryHandle();//获取游戏房间列表
                    } else {
                        this.$notify.warning({title: res.msg});
                    }
                    this.isloading = false;
                }).catch(err => {
                    console.log(err);
                    this.isloading = false;
                })
            },
            queryHandle() { //获取当前分组游戏数据
                this.isloading = true;
                //console.log(this.type, this.gameId);
                let data = {
                    gameType: this.type,
                    gameId: this.gameId
                }
                controlSystem.getGameControlList(data).then(res => {
                    if (res.data) {
                        this.tableData = res.data;
                    }
                    this.isloading = false;
                }).catch(err => {
                    console.log(err);
                    this.isloading = false;
                })
            },
            changeState(row) {  //点击修改操作按钮
                // console.log(row);
                this.dialogVisible = true;
                // this.dialogData.probability="";
                //console.log(this.dialogData.probability);
                this.selectStorage(row);
                this.dialogData.id = row.id;//当条数据id
                this.dialogData.gameName = row.gameName;//游戏名称
                if (row.gameId != 3 && row.gameId != 19 && row.gameId != 13) {//捕鱼类游戏
                    this.probabilityVisible = true;//房间胜率显示
                    this.dialogData.probability = row.roomWinRate ? row.roomWinRate.toString() : "0";//房间胜率
                } else {
                    this.probabilityVisible = false;//房间胜率隐藏
                    this.dialogData.probability = "";
                }
                this.dialogData.multiple = row.multiple;

                //console.log(this.dialogData.multiple);
                //console.log(this.dialogData.probability);
                this.dialogData.roomName = row.roomName;//房间
                this.dialogData.inventoryMinus1 = row.stockWeak;//库存衰减
                this.dialogData.totalInventoryMinus = row.attenuation;//累计库存衰减值
            },
            selectStorage(row) {//获取库存值
                this.inventoryNumberLoading = true;
                this.totalInventoryMinusLoading = true;
                let data = {
                    gameId: row.gameId,
                    roomId: row.id,
                    id: row.id
                }
                controlSystem
                    .selectStorage(data)
                    .then(res => {
                        if (res.code == "200") {
                            this.dialogData.inventoryNumber = res.data.storage;//库存值
                            //this.dialogData.totalInventoryMinus = res.data.totalStorageReduce;//累计库存衰减
                            this.inventoryNumberLoading = false;
                            //this.totalInventoryMinusLoading = false;
                        } else {
                            this.$notify.warning({title: res.msg});
                            this.inventoryNumberLoading = false;
                            //this.totalInventoryMinusLoading = false;
                        }
                    })
            },
            sizeChangeHandle(sz) {
                this.pageSize = sz;
                this.queryHandle();
            },
            currentChangeHandle(crt) {
                this.pageNum = crt;
                this.queryHandle();
            },
            resetAdd() {//修改弹框取消
                this.dialogVisible = false;
               // this.dialogData= {probability: "0"}
            },
            saveWarningValue() {//保存
                this.$refs["dialogData"].validate(valid => {
                    if (valid) {
                        this.dialogLoading = true;
                        console.log(this.dialogData.id);
                        let data = {
                            id: this.dialogData.id,
                            gameName: this.dialogData.gameName,
                            gameId: this.gameId,
                            roomName: this.dialogData.roomName,
                            roomWinRate: parseInt(this.dialogData.probability),
                            stockWeak: this.dialogData.inventoryMinus1,
                            sumStockWeak: this.dialogData.totalInventoryMinus,
                            multiple: this.gameId == 5?this.dialogData.multiple:null
                        };
                        //console.log(data);
                        controlSystem
                            .updateGameControl(data)
                            .then(res => {
                                if (res.code == "200") {
                                    this.$notify.success({title: res.msg});
                                    this.dialogData = {probability: "0", inventoryMinus1: ""};
                                } else {
                                    this.$notify.warning({title: res.msg});
                                }
                                this.dialogLoading = false;
                                this.dialogVisible = false;
                                this.queryHandle(); //重新查询
                            })
                            .catch(err => {
                                console.log(err);
                            });
                    } else {
                        this.$message.error({message: "验证不通过，请检查错误提示"});
                        this.dialogLoading = false;
                    }
                });
            },
        },
        created() {
            this.changeType();//获取游戏列表
        },
        activated() {
            this.changeType();
        },
        deactivated() {
            this.dialogData.probability = '0';
            this.dialogData.inventoryMinus1 = "";
            this.dialogData.inventoryNumber = "";
            this.dialogData.totalInventoryMinus = "";
            //console.log(this.dialogData.probability);
        }
    };
</script>

