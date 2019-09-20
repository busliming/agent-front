<template>
  <el-card>
    <el-form
      label-width="60px"
      @submit.native.prevent
    >
      <el-row
        type="flex" justify="end" align="middle"
      >
        <el-form-item
          label="账号："
        >
          <el-input
            v-model="account"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          label-width="10px"
        >
          <el-button
            size="medium"
            type="primary"
            icon="el-icon-search"
            @click="searchHandle"
          >搜索</el-button>
        </el-form-item>
        <el-form-item
          label-width="10px"
        >
          <el-button
            size="medium"
            icon="el-icon-plus"
            @click="addBtnHandle"
            v-hasauth:SubAccountAddBtn
          >添加</el-button>
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
      v-loading='tableLoading'
    >
      <el-table-column
        type="index"
        label="序号"
      ></el-table-column>
      <el-table-column
        prop="account"
        label="账号"
      ></el-table-column>
      <el-table-column
        prop="realName"
        label="真实姓名"
      >
        <template slot-scope="scope">
          {{scope.row.realName || '-'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="state"
        label="状态"
      >
        <template
          slot-scope="scope"
        >
        {{scope.row.state == 1?'正常':'禁用'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="createDate"
        label="注册日期"
      ></el-table-column>
      <el-table-column
        label="操作"
      >
        <template
          slot-scope="scope"
        >
          <el-row
            type="flex"
            justify="space-around"
          >
            <el-button
              type="primary"
              size="mini"
              @click='editRowPw(scope.row)'
              v-hasauth:SubAccountEditBtn
            >修改密码</el-button>
            <el-button
              type="primary"
              size="mini"
              @click='editRowInfo(scope.row)'
              v-hasauth:SubAccountEditBtn
            >修改信息</el-button>
            <!-- <el-button
              type="primary"
              size="mini"
              @click='editRow(scope.row)'
              v-hasauth:SubAccountEditBtn
            >编辑</el-button> -->
            <el-button
              type="danger"
              size="mini"
              v-if="scope.row.state == '1'"
              @click='changeRow(scope.row,2)'
              v-hasauth:SubAccountOffBtn
            >禁用</el-button>
            <el-button
              type="success"
              size="mini"
              v-if="scope.row.state == '2'"
              @click='changeRow(scope.row,1)'
              v-hasauth:SubAccountOnBtn
            >启用</el-button>
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

    <!-- 添加子账号对话框 -->
    <el-dialog
      :title="(dialogDataState == 'add'?'添加子账号':(dialogDataState == 'editPw'?'修改密码':'修改信息'))"
      :visible.sync="dialogVisible"
      @closed='dialogClosed'
      width="37%"
      center
    >
      <el-form
        :label-width="(dialogDataState == 'editInfo'?'160px':'90px')"
        :model='dialogData'
        ref="dialogForm"
        :rules="rules"
        status-icon
      >
        <el-row
          v-if="dialogDataState == 'add' || dialogDataState == 'editPw'"
        >
          <el-form-item 
            label="子账号："
            prop="account"
            :rules='accountRules'
          >
            <el-input
              v-model="dialogData.account"
              clearable
              :readonly="dialogDataState != 'add'"
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row
          v-if="dialogDataState == 'add' || dialogDataState == 'editPw'"
        >
          <el-form-item
            :label="dialogDataState == 'add'?'密码':'新密码'"
            prop="password"
            :rules='passwordRules'
          >
            <el-input
              v-model="dialogData.password"
              placeholder="请输入6到14位字母+数组组合"
              clearable
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row
          v-if="dialogDataState == 'add'"
        >
          <el-form-item
            label="真实姓名："
            prop="realName"
          >
            <el-input
              v-model="dialogData.realName"
              clearable
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row
          v-if="dialogDataState == 'add'"
        >
          <el-form-item
            label="手机号码："
            prop="phone"
          >
            <el-input
              v-model="dialogData.phone"
              clearable
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row
          v-if="dialogDataState == 'add'"
        >
          <el-form-item
            label="QQ号码："
            prop="qq"
          >
            <el-input
              v-model="dialogData.qq"
              clearable
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row
          v-if="dialogDataState == 'add'"
        >
          <el-form-item
            label="微信号码："
            prop="weixin"
          >
            <el-input
              v-model="dialogData.weixin"
              clearable
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row
          v-if="dialogDataState == 'editInfo'"
        >
          <el-form-item
            label="人工存入单次限额："
            prop="singleMaxPayLimit"
          >
            <el-input
              v-model="dialogData.singleMaxPayLimit"
              clearable
              maxlength="8"
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row
          v-if="dialogDataState == 'editInfo'"
        >
          <el-form-item
            label="人工存入当日总限额："
            prop="dayMaxPayLimit"
          >
            <el-input
              v-model="dialogData.dayMaxPayLimit"
              clearable
              maxlength="8"
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row
          v-if="dialogDataState == 'editInfo'"
        >
          <el-form-item
            label="人工提款单次限额："
            prop="singleMaxDrawLimit"
          >
            <el-input
              v-model="dialogData.singleMaxDrawLimit"
              clearable
              maxlength="8"
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row
          v-if="dialogDataState == 'editInfo'"
        >
          <el-form-item
            label="人工提款当日总限额："
            prop="dayMaxDrawLimit"
          >
            <el-input
              v-model="dialogData.dayMaxDrawLimit"
              clearable
              maxlength="8"
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row
          v-if="dialogDataState == 'add' || dialogDataState == 'editInfo'"
        >
          <el-form-item
            label="用户角色"
            prop="roleId"
          >
            <template
              v-if="dialogDataState == 'add'"
            >
              <el-select
                v-model="dialogData.roleId"
                style="width:100%"
              >
                <el-option
                  v-for="item in rolesList"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </template>
            <template
              v-if="dialogDataState == 'editInfo'"
            >
              <el-select
                v-model="computedDialogDataRoleId"
                style="width:100%"
              >
                <el-option
                  v-for="item in rolesList"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </template>
          </el-form-item>
        </el-row>
        <el-row
          v-if="dialogDataState == 'add' || dialogDataState == 'editInfo'"
        >
          <el-form-item
            label="状态"
          >
            <el-select
              v-model="dialogData.state"
              style="width:100%"
            >
              <el-option
                label="正常"
                :value="1"
              ></el-option>
              <el-option
                label="禁用"
                :value="2"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-row>
      </el-form>  
      <span slot="footer" class="dialog-footer">
        <el-button 
        @click="dialogVisible = false"
        >取 消</el-button>
        <el-button 
        type="primary" 
        :loading="dialogSaveLoading"
        @click="dialogSaveHandle"
        >保 存</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import systemRequest from '@/request/system'
import validator from '@/tool/validate'

export default {
  name:'SubAccount',
  data () {
    const isIntegerFixed2 = (r,v,c) => { //小数点后两位
      let reg = new RegExp(/^[0-9]+(.[0-9]{2})?$/);
      if(!v){
        c();
      }
      if(!reg.test(v)){
        c(new Error('请输入最多包含两位小数的正数'))
      }else{
        c();
      }
    };
    return {
      account:'',

      pageNum:1,
      pageSize:10,
      total:0,

      tableData:[],
      tableLoading:false,

      dialogData:{
        state:1
      },
      dialogDataState:'',
      dialogVisible : false,
      dialogSaveLoading:false,
      rolesList:[],
      rules:{
        realName:[
          {validator:validator.realname,required:false,trigger:'blur'}
        ],
        phone:[
          {validator:validator.validatePhone,required:false,trigger:'blur'}
        ],
        qq:[
          {validator:validator.validateQq,required:false,trigger:'blur'}
        ],
        weixin:[
          {validator:validator.validateWechat,required:false,trigger:'blur'}
        ],
        roleId:[
          { required: true, message: '角色不能为空',trigger:'blur'},
        ],
        singleMaxPayLimit:[
          {validator:isIntegerFixed2,trigger:'blur'}
        ],
        singleMaxDrawLimit:[
          {validator:isIntegerFixed2,trigger:'blur'}
        ],
        dayMaxPayLimit:[
          {validator:isIntegerFixed2,trigger:'blur'},
          {validator:(r,v,c) => {
            if(v<this.dialogData.singleMaxPayLimit){
              c(new Error('当日总限额要大于或等于单次限额'))
            }else{
              c();
            }
          },trigger:'blur'},
        ],
        dayMaxDrawLimit:[
          {validator:isIntegerFixed2,trigger:'blur'},
          {validator:(r,v,c) => {
            if(v<this.dialogData.singleMaxDrawLimit){
              c(new Error('当日总限额要大于或等于单次限额'))
            }else{
              c();
            }
          },trigger:'blur'},
        ],
      },
    }
  },
  computed:{
    accountRules: function() {
      if(this.dialogDataState === 'add'){
        return [
          {validator:validator.account,require:true,trigger:'blur'}
        ]
      }else{
        return [
          {require:false,trigger:'blur'}
        ]
      }
    },
    passwordRules: function() {
      return [
          {required: true,message:'请输入密码',trigger: 'blur'},
          {validator:validator.password,trigger:'blur'}
        ]
    },
    computedDialogDataRoleId:{
      get:function () {
        let id = this.dialogData.roleId;
        let idx = this.rolesList.findIndex(
          function(val){
            return val.id === this.id
          },
          {id}
        )
        if(idx != -1){
          return id
        }else{
          return '无法查看该账号所属角色'
        }
      },
      set:function (val) {
        this.dialogData.roleId = val;
      }
    },
  },
  methods:{
    searchHandle(){
      this.pageNum = 1;
      this.queryHandle();
    },
    queryHandle(){ //查询子账号列表
      this.tableLoading = true;
      let data = {
        "limit":this.pageSize,
        "offset":(this.pageNum -1)*this.pageSize,
        "sort":"createDate",
        "sortOrder":"desc",
        "conditionsMap":{
          "account":this.account.trim(),
        }
      }
      systemRequest.getSubAccounts(data).then(res => {
        if(res.rows){
          this.pageSize = res.limit;
          this.pageNum = res.offset/res.limit +1;
          this.total = res.total;
          this.tableData = res.rows;
        }else{
          this.$notify({
            type:'warning',
            title:res.msg
          })
        }
        this.tableLoading = false;
      }).catch(err => {
        console.log(err)
        this.tableLoading = false;
      })
    },
    getRoles(){
      let data = {
        "limit":100,
        "offset":1,
        "sort":"id",
        "sortOrder":"desc",
        "conditionsMap":{
          "isAgent":2
          }
      }
      systemRequest.getRoles(data).then(res => {
        if(res.rows){
          this.rolesList = res.rows
        }else{
          this.$notify({
            type:'warning',
            title:res.msg
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    addBtnHandle(){ //点击添加子账号
      this.dialogData = {
        state:1
      };
      this.dialogDataState = 'add';
      this.dialogVisible = true;
    },
    dialogClosed(){ //对话框关闭
      this.$refs.dialogForm.clearValidate();
    },
    dialogSaveHandle(){  //对话框保存
      this.dialogSaveLoading = true;
      this.$refs.dialogForm.validate().then(() => {
        let data = {
          account:this.dialogData.account,
          accountType:'11',
          password:this.dialogData.password,
          phone:this.dialogData.phone,
          qq:this.dialogData.qq,
          realName:this.dialogData.realName,
          roleId:this.dialogData.roleId,
          state:this.dialogData.state,
          weixin:this.dialogData.weixin,
        };
        if(this.dialogDataState == 'add'){  //新增状态保存
          this.addAccount(data);
        }
        if(this.dialogDataState == 'editPw'){  //编辑密码状态下保存
          let data = {
            account:this.dialogData.account,
            newPassword:this.dialogData.password
          }
          this.changeSubAccountPassWord(data); 
        }
        if(this.dialogDataState == 'editInfo'){  //编辑信息状态下保存
          let data = {
            id:this.dialogData.id,
            account:this.dialogData.account,
            singleMaxPayLimit:this.dialogData.singleMaxPayLimit,
            dayMaxPayLimit:this.dialogData.dayMaxPayLimit,
            singleMaxDrawLimit:this.dialogData.singleMaxDrawLimit,
            dayMaxDrawLimit:this.dialogData.dayMaxDrawLimit,
            roleId:this.dialogData.roleId,
            state:this.dialogData.state
          }
          this.updateSubAccount(data);
        }
      }).catch( err => {
        this.$notify({
          type:'warning',
          title:'校验不通过，请检查错误提示'
        })
        this.dialogSaveLoading = false;
      })
    },
    updateSubAccount(data){  //修改信息
      systemRequest.updateSubAccount(data).then(res => {
        if(res.code == '200'){
          this.dialogVisible = false;
          this.$notify({
            type:'success',
            title:res.msg
          })
          this.queryHandle();
        }else{
          this.$notify({
            type:'warning',
            title:res.msg
          })
        }
        this.dialogSaveLoading = false;
      }).catch(err => {
        console.log(err);
      })
    },
    changeSubAccountPassWord(data){  //修改密码
      systemRequest.changeSubAccountPassWord(data).then(res => {
        if(res.code == '200'){
          this.dialogVisible = false;
          this.$notify({
            type:'success',
            title:res.msg
          })
          this.queryHandle();
        }else{
          this.$notify({
            type:'warning',
            title:res.msg
          })
        }
        this.dialogSaveLoading = false;
      }).catch(err => {
        console.log(err);
      })
    },
    addAccount(data){  //新增账号
      systemRequest.addAccount(data).then(res => {
        if(res.code == '200'){
          this.dialogVisible = false;
          this.$notify({
            type:'success',
            title:res.msg
          })
          this.queryHandle();
        }else{
          this.$notify({
            type:'warning',
            title:res.msg
          })
        }
        this.dialogSaveLoading = false;
      }).catch(err => {
        console.log(err);
      })
    },
    updateAccount(data){  //编辑账号资料    启用禁用账号
      systemRequest.updateAccount(data).then(res => {
        if(res.code == '200'){
          this.dialogVisible = false;
          this.$notify({
            type:'success',
            title:'操作成功'
          })
          this.queryHandle();
        }else{
          this.$notify({
            type:'warning',
            title:res.msg
          })
        }
        this.dialogSaveLoading = false;
      }).catch(err => {
        console.log(err);
      })
    },
    editRowPw(row){  //修改密码按钮
      this.dialogDataState = 'editPw';
      this.dialogData = Object.assign({},row);
      this.dialogVisible = true;
    },
    editRowInfo(row){  //修改信息按钮
      this.dialogDataState = 'editInfo';
      this.dialogData = Object.assign({},row);
      this.dialogVisible = true;
    },
    changeRow(row,state){  //禁用/启用按钮
      let data ={
        "state":state,
        "account":"",
        "accountType":11,
        "id":row.id,
        "disableMark":0
      }
      let _biaoti = '此操作将'+(state == '1'?'启用':'禁用')+'该账号,是否继续？';
      this.$confirm(_biaoti,'提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.updateAccount(data);  
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
    this.queryHandle(); //获取子账号列表
    this.getRoles();   //获取角色列表
  }
}
</script>