<template>
  <el-card>
    <p style="text-align:right;line-height:24px;">维护费用：app、网页、服务器维护等费用</p>
    <p style="text-align:right;line-height:24px;margin-bottom:20px;">应付总账单金额：总盈亏*占成比例+维护费用</p>
    <el-table
      :data="tableData"
      v-loading="isloading"
      style="width: 100%;"
      border
      fit
      size="medium"
      stripe
      :cell-style="{textAlign:'center'}"
      :header-cell-style="{textAlign:'center'}"
    >
      <!-- <el-table-column prop="no" label="序号"></el-table-column> -->
      <el-table-column prop="billNo" label="账单号"></el-table-column>
      <el-table-column prop="billName" label="账单名称"></el-table-column>
      <el-table-column prop="occupyProportion" label="占成比例" :formatter="occupyProportionFormatter"></el-table-column>
      <el-table-column prop="totalBillProfit" label="总盈亏">
        <template slot-scope="{row}">
          {{row.totalBillProfit | _moneyFormatterMax}}
        </template>
      </el-table-column>
      <el-table-column prop="occupyAmount" label="占成金额">
        <template slot-scope="{row}">
          {{row.occupyAmount | _moneyFormatterMax}}
        </template>
      </el-table-column>
      <el-table-column label="维护费用">
        <template slot-scope="{row}">
          {{row.maintenanceAmount | _moneyFormatterMax}} ({{row.maintenanceDay}}天)
        </template>
      </el-table-column>
      <el-table-column prop="totalBillAmount" label="应付总账单金额">
        <template slot-scope="{row}">
          {{row.totalBillAmount | _moneyFormatterMax}}
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
  </el-card>
</template>

<script>
import request from '@/request/operation'
export default {
  name:'compReport',
  data(){
    return {
      tableData:[], //列表数据
      isloading:false, //表格加载状态

      pageNum:1,
      pageSize:10,
      total:0
    }
  },
  activated(){
    this.queryHandle();
  },
    filters: {
        _moneyFormatterMax(val) {//当需要返回减号不需要返回加号 需要除以1000 需要截取保留2位小数
            if (!val) return "0.00";
            if(val==0.00)return "0.00";
            let str = String(val / 1000);
            let idx = str.indexOf('.') + 3;
            if (str.indexOf('.') > -1) {
                if (str.length > 4) {
                    str = str.slice(0, idx);
                }
            }
            str = str.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return str;
        },
    },
  methods:{
    queryHandle(){ //查询列表
      this.isloading = true;
      let data = {
        "conditionsMap": {},
        "limit": this.pageSize,
        "offset": (this.pageNum-1)*this.pageSize,
        "sort": "",
        "sortOrder": ""
      }
      request.getBill(data).then(res => {
        if(res.rows){
          this.tableData = res.rows;
          this.total = res.total;
          this.pageNum = res.offset/res.limit +1;
          this.pageSize = res.limit;
        }else{
          this.$notify.warning({title:res.msg})
        }
        this.isloading = false;
      }).catch(e => {
        console.log(e);
      })
    },
    occupyProportionFormatter(row,column,cell,index){
      // console.log(row);
      // console.log(column);
      // console.log(cell);
      // console.log(index);
      return (cell *100) + '%'
    },
    sizeChangeHandle (size) {
      this.pageSize = size;
      this.queryHandle();
    },
    currentChangeHandle(crtpage){
      this.pageNum = crtpage;
      this.queryHandle();
    },
  }
}
</script>

