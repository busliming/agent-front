<template>
  <el-card>
    <el-form
      label-width="100px"
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
              maxlength="16"
              clearable
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
              v-model.trim="playId"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col
          :span="8"
        >
          <el-form-item
            label="查询日期："
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
        </el-col>
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
        label="会员账号"
        prop="account"
      ></el-table-column>
      <el-table-column
        label="会员ID"
        prop="playId"
      ></el-table-column>
      <el-table-column
        label="一级返利"
        prop="ratio1Money"
      >
        <template slot-scope="{row}">
          {{row.ratio1Money | betNumberFormatter}}
        </template>
      </el-table-column>
      <el-table-column
        label="二级返利"
        prop="ratio2Money"
      >
        <template slot-scope="{row}">
          {{row.ratio2Money | betNumberFormatter}}
        </template>
      </el-table-column>
      <el-table-column
        label="三级返利"
        prop="ratio3Money"
      >
        <template slot-scope="{row}">
          {{row.ratio3Money | betNumberFormatter}}
        </template>
      </el-table-column>
      <el-table-column
        label="合计"
        prop="sumMoney"
      >
        <template slot-scope="{row}">
          {{row.sumMoney | betNumberFormatter}}
        </template>
      </el-table-column>
      <el-table-column
        label="返利日期"
        prop="rebateDate"
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
import spreadRequest from '@/request/spread'

export default {
  name:'SpreadUser',
  data () {
    return {
      account:'',
      playId:'',
      daterange:null,

      tableData:[],
      loading:false,

      pageNum:1,
      pageSize:10,
      total:0,
    }
  },
  filters:{
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
  methods:{
    searchHandle() {
        this.pageNum = 1;
        this.queryHandle();
    },
    queryHandle(){ //搜索列表
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
      this.loading = true;
      let data = {
        "limit":this.pageSize,
        "offset":(this.pageNum -1)*this.pageSize,
        "sort":"rebateDate",
        "sortOrder":"desc",
        "conditionsMap":{
          "account":this.account.trim(),
          "playId":this.playId!=''? this.playId:'',
          "startDate":this.daterange?this.daterange[0]:'',
          "endDate":this.daterange?this.daterange[1]:''
        }
      };
      spreadRequest.getPromotionRebates(data).then(res => {
        if(res.rows){
          this.pageNum = res.offset/res.limit +1;
          this.pageSize = res.limit;
          this.total = res.total;
          this.tableData = res.rows;
        }else{
          this.$notify({
            type:'warning',
            title:res.msg
          })
        }
        this.loading = false;
      }).catch(err => {
        console.log(err);
        this.loading = false;
      })
    },
    sizeChangeHandle(size){
      this.pageSize = size;
      this.queryHandle();
    },
    currentChangeHandle(crt){
      this.pageNum = crt;
      this.queryHandle();
    },
  },
  created () {
    this.queryHandle();
  }
}
</script>
