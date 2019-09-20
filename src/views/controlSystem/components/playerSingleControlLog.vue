<template>
    <el-card>
        <el-form :inline="true">
            <el-form-item
                    label="日期："
            >
                <el-date-picker
                        v-model="daterange"
                        type="daterange"
                        range-separator="~"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        style="width:100%"
                ></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button
                        type="primary"
                        size="medium"
                        icon="el-icon-search"
                        @click="searchHandle"
                >搜索
                </el-button>
            </el-form-item>
        </el-form>

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
            <el-table-column
                    prop="accountId"
                    label="会员ID"
            ></el-table-column>
            <!--<el-table-column
                    prop="gameName"
                    label="游戏名称"
            ></el-table-column>
            <el-table-column
                    prop="gameRoom"
                    label="游戏房间"
            ></el-table-column>-->
            <el-table-column
                    prop="winLose "
                    label="输赢"
            >
                <template slot-scope="scope" >
                    <!--<div slot="reference" style="color: #5adbc9" v-if="parseFloat(scope.row.winningLosing)<0">
                        {{scope.row.winningLosing | moneyFormatter}}
                    </div>
                    <div slot="reference" style="color: red" v-else>
                        {{scope.row.winningLosing | moneyFormatter}}
                    </div>-->
                    <div slot="reference" :style="scope.row.winLose*1<0?'color: #5adbc9':'color:red '" >
                        {{scope.row.winLose | _moneyFormatterMin}}
                    </div>

                </template>
            </el-table-column>
            <el-table-column
                    prop="winRateBattleBet"
                    label="对战类与下注类胜率"
            ></el-table-column>
            <el-table-column
                    prop="winRateFish"
                    label="捕鱼类胜率"
            ></el-table-column>
            <el-table-column
                    prop="addDate"
                    label="添加时间"
            ></el-table-column>
            <el-table-column
                    prop="updateBy"
                    label="操作人"
            ></el-table-column>
         </el-table>
        <el-row type="flex" justify="center" style="margin-top:30px;align-items: center;">
            <el-col :lg="12" :md="24" >
                <el-pagination
                        style="float:right;"
                        @size-change="sizeChangeHandle"
                        @current-change="currentChangeHandle"
                        :current-page="pageNum"
                        :page-sizes="[10,20,50,100,200]"
                        :page-size.sync="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                </el-pagination>
            </el-col>
            <el-col :lg="12" :md="24" style="margin-left: 20px;">
                <template v-if="summaryData !== null">
                    <el-form :inline="true" style=" display: inline-flex;justify-content: start;align-items: center;" >
                        <el-form-item label="玩家总增加金额">
                            <el-tag>{{summaryData.totalPlusMoney | _moneyFormatterMin}}元</el-tag>
                        </el-form-item>
                        <el-form-item label="玩家总减少金额">
                            <el-tag>{{summaryData.totalMinusMoney | _moneyFormatterMin}}元</el-tag>
                        </el-form-item>
                    </el-form>
                </template>
            </el-col>
        </el-row>
    </el-card>
</template>

<script>
    import controlSystem from '@/request/controlSystem'
    import times from '@/tool/times'
    export default {
        name: "player-single-control-log",
        data(){
            return{
            tableLoading:false,
                tableData:
                   [

                    ],
                summaryData:{
                    totalPlusMoney:"",//玩家总增加金额
                    totalMinusMoney:""//玩家总减少金额
                },
                pageNum: 1,
                pageSize: 10,
                total: 0,
                isloading: false,
                daterange:[],//查询日期条件
            }
        },
        filters: {
            /*moneyFormatter(val) {
                if (!val) return '0.00';
                val = parseFloat(val).toFixed(2);
                val= val.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                return val.includes("-")?val:"+"+val;
            }*/
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
        },
        methods:{
            sizeChangeHandle(size) {  //表格显示条数改变
                this.pageSize = size;
                this.queryHandle();
            },
            currentChangeHandle(crtpage) {  //表格显示页数改变
                this.pageNum = crtpage;
                this.queryHandle();
            },
            queryHandle(){

                this.tableLoading = true;
                console.log(this.daterange);
                let start = "";
                let end = "";

                if(this.daterange.length>0){
                    //console.log(new Date(this.daterange[0]).getFullYear())
                    start = times.DateToYMD(new Date(this.daterange[0]));
                    end = times.DateToYMD(new Date(this.daterange[1]));
                }

                let data = {
                    "limit":this.pageSize,
                    "offset":(this.pageNum -1)*this.pageSize,
                    "sort":"addDate",
                    "sortOrder":"desc",
                    "conditionsMap":{
                        startDate:this.daterange.length>0? start : '',
                        endDate:this.daterange.length>0? end : ''
                    }
                }
                controlSystem.getPlayerSingleControlLog(data).then(res => {
                    if(res.rows){
                    this.pageSize = res.limit;
                    this.pageNum = res.offset/res.limit +1;
                    this.total = res.total;
                    this.tableData = res.rows;

                    if(res.params){
                        this.summaryData.totalPlusMoney=res.params.totalPlusMoney;//总增加金额
                        this.summaryData.totalMinusMoney=res.params.totalMinusMoney;//总减少金额
                    }
                }else{
                    this.$notify.warning({title:res.msg})
                }
                this.tableLoading = false;
            }).catch(err => {
                    console.log(err)
                this.tableLoading = false;
            })
            },
            searchHandle(){
                this.pageNum = 1;
                //console.log(this.daterange);
                this.queryHandle();
            }
        },
        created(){
            this.queryHandle();
        }
    }
</script>

<style scoped>

</style>