<template>
  <el-card>
    <el-row
      type="flex"
      align="middle"
      style="height:60px;"
    >
      <el-button type="primary" size="medium"
        @click='addLabel'
      >添加</el-button>
    </el-row>
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
      :default-sort = "{prop: 'labelSort', order: 'ascending'}"
    >
      <el-table-column
        prop="labelName"
        label="标签名称"
      >
      </el-table-column>
      <el-table-column
        prop="labelSort"
        label="排序"
      >
      </el-table-column>
      <el-table-column
        prop="memberNumber"
        label="人数"
      >
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button size="mini" plain @click="editRow(scope.row)" type="" >编辑</el-button>
          <el-button v-if="scope.row.memberNumber  == 0" size="mini" plain @click='deleteRow(scope.row)' type="danger">删除</el-button>
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

    <el-dialog
      :title='dialogTitle'
      :visible.sync='dialogVisible'
      width="30%"
      @closed='dialogClosedHandle'
    >
      <el-form
        :model="dialogData"
        label-width="120px"
        :rules="rules"
        ref="dialogForm"
      >
        <el-form-item
          label="标签名称："
          prop="labelName"
        >
          <el-input
            v-model="dialogData.labelName"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item
          label="自动出款："
        >
          <el-select v-model="dialogData.isAutomatic" placeholder="请选择"
            style="width:100%"
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="排序："
          prop="labelSort"
        >
          <el-input
            v-model="dialogData.labelSort"
            placeholder="数字越小下拉排序越靠前"
            clearable
          >
          </el-input>
        </el-form-item>

      </el-form>
      <span slot="footer">
        <el-row
          type="flex"
          justify="space-between"
        >
          <el-button @click="dialogVisible = false">
            取 消
          </el-button>
          <el-button :loading="saveLoading" type="primary" @click="dialogSaveBtnHandle">
            保存
          </el-button>
        </el-row>
      </span>
    </el-dialog>
    
  </el-card>
</template>

<script>
import memberRequest from '@/request/member'
import tableHeight from '@/tool/tableHeight'

export default {
  name:'MemberList',
  data () {
    const valiLabelName = (r,v,c) => {
      c();
    }
    const valiLabelSort = (r,v,c) => {
      c();
    }
    return {
      dialogTitle:'',
      dialogVisible:false,
      dislogState:'',
      saveLoading:false,
      dialogData:{},
      rules:{
        labelName:[
          {required:true,message: '请输入标签名称', trigger: 'blur'},
          {validator:valiLabelName,trigger:'blur'}
        ],
        labelSort:[
          {required:true,message: '请输入标签名称', trigger: 'blur'},
          {validator:valiLabelSort,trigger:'blur'}
        ],
      },

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
    dialogClosedHandle(){ //弹窗关闭
      this.$refs.dialogForm.resetFields();
    },
    queryHandle () {   //查询列表
      this.isloading = true;
      let data = {
                "conditionsMap": {
                },
                limit: this.pageSize,
                offset:(this.pageNum -1)*this.pageSize,
                "sort": "create_date",
                "sortOrder": "desc"
              }
      memberRequest.queryUserLabels(data).then(res => {
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
      }).catch(err => {
        console.log(err)
      })
      this.isloading = false;
    },
    addLabel () {  //点击新增
        if (this.total == 20 || this.total >20) {//bug 12514 同会员等级
            this.$message.warning('会员标签最多不能超过20个，无法继续添加');
            return
        }
        this.dialogTitle = '添加标签'
        this.dialogState = 'add';
        this.dialogData = {
            labelName: '',
            isAutomatic: 1,
            labelSort: ''
        }
        this.dialogVisible = true;
    },
    editRow(row) { //编辑
      this.dialogTitle = '编辑标签'
      this.dialogState = 'edit';
      this.dialogData = Object.assign({},row)
      this.dialogVisible = true;
    },
    dialogSaveBtnHandle(){ //弹窗点击保存
      this.saveLoading = true;
      this.$refs.dialogForm.validate().then( () => {
        let data = {
          isAutomatic:this.dialogData.isAutomatic,
          labelName:this.dialogData.labelName,
          labelSort:this.dialogData.labelSort
        }
        if(this.dialogState == 'edit'){
          data.id = this.dialogData.id;
        }
        memberRequest.addOrUpdateUserLabel(data).then(res => {
          if(res.code == 200){
            this.$notify({
              type:'success',
              title:res.msg
            })
          }else{
            this.$notify({
              type:'warning',
              title:res.msg
            })
          }
          this.saveLoading = false;
          this.dialogVisible = false;
          this.queryHandle();
        }).catch(err => {
          console.log(err);
        })
        this.saveLoading = false;
        this.dialogVisible = false;
      }).catch(err => {
        this.$notify({
          type:'error',
          title:'校验不通过，请检查页面错误提示。'
        })
        this.saveLoading = false;
        this.dialogVisible = false;
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
    deleteRow(row){  //删除
      this.$confirm(
        '请确认是否要删除标签：'+row.labelName,
        '提示',
        {
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning',
          center:true
        }
      ).then(() => {
        this.isloading = true;
        memberRequest.deleteRole({
          id:row.id,
        }).then(res => {
          if(res.code == '200'){
            this.$notify({
              title:'操作成功',
              type:'success',
              duration:3*1000
            })
            this.isloading = false;
            this.queryHandle();
          }else{
            this.$notify({
              title:'操作失败',
              message:res.msg,
              type:'warning',
              duration:3*1000
            })
            this.isloading = false;
          }
        }).catch(err => {
          console.log(err)
        })
      }).catch(() => {
      });
    }
  },
}
</script>

<style lang="scss">
</style>
