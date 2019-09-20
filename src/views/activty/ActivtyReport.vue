<template>
  <el-card>
    <el-form
      label-width="80px"
    >
      <el-row type="flex" justify="space-between">
        <el-col :span="4">
          <el-form-item
            label="活动名称"
          >
            <el-select v-model="activityName" clearable placeholder="请选择"
              style="width:100%"
            >
              <el-option
                v-for="item in activityNames"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item
            label="会员账号"
          >
            <el-input
              placeholder="请输入账号"
              v-model="account"
              maxlength="16"
              clearable>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="申请日期"
          >
            <el-date-picker
              v-model="createDate"
              type="daterange"
              align="center"
              value-format='timestamp'
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width:100%;"  
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item
            label="审核状态"
          >
            <el-select v-model="state" clearable placeholder="请选择"
            style='width:100%'
            >
              <el-option
                v-for="item in stateoptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row
        type="flex"
        justify="space-between"
      >
        <el-form-item
          label="会员ID"
        >
          <el-input
            placeholder="会员id"
            v-model="playId"
            clearable>
          </el-input>
        </el-form-item>
        <el-form-item label-width="0">
          <el-button type="primary" size="medium" icon="el-icon-search" @click='searchHandle'>
            查询
          </el-button>
        </el-form-item>
      </el-row>
    </el-form>
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
      :default-sort = "{prop: 'createDate', order: 'descending'}"
    >
      <el-table-column
        prop="activityName"
        label="活动名称"
      >
      </el-table-column>
      <el-table-column
        prop="account"
        label="会员账号"
      >
      </el-table-column>
      <!-- <el-table-column
        prop="playId"
        label="会员ID"
      >
      </el-table-column> -->
      <el-table-column
        prop="createDateStr"
        label="申请时间"
      >
      </el-table-column>
      <el-table-column
              prop="subNum"
              label="消耗货币"
      >
      </el-table-column>
      <el-table-column
        prop="activityAmount"
        label="活动奖励"
      >
      </el-table-column>
      <el-table-column
        prop="auditStatus"
        label="状态"
      >
        <template slot-scope="scope">
          <el-tag size="medium" color="#ddd" type="info" v-if="scope.row.auditStatus == 1">待处理</el-tag>
          <el-tag size="medium" color="#fff" type="success" v-if="scope.row.auditStatus == 2">通过</el-tag>
          <el-tag size="medium" color="#fff" type="danger" v-if="scope.row.auditStatus == 3">拒绝</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button size="mini" plain @click='changeState(scope.row,2)' type="primary"  v-if="scope.row.auditStatus == 1">通过</el-button>
          <el-button size="mini" plain @click='changeState(scope.row,3)' type="danger"  v-if="scope.row.auditStatus == 1">拒绝</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="updateBy"
        label="操作人"
        sortable
        width="">
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
  </el-card>
</template>

<script>
import activtyRequest from '@/request/activty'
import validator from '@/tool/validate'
export default {
    name: 'ActivtyReport',
    data() {
        var isIntegerChips = (r, v, c) => { //正整数
            console.log(v);
            let reg = new RegExp(/^\+?[1-9][0-9]*$/);//(/^\d+$/);
            if (v === 0 || !reg.test(v)) {//不包含0
                return c(new Error('请输入正整数'));
            } else {
                return c();
            }
        }
        return {
            //搜索条件
            activityName: '',
            account: '',
            createDate: '',
            state: '',
            playId: '', //会员id
            rewardType: ['金币', '积分', '其他', '红包', '免费次数'],//根据bug单11636 改动 ['金币','金币','免费次数'] 11892bug单改回来 6-25增加免费次数
            subType: ['金币', '积分', '免费次数'],
            activityNames: [
                {
                    value: 1,
                    label: '注册送'
                },
                {
                    value: 2,
                    label: '试玩金'
                },
                {
                    value: 3,
                    label: '首充送'
                },
                {
                    value: 5,
                    label: '签到'
                },
                {
                    value: 6,
                    label: '幸运转盘'
                },
                {
                    value: 7,
                    label: '实名认证'
                },
                {
                    value: 4,
                    label: '其他'
                },
            ],
            stateoptions: [
                {
                    value: 1,
                    label: '待处理'
                },
                {
                    value: 2,
                    label: '通过'
                },
                {
                    value: 3,
                    label: '拒绝'
                },
            ],

            //表格 分页
            pageSize: 10,
            total: 0,
            pageNum: 1,
            tableData: [],
            isloading: false,
        }
    },
    created() {
        this.queryHandle();
    },
    activated() {
        this.queryHandle();
    },
    methods: {
        _moneyFormatter(val) {//当不需要返回加减号 需要除以1000 需要截取保留2位小数
            //console.log(val);
            if (!val) return "0.00";
            let str = String(val / 1000);
            let idx = str.indexOf('.') + 3;
            if (str.indexOf('.') > -1) {
                if (str.length > 4) {
                    str = str.slice(0, idx);
                }
            }
            return str;//.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        searchHandle() {
            this.pageNum = 1;
            this.queryHandle();
        },
        queryHandle() {   //查询会员列表
            if (this.playId != null && this.playId != '') {
                if (this.playId.toString().length > 9) {
                    this.$message.warning({message: "会员ID长度不能大于9位"});
                    return;
                }
                let reg = new RegExp(/^\d+$/);//包含0 和大于0的整数
                if (!reg.test(this.playId)) {
                    this.$message.warning({message: "会员ID请输入有效格式(非负整数)"});
                    return;
                }
            }
            this.isloading = true;
            let data = {
                "conditionsMap": {
                    activityType: this.activityName,
                    account: this.account.trim(),
                    playId: Number(this.playId),
                    createDateStart: this.createDate ? this.createDate[0] : '',
                    createDateEnd: this.createDate ? this.createDate[1] : '',
                    auditStatus: this.state
                },
                "limit": this.pageSize,
                "offset": (this.pageNum - 1) * this.pageSize,
                "sort": "createDate",
                "sortOrder": "desc"
            }
            // 帮后端日期加一天
            if (this.createDate) {
                data.conditionsMap.createDateEnd += 86400000;
            }
            activtyRequest.getSiteActivityBonusList(data).then(res => {
                let data = res.data
                if (res.code == 200) {
                    this.tableData = data.rows;
                    this.total = data.total;
                    this.pageSize = data.limit;
                    this.pageNum = data.offset / data.limit + 1;
                    for (let i = 0; i < this.tableData.length; i++) {
                        // if (this.tableData[i].lotteryType && this.tableData[i].activityName == '幸运夺宝'){
                        //   this.tableData[i].activityName += '-' + this.duobaoType[this.tableData[i].lotteryType - 1];
                        // }
                        if (this.tableData[i].rewardType && Number(this.tableData[i].rewardType) <= this.rewardType.length) {
                            this.tableData[i].activityAmount += ' ' + this.rewardType[this.tableData[i].rewardType - 1];
                        }

                        if (this.tableData[i].subType && Number(this.tableData[i].subType) <= this.subType.length) {
                            if (this.tableData[i].subNum == null || this.tableData[i].subNum == 0) {
                                this.tableData[i].subNum = '-';
                            } else {
                                // if(this.tableData[i].subType == 2){//当类型返回的是积分的时候 需要除以1000
                                //     this.tableData[i].subNum = this._moneyFormatter(this.tableData[i].subNum) +' ' + this.subType[this.tableData[i].subType - 1];
                                // }else {
                                this.tableData[i].subNum += ' ' + this.subType[this.tableData[i].subType - 1];
                                // }
                            }
                        } else {
                            if (this.tableData[i].subNum == null || this.tableData[i].subNum == 0) {
                                this.tableData[i].subNum = '-';
                            }
                        }
                    }
                } else {
                    this.$notify({
                        type: 'warning',
                        title: res.msg
                    })
                }
                this.isloading = false;
            }).catch(err => {
                console.log(err)
                this.isloading = false;
            })
        },
        sizeChangeHandle(size) {  //切换表格显示条数
            this.pageSize = size;
            this.queryHandle();
        },
        currentChangeHandle(crtpage) {  //切换表格当前页
            this.pageNum = crtpage;
            this.queryHandle();
        },
        auditSiteActivityBonus(data) {  //审核活动
            this.isloading = true;
            activtyRequest.auditSiteActivityBonus(data).then(res => {
                if (res.code == '200') {
                    this.$notify({
                        title: '操作成功',
                        type: 'success',
                        duration: 3 * 1000
                    })
                    this.isloading = false;
                    this.queryHandle();
                } else {
                    this.$notify({
                        title: '操作失败',
                        message: res.msg,
                        type: 'warning',
                        duration: 3 * 1000
                    })
                    this.isloading = false;
                }
            }).catch(err => {
                console.log(err)
                this.isloading = false;
            })
        },
        changeState(row, state) {  //操作按钮
            let msg2 = '正在通过账户' + row.account + '的申请,你还要继续吗?';
            let msg3 = '正在拒绝账户' + row.account + '的申请,你还要继续吗?';
            if (state == 2) {  //通过审核
                this.$prompt(msg2, '确认通过', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^[0-9]+$/,
                    inputPlaceholder: '请输入活动奖励金额',
                    inputErrorMessage: '请输入数字'
                }).then(({value}) => {
                    let data = {
                        id: row.id,
                        auditStatus: 2,
                        activityAmount: value
                    };
                    this.auditSiteActivityBonus(data);
                }).catch(() => {
                })
            } else {  //拒绝
                this.$confirm(msg3, '操作确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    let data = {
                        id: row.id,
                        auditStatus: 3
                    }
                    this.auditSiteActivityBonus(data);
                }).catch(() => {
                })
            }
        }
    },
}
</script>

<style lang="scss">
</style>
