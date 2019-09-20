<template>
   <el-card>
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
                             prop="roomName"
                             label="房间名"
           >
               <template slot-scope="scope">
                   {{scope.row.gameName}} - {{scope.row.roomName}}
               </template>
           </el-table-column>
           <el-table-column
                             prop="stockWeak"
                             label="库存衰减%"
           ></el-table-column>
           <el-table-column
                            prop="sumStockWeak"
                            label="累计衰减"
           ></el-table-column>
           <el-table-column
                            prop="updateBy"
                            label="操作者"
           ></el-table-column>
           <el-table-column
                            prop="createDate"
                            label="添加时间"
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
    import controlSystem from '@/request/controlSystem'
    export default {
        name: "inventory-reduction-log",
        data(){
            return{
                pageNum: 1,
                pageSize: 10,
                total: 0,

                tableLoading: false, //表格的加载状态
                tableData: [
                    ],
            }
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
            queryHandle()
            {

                this.tableLoading = true;
                let data = {
                    "limit":this.pageSize,
                    "offset":(this.pageNum -1)*this.pageSize,
                    "sort":"createDate",
                    "sortOrder":"desc",
                    "conditionsMap":{
                    }
                }
                controlSystem.getInventoryReductionLog(data).then(res => {
                    if(res.rows){
                    this.pageSize = res.limit;
                    this.pageNum = res.offset/res.limit +1;
                    this.total = res.total;
                    this.tableData = res.rows;
                }else{
                    this.$notify.warning({title:res.msg})
                }
                this.tableLoading = false;
                }).catch(err => {
                        console.log(err)
                    this.tableLoading = false;
                })
            }
        },
        created(){
            this.queryHandle();
        }
    }
</script>

<style scoped>

</style>