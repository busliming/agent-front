<template>
  <el-card>
    <el-form
      label-width="80px"
    >
      <el-row type="flex" justify="space-between">
        <el-col :span="5">
          <el-form-item
            label="一级菜单"
          >
            <el-select v-model="levelOne" clearable placeholder="全部"
              style="width:100%"
              @change="getLogMenulist(levelOne)"
            >
              <el-option
                v-for="item in levelOneOptions"
                :key="item.menuName"
                :value="item.id"
                :label="item.menuName"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item
            label="二级菜单"
          >
            <el-select v-model="levelTwo" clearable placeholder="全部"
              style="width:100%"
            >
              <el-option
                v-for="item in levelTwoOptions"
                :key="item.menuName"
                :value="item.id"
                :label="item.menuName"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item
            label="操作时间"
          >
            <el-date-picker
              v-model="operateTime"
              type="daterange"
              align="center"
              value-format='yyyy-MM-dd'
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
            label="操作人"
          >
            <el-input
              placeholder="操作人"
              v-model="operater"
              clearable>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row
        type="flex" justify="end"
      >
        <el-col :span="3">
          <el-form-item
          >
            <el-row
              type="flex" justify="end"
            >
              <el-button type="primary" size="medium" icon="el-icon-search" @click='searchHandle'>
                搜索
              </el-button>
            </el-row>
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
        label="一级菜单"
        prop="oneMenu"
      ></el-table-column>
      <el-table-column
        label="二级菜单"
        prop="twoMenu"
      ></el-table-column>
      <el-table-column
        label="内容"
        prop="operation"
        width="500"
      ></el-table-column>
      <el-table-column
        label="操作时间"
        prop="operDate"
        width="110"
      ></el-table-column>
      <el-table-column
        label="操作人"
        prop="username"
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
import systemRequest from '@/request/system'
import memberRequest from '@/request/member'

export default {
  name:'OperateLog',
  data(){
    return {
      levelOne:'', //查询条件一级菜单id
      levelTwo:'', //二级菜单id
      operateTime:null, //操作时间
      operater:'', //操作人

      levelOneOptions:[
        {id:'1',menuName:'全部'}
      ],
      levelTwoOptions:[
        {id:'1',menuName:'全部'}
      ],

      tableData:[],
      isloading:false,

      pageNum:1,
      pageSize:10,
      total:0,
    }
  },
  methods:{
    searchHandle(){
      this.pageNum = 1;
      this.queryHandle();
    },
    queryHandle(){ //查询表格数据
      this.isloading = true;
      let data = {
        "conditionsMap": {
          origin:'agent',
          flag:'agent',
          userName:this.operater,
          oneMenu:this.levelOne,
          twoMenu:this.levelTwo,
          eventStart:this.operateTime?this.operateTime[0]:'',
          eventEnd:this.operateTime?this.operateTime[1]:''
        },
        "limit": this.pageSize,
        "offset": (this.pageNum -1)*this.pageSize,
        "sort": "operDate",
        "sortOrder": "desc"
      };
      memberRequest.getUserOperList(data).then(res => {
        if(res.rows){
          this.tableData = res.rows;
          this.pageSize = res.limit;
          this.total = res.total;
          this.pageNum = res.offset/res.limit +1;
        }else{
          this.$notify({
            type:'warning',
            title:res.msg
          })
        }
        this.isloading = false;
      }).catch(err => {
        console.log(err);
        this.isloading = false;
      })
    },
    getLogMenulist(id){ //获取日志菜单列表
      if(id != 0){
        this.levelTwoOptions = [];
      }
      if(!id){
        id = 0;
      }
      systemRequest.getLogMenulist({menuLevel:id}).then(res => {
        if(res.code == 200){
          if(id === 0){
            this.levelOneOptions = res.data;
          }else{
            this.levelTwoOptions = res.data;
          }
        }else{
          this.$message({
            type:'warning',
            message:'获取菜单失败'
          })
        }
      }).catch(err => {
        console.log(err);
      })
    },
    sizeChangeHandle(sz){
      this.pageSize = sz;
      this.queryHandle();
    },
    currentChangeHandle(crt){
      this.pageNum = crt;
      this.queryHandle();
    }
  },
  created(){
    this.queryHandle();
    this.getLogMenulist(0);
  }
}
</script>

