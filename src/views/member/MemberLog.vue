<template>
  <el-card>
    <el-form
      label-width="70px"
    >
      <el-row type="flex" justify="space-between" :gutter="20">
        <el-col :span="9">
          <el-form-item
            label="日期"
            label-width="40px"
          >
            <el-date-picker
              v-model="createDate"
              type="daterange"
              align="center"
              unlink-panels
              value-format='yyyy-MM-dd HH:mm:ss'
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width:100%;"  
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item
            label="会员账号"
          >
            <el-input
              placeholder="会员账号"
              v-model="account"
              clearable>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item
            label="IP"
            label-width="40px"
          >
            <el-input
              placeholder="请输入ip"
              v-model="ip"
              clearable
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item
            label-width="0"
          >
            <el-button type="primary" size="medium" icon="el-icon-search" @click='searchHandle'
              style="width:100%"
            >
              查询
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
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
      :default-sort = "{prop: 'createDate', order: 'descending'}"
    >
      <el-table-column
        prop="operDate"
        label="日期"
      >
      </el-table-column>
      <el-table-column
        prop="username"
        label="账号"
      >
      </el-table-column>
      <el-table-column
        prop="ip"
        label="IP"
      >
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址"
      >
      </el-table-column>
      <el-table-column
        prop="deviceName"
        label="设备"
      >
        <template slot-scope="scope">
          {{scope.row.deviceName == null?'无':scope.row.deviceName}}
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
import memberRequest from '@/request/member'
import tableHeight from '@/tool/tableHeight'

export default {
  name:'MemberList',
  data () {
    return {
      createDate:null,
      account:'',
      ip:'',

      //表格 分页
      pageSize:10,
      total:0,
      pageNum:1,
      tableData:[],
      isloading:false,
      TABLEMAXHEIGHT:0,
    }
  },
  created () {
    this.queryHandle();
  },
  methods: {
    searchHandle(){  //点击查询按钮
      this.pageNum = 1;
      this.queryHandle();
    },
    queryHandle () {   //查询会员列表
      this.isloading = true;
      let data = {
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
              }
      memberRequest.getUserOperList(data).then(res => {
        if(res.rows){
          this.tableData = res.rows;
          this.total = res.total;
          this.pageSize = res.limit;
          this.pageNum = res.offset/res.limit +1;
        }else{
          this.$notify({
            type:'warning',
            title:res.msg
          })
        }
        tableHeight(this); //计算表格高度
        this.isloading = false;
      }).catch(err => {
        console.log(err)
        this.isloading = false;
      })
    },

    sizeChangeHandle (size) {  //切换表格显示条数
      this.pageSize = size;
      this.queryHandle();
    },
    currentChangeHandle(crtpage){  //切换表格当前页
      this.pageNum = crtpage;
      this.queryHandle();
    },
  }
}
</script>

<style lang="scss">
</style>
