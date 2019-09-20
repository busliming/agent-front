<template>
  <el-card>
    <el-form
      label-width="90px"
    >
      <el-row
        type="flex" justify="space-between"
      >
        <el-col
          :span="6"
        >
          <el-form-item
            label="公告类型"
          >
            <el-select
              v-model="type"
              clearable
            >
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col
          :span="12"
        >
          <el-form-item
            label="开始时间"
          >
            <el-date-picker
              type="datetimerange"
              range-separator="~"
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="datetimerange"
              align="center"
              style="width:100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-form-item label-width="0">
          <el-button
            size="medium"
            type="primary"
            icon="el-icon-search"
            @click="searchHandle"
          >搜索</el-button>
        </el-form-item>
        <el-form-item label-width="0">
          <el-button
            size="medium"
            icon="el-icon-plus"
            @click="addAnnounceBtnHandle"
            v-hasauth:AnnounceListAddBtn
          >添加</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <el-table
      border
      fit
      stripe
      :data='tableData'
      v-loading='isloading'
      :cell-style="{textAlign:'center'}"
      :header-cell-style="{textAlign:'center'}"
    >
      <el-table-column
        type="index"
        label="序号"
      ></el-table-column>
      <el-table-column
        prop="type"
        label="类型"
      >
        <template
          slot-scope="scope"
        >
          <span
            v-if="scope.row.type == '11'"
          >系统游戏公告</span>
          <span
            v-if="scope.row.type == '12'"
          >维护公告</span>
          <span
            v-if="scope.row.type == '13'"
          >站点公告</span>
          <span
            v-if="scope.row.type == '14'"
          >一般游戏公告</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="noticeContent"
        label="公告内容"
      ></el-table-column>
      <el-table-column
        prop="updateDate"
        label="发布时间"
      ></el-table-column>
      <el-table-column
        prop="state"
        label="公告状态"
      >
        <template slot-scope="scope">
          {{scope.row.state == '1'?'启用':'禁用'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="updateBy"
        label="创建人"
      ></el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
      ></el-table-column>
      <el-table-column
        label="操作"
      >
        <template slot-scope="scope">
          <el-row
            type="flex" justify="space-around"
          >
            <el-button
              size="mini"
              type="primary"
              @click="editRow(scope.row)"
              v-hasauth:AnnounceListEditBtn
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="deleteRow(scope.row)"
              v-hasauth:AnnounceListDelBtn
            >删除</el-button>
          </el-row>
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

    <!-- 添加公告对话框 -->
    <el-dialog
      :title="(dialogDataState == 'add'?'添加公告':'编辑公告')"
      :visible.sync="dialogVisible"
      width="32%"
      center
      @closed='dialogClosed'
    >
      <el-form
        label-width="90px"
        :model='dialogData'
        ref="dialogForm"
        :rules="rules"
        status-icon
      >
        <el-row>
          <el-form-item
            label="公告内容："
            prop="noticeContent"
          >
            <el-input
              type="textarea"
              v-model.trim="dialogData.noticeContent"
              placeholder="请输入公告内容"
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item
            label="备注："
            prop="remark"
          >
            <el-input
              v-model="dialogData.remark"
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item
            label="公告类型"
          >
            <el-select
              v-model="dialogData.type"
              style="width:100%"
            >
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item
            label="公告状态"
          >
            <el-select
              v-model="dialogData.state"
              style="width:100%"
            >
              <el-option
                :value="1"
                label="启用"
              ></el-option>
              <el-option
                :value="2"
                label="禁用"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row
          v-if="dialogDataState == 'add'"
        >
          <el-form-item
            label="发送区域"
          >
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <el-checkbox-group v-model="checkedAreas" @change="handleCheckedChange">
              <el-checkbox :label="1" >收件箱</el-checkbox>
              <el-checkbox :label="2" >走马灯</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-row>
        <el-row
          v-if="zmdIsCheck&&(dialogDataState == 'add')"
        >
          <el-form-item
            label="时间范围"
          >
            <el-date-picker
              type="datetimerange"
              range-separator="~"
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="dialogData.datetimerange"
              align="center"
              style="width:100%"
            ></el-date-picker>
          </el-form-item>
        </el-row>
        <el-row
          v-if="dialogDataState == 'add'"
        >
          <el-form-item
            label="使用终端"
          >
            <el-select v-model="terminal" placeholder="全部"
              style="width:100%"
            >
              <el-option
                value="all"
                label="全部"
              ></el-option>
              <el-option
                value="pc"
                label="电脑端"
              ></el-option>
              <el-option
                value="mobile"
                label="移动端"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="small"
        @click="dialogCancleBtn">取 消</el-button>
        <el-button
          size="small"
          type="primary"
          @click="dialogSaveBtn"
          :loading="dialogSaveBtnLoading"
        >保 存</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import messageRequest from '@/request/message'
import validator from '@/tool/validate'

export default {
  name:'AnnounceList',
  data () {
    return {
      type:'',
      datetimerange:[""],

      terminal:'', //all pc mobile
      isIndeterminate:false,
      checkAll:'',  //是否全选
      checkedAreas:[],//发送区域

      typeOptions:[
        {
          value:'14',
          label:'一般游戏公告'
        },
        {
          value:'13',
          label:'站点公告'
        },
        {
          value:'12',
          label:'维护公告'
        },
        {
          value:'11',
          label:'系统游戏公告'
        },
      ],

      pageNum:1,
      pageSize:10,
      total:0,

      tableData:[],
      isloading:false,

      dialogData:{
        type: '14'
      },
      dialogDataState:'',
      currentRowId:'',
      rowdatetimerange:[], //编辑公告时，公告有效范围

      rules:{
        noticeContent:[
          {
            validator:validator.noticeContent,
            trigger:'blur'
          }
        ],
        remark:[
          {
            validator:validator.remark,
            trigger:'blur'
          }
        ]
      },
      dialogVisible : false,
      dialogSaveBtnLoading:false,
    }
  },
  computed:{
    zmdIsCheck(){ //走马灯已选择则需要输入时间
      return this.checkedAreas.includes(2);
    }
  },
  methods:{
    searchHandle(){
      this.pageNum = 1;
      this.queryHandle();
    },
    queryHandle(){ //搜索公告列表
      this.isloading = true;
      let data = {
        conditionsMap:{
          isAgent:2,
          isEmail:2,
          type:this.type,
          beginDate:this.datetimerange?this.datetimerange[0] : '',
          endDate:this.datetimerange?this.datetimerange[1] : '',
          sort:"createDate",
          sortOrder:"desc",
        },
        offset:(this.pageNum -1)*this.pageSize,
        limit:this.pageSize,
        sort:"createDate",
        sortOrder:"desc",
      };
      messageRequest.getNotices(data).then( res => {
        this.pageSize = res.limit;
        this.pageNum = res.offset/res.limit +1;
        this.total = res.total;
        this.tableData = res.rows;
        this.isloading = false;
      }).catch(err => {
        console.log(err);
        this.isloading = false;
      })
    },
    handleCheckAllChange(value){ //发送区域全选
      this.checkedAreas = value ? [1,2] : [];
      this.isIndeterminate = false;
    },
    handleCheckedChange(value){  //勾选的区域改变
      let checkedCount = value.length;
      this.checkAll = checkedCount === 2;
      this.isIndeterminate = checkedCount > 0 && checkedCount < 2;
    },

    sizeChangeHandle(sz){
      this.pageSize = sz;
      this.queryHandle();
    },
    currentChangeHandle(crt){
      this.pageNum = crt;
      this.queryHandle();
    },
    addAnnounceBtnHandle(){ //点击添加公告
      this.dialogDataState = 'add';
      this.dialogData.state = 1;
      this.checkAll = false;
      this.isIndeterminate = false;
      this.checkedAreas = [];
      this.dialogVisible = true;
    },
    dialogCancleBtn(){ //弹窗点击取消
      this.dialogVisible = false;
    },
    dialogClosed(){  //弹窗关闭后
      this.dialogData = {  //恢复默认数据
        type:'11',
        state:1,
      }
      this.checkedAreas = [];
      this.$refs.dialogForm.clearValidate();
    },
    dialogSaveBtn(){ //弹窗点击保存
      if(this.dialogDataState == 'add'&&this.checkedAreas.length == 0){
        this.$notify.warning({title:'请选择发送区域'})
        return
      }
      this.dialogSaveBtnLoading = true;
      this.$refs.dialogForm.validate().then(resolve => {
        let data = {
          conditionsMap:{},
          isEmail:this.checkAll?'0':this.checkedAreas[0],
          noticeContent:this.dialogData.noticeContent.trim(),
          remark:this.dialogData.remark || '',
          state:this.dialogData.state,
          terminal:this.terminal?this.terminal:'all',
          type:this.dialogData.type,
          noticeTitle:''
        }
        if(this.zmdIsCheck){
          if(this.dialogData.datetimerange){
            data.beginDate = this.dialogData.datetimerange[0]; //年月日时分秒
            data.endDate = this.dialogData.datetimerange[1];
          }else{
            this.$notify({
              type:'warning',
              title:'走马灯公告请选择时间范围'
            })
            this.dialogSaveBtnLoading = false;
            return
          }
        }
        if(this.dialogDataState == 'edit'){
          data.id = this.currentRowId;
          data.beginDate = this.rowdatetimerange[0]; //年月日时分秒
          data.endDate = this.rowdatetimerange[1];
          data.isEmail = 2;
        }
        messageRequest.addOrUpdateNotice(data).then( res => {
          if(res.code == '200'){
            this.dialogSaveBtnLoading = false;
            this.dialogVisible = false;
            this.queryHandle();
            this.$notify({
              type:'success',
              title:res.msg
            })
          }else{
            this.dialogSaveBtnLoading = false;
            this.$notify({
              type:'warning',
              title:res.msg
            })
          }
        }).catch( err => {
          console.log(err);
          this.dialogSaveBtnLoading = false;
        })
      }).catch(err => {
        console.log(err);
        this.$notify({
          type:'warning',
          title:'校验不通过，请检查页面错误提示'
        })
        this.dialogSaveBtnLoading = false;
      })
    },
    editRow(row){ //编辑公告
      this.dialogDataState = 'edit';
      this.dialogData = Object.assign({},row);
      this.terminal = row.terminal;
      this.rowdatetimerange = [row.beginDate,row.endDate];
      this.dialogVisible = true;
      this.currentRowId = row.id;
    },
    deleteRow(row){   //删除公告
      console.log(row);
      this.$confirm('确认删除该条公告吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {id:row.id}
        messageRequest.deleteNotice(data).then( res => {
          if(res.code == '200'){
            this.queryHandle();
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
        }).catch( err => {
          console.log(err);
        })
      })
    }
  },
  created () {
    this.queryHandle();
  }
}
</script>
