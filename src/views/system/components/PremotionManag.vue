<template>
  <el-card>
    <el-table
      border
      fit
      stripe
      :data="tableData"
      :cell-style="{textAlign:'center'}"
      :header-cell-style="{textAlign:'center'}"
      @selection-change="handleSelectionChange"
      v-loading="loading">
       <el-table-column type="selection" width="25"></el-table-column>
       <el-table-column
            type="index"
            label="编号"
            width="50">
            </el-table-column>
       <el-table-column  label="域名名称" prop="domainName"></el-table-column>     
       <el-table-column  label="域名">
               <template slot-scope="scope">
                    <a  
                       :href="['//'+scope.row.domainUrl]"  
                       target="_blank"  
                       style="color:#0d8cfb;cursor: pointer;">
                          {{scope.row.domainUrl}}
                    </a>
               </template>
       </el-table-column>
       <el-table-column label="推广域名">
                 <template slot-scope="scope">
                      <a  
                          v-if="scope.row.externalUrl"
                          :href="['//'+scope.row.externalUrl]"  
                          target="_blank"  
                          style="color:#0d8cfb;cursor: pointer;">
                              {{scope.row.externalUrl}}
                        </a>
                      <span v-else>-</span>
                 </template>
       </el-table-column>
       <el-table-column label="模板样式" >
                 <template slot-scope="scope">
                       <span v-if="scope.row.styleType == 1">经典默认</span> 
                 </template> 
       </el-table-column>
       <el-table-column label="推广ID" >
                <template slot-scope="scope">
                       <span v-if="scope.row.accountId == 0">所有人</span> 
                       <a  v-else style="cursor: pointer;color: rgb(13, 140, 251);" @click="getDetailHandle(scope.row.accountId)" >{{scope.row.accountId}}</a>
                 </template>
       </el-table-column>
       <el-table-column label="操作" width="280">
        <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="getDetailRow(scope.row)"
            >编辑</el-button>
            <el-button
              type="info"
              size="mini"
              v-if="scope.row.popuStatus == '0'"
              @click="changeState(scope.row,'1')"
            >已隐藏</el-button>
            <el-button
              type="success"
              size="mini"
              v-if="scope.row.popuStatus == '1'"
              @click="changeState(scope.row,'0')"
            >已开启</el-button>
            <el-button
              type="danger"
              size="mini"
              v-if="scope.row.defaultTag !== 1"
              @click="deleteRow(scope.row)"
            >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-form style="float: right; padding-top: 10px;">
        <el-row>
            <el-form-item>
                <el-button type="primary" size="medium" @click="addBtnHandle">新增</el-button>
                <el-button type="info" size="medium" @click="tgDomainVisible">批量隐藏</el-button>
            </el-form-item>
        </el-row>
    </el-form>
      <el-row type="flex" justify="center">
      <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageNum"
        :page-sizes="[10,20,50,100,200]"
        :page-size.sync="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-row> 
     <!-- 新增/编辑对话框 -->
    <el-dialog
      :title="dialogDataState=='add'?'新增推广域名':'编辑推广域名'"
      :visible.sync="dialogVisible"
      width="37%"
      center
      @closed="dialogClosed"
    >
      <el-form label-width="80px" :model="dialogData" :rules="rules" ref="dialogData">
         <el-form-item  label="域名名称"  prop="domainName">
                <el-input placeholder="请输入域名名称" v-model="dialogData.domainName" maxlength="20" ></el-input>
         </el-form-item>
          <el-form-item  label="推广域名">
                 <el-input placeholder="请输入推广域名" v-model="dialogData.domainUrl" maxlength="50"></el-input>
         </el-form-item>

          <el-form-item  label="域名" prop="siteMainUrl">
                   <el-input placeholder="请输入域名" v-model="dialogData.siteMainUrl" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item>
                 <el-radio-group v-model="dialogData.popu_type" :disabled="dialogDataState=='edit'" >
                   <el-radio label="0">所有会员</el-radio>
                   <el-radio label="1" >自定义</el-radio>
                </el-radio-group>
                <el-col :span="1" style="float: right;">
                  <el-form-item label-width="0" style="text-align: center;">
                    <el-tooltip placement="bottom" effect="light">
                      <div slot="content">1、开启则在前端首页展示域名。<br/>2、关闭则不再前端首页展示。<br/>3、多条开启则每次登陆随机显示一条推广域名。</div>
                      <i class="el-icon-info" style="font-size: 18px;"></i>
                    </el-tooltip>
                  </el-form-item>
                </el-col>
          </el-form-item>
          <el-form-item  label="推广id" >
                  <el-input placeholder="请输入推广员的ID" :disabled="dialogDataState=='edit'" type="text" v-model="dialogData.account_id" v-if="dialogData.popu_type=='1'" @blur="blurAccount"></el-input>
                  <el-input placeholder="默认所有会员" :disabled="true" v-else></el-input>
          </el-form-item>
          <el-form-item  label="模板样式">
                  <el-select  placeholder="请选择模板样式" v-model="dialogData.style_type">
                        <el-option label="经典默认" value="1"></el-option>
                        <!-- <el-option label="区域二" value="1"></el-option> -->
                  </el-select>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogSaveBtn" :loading="dialogSaveLoading">保 存</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import systemRequest from "@/request/system";
import financeRequest from "@/request/finance";

import valide from "@/tool/validate";
export default {
  name: "PremotionManag",
  data() {
    var checkAge = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入域名名称'));
        }else{
            if(value.trim()==""){
               return callback(new Error('请输入域名名称'));
            }else{
                callback();
            }
        }
    }
    var checkURl = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入域名'));
        }else{
             if(value.trim()==''){
               return callback(new Error('请输入域名'));
            }else if(value.includes('http') || value.includes('\\')){
                return callback(new Error('输入域名不能带http或者\\'));
               //callback();
            }else{
                callback();
            }
        }
    }
    return {
         rules: {
           domainName: [
            { validator: checkAge, trigger: 'blur' }
          ],
          siteMainUrl: [
            { required:true,validator: checkURl, trigger:['blur','change'] }
          ]

        },
        pageNum: 1,
        pageSize: 10,
        total: 0,
        tableData: [],
        siteCnameInfo: "", //cname信息
        sitePnameInfo:'',//pname信息
        loading: false,
        deleteBtnLoading: {},

        //新增/编辑对话框
        dialogData: {
            domains: [], //新增弹框  域名数组
            domainName:'', //域名名称
            domainUrl:'', //推广域名
            siteMainUrl:'', //主域名
            popu_type:'0', //自定义会员
            account_id:'', //推广id
            style_type:'1', //经典默认样式
            id:''
        },
        dialogDataState: "",
        dialogVisible: false,
        dialogSaveLoading: false,
       
        //查看对话框
        detailDialogVisible: false,
        detailDialogData: {
            domains: []
        },
        
        //代理域名
       agentdialogVisible:false,
       agentdialogData:{
           domains:[],
           domainsagent:''  
       },
        //单选多选
        multipleSelection:'',
        account_idIs:false,
    };
  },
    methods: {
      getDetailRow(data){
        this.dialogVisible=true
        this.dialogDataState = "edit";
        this.dialogData.domainName=data.domainName
        this.dialogData.domainUrl=data.externalUrl //  domainUrl
        this.dialogData.siteMainUrl=data.domainUrl //siteMainUrl
        this.dialogData.popu_type=data.popuType+''
        this.dialogData.account_id=data.accountId===0?'':data.accountId+''
        this.dialogData.style_type=data.styleType+''
        this.dialogData.id=data.id
        console.log(this.dialogData)
      },
      getDetailHandle(account) {
        //点击用户详情按钮
        let data = {
              playId:account
        };
        financeRequest.findUser(data).then(res => {
                if (res.code == "200") {
                    this.$router.push({
                      name: "会员详情",
                      params: { account:res.data.account}
                    });
                }else {
                  this.$notify({
                    type: "warning",
                    title: res.msg
                  });
                }
            })
      },
      blurAccount(){
        let vm=this
         return   new Promise(function(resolve, reject) { 
         let data = {
              playId:vm.dialogData.account_id || null
            };
          if(vm.dialogData.account_id.length>8){
               this.$notify({
                    type: "warning",
                    title: "最多只能输入8位数推广id"
                });
          }else{
              if(vm.dialogData.account_id.length>0){
                  financeRequest.findUser(data).then(res => {
                      if (res.code == "200") {
                        vm.account_idIs=true
                         resolve(true)
                      }else {
                        vm.$notify({
                          type: "warning",
                          title: '此ID不存在请重新输入'
                        });
                        vm.account_idIs=false
                        resolve(false)
                      }
                  })
              }
          }
        })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
     },
     tgDomainVisible(){  //批量禁用
         if(this.multipleSelection==''){
          this.$message({
            type: "warning",
            message: "请先选择域名"
          }); 
          return 
         }
        this.$confirm(`请您确定隐藏站点，隐藏后所有与该域名相关的推广域名都不可用（当前共选中${this.multipleSelection.length}条域名）`, "隐藏域名", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        }).then(() => {
          let data ={
               ids: [],
               popuStatus: 0

          }
           this.multipleSelection.map(item=>{
               data.ids.push(item.id)
           })
          this.enabledSiteDomain(data);
        })
        .catch(e => {
          console.log(e);
        });
     },
    queryHandle() {
      //查询域名列表
      this.loadding = true;
      let data = {
        limit: this.pageSize,
        offset: (this.pageNum - 1) * this.pageSize
      };
      systemRequest
        .getSitePopuDomains(data)
        .then(res => {
          if (res.code == "200") {
            console.log(res)
            let  resdata = res.data;
            this.pageSize = resdata.limit;
            this.pageNum = resdata.offset / resdata.limit + 1;
            this.total = resdata.total;
            this.tableData = resdata.rows;
          } else {
            this.$notify({
              type: "warning",
              title: res.msg
            });
          }
          this.loadding = false;
        })
        .catch(err => {
          console.log(err);
          this.loadding = false;
        });
    },
    addBtnHandle() {
      //点击添加域名
      this.dialogDataState = "add";
      this.dialogData.domains = [""];
      this.dialogVisible = true;
    },
    dialogClosed() {
      this.$refs.dialogData.resetFields();
       let dialogData={
            domains: [], //新增弹框  域名数组
            domainName:'', //域名名称
            domainUrl:'', //推广域名
            siteMainUrl:'', //域名
            popu_type:'0', //自定义会员
            account_id:'', //推广id
            style_type:'1', //经典默认样式
        }
        this.dialogData=dialogData
    },
    changeState(row, status) {
      //启用/禁用当前域名
      let data = {
        ids: [row.id] || '',
        popuStatus: status
      };
      let _title =
        "此操作将" +
        (status == "1" ? "开启" : "隐藏") +
        row.domainUrl +
        "该域名，确认继续？";
      this.$confirm(_title, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.enabledSiteDomain(data);
        })
        .catch(e => {
          console.log(e);
        });
    },
    deleteRow(row) {
      if(row.popuStatus==1){
           this.$message({
             type: "warning",
             message: "请先隐藏当前域名"
          });
      }else{
            this.$set(this.deleteBtnLoading, row.id, true);
            this.$confirm("请您确定删除站点，删除后所有与该"+ row.domainUrl + "域名相关的推广域名都不可用" , "注意", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
            .then(() => {
                    let data = {
                      ids: [row.id]
                    };
                    systemRequest
                      .delSitePopuDomain(data)
                      .then(res => {
                        if (res.code == 200) {
                          this.$notify({
                            type: "success",
                            title: res.msg
                          });
                          this.queryHandle();
                        } else {
                          this.$notify({
                            type: "warning",
                            title: res.msg
                          });
                        }
                        this.$set(this.deleteBtnLoading, row.id, false);
                      })
                      .catch(err => {
                        console.log(err);
                        this.$set(this.deleteBtnLoading, row.id, false);
                      });
                  })
                  .catch(() => {
                    this.$set(this.deleteBtnLoading, row.id, false);
                  });
             }
      //删除当前域名
    },
    agentloform(data){
           this.$refs.dialogData
            .validate()
            .then(() => {
                this.editSiteDomainInfo(data); 
            })
            .catch(e => {
              this.$notify({
                type: "error",
                title: "校验不通过，请检查错误提示"
              });
              this.dialogSaveLoading = false;
            });
    },
    dialogSaveBtn() {
      //对话框点击保存
      this.dialogSaveLoading = true;
        //编辑
      let data = {
          accountId:this.dialogData.popu_type == '0' ? 0 : this.dialogData.account_id,
          domainName: this.dialogData.domainName.trim(),
          domainUrl:this.dialogData.siteMainUrl.trim(),
          externalUrl:this.dialogData.domainUrl,
          // popuStatus:this.dialogData.popu_type,
          popuType:this.dialogData.popu_type,
          styleType:this.dialogData.style_type,
          id:this.dialogData.id
        };
        if(data.domainUrl==data.externalUrl){
            this.$notify({
                    type: "warning",
                    title: '推广域名与域名不能一致'
            }); 
             this.dialogSaveLoading = false;  
            return 
        }
        if(this.dialogData.popu_type=='1'){
            if(this.dialogData.account_id.length>0){
                if(this.account_idIs){
                    this.agentloform(data); 
                }else{
                    this.blurAccount().then(result =>{
                         if(result){
                            this.agentloform(data);  
                         }else{
                            console.log('推广ID不存在，请从新输入')
                         }
                    })
                    // this.$notify({
                    //     type: "warning",
                    //     title: '推广ID不存在，请从新输入'
                    //   });
                    this.dialogSaveLoading = false;  
                }   
            }else{
               data.accountId=0
               this.agentloform(data); 
            }
        }else{
           this.agentloform(data); 
        }
    },
    editSiteDomainInfo(data) {
      //域名保存
      systemRequest
        .addOrUpSitePopuDomains(data)
        .then(res => {
          this.dialogSaveLoading = false;
          if (res.code == 200) {
            this.$notify({
              type: "success",
              title: res.msg
            });
            this.dialogVisible = false;
            this.queryHandle();
          } else {
            this.$notify({
              type: "warning",
              title: res.msg
            });
          }
        })
        .catch(err => {
          console.log(err);
          this.dialogSaveLoading = false;
        });
    },
    enabledSiteDomain(data) {
      //启用禁用域名
      systemRequest
        .enabledSitePopuDomain(data)
        .then(res => {
          if (res.code == 200) {
            this.$notify({
              type: "success",
              title: res.msg
            });
            this.queryHandle();
          } else {
            this.$notify({
              type: "warning",
              title: res.msg
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    sizeChangeHandle(sz) {
      //分页条数改动
      this.pageSize = sz;
      this.queryHandle();
    },
    currentChangeHandle(crt) {
      //分页当前页跳转
      this.pageNum = crt;
      this.queryHandle();
    }
  },
  filters: {
　　　　Upper: function (value) {
　　　　　　 if(value==null || value == ''){
             return '0'
            }else{
              return value
            }
　　　　},
       styleTypes:function(val){
            
       }
　},
  created() {
    this.queryHandle(); //获取列表信息
  }
};
</script>
