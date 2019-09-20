<template>
    <el-card class="funds-report">
        <el-form :inline="true">
            <el-form-item label="账变类型：">
                <el-select v-model="type" clearable >
                    <el-option value="" label="全部"></el-option>
                    <el-option v-for="item in typeList"
                               :label="item.typeName"
                               :key="item.id"
                               :value="item.typeId"
                    >
                        {{ item.typeName }}
                    </el-option>
                </el-select>
            </el-form-item>
              <el-form-item label="货币类型：">
                <el-select v-model="moneyType" clearable>
                    <el-option value="0" label="全部"></el-option>
                    <el-option value="1" label="金币"></el-option>
                    <el-option value="2" label="积分"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="会员账号：">
                <el-input v-model="account" maxlength="16" clearable></el-input>
            </el-form-item>
            <el-form-item label="ID号：" >
                <el-input v-model.trim="playId" clearable></el-input>
            </el-form-item>
            <el-form-item label="时间：" >
                <el-date-picker
                        value-format="yyyy-MM-dd"
                        type="daterange"
                        v-model="daterange"
                        range-separator='~'
                        align="center"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        clearable
                ></el-date-picker>
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

        <el-table
                :data='tableData'
                border
                fit
                stripe
                :cell-style="{textAlign:'center'}"
                :header-cell-style="{textAlign:'center'}"
                style="margin-top:15px"
                v-loading="tableLoading"
        >
            <!-- :max-height="TABLEMAXHEIGHT"-->
            <el-table-column
                    prop="number"
                    label="订单号/局号"
                    sortable
            >
                <template slot-scope="scope">
                    {{scope.row.number | numberFormatter}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="account"
                    label="用户名"
                    sortable
            ></el-table-column>
            <el-table-column
                    prop="playId"
                    label="ID号"
                    sortable
            ></el-table-column>
            <el-table-column
                    prop="type"
                    label="账变类型"
                    sortable
            ></el-table-column>
            <el-table-column
                    prop="beforeMoney"
                    label="账变前余额"
                    sortable
            >
                <template slot-scope="scope">
                    <div v-if="scope.row.beforeMoney">
                      {{scope.row.beforeMoney | betNumberFormatter}}金币
                   </div>
                    <div v-if="scope.row.integralResidue">
                      {{scope.row.integralResidue | betNumberFormatter}}积分
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                    prop="money"
                    label="账变金额"
                    sortable
            >
                <template slot-scope="scope">
                        <div v-if="scope.row.money">
                            <el-tag size="medium" type="success" v-if="parseFloat(scope.row.beforeMoney) < parseFloat(scope.row.afterMoney)">
                            +{{ scope.row.money | betNumberFormatter }}金币
                            </el-tag>
                            <el-tag size="medium" type="danger" v-else>
                            {{scope.row.money | betNumberFormatter}}金币
                            </el-tag>
                        </div>
                        <div v-if="scope.row.integralExpend">
                            <el-tag size="medium" type="success" v-if="parseFloat(scope.row.integralResidue) < (parseFloat(scope.row.integralExpend)+parseFloat(scope.row.integralResidue))">
                            +{{ scope.row.integralExpend | betNumberFormatter }}积分
                            </el-tag>
                            <el-tag size="medium" type="danger" v-else>
                            {{scope.row.integralExpend | betNumberFormatter}}积分
                            </el-tag>
                        </div>

                </template>
            </el-table-column>
            <el-table-column
                    prop="afterMoney"
                    label="账变后余额"
                    sortable
            >
                <template slot-scope="scope">
                    <span v-if="scope.row.afterMoney">
                        {{scope.row.afterMoney | betNumberFormatter}}金币
                    </span>
                    <br>
                     <span v-if="scope.row.integralResidue">
                    {{scope.row.integralResidue | betNumberFormatter}}积分
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="createDate"
                    label="账变时间"
                    sortable
            ></el-table-column>
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
    import operationRequest from '@/request/operation'
    import times from '@/tool/times'

    export default {
        data() {
            return {
                //查询条件
                daterange: [],
                account: '',
                playId: '',
                type: '',
                moneyType:'1', //货币类型
                typeList: [],

                pageNum: 1,
                pageSize: 10,
                total: 0,

                tableLoading: false, //表格的加载状态
                tableData: [],
                isActivated:false,
            }
        },
        filters: {
            numberFormatter(val){
                let result = "无";
                if (!val) return result;
                if(val == 0) return result;
                result = val;
                return result;
            },
          betNumberFormatter(val){
            if (!val) return "0";
            let str = String(val/1000);
            let idx = str.indexOf('.') + 3;
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
            searchHandle(){
                this.pageNum = 1;
                this.queryHandle();
            },
            queryHandle() {
                if (this.playId != null&&this.playId!='') {
                    if (this.playId.toString().length > 9) {
                        this.$message.warning({message: "会员ID长度不能大于9位"});
                        return;
                    }
                    let reg = new RegExp(/^\d+$/);//包含0 和大于0的整数
                    if (!reg.test(this.playId)) {
                        this.$message.warning({message: "会员ID请输入有效格式(非负整数)"});
                        return;
                    }
                }
                let data = {
                    beginDate: this.daterange ? this.daterange[0] : '',
                    endDate: this.daterange ? this.daterange[1] : '',
                    account: this.account,
                    playId: this.playId!=''? Number(this.playId):null,
                    type: this.type,
                    moneyType:this.moneyType,

                    limit: this.pageSize,
                    offset: (this.pageNum - 1) * this.pageSize,
                    sort: 'createDate',
                    sortOrder: 'desc',
                };
                this.tableLoading = true;
                operationRequest.queryTbFundsVariety(data).then(res => {
                    this.tableLoading = false;
                    this.tableData = res.rows;
                    this.total = res.total;
                    this.isActivated = true;
                })
            },
            queryTbSysTypeList() {
                operationRequest.queryTbSysTypeList().then(res => {
                    this.typeList = res.data;
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

        },
        created() {
            this.daterange.push(times.DateToYMD(new Date()));
            this.daterange.push(times.DateToYMD(new Date()));
            this.queryHandle();
            this.queryTbSysTypeList();
        },
        /*beforeRouteLeave (to, from, next) {
            // 导航离开该组件的对应路由时调用
            // 可以访问组件实例 `this`
            this.daterange = [];
            this.daterange.push(times.DateToYMD(new Date()));
            this.daterange.push(times.DateToYMD(new Date()));
            next();
        }*/
        activated(){
               if(this.isActivated) {
                   this.daterange = [];
                   this.daterange.push(times.DateToYMD(new Date()));
                   this.daterange.push(times.DateToYMD(new Date()));
                   this.queryHandle();
                   this.queryTbSysTypeList();
               }
        }
    }
</script>

<style lang="scss" scoped>
    .funds-report {
        > el-form .el-form-item {
            margin-bottom: 0
        }
    }
</style>
