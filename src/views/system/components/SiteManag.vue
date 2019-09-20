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
       <el-table-column  label="站点域名">
               <template slot-scope="scope">
                    <a  
                       :href="['//www.'+scope.row.domainUrl]"  
                       target="_blank"  
                       style="color:#0d8cfb;cursor: pointer;">
                          {{scope.row.domainUrl}}
                    </a>
               </template>
       </el-table-column>
       <el-table-column label="操作" width="280">
        <template slot-scope="scope">
          <el-row type="flex" justify="space-around" v-if="scope.row.defaultTag === 0">
            <el-button size="mini" @click="editRow(scope.row)">编辑</el-button>
            <el-button
              type="success"
              size="mini"
              v-if="scope.row.status == '0'"
              @click="changeState(scope.row,'1')"
            >启用</el-button>
            <el-button
              type="warning"
              size="mini"
              v-if="scope.row.status == '1'"
              @click="changeState(scope.row,'0')"
            >禁用</el-button>
            <el-button
              type="danger"
              size="mini"
              @click="deleteRow(scope.row)"
            >删除</el-button>
            <el-button type="info" size="mini" @click="getDetailRow(scope.row)">查看</el-button>
          </el-row>
          <el-row v-else>
             <el-button type="info" size="mini" @click="getDetailRow(scope.row)">查看</el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <el-form style="float: right; padding-top: 10px;">
        <el-row>
            <el-form-item>
                <el-button type="primary" size="medium" @click="addBtnHandle">新增</el-button>
                <el-button type="primary" size="medium" @click="agetaddBtnHandle">代理域名</el-button>
                <el-button type="info" size="medium" @click="tgDomainVisible">批量禁用</el-button>
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
      
    <!-- 代理域名弹窗 -->
    <el-dialog
       title="修改代理域名"
       :visible.sync="agentdialogVisible"
       width="37%"
       center
       @closed="dialogClosed"
    >
        <el-form label-width="80px" :model="agentdialogData" ref="agentdialogForm">
            <el-form-item label="域名" :rules="domainRule" :prop="'domains[0]'" >
                   <el-input placeholder="请输入域名" v-model="agentdialogData.domains[0]" :disabled="true"></el-input>
            </el-form-item>
            <el-row>
                    <el-form-item
                        label="备用域名"
                        style="width:550px"
                    >
                        <el-input placeholder="不带http://www.,且不重复" v-model="agentdialogData.domains[1]" clearable></el-input>
                    </el-form-item>
                    <el-form-item
                        label="备用域名"
                        style="width:550px"
                    >
                        <el-input placeholder="不带http://www.,且不重复" v-model="agentdialogData.domains[2]" clearable></el-input>
                    </el-form-item>
                    <el-form-item
                        label="备用域名"
                        style="width:550px"
                    >
                        <el-input placeholder="不带http://www.,且不重复" v-model="agentdialogData.domains[3]" clearable></el-input>
                    </el-form-item>
                    <el-form-item
                        label="备用域名"
                        style="width:550px"
                    >
                        <el-input placeholder="不带http://www.,且不重复" v-model="agentdialogData.domains[4]" clearable></el-input>
                    </el-form-item>
                    <el-form-item
                        label="备用域名"
                        style="width:550px"
                    >
                        <el-input placeholder="不带http://www.,且不重复" v-model="agentdialogData.domains[5]" clearable></el-input>
                    </el-form-item>
            </el-row>
        </el-form> 
        <span slot="footer" class="dialog-footer">
            <el-button @click="agentdialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="agentdialogSaveBtn" :loading="dialogSaveLoading">保 存</el-button>
        </span>  
    </el-dialog>
     <!-- 新增/编辑对话框 -->
    <el-dialog
      :title="(dialogDataState == 'add'?'添加域名':'编辑域名')"
      :visible.sync="dialogVisible"
      width="37%"
      center
      @closed="dialogClosed"
    >
      <el-form label-width="40px" :model="dialogData" ref="dialogForm">
        <el-row type="flex" justify="start" v-for="(domain,idx) in dialogData.domains" :key="idx">
          <el-form-item
            label="域名"
            style="width:550px"
            :prop="'domains['+idx+']'"
            :rules="domainRule"
          >
            <el-input placeholder="不带http://www.,且不重复" v-model="dialogData.domains[idx]" clearable maxlength="40"></el-input>
          </el-form-item>
          <el-form-item
            label-width="0"
            v-if="dialogData.domains.length > 1 && dialogDataState === 'add'"
            style="margin-left:20px"
          >
            <el-button circle size="medium" @click="deleteLine(idx)">&nbsp;-&nbsp;</el-button>
          </el-form-item>
          <el-form-item
            label-width="0"
            v-if="(idx === dialogData.domains.length-1)&&(dialogData.domains.length < 5)&&(dialogDataState === 'add')"
            style="margin-left:20px"
          >
            <el-button circle size="medium" @click="addLine">&nbsp;+&nbsp;</el-button>
          </el-form-item>
        </el-row>
      </el-form>
      <!-- <div class="domain_manage_dialog_site_info" v-html="siteCnameInfo"></div> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogSaveBtn" :loading="dialogSaveLoading">保 存</el-button>
      </span>
    </el-dialog>
    
     <!-- 查看对话框 -->
    <el-dialog title="查看域名" :visible.sync="detailDialogVisible" width="37%" center>
      <el-form label-width="20%" v-if="detailDialogData.domains.length>0">
        <el-row
          type="flex"
          justify="start"
          v-for="(domain,idx) in detailDialogData.domains"
          :key="idx"
        >
          <el-form-item style="width:90%">
            <template slot="label">
              <!-- <span v-if="detailDialogData.domains[idx].domainType === '0'">维护域名</span> -->
              <!-- <span v-if="detailDialogData.domains[idx].domainType === '1'">PC游戏域名</span> -->
              <!-- <span v-if="detailDialogData.domains[idx].domainType === '2'">代理域名</span> -->
              <span v-if="detailDialogData.domains[idx].domainType === '3'">门户域名</span>
             <!--  <span v-if="detailDialogData.domains[idx].domainType === '4'">官网域名</span> -->
              <span v-if="detailDialogData.domains[idx].domainType === '5'">H5门户域名</span>
              <!-- <span v-if="detailDialogData.domains[idx].domainType === '6'">H5游戏域名</span> -->
            </template>
            <el-input v-model="detailDialogData.domains[idx].domainUrl" v-if="detailDialogData.domains[idx].domainType === '3'" readonly></el-input>
            <el-input v-model="detailDialogData.domains[idx].domainUrl" v-if="detailDialogData.domains[idx].domainType === '5'" readonly></el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <el-row v-else type="flex" justify="center">数据加载中...</el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>

  </el-card>
</template>

<script>
import systemRequest from "@/request/system";
import valide from "@/tool/validate";
export default {
  name: "SiteManag",
  data() {
    var checkAge = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('代理域名不能为空'));
        }else{
            callback();
        }
    }
    return {
        ageteinRule:{
            validator: checkAge,
            trigger: "blur"
        },
        domainRule: {
            validator: valide.domainRule,
            trigger: "blur"
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
            domains: [] //新增弹框  域名数组
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
        multipleSelection:''
    };
  },
    methods: {
      // systemRequestgetMainSiteDomainList(){  //获取域名下拉列表
      //        let data = {
      //         limit:200,
      //         offset:0
      //       };
      //       systemRequest.getMainSiteDomainList(data).then(res =>{
      //             this.$store.dispatch('SetMainSiteDomainList',res.data.rows);
      //       })
      // },
       agentdialogSaveBtn(){
            this.dialogSaveLoading = true;
        //新增
        //验证是否有重复
        let arrset = []
        let arr = this.agentdialogData.domains;
        let set = new Set(arr.filter(item => item));
        this.agentdialogData.domains.map(item=>{
          if(item !==''){
               arrset.push(item)
          }
        })
        if (arrset.length != set.size) {
          this.$message({
            type: "warning",
            message: "当前添加的域名不能有重复不能为空"
          });
          this.dialogSaveLoading = false;
        } else {
          //校验是否重复
          
          this.$refs.agentdialogForm
            .validate()
            .then(() => {
                this.addOrUpdateAgentDomain();
            })
            .catch(e => {
              this.$notify({
                type: "error",
                title: "校验不通过，请检查错误提示"
              });
              this.dialogSaveLoading = false;
            });
        }
       },
       addOrUpdateAgentDomain(){
            let data = {
                domainUrls:[]
            };
           this.agentdialogData.domains.map(tiem=>{
                if(tiem !==''){
                 data.domainUrls.push(tiem.trim())
               }
           }) 
           systemRequest.addOrUpdateAgentDomain(data)
           .then(res=>{ 
                 if (res.code == "200") {
                   this.dialogSaveLoading = false;
                   this.agentdialogVisible=false
                   this.$notify({
                        type: "success",
                        title: res.msg
                   });
                 } else {
                    this.$notify({
                    type: "warning",
                    title: res.msg
                    });
                }
            })
       },
       agetaddBtnHandle(){ //打开代理域名弹出
           this.agentdialogVisible=true
           this.agentdialogData.domains = [];
           this.getSiteAgentDomain()
       },
       getSiteAgentDomain(){ //获取代理域名
            systemRequest.getSiteAgentDomain().then(res =>{
                  res.data.map(domainUrl=>{
                      this.agentdialogData.domains.push(domainUrl.domainUrl)
                  })
            })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
     },
     tgDomainVisible(){
         if(this.multipleSelection==''){
          this.$message({
            type: "warning",
            message: "请先选择域名"
          }); 
          return 
         }
        this.$confirm(`确认禁用域名吗？禁用后，将无法访问（当前共选中${this.multipleSelection.length}条域名）`, "禁用域名", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        }).then(() => {
            let data = {
                 groupIds:[],
                 status:0,
            }
            this.multipleSelection.map(item=>{
                if(item.defaultTag!==1){
                    data.groupIds.push(item.domainGroupId)
                }
            })
            if(data.groupIds.length==0){
              this.$message({
                  type: "warning",
                  message: "默认域名不可禁用"
                });   
            }else{
              this.batchenabledSiteDomain(data)
            }
        })
        .catch(e => {
          console.log(e);
        });
     },
     batchenabledSiteDomain(data){
           //批量禁用域名
         systemRequest
        .enabledSiteDomain(data)
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
    queryHandle() {
      //查询域名列表
      this.loadding = true;
      let data = {
        limit: this.pageSize,
        offset: (this.pageNum - 1) * this.pageSize
      };
      systemRequest
        .getMainSiteDomainList(data)
        .then(res => {
          if (res.code == "200") {
            res = res.data;
            this.pageSize = res.limit;
            this.pageNum = res.offset / res.limit + 1;
            this.total = res.total;
            this.tableData = res.rows;
            // this.systemRequestgetMainSiteDomainList()
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
    getSiteCnameInfo() {
      //查询站点CNAME信息
      systemRequest
        .getSiteCnameInfo()
        .then(res => {
          if (res.code == 200) {
            this.siteCnameInfo = res.data.cname || "暂无信息";
            this.sitePnameInfo = res.data.pname || "暂无信息";
          } else {
            console.log(res.msg);
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    addBtnHandle() {
      //点击添加域名
      this.dialogDataState = "add";
      this.dialogData.domains = [""];
      this.dialogVisible = true;
    },
    dialogClosed() {
      //添加/编辑对话框关闭
    //   this.$refs.dialogForm.resetFields();
    //   this.$refs.agentdialogForm.resetFields();
    },
    editRow(row) {
      //编辑当前域名
      this.dialogDataState = "edit";
      this.dialogData.domainGroupId = row.domainGroupId;
      this.dialogData.domains = [row.domainUrl];
      this.dialogVisible = true;
    },
    changeState(row, status) {
      //启用/禁用当前域名
      let data = {
        groupIds:[row.domainGroupId || ""],
        status: status,
        siteFolder:row.siteFolder,
        domainUrl:row.domainUrl
      };
      let _title =
        "请您确定" +
        (status == "1" ? "启用" : "禁用") +
        row.domainUrl +
        (status == "1" ? "该域名吗？" : "禁用后所有与该主域名相关的推广域名都不可用");
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
      //删除当前域名
      this.$set(this.deleteBtnLoading, row.id, true);
      this.$confirm("请您确定删除站点"+ row.domainUrl + "，吗？删除后所有与该主域名相关的推广域名都不可用", "注意", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let data = {
            groupIds: [row.domainGroupId]
          };
          systemRequest
            .delSiteDomainInfo(data)
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
    },
    dialogSaveBtn() {
      //对话框点击保存
      this.dialogSaveLoading = true;
      if (this.dialogDataState === "add") {
        //新增
        //验证是否有重复
        let arr = this.dialogData.domains;
        let set = new Set(arr);
        if (arr.length != set.size) {
          this.$message({
            type: "warning",
            message: "当前添加的域名不能有重复"
          });
          this.dialogSaveLoading = false;
        } else {
          //校验是否重复
          this.$refs.dialogForm
            .validate()
            .then(() => {
              let domains = []; //待新增url数组
              this.dialogData.domains.map(domain => {
                let obj = {
                  defaultTag: 0,
                  domainUrl: ""
                };
                if (this.tableData.length === 0 && domains.length === 0) {
                  obj.defaultTag = 1;
                  obj.domainUrl = domain.trim(); 
                } else {
                  obj.domainUrl = domain.trim();
                }
                domains.push(obj);
              });
              let data = {
                domains: domains
              };
              this.addSiteDomainInfo(data);
            })
            .catch(e => {
              this.$notify({
                type: "error",
                title: "校验不通过，请检查错误提示"
              });
              this.dialogSaveLoading = false;
            });
        }
      } else {
        //编辑
        let data = {
          domainGroupId: this.dialogData.domainGroupId || "",
          domainUrl: this.dialogData.domains[0].trim()
        };
        this.editSiteDomainInfo(data);
      }
    },
    addSiteDomainInfo(data) {
      //新增域名保存
      systemRequest
        .addSiteDomainInfo(data)
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
    editSiteDomainInfo(data) {
      //编辑域名保存
      systemRequest
        .editSiteDomainInfo(data)
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
        .enabledSiteDomain(data)
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
    getDetailRow(row) {
      //查看该组详细
      this.detailDialogData.domains = [];
      this.detailDialogVisible = true;
      let data = {
        domainGroupId: row.domainGroupId
      };
      systemRequest
        .getMainSiteDomainDetail(data)
        .then(res => {
          if (res.code == 200) {
            this.detailDialogData.domains = res.data;
          } else {
            this.$notify({
              type: "warning",
              title: res.msg
            });
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    deleteLine(idx,i) {
      //新增弹窗删除一行
      if(i==2){
         this.agentdialogData.domains.splice(idx, 1); 
      }
      this.dialogData.domains.splice(idx, 1);
    },
    addLine(i) {
      //新增弹窗增加一行
      if(i==2){
       this.agentdialogData.domains.push("");
      }
      this.dialogData.domains.push("");
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
  created() {
    this.queryHandle(); //获取列表信息
    this.getSiteCnameInfo(); //获取cname信息

  }
};
</script>
