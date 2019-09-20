<template>
  <el-card>
    <el-form label-width="70px">
      <el-row type="flex" justify="space-between" :gutter="60">
        <el-col :span="6">
          <el-form-item label="账号">
            <el-input placeholder="会员账号" v-model="account" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="会员状态">
            <el-select v-model="state" clearable placeholder="会员状态" style="width:100%">
              <el-option
                v-for="item in stateoptions"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="会员等级">
            <el-select v-model="level" clearable placeholder="会员等级" style="width:100%">
              <el-option
                v-for="item in leveloptions"
                :key="item.id"
                :label="item.levelName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="上级">
            <el-input placeholder="上级账号" v-model="superior" maxlength="16" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="space-between">
        <el-col :span="10">
          <el-form-item label="注册日期">
            <el-date-picker
              v-model="createDate"
              type="daterange"
              align="right"
              unlink-panels
              value-format="yyyy-MM-dd"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width:100%;"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="玩家状态" style="padding-left: 30px;">
            <el-select v-model="onlineState" placeholder="选择在线状态" style="width:100%" clearable>
              <el-option :value="1" label="在线"></el-option>
              <el-option :value="2" label="离线"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="认证状态" style="padding-left: 30px;">
            <el-select v-model="realNameAuth" placeholder="选择认证状态" style="width:100%" clearable>
              <el-option :value="0" label="未认证"></el-option>
              <el-option :value="1" label="已通过"></el-option>
              <el-option :value="2" label="未通过"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-row type="flex" justify="end">
            <el-button
              type
              size="medium"
              :icon="moreConditions?'el-icon-arrow-down':'el-icon-arrow-up'"
              @click="moreConditions = !moreConditions"
            >更多条件</el-button>
            <el-button
              type
              size="medium"
              icon="el-icon-circle-plus-outline"
              @click="addHandle"
              v-hasauth:MemberListAddBtn
            >新增</el-button>
            <el-button type="primary" size="medium" icon="el-icon-search" @click="searchHandle">查询</el-button>
          </el-row>
        </el-col>
      </el-row>
      <el-row type="flex" justify="space-between" :gutter="60" v-if="moreConditions">
        <el-col :span="6">
          <el-form-item label="会员ID">
            <el-input v-model.trim="playId" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="手机号码">
            <el-input v-model="phone" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="真实姓名">
            <el-input v-model="realName" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="银行卡">
            <el-input v-model="bankAccount" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      :data="tableData"
      v-loading="isloading"
      style="width: 100%;"
      :border="true"
      :fit="true"
      size="medium"
      stripe
      :cell-style="{textAlign:'center'}"
      :header-cell-style="{textAlign:'center'}"
      :default-sort="{prop: 'createDate', order: 'descending'}"
    >
      <el-table-column prop="onlineState" label="在线" width="48px">
        <template slot-scope="scope">
          <span v-if="scope.row.onlineState == 1" style="font-size:16px;color:green;">
            <el-tooltip effect="dark" content="会员在线" placement="top">
              <i class="el-icon-success"></i>
            </el-tooltip>
          </span>
          <span v-else style="font-size:16px;color:rgba(0,0,0,.1);">
            <el-tooltip effect="dark" content="会员离线" placement="top">
              <i class="el-icon-error"></i>
            </el-tooltip>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="account" label="账号" width="120px"></el-table-column>
      <el-table-column prop="playId" label="会员id" width="86px"></el-table-column>
      <el-table-column prop="realName" label="真实姓名" width>
        <template slot-scope="scope">{{scope.row.realName || '-'}}</template>
      </el-table-column>
      <el-table-column prop="superior" label="上级" width>
        <template slot-scope="scope">{{scope.row.superior || '-'}}</template>
      </el-table-column>
      <el-table-column prop="juniorNum" label="下级人数" width="96px"></el-table-column>
      <el-table-column prop="createDate" label="注册日期" width="158px"></el-table-column>
      <!-- <el-table-column prop="totalWin" label="总输赢" width="100px"></el-table-column> -->
      <el-table-column prop="state" label="状态" width="68px">
        <template slot-scope="scope">
          <el-tag size="medium" color="#ddd" type="danger" v-if="scope.row.state == 2">禁用</el-tag>
          <el-tag size="medium" color="#fff" type="success" v-if="scope.row.state == 1">启用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="money" label="账户总余额" width>
        <template slot-scope="scope">{{moneyFormater(scope.row.money)}}</template>
      </el-table-column>
      <!-- <el-table-column prop="score" label="今日可用幸运积分" width="80px">
        <template slot-scope="scope">
                    <span v-if="scope.row.score==null">-</span>
                    <span v-else>{{scope.row.score | Upper}}</span>
        </template>
      </el-table-column>
       <el-table-column prop="score" label="明日可用幸运积分" width="80px">
        <template slot-scope="scope">
                   <span v-if="scope.row.todayIntegral==null">-</span>
                   <span v-else>{{scope.row.todayIntegral | Upper}}</span>
        </template>
      </el-table-column>-->
      <el-table-column prop="onlineState" label="玩家状态" width>
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.onlineState == 1">在线</el-tag>
          <el-tag type="error" v-else>离线</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="realNameAuth" label="实名认证" width>
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.realNameAuth == 1">已通过</el-tag>
          <el-tag type="error" v-if="scope.row.realNameAuth == 2">未通过</el-tag>
          <el-tag type="info" v-if="scope.row.realNameAuth == 0">未认证</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="operating" width="280" label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            v-if="scope.row.onlineState === 1"
            plain
            @click="getKickPlayer(scope.row,scope.$index,2)"
            type="success"
          >踢人</el-button>
          <el-button
            size="mini"
            plain
            @click="getDetailHandle(scope.row)"
            type
            v-hasauth:MemberListDetailBtn
          >详情</el-button>
          <el-button
            size="mini"
            plain
            @click="changeStateBtnHandle(scope.row.account,2)"
            type="danger"
            v-if="scope.row.state == 1"
            v-hasauth:MemberListOnOffBtn
          >禁用</el-button>
          <el-button
            size="mini"
            plain
            @click="changeStateBtnHandle(scope.row.account,1)"
            type="primary"
            v-if="scope.row.state == 2"
            v-hasauth:MemberListOnOffBtn
          >启用</el-button>
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
        :total="total"
      ></el-pagination>
    </el-row>
  </el-card>
</template>

<script>
import memberRequest from "@/request/member";
import tableHeight from "@/tool/tableHeight";
import { moneyFormater } from "@/tool/moneyFormater";
export default {
  name: "MemberList",
  data() {
    return {
      //搜索条件
      account: "", //账号
      state: "", //会员状态
      level: "", //会员等级id
      createDate: null, //注册日期
      superior: "", //上级
      onlineState: "", //玩家在线状态
      realNameAuth: "", //玩家认证状态
      playId: "", //会员id
      phone: "", //手机号码
      realName: "", //真实姓名
      bankAccount: "", //银行卡
      stateoptions: [
        {
          value: 0,
          label: "全部"
        },
        {
          value: 1,
          label: "启用"
        },
        {
          value: 2,
          label: "禁用"
        }
      ],
      leveloptions: [],
      moreConditions: false, //更多条件

      //表格 分页
      pageSize: 10,
      total: 0,
      pageNum: 1,
      tableData: [],
      isloading: false
    };
  },
  created() {
    this.queryHandle();
    this.getLevelListHandle();
  },
  activated() {
    this.queryHandle();
    this.getLevelListHandle();
  },
  computed: {
    warningStatus() {
      let status = this.tableData[0] ? this.tableData[0].status : "";
      if (status == 1) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    moneyFormater,
    searchHandle() {
      this.pageNum = 1;
      this.queryHandle();
    },
    queryHandle() {
      //查询会员列表
      if (this.playId != null && this.playId != "") {
        if (this.playId.toString().length > 9) {
          this.$message.warning({ message: "会员ID长度不能大于9位" });
          return;
        }
        let reg = new RegExp(/^\d+$/); //包含0 和大于0的整数
        if (!reg.test(this.playId)) {
          this.$message.warning({ message: "会员ID请输入有效格式(非负整数)" });
          return;
        }
      }
      this.isloading = true;
      let data = {
        conditionsMap: {
          account: this.account.trim(),
          playId: this.playId != "" ? Number(this.playId) : null,
          phone: this.phone.trim(),
          realName: this.realName.trim(),
          bankAccount: this.bankAccount.trim(),
          state: this.state,
          parentAccount: this.superior.trim(),
          level: this.level,
          onlineState: this.onlineState,
          realNameAuth: this.realNameAuth + "",
          startDate: this.createDate ? this.createDate[0] : "",
          endDate: this.createDate ? this.createDate[1] : ""
        },
        limit: this.pageSize,
        offset: (this.pageNum - 1) * this.pageSize,
        sort: "createDate",
        sortOrder: "desc"
      };
      memberRequest
        .getUsers(data)
        .then(res => {
          if (res.rows) {
            this.tableData = res.rows;
            this.total = res.total;
            this.pageSize = res.limit;
            this.pageNum = res.offset / res.limit + 1;
          } else {
            this.$notify({
              type: "warning",
              title: res.msg
            });
          }
          this.isloading = false;
        })
        .catch(err => {
          console.log(err);
          this.isloading = false;
        });
    },
    getLevelListHandle() {
      //获取会员等级列表
      memberRequest
        .getLevelList()
        .then(res => {
          if (res.code == "200") {
            this.leveloptions = res.data;
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
    addHandle() {
      //点击新增用户按钮
      this.$router.push({
        name: "新增用户"
      });
    },
    getDetailHandle(rew) {
      let data = {
        account: rew.account,
        score: rew.score,
        todayIntegral: rew.todayIntegral
      };
      //点击用户详情按钮
      this.$router.push({
        name: "会员详情",
        params: data
      });
    },
    sizeChangeHandle(size) {
      //切换表格显示条数
      this.pageSize = size;
      this.queryHandle();
    },
    currentChangeHandle(crtpage) {
      //切换表格当前页
      this.pageNum = crtpage;
      this.queryHandle();
    },
    changeStateBtnHandle(account, state) {
      //启用禁用账户按钮
      this.$confirm(
        (state == "2" ? "请确认是否要禁用账号：" : "请确认是否要启用账号：") +
          account,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        }
      )
        .then(() => {
          this.isloading = true;
          memberRequest
            .changeState({
              account: account,
              state: state
            })
            .then(res => {
              if (res.code == "200") {
                this.$notify({
                  title: "操作成功",
                  type: "success",
                  duration: 3 * 1000
                });
                this.isloading = false;
                this.queryHandle();
              } else {
                this.$notify({
                  title: "操作失败",
                  message: res.msg,
                  type: "success",
                  duration: 3 * 1000
                });
                this.isloading = false;
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    getKickPlayer(row,index) {
      // 在线会员踢人功能
      // this.$set(this.tableData[index],'onlineState', 2)
      this.$confirm(
        '你确认要该会员<strong style="color: red">强制下线</strong>?',
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true,
          dangerouslyUseHTMLString: true
        }
      )
        .then(() => {
          this.isloading = true;
          memberRequest
            .kickPlayer(row.id)
            .then(res => {
              console.log(res)
              if (res.code === "200") {
                this.$notify({
                  type: "success",
                  title: res.msg,
                  duration: 3 * 1000
                });
                console.log(res)
                this.isloading = false;
                this.queryHandle();
                // this.$set(row[index], '')
              } else {
                this.$notify({
                  type: "warning",
                  title: "操作失败",
                  message: res.msg,
                  duration: 3 * 1000
                });
                this.isloading = false;
              }
            })
            .catch(err => {
              // console.log(err)
              this.$notify({
                type: "warning",
                title: '操作失败,请稍后重试！'
              });
              this.isloading = false;
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消踢人"
          });
        });
    }
  },
  filters: {
    Upper(val) {
      //当不需要返回加减号 需要除以1000 需要截取保留2位小数
      //console.log(val);
      if (!val) return "0.00";
      let str = String(val);
      let mathdata = Math.floor(str) / 1000;
      let s = mathdata + "";
      if (s.indexOf(".") == -1) {
        console.log(s);
        return s;
      } else {
        return s.substring(0, s.indexOf(".") + 3);
      }
    }
  }
};
</script>
