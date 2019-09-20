<template>
<el-card>
  <el-row>
    <el-button size="medium" type="primary" @click='addBtnHandle'
      v-hasauth:MemberLevelAddBtn
    >
      <i class="el-icon-circle-plus"></i>
      <span>新增等级</span>
    </el-button>
  </el-row>
  <el-table
    style='width:100%;margin-top:20px;'
    fit
    border
    v-loading='tableLoading'
    :header-cell-style="{textAlign:'center'}"
    :cell-style="{textAlign:'center'}"
    stripe
    :data='levelData'
  >
    <el-table-column
      prop='levelName'
      label='等级名称'
    >
    </el-table-column>
    <el-table-column
      prop='conditionMoney'
      label='晋升条件'
    >
    </el-table-column>
    <el-table-column
      prop='userCount'
      label='会员数'
    >
    </el-table-column>
    <el-table-column
      label='操作'
    >
      <template slot-scope="scope">
        <el-tag v-if="scope.row.levelName == '普通会员'">
          默认等级，不可操作
        </el-tag>
        <el-button size="mini" @click='editBtnhandle(scope.row)' type="primary" v-else
          v-hasauth:MemberLevelEditBtn
        >
        编辑 
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-row
    type="flex" justify="center"
  >
    <el-pagination
      @size-change='sizechangehandle'
      @current-change='currentchangehandle'
      :page-sizes="[10,20,50,100,200]"
      :page-size="pageSize"
      :current-page="pageNum"
      :total="total"
      layout="total,sizes,prev,pager,next,prev,jumper"
    ></el-pagination>
  </el-row>

  <el-dialog
    :title='dialogTitle'
    :visible.sync='dialogVisible'
    width="40%"
    @closed='dialogClosedHandle'
  >
    <el-form
      :model="dialogData"
      label-width="130px"
      :rules="rules"
      ref="dialogForm"
    >
      <el-form-item
        label="等级名称："
        prop="levelName"
      >
        <el-input
          v-model="dialogData.levelName"
          clearable
        >
        </el-input>
      </el-form-item>
      <el-form-item
        label="晋升条件："
        prop="conditionMoney"
      >
        <el-input
          type="number"
          placeholder="请输入金额"
          v-model="dialogData.conditionMoney"
          clearable
        >
          <template slot="prepend">￥</template>
        </el-input>
      </el-form-item>
      <el-form-item
        label="出款稽核模板："
        prop="templateId"
      >
        <el-select v-model.number="dialogData.templateId" placeholder="请选择">
          <el-option v-for="item in drawPayConfigList" :key="item.id"
            :label="item.templateName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="备注："
      >
        <el-input
          v-model="dialogData.remark"
          clearable=""
          type="textarea"
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
        <el-popover
          placement="top"
          width="200"
          v-if="(dialogState == 'edit')&&(dialogData.userCount == '0')"
          v-model="deletePopvisible">
          <p>确定删除该用户等级吗？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="deletePopvisible = false">取消</el-button>
            <el-button :loading='deleteLoading' type="primary" size="mini" @click="dialogDeleteBtnHandle">确定</el-button>
          </div>
          <el-button type="danger" slot="reference">删除</el-button>
        </el-popover>
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
import vali from '@/tool/validate'

export default {
  name:'MemberLevel',
  data () {
    return {
      levelData:[
      ],
      dialogTitle:'',
      dialogVisible:false,
      dialogData:{},
      drawPayConfigList:[], //出入款配置模板列表
      dialogState:'add',  //add新增 edit编辑
      loading:true,

      rules:{
        levelName:[
          { required: true, message: '请输入等级名称', trigger: 'blur' },
          { validator:vali.checklevelName, trigger: 'blur' }
        ],
        conditionMoney:[
          { required: true, message: '请输入晋升条件', trigger: 'blur' },
        ],
        templateId:[
          { required: true, message: '请选择出款稽核模板', trigger: 'blur' },
        ]
      },

      deletePopvisible:false,
      deleteLoading:false,
      saveLoading:false,

      pageSize:10,
      pageNum:1,
      total:0,
    }
  },
  methods: {
    getLevel(){  //获取会员等级列表
      this.tableLoading = true;
      memberRequest.getLevel({
        limit:this.pageSize,
        offset:(this.pageNum -1)*this.pageSize,
        sort:"id",
        sortOrder:"desc",
      }).then(res => {
        if(res.rows){
          this.levelData = res.rows;
          this.pageSize = res.limit;
          this.pageNum = res.offset/res.limit +1;
          this.total = res.total;
        }else{
          this.$notify({
            type:'warning',
            title:res.msg
          })
        }
      }).catch(err => {
        console.log(err)
      })
      this.tableLoading = false;
    },
    getDrawPayConfigList() {
      //获取出入款配置列表
      memberRequest.getDrawPayConfigList().then(res => {
        if (res.code == 200) {
          this.drawPayConfigList = res.data;
        } else {
          this.$notify.warning({ title: res.msg });
        }
        this.loading = false;
      })
      .catch(e => {
        console.log(e);
        this.loading = false;
      });
    },
    
    addBtnHandle () { //点击新增等级按钮
      //bug单10060新增需求   限制20个会员等级
      if(this.total == 20 || this.total >20){
        this.$message.warning('会员等级最多不能超过20个，无法继续添加');
        return
      }
      this.dialogData = {};
      this.dialogTitle = '添加新的会员等级'
      this.dialogState = 'add';
      this.getDrawPayConfigList();
      this.dialogVisible = true;
    },
    editBtnhandle (row) {   //编辑等级
      this.dialogData = Object.assign({},row);
      this.dialogTitle = `修改${row.levelName}等级`
      this.dialogState = 'edit';
      this.getDrawPayConfigList();
      this.dialogVisible = true;
    },
    dialogClosedHandle(){  //对话框关闭
      this.$refs.dialogForm.clearValidate(); //移除验证项
    },
    dialogSaveBtnHandle(){ //保存等级信息
      this.saveLoading = true;
      let data = {
        conditionMoney:(this.dialogData.conditionMoney+'').trim(),
        levelName:(this.dialogData.levelName+'').trim(),
        templateId:this.dialogData.templateId,
        remark:this.dialogData.remark?this.dialogData.remark.trim():'',
      }
      //判断新增还是编辑
      if(this.dialogState == 'add'){
        this.$refs.dialogForm.validate().then(()=>{
          memberRequest.addLevel(data).then(res => {
            if(res.code == '200'){
              this.saveLoading = false;
              this.dialogVisible = false;
              this.$notify({
                title:'添加成功',
                type:'success',
              })
              this.getLevel();
            }else{
              this.$notify({
                title:res.msg,
                type:'error',
              })
              this.saveLoading = false;
            }
          }).catch(err => {
            console.log(err);
          })
        }).catch(() => {
          this.$notify({
            type:'warning',
            title:'验证不通过，请检查错误提示'
          })
          this.saveLoading = false;
        })
      }else{
        data.id = this.dialogData.id;
        data.state = this.dialogData.state;
        this.$refs.dialogForm.validate().then(()=>{
          memberRequest.updateLevel(data).then(res => {
            if(res.code == '200'){
              this.saveLoading = false;
              this.dialogVisible = false;
              this.$notify({
                title:'编辑成功',
                type:'success',
              })
              this.getLevel();
            }else{
              this.$notify({
                title:res.msg,
                type:'error',
              })
              this.saveLoading = false;
            }
          }).catch(err => {
            console.log(err);
          })
        }).catch( ()=> {
          this.$notify({
            type:'warning',
            title:'验证不通过，请检查错误提示'
          })
          this.saveLoading = false;
        })
      }
    },
    dialogDeleteBtnHandle(){ //删除等级
      this.deleteLoading = true;
      memberRequest.deleteLevel({
        id:this.dialogData.id
      }).then(res => {
        if(res.code == '200'){
          this.deleteLoading = false;
          this.deletePopvisible = false;
          this.dialogVisible = false;
          this.$notify({
            title:'删除成功',
            type:'success',
          })
          this.getLevel();
        }else{
          this.deleteLoading = false;
          this.$notify({
            title:'删除失败',
            type:'warning',
          })
        }
      }).catch(err => {
        console.log(err);
      })
    },
    sizechangehandle(size){
      this.pageSize = size;
      this.getLevel();
    },
    currentchangehandle(crt){
      this.pageNum = crt;
      this.getLevel();
    },
  },
  created () {
    this.getLevel();
  }
}
</script>
