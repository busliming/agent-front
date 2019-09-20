<template>
    <el-card>

        <el-table
                :data="tableData"
                v-loading="isloading"
                style="width: 100%;"
                :border='true'
                :fit='true'
                size="medium"
                stripe
                :cell-style='{textAlign:"center"}'
                :header-cell-style='{textAlign:"center"}'
                :default-sort = "{prop: 'vipLevel', order: 'ascending'}"
        >
            <el-table-column
                    prop="vipLevel"
                    label="等级名称"
            >
                <template slot-scope="scope">
                  VIP{{scope.row.vipLevel}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="vipBet"
                    label="晋升条件"
            >
                <template slot-scope="scope">
                    {{scope.row.vipBet | _moneyFormatter}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="vipAmount"
                    label="会员数"
            >
            </el-table-column>
           <!-- <el-table-column
                    prop="levelAmount"
                    label="晋级礼包数"
            >
            </el-table-column>
            <el-table-column
                    prop="weekAmount"
                    label="周礼包数"
            >
            </el-table-column>
            <el-table-column
                    prop="monthAmount"
                    label="月礼包数"
            >
            </el-table-column>-->
            <el-table-column
                    prop="status"
                    label="状态"
            >
                <template slot-scope="scope">
                    <el-tag type="success" v-if="scope.row.status == 1">开启</el-tag>
                    <el-tag type="error" v-else>关闭</el-tag>
                </template>
            </el-table-column>
        </el-table>
       <!-- <el-row type="flex" justify="center">
            <el-pagination
                    @size-change="sizeChangeHandle"
                    @current-change="currentChangeHandle"
                    :current-page="pageNum"
                    :page-sizes="[10,20,50,100,200]"
                    :page-size.sync="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-row>-->
    </el-card>
</template>

<script>
    import memberRequest from '@/request/member'
   // import tableHeight from '@/tool/tableHeight'

    export default {
        name:'MemberReport',
        data () {
            return {
                //表格 分页
                // pageSize:10,
                // total:0,
                // pageNum:1,
                tableData:[],
                isloading:false,
               // TABLEMAXHEIGHT:0,
            }
        },
        created () {
            this.queryHandle();
        },
        filters:{
            _moneyFormatter(val){//当不需要返回加减号 需要除以1000 需要截取保留2位小数
                //console.log(val);
                if (!val) return "0.00";
                let str = String(val/1000);
                let idx = str.indexOf('.') + 3;
                if(str.indexOf('.') > -1){
                    if(str.length>4){
                        str = str.slice(0,idx);
                    }
                }
                return str;//.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            },
        },
        methods: {
            queryHandle () {   //获取站点VIP统计信息
                this.isloading = true;
               /* let data = {
                    "conditionsMap": {
                        "origin":"account-service",
                        // "operation":"登录游戏", bug 4661
                        "operation":"账号登录",
                        "userName": this.account.trim(),
                        "ip": this.ip.trim(),
                        "eventStart":this.createDate?this.createDate[0]:'',
                        "eventEnd":this.createDate?this.createDate[1]:''
                    },
                    "limit": this.pageSize,
                    "offset": (this.pageNum -1)*this.pageSize,
                    "sort": "",
                    "sortOrder": ""
                }*/
               let data = {};
                memberRequest.getSiteVipInfo(data).then(res => {
                    if(res.code == "200"){
                        if(res.data&&res.data!=null){
                            this.tableData = res.data;
                            // this.total = res.total;
                            // this.pageSize = res.limit;
                            // this.pageNum = res.offset/res.limit +1;

                        }
                    }
                   else{
                        this.$notify({
                            type:'warning',
                            title:res.msg
                        })
                    }
                   // tableHeight(this); //计算表格高度
                    this.isloading = false;
                }).catch(err => {
                    console.log(err)
                    this.isloading = false;
                })
            },
           /* sizeChangeHandle (size) {  //切换表格显示条数
                this.pageSize = size;
                this.queryHandle();
            },
            currentChangeHandle(crtpage){  //切换表格当前页
                this.pageNum = crtpage;
                this.queryHandle();
            },*/
        }
    }
</script>

<style lang="scss">
</style>
