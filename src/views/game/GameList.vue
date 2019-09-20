<template>
    <el-card>
        <el-form label-width="90px">
            <el-row type="flex" justify="space-between">
                <el-col :span="6">
                    <el-form-item label="游戏名称：">
                        <el-input v-model="gamename" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="游戏状态：">
                        <el-select v-model="gamestate" clearable >
                            <el-option value="" label="全部"></el-option>
                            <el-option
                                v-for="item in stateoptions"
                                :key="item.value"
                                :value="item.value"
                                :label="item.label"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <!-- <el-col :span="6">
                    <el-form-item label="游戏类型：">
                        <el-select v-model="gametype" clearable >
                            <el-option value="" label="全部"></el-option>
                            <el-option
                                v-for="item in typeoptions"
                                :key="item.value"
                                :value="item.value"
                                :label="item.label"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col> -->
                <el-col :span="3">
                    <el-form-item label-width="0">
                        <el-button
                            type="primary"
                            size="medium"
                            icon="el-icon-search"
                            @click="searchHandle"
                            style="width:100%"
                        >搜索</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-table
            :data="tableData"
            v-loading="isloading"
            style="width: 100%;margin-top:10px;"
            :border="true"
            :fit="true"
            size="medium"
            stripe
            :cell-style="{textAlign:'center'}"
            :header-cell-style="{textAlign:'center'}"
            highlight-current-row
        >
            <el-table-column prop="gameName" label="游戏名称" width=""></el-table-column>
            <!-- <el-table-column prop="gameType" label="游戏类型" width="">
                <template slot-scope="scope">
                    <el-tag size="medium" type="success" v-if="scope.row.gameType == 3">对战类</el-tag>
                    <el-tag size="medium" type="warning" v-if="scope.row.gameType == 2">捕鱼类</el-tag>
                    <el-tag size="medium" type="info" v-if="scope.row.gameType == 1">下注类</el-tag>
                </template>
            </el-table-column> -->
            <el-table-column prop="siteStatus" label="游戏状态" width="">
                <template slot-scope="scope">
                    <el-tag size="medium" type="success" v-if="scope.row.siteStatus == 1">正常</el-tag>
                    <el-tag size="medium" type="danger" v-if="scope.row.siteStatus == 2">关闭</el-tag>
                    <el-tag size="medium" type="warning" v-if="scope.row.siteStatus == 3">开发中</el-tag>
                    <el-tag size="medium" type="info" v-if="scope.row.siteStatus == 4">敬请期待</el-tag>
                    <el-tag size="medium" type="info" v-if="scope.row.siteStatus == 5">即将上线</el-tag>
                    <el-tag size="medium" type="warning" v-if="scope.row.siteStatus == 6">维护中</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="createDate" label="维护时间" width="">
                <template
                    slot-scope="scope"
                >{{(scope.row.maintainStartDate || '无')+'~'+(scope.row.maintainEndDate || '无')}}</template>
            </el-table-column>
            <el-table-column prop="operating" width="" label="操作">
                <template slot-scope="scope">
                    
                    <el-button
                        size="mini"
                        @click="getGameRoomList(scope.row)"
                        type="primary"
                        plain
                    >房间</el-button>
                    
                    <template>
                        
                        <el-button
                            size="mini"
                            @click="editRoomStt(scope.row)"
                            type="default"
                            plain
                        >编辑</el-button>
                    </template>
                    <!-- <template v-else>
                        <el-button size="mini" type="default" plain disabled>编辑</el-button>
                    </template> -->

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
        
        <el-dialog :visible.sync="dialogVisible" width="400px">
            <el-card>
                <el-form label-width="100px">
                    <el-form-item label="游戏状态：">
                        <el-select v-model="gameState">
                            <el-option value="1" label="正常">正常</el-option>
                            <el-option value="2" label="关闭">关闭</el-option>
                             <el-option value="4" label="敬请期待">敬请期待</el-option>
                            <el-option value="5" label="即将上线">即将上线</el-option>
                            <el-option value="6" label="维护中">维护中</el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-card>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateRoomStt">保 存</el-button>
            </span>
        </el-dialog>
    </el-card>
</template>

<script>
import gameRequest from "@/request/game";
import tableHeight from "@/tool/tableHeight";


export default {
  name: "GameList",
  data() {
    return {
      dialogVisible: false,
      gamename: "",
      gamestate: "",//搜索查询的状态值
    //   gametype: "",
       gameState: "",//编辑修改的状态值
      configId: "",
      gameId:"",//游戏ID
      stateoptions: [
        {
          value: 1,
          label: "正常"
        },
        {
          value: 2,
          label: "禁用"
        },
         {
          value: 4,
          label: "敬请期待"
        },
         {
          value: 5,
          label: "即将上线"
        },
        {
          value: 6,
          label: "维护中"
        }
      ],
      typeoptions: [
        {
          value: 1,
          label: "下注类"
        },
        {
          value: 2,
          label: "捕鱼类"
        },
        {
          value: 3,
          label: "对战类"
        }
      ],

      pageSize: 10,
      total: 0,
      pageNum: 1,
      tableData: [],
      isloading: false,


      centerDialogVisible: false,
      centerDialogAccount: "",
      centerDialogState: ""
    };
  },
  computed: {},
  created() {
    this.queryHandle();
  },
  methods: {
    searchHandle() {
      //搜索按钮
      this.pageNum = 1;
      this.queryHandle();
    },
    queryHandle() {
      this.isloading = true;
      let data = {
        conditionsMap: {
          gameName: this.gamename.trim(),
        //   gameType: this.gametype,
          maintainStatus: this.gamestate
        },
        // "pageSize": this.pageSize,
        // "pageNum": this.pageNum,
        sort: "id",
        sortOrder: "desc",
        offset: (this.pageNum - 1) * this.pageSize,
        limit: this.pageSize
      };
      gameRequest
        .getGamePage(data)
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
    getGameRoomList(row) {
      //查看游戏房间
      this.$router.push({
        name: "游戏房间管理",
        params: { id: row.gameId }
      });
    },
    sizeChangeHandle(size) {
      //表格显示条数改变
      this.pageSize = size;
      this.queryHandle();
    },
    currentChangeHandle(crtpage) {
      //表格显示页数改变
      this.pageNum = crtpage;
      this.queryHandle();
    },
    editRoomStt(row) {
      // console.log(row)
      this.dialogVisible = true;
      this.gameState = row.siteStatus;
      this.configId = row.id;
      this.gameId = parseInt(row.gameId);//游戏ID
    },
    updateRoomStt() {
      this.$confirm("请确认是否更新游戏状态：", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          this.isloading = true;
          gameRequest
            .maintainTbGameList({
              idList: [this.configId],
              status: this.gameState,
              gameId:this.gameId
            })
            .then(res => {
              if (res.code == "200") {
                this.$notify.success(res.msg);
                this.isloading = false;
                this.dialogVisible = false;
                this.queryHandle();
              } else {
                this.$notify.error(res.msg);
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
    }
  }
};
</script>

<style lang="scss">
</style>
