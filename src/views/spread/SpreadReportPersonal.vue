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
                                :_value="{_date:''}"
                                :currentContext='this'
                                currentModelName='createDate'
                                currentQueryHandle='searchHandle'
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
                            @click="searchHandle"
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
            </el-table-column>
            <el-table-column
                    label="会员ID"
                    prop="play2Id"
            ></el-table-column>

            <el-table-column
                    label="税收金额"
                    prop="personTax"
            >
                <template slot-scope="{row}">
                    {{row.personTax | betNumberFormatter}}
                </template>
            </el-table-column>
            <el-table-column
                    label="充值金额"
                    prop="personRecharge"
            >
                <template slot-scope="{row}">
                    {{row.personRecharge}}
                </template>
            </el-table-column>
            <el-table-column
                    label="提款金额"
                    prop="personDrawings"
            >
                <template slot-scope="{row}">
                    {{row.personDrawings }}
                </template>
            </el-table-column>
            <el-table-column
                    label="返利金额"
                    prop="personRebate"
            >
                <template slot-scope="{row}">
                    {{row.personRebate | betNumberFormatter}}
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
        name: 'SpreadReportPersonal',
        data() {
            return {
                createDate: [],//查询日期
                queryType: 'search', //查询类型 默认从父级传过来 点击搜索 变成 search 点击上级变成sup 点击下级变成sub
                parentAccount:'',//父级账号
                account: '',   //会员账号
                play2Id: '',   //会员id
                _playId:null,//点击上级时赋值
                subordinateLevel:'',
                subordinateTopId:null,//下三级条件的顶层ID

                queryParams:{},//搜索条件

                subIsClick:false,// 下级有没有被点过
                supIsClick:false,//上级有没有被点过
                searchIsClick:false,//搜索有没有被点过

                pageNum: 1,
                pageSize: 10,
                total: 0,

                tableData: [],
                loading: false,
            }
        },
        computed: {//不能放在computed里

        },
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
            searchHandle(){//搜索
                this.queryType = 'search';
                this.searchIsClick =true;//搜索被点击过
                this.pageNum = 1;
                this.queryHandle();
            },
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
                let vm = this;
                 //查询条件

                    if(vm.queryType=='fujisearch'){
                        vm.queryParams={
                            limit: vm.pageSize,
                            offset: (vm.pageNum - 1) * vm.pageSize, //页数
                            sort: "createDate",
                            sortOrder: "desc",
                            startTime: vm.createDate ? vm.createDate[0] : '',  //开始时间
                            endTime: vm.createDate ? vm.createDate[1] : '',    //结束时间
                            parentAccountId:vm.queryType === 'sub' ?vm.parentAccountId:null,//点击传下级才传，其他的不用
                            parentAccount:vm.queryType === 'search'?vm.parentAccount:'',//用来搜索，上级会员账号，除了搜索就不传
                            account: vm.queryType === 'search' ? vm.account : '',   //用来搜索，会员账号，除了搜索就不传// &&this.subordinateTopId==null
                            play2Id:  null,     //搜索或者点击上级都传_playId
                            playId:null,
                            subordinateLevel:vm.subordinateLevel!=''&&vm.queryType=='fujisearch'?vm.subordinateLevel:'',//下三级
                            subordinateTopId:vm.subordinateTopId!=null&&vm.queryType=='fujisearch'?vm.subordinateTopId:null//下三级条件的顶层ID
                        };
                    }else {
                        vm.queryParams={
                            limit: vm.pageSize,
                            offset: (vm.pageNum - 1) * vm.pageSize, //页数
                            sort: "createDate",
                            sortOrder: "desc",
                            startTime: vm.createDate ? vm.createDate[0] : '',  //开始时间
                            endTime: vm.createDate ? vm.createDate[1] : '',    //结束时间
                            parentAccountId:vm.queryType === 'sub' ?vm.parentAccountId:null,//点击传下级才传，其他的不用
                            parentAccount:vm.queryType === 'search'?vm.parentAccount:'',//用来搜索，上级会员账号，除了搜索就不传
                            account: vm.queryType === 'search' ? vm.account : '',   //用来搜索，会员账号，除了搜索就不传// &&this.subordinateTopId==null
                            play2Id: vm.queryType === 'search' ?  this.play2Id!=''? Number(this.play2Id):null: null,     //搜索
                            playId:vm.queryType ==='sup'?vm._playId:null,
                        };
                    }

                vm.loading = true;
                spreadRequest.getPromotionPersonReport(vm.queryParams).then(res => {
                    if (res.rows) {
                        if (vm.queryType === 'sub') {
                            if (res.rows.length == 0) {
                                this.$notify.warning({title: '该会员没有下级'});
                                //vm.subIsClick=false;
                                if(vm.subIsClick===false&&vm.supIsClick===false&&vm.searchIsClick===false){
                                    //vm.queryType ="search";
                                    vm.queryType=vm.$store.getters.spreadParams1.queryType;
                                    vm.subordinateLevel = vm.$store.getters.spreadParams1.subordinateLevel;
                                    vm.subordinateTopId = vm.$store.getters.spreadParams1.subordinateTopId;
                                }else{

                                }

                                let params = {
                                    subordinateTopId: vm.$store.getters.spreadParams1.subordinateTopId,
                                    subordinateLevel: vm.$store.getters.spreadParams1.subordinateLevel,
                                    queryType: 'sub',
                                    parentAccountId: vm.$store.getters.spreadParams1.parentAccountId,
                                    playId: vm.$store.getters.spreadParams1.playId,
                                    pageNum: vm.$store.getters.spreadParams1.pageNum,
                                }
                                vm.$store.dispatch('setParams1',params);
                                vm.pageNum = vm.$store.getters.spreadParams1.pageNum;
                                console.log(vm.queryType);
                                vm.loading = false;
                                return;
                            }
                        } else if (vm.queryType === 'sup') {
                            if (res.rows.length == 0) {
                                this.$notify.warning({title: '该会员没有上级'});
                                //vm.supIsClick=false;
                                if(vm.subIsClick===false&&vm.supIsClick===false&&vm.searchIsClick===false){
                                    //vm.queryType ="search";
                                    vm.queryType=vm.$store.getters.spreadParams1.queryType;
                                    vm.subordinateLevel = vm.$store.getters.spreadParams1.subordinateLevel;
                                    vm.subordinateTopId = vm.$store.getters.spreadParams1.subordinateTopId;
                                }else{

                                }
                                let params = {
                                    subordinateTopId: vm.$store.getters.spreadParams1.subordinateTopId,
                                    subordinateLevel:vm.$store.getters.spreadParams1.subordinateLevel,
                                    queryType:'sup',
                                    parentAccountId:vm.$store.getters.spreadParams1.parentAccountId,
                                    playId:vm.$store.getters.spreadParams1.playId,
                                    pageNum: vm.$store.getters.spreadParams1.pageNum,
                                }
                                vm.$store.dispatch('setParams1',params);
                                vm.pageNum = vm.$store.getters.spreadParams1.pageNum;
                                console.log(vm.queryType);
                                vm.loading = false;
                                return;
                            }
                        }
                        vm.pageNum = res.offset / res.limit + 1;
                        vm.pageSize = res.limit;
                        vm.total = res.total;
                        vm.tableData = res.rows;

                        if (vm.queryType === 'sub') {
                            vm.subIsClick = true;
                            vm.supIsClick = false;
                            vm.searchIsClick =false;
                            vm.account='';
                            vm.parentAccount='';
                            vm.playId=null;
                            vm.play2Id =null;
                            //this.parentAccountId = '';
                            vm.queryType ="sub";
                            let params = {
                                subordinateTopId: vm.$store.getters.spreadParams1.subordinateTopId,
                                subordinateLevel:vm.$store.getters.spreadParams1.subordinateLevel,
                                queryType:'sub',
                                parentAccountId:vm.parentAccountId,
                                playId:vm.$store.getters.spreadParams1.playId,
                                pageNum: vm.pageNum,
                            }
                            vm.$store.dispatch('setParams1',params);
                        }
                        if (vm.queryType === 'sup') {
                            vm.supIsClick = true;//上级被点击过
                            vm.subIsClick = false;
                            vm.searchIsClick =false;
                            vm.account='';
                            vm.parentAccount='';
                            vm.play2Id =null;
                            //this._playId = '';
                            vm.playId=null;
                            vm.queryType ="sup";
                            let params = {
                                subordinateTopId: vm.$store.getters.spreadParams1.subordinateTopId,
                                subordinateLevel:vm.$store.getters.spreadParams1.subordinateLevel,
                                queryType:'sup',
                                parentAccountId:vm.$store.getters.spreadParams1.parentAccountId,
                                playId:vm._playId,
                                pageNum: vm.pageNum,
                            }
                            vm.$store.dispatch('setParams1',params);
                        }
                        if(vm.queryType === 'search'){
                            vm.searchIsClick =true;//搜索被点击过
                            vm.subIsClick = false;
                            vm.supIsClick =false;
                            let params = {
                                subordinateTopId: vm.$store.getters.spreadParams1.subordinateTopId,
                                subordinateLevel:vm.$store.getters.spreadParams1.subordinateLevel,
                                queryType:'search',
                                parentAccountId:vm.$store.getters.spreadParams1.parentAccountId,
                                playId:vm.$store.getters.spreadParams1.playId,
                                pageNum: vm.pageNum,
                            }
                            vm.$store.dispatch('setParams1',params);
                        }
                        if(vm.queryType==="fujisearch"){
                            vm.subIsClick = false;
                            vm.supIsClick = false;
                            vm.searchIsClick =false;
                            let params = {
                                subordinateTopId: vm.$store.getters.spreadParams1.subordinateTopId,
                                subordinateLevel:vm.$store.getters.spreadParams1.subordinateLevel,
                                queryType:'fujisearch',
                                parentAccountId:vm.$store.getters.spreadParams1.parentAccountId,
                                playId:vm.$store.getters.spreadParams1.playId,
                                pageNum: vm.pageNum,
                                createDate:this.createDate
                            }
                            vm.$store.dispatch('setParams1',params);
                        }
                    } else {
                        //this.queryType = 'search';
                    }
                    vm.loading = false;
                }).catch(err => {
                    console.log(err);
                    //this.$notify.warning({title: err});
                    vm.loading = false;
                })
            },
            checkSub(row) { //查看下级
                let vm =this;
                vm.queryType = 'sub';
                //vm.subIsClick = true;//下级被点击过
                vm.parentAccountId = row.accountId;
                vm.pageNum = 1;
                vm.queryHandle();
            },
            checkSup(row) { //查看上级
                let vm =this;
                vm.queryType = 'sup';
                //vm.supIsClick = true;
                vm._playId = row.parentId;
                vm.pageNum = 1;
                vm.queryHandle();
            },
            viewDailyReportHandler(row) {  //报表详情
                console.log(row);
                let params = {
                    accountId: row.accountId,
                    type:"Single",//代表是从个人过来的
                    subordinateLevel:this.subordinateLevel,
                    subordinateTopId:this.subordinateTopId
                }
                this.$store.dispatch('setParams',params);
                this.$router.push({
                    path: '/spread/spreadReport/SpreadReportNewDetails',
                    name: '报表详情',
                    /*query: {
                        type:"Single",//代表是从个人过来的
                        subordinateLevel:this.subordinateLevel,
                        subordinateTopId:this.subordinateTopId
                    }*/
                })
            },
            sizeChangeHandle(size) {
                this.pageSize = size;
                this.subordinateLevel = this.$store.getters.spreadParams1.subordinateLevel;
                this.subordinateTopId = this.$store.getters.spreadParams1.subordinateTopId;
                this.queryType = this.$store.getters.spreadParams1.queryType;
                this.parentAccountId =this.$store.getters.spreadParams1.parentAccountId;
                this._playId = this.$store.getters.spreadParams1.playId;
                this.pageNum = 1;
                this.queryHandle();
            },
            currentChangeHandle(crt) {
                this.pageNum = crt;
                let params = {
                    subordinateTopId: this.$store.getters.spreadParams1.subordinateTopId,
                    subordinateLevel:this.$store.getters.spreadParams1.subordinateLevel,
                    queryType:this.$store.getters.spreadParams1.queryType,
                    parentAccountId:this.$store.getters.spreadParams1.parentAccountId,
                    playId:this.$store.getters.spreadParams1.playId,
                    pageNum:crt
                }
                this.$store.dispatch('setParams1',params);
                this.subordinateLevel = this.$store.getters.spreadParams1.subordinateLevel;
                this.subordinateTopId = this.$store.getters.spreadParams1.subordinateTopId;
                this.queryType = this.$store.getters.spreadParams1.queryType;
                this.parentAccountId =this.$store.getters.spreadParams1.parentAccountId;
                this._playId = this.$store.getters.spreadParams1.playId;
                this.pageNum = this.$store.getters.spreadParams1.pageNum;
                this.queryHandle();
            },
        },
        activated() {
            this.subordinateLevel = this.$store.getters.spreadParams1.subordinateLevel;
            this.subordinateTopId = this.$store.getters.spreadParams1.subordinateTopId;
            this.queryType = this.$store.getters.spreadParams1.queryType;
            this.parentAccountId =this.$store.getters.spreadParams1.parentAccountId;
            this._playId = this.$store.getters.spreadParams1.playId;
            this.pageNum = this.$store.getters.spreadParams1.pageNum;
            if(this.queryType == "fujisearch"){//如果是从父级页面传过来时，才把父页面的时间赋值给子页面
                this.createDate = this.$store.getters.spreadParams1.createDate;
            }

            this.queryHandle();
        }
    }
</script>
