<template>
  <el-card>
    <el-form
      label-width="90px"
      @submit.native.prevent
    >
      <el-row
        type="flex" justify="end" align="middle"
      >
        <el-form-item
          label="角色名称："
        >
          <el-input
            v-model="roleName"
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
            v-hasauth:RoleManageAddBtn
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
      style="margin-top:10px"
      v-loading='loading'
    >
      <el-table-column
        type="index"
        label="序号"
        width="60px"
      ></el-table-column>
      <el-table-column
        prop="roleName"
        label="角色名称"
      ></el-table-column>
      <el-table-column
        prop="croleName"
        label="角色描述"
      ></el-table-column>
      <el-table-column
        label="操作"
      >
        <template
          slot-scope="scope"
        >
          <el-row
            type="flex" justify="space-around"
          >
            <el-button type="info" size="mini"
            @click="editRow(scope.row)"
              v-hasauth:RoleManageDelBtn
            >编辑</el-button>
            <el-button type="success" size="mini"
            v-if="scope.row.state == '2'"
            @click="changeState(scope.row,1)"
              v-hasauth:RoleManageOffBtn
            >启用</el-button>
            <el-button type="warning" size="mini"
            v-if="scope.row.state == '1'"
            @click="changeState(scope.row,2)"
              v-hasauth:RoleManageOffBtn
            >禁用</el-button>
            <el-button type="danger" size="mini"
            @click="deleteRow(scope.row)"
              v-hasauth:RoleManageDelBtn
            :loading="deleteBtnLoading[scope.row.id]"
            >删除</el-button>
            <el-button type="primary" size="mini"
            @click="editPermissions(scope.row)"
              v-hasauth:RoleManagePermBtn
            >权限控制</el-button>
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

    <!-- 添加角色对话框 -->
    <el-dialog
      :title="(dialogDataState == 'add'?'添加角色':'编辑角色')"
      :visible.sync="dialogVisible"
      width="37%"
      center
      @closed='dialogClosed'
    >
      <el-form
        label-width="100px"
        :model="dialogData"
        ref="dialogForm"
        :rules="rules"
      >
        <el-row>
          <el-form-item
            label="角色名称："
            prop="roleName"
          >
            <el-input
              v-model="dialogData.roleName"
              clearable
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item
            label="角色描述："
            prop="croleName"
          >
            <el-input
              v-model="dialogData.croleName"
              clearable
            ></el-input>
          </el-form-item>
        </el-row>
      </el-form>  
      <span slot="footer" class="dialog-footer">
        <el-button 
          @click="dialogVisible = false" 
        >取 消</el-button>
        <el-button type="primary" 
          @click="dialogSaveBtn"
          :loading="dialogSaveLoading"
        >保 存</el-button>
      </span>
    </el-dialog>

    <!-- 编辑权限对话框 -->
    <el-dialog
      title="编辑角色权限"
      :visible.sync="permissionDialogVisible"
      width="37%"
      center
    >
      <el-row
        type="flex" justify="end" :gutter="20"
        style="margin-bottom:20px;"
      >
        <el-button size='mini' @click="checkAll(1)">全选所有</el-button>
        <el-button size='mini' @click="checkAll(0)">取消全选</el-button>
      </el-row>
      <el-tree 
        :data="roleMenuList" 
        empty-text='数据获取中...'
        show-checkbox
        check-strictly
        node-key="id"
        highlight-current
        default-expand-all
        check-on-click-node
        :expand-on-click-node='false'
        :props="defaultProps" 
        ref='permissionTree'
        :default-checked-keys='checkedKeys'
        @node-click='nodeClickHandle'
      >
        <!-- 自定义全选功能 -->
        <span class="role-manage-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span
            v-if="data.nodes"
          >
            <el-button
              type="text"
              size="mini"
              @click.stop="nodeCheckAll(data,true)">
              全选
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click.stop="nodeCheckAll(data,false)">
              取消全选
            </el-button>
          </span>
        </span>
      </el-tree>
      
      <span slot="footer" class="dialog-footer">
        <el-button 
          @click="permissionDialogVisible = false"
        >取 消</el-button>
        <el-button 
          type="primary" 
          @click="permissionDialogSaveBtn"
          :loading="permissionDialogSaveLoading"
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
    return {
      roleName:'',

      pageNum:1,
      pageSize:10,
      total:0,

      tableData:[],
      loading:false,
      deleteBtnLoading:{},

      dialogData:{
      },
      dialogDataState:'',
      dialogVisible : false,
      dialogSaveLoading:false,
      rules:{
        roleName:[
          {validator:validator.rolename,trigger:'blur'}
        ],
        croleName:[
          {validator:validator.rolename,trigger:'blur'}
        ],
      },

      permissionDialogVisible : false, 
      currentRoleId:'',    //当前正在配置的角色id
      permissionDialogSaveLoading:false,   //权限配置保存按钮的loading状态

      roleMenuList:[],    //配置角色权限时获取的当前角色菜单
      checkedKeys:[],   //勾选的节点（当前角色拥有的菜单项） 获取菜单后计算
      defaultProps: {    //树形菜单显示的内容
        children: 'nodes',
        label: 'text'
      }
    }
  },
  methods:{
    searchHandle(){ //查询角色列表
      this.pageNum = 1;
      this.queryHandle();
    },
    queryHandle(){  
      this.loadding = true;
      let data = {
        "limit":this.pageSize,
        "offset":(this.pageNum -1)*this.pageSize,
        "sort":"id",
        "sortOrder":"desc",
        "conditionsMap":{
          "roleName":this.roleName.trim()
        }
      }
      systemRequest.getRoles(data).then(res => {
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
        this.loadding = false;
      }).catch(err => {
        console.log(err);
        this.loadding = false;
      })
    },
    roleMenuListHandle(id){   //获取权限菜单树形结构
      systemRequest.roleMenulist({id:id}).then(res => {
        if(res.code == '200'){
          let str = res.data;
          let str2 = str.replace(/\ /g,"");
          let str3 = str2.replace(/\'/g,"\"");
          let str4 = str3.replace(/state/g,"\"state\"");
          let str5 = "["+str4.replace(/nodes/g,"\"nodes\"")+"]";
          let str6 = str5.replace(/\,\]/g,"\]");                 
          this.roleMenuList = JSON.parse(str6); //规范的json数组
          this.computedCheckedKyes();  //根据当前角色的roleMenu计算已勾选的菜单项
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
    computedCheckedKyes(){
      let arr = [];
      this.roleMenuList.forEach((val,idx) => { 
        if(val.state.checked){ //一级菜单
          arr.push(val.id);
          if(val.nodes&&val.nodes.length>0){  //二级菜单
            val.nodes.forEach((val2,idx2) => { 
              if(val2.state.checked){
                arr.push(val2.id)
                if(val2.nodes&&val2.nodes.length>0){  //三级按钮
                  val2.nodes.forEach((val3,idx3) => {
                    if(val3.state.checked){
                      arr.push(val3.id)
                      if(val3.nodes&&val3.nodes.length>0){  //四级 (显示手机号)
                        val3.nodes.forEach((val4,idx4) => {
                          if(val4.state.checked){
                            arr.push(val4.id)
                          }
                        })
                      }
                    }
                  })
                }
              }
            })
          }
        }
      });
      this.checkedKeys = arr;
    },
    addBtnHandle(){ //点击添加角色
      this.dialogDataState = 'add';
      this.dialogData = {};
      this.dialogVisible = true;
    },
    dialogClosed(){ //添加/编辑对话框关闭
      this.$refs.dialogForm.resetFields();
      this.$refs.dialogForm.clearValidate();
    },
    editRow(row){ //编辑当前角色
      this.dialogDataState = 'edit';
      this.dialogData = Object.assign({},row);
      this.dialogVisible = true;
    },
    changeState(row,state){  //启用/禁用当前角色
      let data = {
        "id":row.id,
        "roleName":row.roleName,
        "croleName":row.croleName,
        "state":state
      }
      let _title = '此操作将'+(state == '1'?'启用':'禁用')+row.roleName+'该账号，确认继续？'
      this.$confirm(_title,'提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning',
      }).then(() => {
        this.addOrUpdateHandle(data);
      }).catch(() => {
      })
    },
    deleteRow(row){  //删除当前角色
      this.$set(this.deleteBtnLoading,row.id,true);
      this.$confirm('确认删除该角色:'+row.roleName+'吗？','注意',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning',
      }).then(() => {
        let data = {
          id:row.id
        }
        systemRequest.deleteRole(data).then(res => {
          if(res.code == 200){
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
          this.$set(this.deleteBtnLoading,row.id,false);
        }).catch(err => {
          console.log(err)
          this.$set(this.deleteBtnLoading,row.id,false);
        })
      }).catch(() => {
        this.$set(this.deleteBtnLoading,row.id,false);
      })
    },
    editPermissions(row){  //编辑当前角色权限
      this.roleMenuListHandle(row.id);
      this.currentRoleId = row.id;
      this.permissionDialogVisible = true;
    },
    dialogSaveBtn(){ //对话框点击保存
      this.dialogSaveLoading = true;
      let data = {
        croleName:this.dialogData.croleName,
        id:this.dialogData.id,
        roleName:this.dialogData.roleName,
        state:1,
      }
      this.$refs.dialogForm.validate().then(() => {
        this.addOrUpdateHandle(data);
      }).catch(err => {
        this.$notify({
          type:'warning',
          title:'校验不通过，请检查错误提示'
        })
        this.dialogSaveLoading = false;
      })
    },
    addOrUpdateHandle(data){
      systemRequest.addOrUpdateRole(data).then(res => {
        this.dialogSaveLoading = false;
        if(res.code == 200){
          this.$notify({
            type:'success',
            title:res.msg
          })
          this.dialogVisible = false;
          this.queryHandle();
        }else{
          this.$notify({
            type:'warning',
            title:res.msg
          })
        }
      }).catch(err => {
        console.log(err);
        this.dialogSaveLoading = false;
      })
    },
    checkAll(isCheck){  //全选/取消全选所有
      if(isCheck){
        console.log(this.roleMenuList);
        this.setMenuAllCheck(this.roleMenuList);
      }else{
        this.checkedKeys = [];
        this.$refs.permissionTree.setCheckedKeys([]);
      }
    },
    nodeCheckAll(data,isCheck){ //节点全选/取消全选
      if(isCheck){
        this.setMenuAllCheck([data]);
      }else{
        this.setMenuAllUncheck([data]);
      }
    },
    setMenuAllCheck(list){  //将list所有的下级勾选
      list.forEach((item) => {
        if(!this.checkedKeys.includes(item.id)){  //保证只被push一次
          this.checkedKeys.push(item.id);   //一级菜单
        }
        if(item.nodes&&item.nodes.length>0){
          let _list = item.nodes;
          _list.forEach((_item) => {
            if(!this.checkedKeys.includes(_item.id)){
              this.checkedKeys.push(_item.id); //二级菜单
            }
            if(_item.nodes&&_item.nodes.length>0){
              let _buttons = _item.nodes;
              _buttons.forEach((btns) => {
                if(!this.checkedKeys.includes(btns.id)){
                  this.checkedKeys.push(btns.id)  //三级按钮
                }
                if(btns.nodes&&btns.nodes.length>0){
                  let _states = btns.nodes;
                  _states.forEach((state) => {
                    if(!this.checkedKeys.includes(state.id)){
                      this.checkedKeys.push(state.id)  //四级权限
                    }
                  })
                }
              })
            }
          })
        }
      })
      this.$refs.permissionTree.setCheckedKeys(this.checkedKeys);
    },
    setMenuAllUncheck(list){  //将list所有的下级取消勾选
      list.forEach((item) => {
        let idx = this.checkedKeys.indexOf(item.id);
        if(idx === -1){
          return
        }
        this.checkedKeys.splice(idx,1); //取消一级菜单

        if(item.nodes&&item.nodes.length>0){
          let _list = item.nodes;
          _list.forEach((_item) => {
            let idx = this.checkedKeys.indexOf(_item.id);
            this.checkedKeys.splice(idx,1); //取消二级菜单

            if(_item.nodes&&_item.nodes.length>0){
              let _buttons = _item.nodes;
              _buttons.forEach((btns) => {
                let idx = this.checkedKeys.indexOf(btns.id);
                this.checkedKeys.splice(idx,1);  //取消三级按钮

                  if(btns.nodes&&btns.nodes.length>0){
                    let _states = btns.nodes;
                    _states.forEach((state) => {
                      let idx = this.checkedKeys.indexOf(state.id);
                      this.checkedKeys.splice(idx,1);  //取消四级权限
                    })
                  }
              })
            }
          })
        }
      })
      this.$refs.permissionTree.setCheckedKeys(this.checkedKeys);
    },


    sizeChangeHandle(sz){  //分页条数改动
      this.pageSize = sz;
      this.queryHandle();
    },
    currentChangeHandle(crt){ //分页当前页跳转
      this.pageNum = crt;
      this.queryHandle();
    },

    /**
     * 权限菜单相关：
     */
    nodeClickHandle(data,node,self){  //树形节点点击事件
      // console.log(data);
      // console.log(node);
      // console.log(self);

      // var arr = this.$refs['permissionTree'].getCheckedNodes(false,true);
      // console.log(arr);

      // var arr2 = this.$refs['permissionTree'].getCheckedKeys(false);
      // console.log(arr2);
    },
    permissionDialogSaveBtn(){  //权限控制点击保存按钮
      this.permissionDialogSaveLoading = true;
      let nodes = this.$refs['permissionTree'].getCheckedNodes(false,true);
      let arr = [];
      nodes.forEach((val,index) => {
        arr.push(val.id)
      })
      let data = {
        roleId:this.currentRoleId,
        menuList:arr
      };
      systemRequest.roleToMenu(data).then(res => {
        if(res.code == 200){
          this.permissionDialogVisible = false;
          this.$notify({
            type:'success',
            title:'保存成功'
          })
        }else{
          this.$notify({
            type:'warning',
            title:res.msg
          })
        }
        this.permissionDialogSaveLoading = false;
      }).catch(err => {
        console.log(err);
        this.permissionDialogSaveLoading = false;
      })
    }
  },
  created () {
    this.queryHandle();
  }
}
</script>

<style>
.role-manage-tree-node{
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 380px;
  }
</style>
