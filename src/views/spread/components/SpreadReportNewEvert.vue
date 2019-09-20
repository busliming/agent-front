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
              v-model="playId"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
         <el-col :span="6">
            <el-form-item label="操作人：" >
                <el-input
                  v-model="handName"
                  clearable
                ></el-input>
            </el-form-item>
        </el-col>
          <el-col :span="6">
          <el-form-item label="操作状态">
            <el-select v-model="handleStatus" clearable placeholder="操作状态" style="width:100%">
              <el-option 
                v-for="item in stateoptions"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="space-between" >
          <el-col :span="8">
              <el-form-item label="返利日期">
                  <el-row type="flex" justify="space-between">
                      <el-date-picker
                              v-model="createDate"
                              type="daterange"
                              range-separator="~"
                              value-format="yyyy-MM-dd"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期"
                      ></el-date-picker>
                      <short-cuts
                              :_value="{_date:'jint'}"
                              :currentContext='this'
                              currentModelName='createDate'
                              currentQueryHandle='searchHandle'
                              ref="parentHandleclick"
                      ></short-cuts>
                  </el-row>
              </el-form-item>
          </el-col>
          <el-col :span="8">
                <el-form-item label="返利金额">
                    <el-row type="flex" justify="space-between">
                       <el-input
                            placeholder="最小金额"
                            v-model="minMoney" clearable>
                          </el-input>
                          <el-input
                            placeholder="最大金额"
                            v-model="maxMoney" clearable>
                        </el-input>
                    </el-row>    
                </el-form-item>
          </el-col>
          <el-form-item
              label-width="0" >
              <el-button
                size="medium"
                type="primary"
                icon="el-icon-search"
                @click="searchHandle(1)"
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
      @selection-change="handleSelectionChange"
      v-loading='loading'
    >
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column
        label="会员账号"
        prop="account"
      ></el-table-column>
      <el-table-column
        label="会员ID"
        prop="playId"
      ></el-table-column>
      <!-- <el-table-column
        label="自营返利金额11"
        prop="selfMoney">
          <template slot-scope="{row}">
          {{row.selfMoney | betNumberFormatter}}
         </template>
      </el-table-column> -->
      <el-table-column
        label="直属贡献返利金额"
        prop="ratio1Money"
      >
        <template slot-scope="{row}">
          {{row.ratio1Money | betNumberFormatter}}
        </template>
      </el-table-column>
      <el-table-column
        label="其他贡献返利金额"
        prop="othersMoney"
      >
        <template slot-scope="{row}">
          {{row.othersMoney | betNumberFormatter}}
        </template>
      </el-table-column>
      <el-table-column
        label="总返利金额"
      >
        <template slot-scope="{row}">
          {{(row.ratio1Money+ row.othersMoney) | betNumberFormatter}}
        </template>
      </el-table-column>
      <el-table-column
        label="返利日期"
        prop="rebateDate"
      ></el-table-column>
       <el-table-column
        label="操作人"
        prop="handleName"
      ></el-table-column>
       <el-table-column
        label="操作"
        prop="handleStatus" width="380">
            <template slot-scope="{row}">
                      <span v-if="row.handleStatus==0">
                     <el-button
                        size="mini"
                        @click="changeStateBtnHandle(row.id,true)"
                        type="primary"
                      >通过</el-button>
                      <el-button
                        size="mini"
                        @click="changeStateBtnHandle(row.id,false)"
                         type="danger"
                      >拒绝</el-button>
                      </span>
                      <span v-else>
                      <el-button
                          v-if="row.handleStatus==1"
                        size="mini"
                        type="info"
                      >已通过</el-button>
                       <el-button
                        v-if="row.handleStatus==2"
                        size="mini"
                        type="info"
                      >已拒绝</el-button>
                      </span>
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
      <el-button type="primary" style="right: 0;position: absolute;top: 10px;" @click="tgVisible">批量审核</el-button>
    </el-row>
    <el-dialog
      title="批量审核"
      :visible.sync="dialogVisible"
      width="400px"
      :before-close="handleClose">
      <span>请对勾选的{{multipleSelection.length}}个会员进行审核！</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="danger" @click="onclickdialogVisible(false)">拒 绝</el-button>
        <el-button type="primary" @click="onclickdialogVisible(true)">通 过</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>


<script>
import spreadRequest from '@/request/spread'

export default {
  name:'SpreadReview',
  data () {
    return {
      dialogVisible: false, 
       stateoptions: [
        {
          value: 3,
          label: "全部"
        },
        {
          value: 1,
          label: "已通过"
        },
        {
          value: 2,
          label: "已拒绝"
        },
         {
          value: 0,
          label: "未审核"
        }
      ],

      //单选多选
      multipleSelection:'',
      handleStatus:'', //操作状态
      createDate: [],//选择日期
      minMoney:'', //最小金额
      maxMoney:'', //最大金额
      account:'', 
      playId:'',
      handName:'', //操作人
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
      let idx = str.indexOf('.') + 4;
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
    onclickdialogVisible(boolea){
         let data={
             id:[],
             status:null
         }
         this.multipleSelection.map(item=>{
              if(item.handleStatus==0){
                 data.id.push(item.id)
              }
         })
         if(data.length<=0){
            this.$message({
              type: "warning",
              message: "没有可操作的会员"
            }); 
         }else{
              if(boolea){
                 data.status=1
                 this.infiniteaudit(data)

              }else{
                  data.status=2
                 this.infiniteaudit(data)
              }
            this.dialogVisible=false 
         }
    },
    tgVisible(){ //批量审核按钮
         if(this.multipleSelection==''){
            this.$message({
              type: "warning",
              message: "请先选择要审核的账号"
            }); 
           return 
         }
         this.dialogVisible = true
    },
    handleClose(done){
          done()
    },
    changeStateBtnHandle(val,sate){  //通过拒绝
         if(sate){
               this.confirmStateBtnHandle(val,'通过','teal',1)
         }else{
              this.confirmStateBtnHandle(val,'拒绝','red',2)
         }
    },
    confirmStateBtnHandle(val,i,c,sate){
        const h = this.$createElement;
        this.$msgbox({
          title: `${i}审核`,
          message: h('p', {style:'text-align:center'}, [
            h('span',null, `你确定要`),
            h('span', { style: `color:${c}` },`${i}`),
            h('span', null,'该笔审核'),
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(action => {
            let data={}
           if(sate==1){
                data.id=[val]
                data.status=1
                this.infiniteaudit(data)
           }else{
                data.id=[val]
                data.status=2
                this.infiniteaudit(data)
           }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });       
        });
    },
    infiniteaudit(data){
        spreadRequest.infinitetaxaudit(data).then(res => {
            if(res.code=='200'){
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
        })
    },
    handleSelectionChange(val) {
        this.multipleSelection = val;
     },
    searchHandle(i){
       if(i){
          this.$refs.parentHandleclick.parentHandleclick();
      } 
      this.pageNum = 1;
      this.queryHandle();
    },
    queryHandle(){ //搜索列表
      this.loading = true;
      let data = {
        "limit":this.pageSize,
        "offset":(this.pageNum -1)*this.pageSize,
        "sort":"rebateDate",
        "sortOrder":"desc",
        "account":this.account.trim(),
        "endTime":this.createDate?this.createDate[1]:'',
        "startTime":this.createDate?this.createDate[0]:'',
        "playId":this.playId.trim(),
        "handleStatus":this.handleStatus==3 ? '' : this.handleStatus,
        "handName":this.handName,
        "maxMoney":this.maxMoney, //最大金额
        "minMoney":this.minMoney, //最小金额

      };
        console.log(data);
      spreadRequest.infinitetaxpage(data).then(res => {
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
