<template>
    <el-card>
        <el-form
                label-width="140px"
        >
            <el-row
                    type="flex"
                    justify="space-between"
            >
                <el-col
                        :span="6"
                >
                    <el-form-item
                            label="会员账号："
                    >
                        <el-input
                                v-model="account"
                                clearable
                                maxlength="16"
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col
                        :span="6"
                >
                    <el-form-item
                            label="上级会员账号："
                    >
                        <el-input
                                v-model="parentAccount"
                                clearable
                                maxlength="16"
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col
                        :span="6"
                >
                    <el-form-item
                            label="会员ID："
                    >
                        <el-input
                                v-model.trim="play2Id"
                                clearable
                        ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row type="flex" justify="space-between" >
                <el-form-item label="时间范围">
                    <el-row type="flex" justify="space-between">
                        <el-date-picker
                                v-model="createDate"
                                type="daterange"
                                range-separator="~"
                                value-format="yyyy-MM-dd"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                        ></el-date-picker>
                        <short-cuts
                                :_value="{_date:'jint'}"
                                :currentContext='this'
                                currentModelName='createDate'
                                currentQueryHandle='searchHandle'
                                ref="parentHandleclick"
                        ></short-cuts>
                    </el-row>
                </el-form-item>
                <el-form-item
                        label-width="0"
                >
                    <el-button
                            size="medium"
                            type="primary"
                            icon="el-icon-search"
                            @click="searchHandle(1)"
                    >搜索</el-button>
                </el-form-item>
            </el-row>
        </el-form>
        <el-table
                border
                fit
                stripe
                :data='tableData'
                :cell-style="{textAlign:'center'}"
                :header-cell-style="{textAlign:'center'}"
                v-loading='loading'
        >
            <el-table-column
                    label="上级会员账号"
                    prop="parentAccount"
            >
                <template slot-scope="{row}">
                    {{ row.parentAccount == null ? '-' : row.parentAccount }}
                </template>
            </el-table-column>
            <el-table-column
                    label="会员账号"
                    prop="account"
            >
                <template slot-scope="{row}">
                    {{ row.account }}
                </template>
            </el-table-column>
            <el-table-column
                    label="会员ID"
                    prop="play2Id"
            ></el-table-column>
            <el-table-column
                    label="一级代理"
                    prop="ratio1Total"
            >
                <template slot-scope="{row}">
                    <el-button type="text" @click="goSingle(row.accountId,'FIRST')">{{ row.ratio1Total }}</el-button>
                </template>
            </el-table-column>
            <el-table-column
                    label="二级代理"
                    prop="ratio2Total"
            >
                <template slot-scope="{row}">
                    <el-button type="text" @click="goSingle(row.accountId,'SECOND')">{{ row.ratio2Total }}</el-button>
                </template>
            </el-table-column>
            <el-table-column
                    label="三级代理"
                    prop="ratio3Total"
            >
                <template slot-scope="{row}">
                    <el-button type="text"  @click="goSingle(row.accountId,'THIRD')">{{ row.ratio3Total }}</el-button>
                </template>
            </el-table-column>
            <el-table-column
                    label="团队税收金额"
                    prop="groupTax"
            >
                <template slot-scope="{row}">
                    {{row.groupTax | betNumberFormatter}}
                </template>
            </el-table-column>
            <el-table-column
                    label="团队充值金额"
                    prop="groupRecharge"
            >
                <template slot-scope="{row}">
                    {{row.groupRecharge}}
                </template>
            </el-table-column>
            <el-table-column
                    label="团队提款金额"
                    prop="groupDrawings"
            >
                <template slot-scope="{row}">
                    {{row.groupDrawings}}
                </template>
            </el-table-column>
            <el-table-column
                    label="团队返利金额"
                    prop="groupRebate"
            >
                <template slot-scope="{row}">
                    {{row.groupRebate | betNumberFormatter}}
                </template>
            </el-table-column>
            <el-table-column
                    label="操作"
                    width="280px"
            >
                <div class="btn-group" slot-scope="scope">
                    <el-button plain size="mini"
                               @click="checkSup(scope.row)"
                    >上级
                    </el-button>
                    <el-button plain size="mini"
                               @click="checkSub(scope.row)"
                    >下级
                    </el-button>
                    <el-button type="primary" size="mini"
                               @click="viewDailyReportHandler(scope.row)">
                        详情
                    </el-button>
                </div>
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
    </el-card>
</template>

<script>
    import spreadRequest from '@/request/spread'
    import time from '@/tool/times'

    export default {
        name: 'SpreadReportNew',
        data() {
            return {
                queryType: 'search', //查询类型
                parentAccount:'',//上级会员账号
                parentAccountId:null,//父级ID
                account: '',   //会员账号
                play2Id: '',   //会员id
                _playId:'',//专用来记录上级会员id
                createDate: [],//选择日期

                lastQueryType:'search',//上一次有数据的查询type是什么
                lastParentAccountId:null,//上一次有数据的查询为sub时的parentID
                lastPlayId:null,//上一次有数据的查询为sub时的playId
                lastPageNum:1,//上次有数据的页数

                pageNum: 1,//当前页数
                pageSize: 10,//当前每页显示几条
                total: 0,//当前查询条件下的总条数

                tableData: [],
                loading: false,
            }
        },
        // watch:{
        //     createDate:(newVal)=>{
        //             console.log(newVal)
        //     }
        // },
        filters:{
            betNumberFormatter(val){
                if (!val) return "0";
                let str = String(val/1000);
                let idx = str.indexOf('.') + 4;
                if(str.indexOf('.') > -1){
                    if(str.length>4){
                        return str.slice(0,idx);
                    }else{
                        return str
                    }
                }else{
                    return str
                }
            },
        },
        methods: {
            queryHandle() { //获取列表的数据
                if (this.play2Id != null&&this.play2Id!='') {
                    if (this.play2Id.toString().length > 9) {
                        this.$message.warning({message: "会员ID长度不能大于9位"});
                        return;
                    }
                    let reg = new RegExp(/^\d+$/);//包含0 和大于0的整数
                    if (!reg.test(this.play2Id)) {
                        this.$message.warning({message: "会员ID请输入有效格式(非负整数)"});
                        return;
                    }
                }
                this.loading = true;
                let formdata = {
                    limit: this.pageSize,
                    offset: (this.pageNum - 1) * this.pageSize, //页数
                    sort: "createDate",
                    sortOrder: "desc",
                    startTime: this.createDate ? this.createDate[0] : '',  //开始时间
                    endTime: this.createDate ? this.createDate[1] : '',    //结束时间
                    parentAccountId: this.queryType === 'sub' ? this.parentAccountId : null,//点击传下级才传，其他的不用
                    parentAccount: this.queryType === 'search' ? this.parentAccount : '',//用来搜索，上级会员账号，除了搜索就不传
                    account: this.queryType === 'search' ? this.account : '',   //用来搜索，会员账号，除了搜索就不传
                    play2Id: this.queryType === 'search' ?  this.play2Id!=''? Number(this.play2Id):null : null,     //搜索
                    playId:this.queryType ==='sup'?Number(this._playId):null,
                };
                spreadRequest.getPromotionGroupReport(formdata).then(res => {
                    if (res.rows) {
                        if (this.queryType === 'sub') {
                            if (res.rows.length == 0) {
                                this.$notify.warning({title: '该会员没有下级'});
                                this.loading = false;
                                this.queryType = this.lastQueryType;
                                this.parentAccountId = this.lastParentAccountId;
                                this.pageNum = this.lastPageNum;
                                return;
                            }

                        } else if (this.queryType === 'sup') {
                            if (res.rows.length == 0) {
                                this.$notify.warning({title: '该会员没有上级'});
                                this.loading = false;
                                this.queryType = this.lastQueryType;
                                this._playId = this.lastPlayId;
                                this.pageNum = this.lastPageNum;
                                return;
                            }
                        }
                        this.pageNum = res.offset / res.limit + 1;
                        this.pageSize = res.limit;
                        this.total = res.total;
                        this.tableData = res.rows;

                        if (this.queryType === 'sub') {
                            this.account='';
                            this.parentAccount='';
                            this.playId=null;
                            //this.parentAccountId = '';
                            this.createDate=[];
                        }
                        if (this.queryType === 'sup') {
                            this.account='';
                            this.parentAccount='';
                            this.playId=null;
                            //this._playId=null;
                            this.createDate=[];
                        }
                        this.lastQueryType = this.queryType;
                        this.lastPageNum = this.pageNum;
                        this.lastParentAccountId = this.parentAccountId;
                        this.lastPlayId = this._playId;
                    }
                    this.loading = false;
                }).catch(err => {
                    console.log(err);
                    this.loading = false;
                })
            },
            searchHandle(i) { //搜索
                if(i){
                    this.$refs.parentHandleclick.parentHandleclick();
                } 
                this.queryType = 'search';
                this.pageNum = 1;
                this.queryHandle();
            },
            checkSub(row) { //查看下级
                this.lastQueryType = this.queryType;//将上次的查询type保存
                this.lastParentAccountId = this.parentAccountId;//将上次查询的parentID保存
                this.lastPageNum = this.pageNum;//将上次的页数保存
                this.queryType = 'sub';
                this.parentAccountId = row.accountId;//查看下级的去掉判断
                this.pageNum = 1;
                this.queryHandle();
            },
            checkSup(row) { //查看上级
                this.lastQueryType = this.queryType;//将上次的查询type保存
                this.lastPlayId = this._playId;////将上次的查询_playId保存
                this.lastPageNum = this.pageNum;//将上次的页数保存
                this.queryType = 'sup';
                this._playId = row.parentId;
                this.pageNum = 1;
                this.queryHandle();
            },
            goSingle(subordinateTopId,subordinateLevel){
                let params = {
                    subordinateTopId: subordinateTopId,
                    subordinateLevel:subordinateLevel,
                    queryType:'fujisearch',
                    pageNum:1,
                    createDate:this.createDate
                }
                this.$store.dispatch('setParams1',params);

                this.$router.push({
                    path: '/spread/spreadReport/SpreadReportPersonal',
                    name: '个人推广报表',
                    /*params: {
                        subordinateTopId: subordinateTopId,
                        subordinateLevel:subordinateLevel,
                        queryType:'fujisearch'
                    }*/
                })
            },
            viewDailyReportHandler(row) {  //报表详情
                //console.log(row);
                let params = {
                    accountId: row.accountId,
                    type:"Group"
                }
                this.$store.dispatch('setParams',params);
                this.$router.push({
                    path: '/spread/spreadReport/SpreadReportNewDetails',
                    name: '报表详情',
                   /* query: {
                        accountId: row.accountId,
                        type:"Group"//代表是从团队过来的
                    }*/
                })
            },
            sizeChangeHandle(size) {
                this.pageSize = size;
                this.queryHandle();
            },
            currentChangeHandle(crt) {
                this.pageNum = crt;
                this.queryHandle();
            },
        },
        created(){
            this.queryHandle();
             this.createDate = [];//默认为今天的数据
             this.createDate.push(time.DateToYMD(new Date()));
             this.createDate.push(time.DateToYMD(new Date()));
        },
        activated(){
            let date = this.$store.getters.spreadParams1.createDate;
            if(date!=undefined&&date!=null&&date!=[]){
                this.createDate =date;
            }
            this.queryHandle();
        }
    }
</script>
