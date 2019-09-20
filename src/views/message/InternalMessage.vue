<template>
    <el-card class="inernalmessagecontainer">
        <el-row>
            <el-tabs v-model="activeName" @tab-click="tabsHandleClick">
                <el-tab-pane label="收件箱" name="inbox"></el-tab-pane>
                <el-tab-pane label="发件箱" name="outbox"></el-tab-pane>
                <el-tab-pane label="APP消息推送" name="App"></el-tab-pane>
            </el-tabs>
        </el-row>
        <template v-if="activeName != 'App'">
            <el-form
                    style="margin-top:10px"
                    label-width="70px"
            >
                <el-row
                        type="flex" justify="space-between" align="middle"
                >
                    <el-col
                            :span="3"
                    >
                        <el-form-item
                                label-width="0"
                        >
                            <el-button
                                    size="medium"
                                    icon="el-icon-plus"
                                    @click="addMessageBtnHandle"
                            >发新消息
                            </el-button>

                        </el-form-item>
                    </el-col>
                    <el-col :span="3">
                        <el-form-item
                                label-width="0"
                        >
                            <el-button
                                    size="medium"
                                    type="primary"
                                    icon="el-icon-plus"
                                    @click="addMessageNewBtn"
                            >新会员邮件
                            </el-button>
                        </el-form-item>


                    </el-col>

                    <el-col
                            :span="5"
                    >
                        <el-form-item
                                label="标题"
                                label-width="40px"
                        >
                            <el-input
                                    v-model="title" clearable
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col
                            :span="10"
                    >
                        <el-form-item
                                :label="(state=='inbox'?'收信时间':'发信时间')"
                        >
                            <el-date-picker
                                    v-model="datetimerange"
                                    type="datetimerange"
                                    range-separator="~"
                                    style="width:102%"
                                    align="center"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    start-placeholder="开始时间"
                                    end-placeholder="结束时间"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col
                            :span="2"
                    >
                        <el-form-item
                                label-width="0"
                        >
                            <el-button
                                    size="medium"
                                    type="primary"
                                    icon="el-icon-search"
                                    @click="searchHandle"
                                    style="width:100%"
                            >搜索
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <el-table
                    border
                    fit
                    stripe
                    :data='tableData'
                    v-loading='tableLoading'
                    :cell-style="{textAlign:'center'}"
                    :header-cell-style="{textAlign:'center'}"
            >
                <el-table-column
                        type="index"
                        label="序号"
                ></el-table-column>
                <el-table-column
                        prop="createBy"
                        :label="(state=='inbox'?'发件人':'收件人')"
                >
                    <template
                            slot-scope="scope"
                    >
                        <template
                                v-if="state == 'outbox'"
                        >
                            <el-popover
                                    placement="bottom"
                                    title="发送到这些会员:"
                                    width="250"
                                    trigger="click"
                            >
                                <div class="tags"
                                     v-loading="popLoading"
                                >
                                    <template
                                            v-for="item in popData"
                                    >
                                        <el-tag
                                                :key="item.account"
                                        >{{item.account}}
                                        </el-tag>
                                    </template>
                                </div>
                                <el-button type="primary"
                                           slot="reference"
                                           size='mini'
                                           @click="getRecipient(scope.row.id)"
                                >查看收件人
                                </el-button>
                            </el-popover>
                        </template>
                        <template
                                v-if="state == 'inbox'"
                        >
                            {{scope.row.createBy}}
                        </template>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="createDate"
                        label="发布时间"
                ></el-table-column>
                <el-table-column
                        prop="noticeTitle"
                        label="标题"
                ></el-table-column>
                <el-table-column
                        prop="isRead"
                        label="已读状态"
                >
                    <template
                            slot-scope="scope"
                    >
                        <el-tag
                                v-if="scope.row.isRead == 1"
                        >未读
                        </el-tag>
                        <el-tag
                                v-else
                        >已读
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        label="操作"
                >
                    <template
                            slot-scope="scope"
                    >
                        <el-button
                                size="mini"
                                type="primary"
                                @click="showMessage(scope.row)"
                        >
                            查看消息
                        </el-button>
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
        </template>

        <template v-else>
            <el-row :gutter="40">
                <el-col :lg="10" :md="24">
                    <el-form ref="appMsgForm"
                             :rules="appMsgRules"
                             :model="appMsgForm"
                             label-width="120px">
                        <el-form-item label="通知标题："
                                      prop="msgTitle">
                            <el-input v-model="appMsgForm.msgTitle"
                                      placeholder="请输入通知标题"></el-input>
                        </el-form-item>
                        <el-form-item label="通知内容：" prop="msgContent">
                            <el-input v-model="appMsgForm.msgContent"
                                      type="textarea" placeholder="请输入通知内容"></el-input>
                        </el-form-item>

                        <!--新需求，需要隐藏-->
                        <!--<el-form-item label="推送方式：">-->
                            <!--<el-radio-group v-model="appMsgForm.pushType">-->
                                <!--<el-radio label="即时"></el-radio>-->
                                <!--<el-radio label="定时"></el-radio>-->
                            <!--</el-radio-group>-->
                            <!--<el-form-item v-if="appMsgForm.pushType == '定时'"-->
                                          <!--label="时间选择："-->
                                          <!--label-width="100px"-->
                                          <!--style="margin: 10px auto 0; padding: 0">-->
                                <!--<el-date-picker-->
                                        <!--v-model="appMsgTime"-->
                                        <!--type="datetimerange"-->
                                        <!--style="width: 83%"-->
                                        <!--size="mini"-->
                                        <!--range-separator="~"-->
                                        <!--value-format="yyyy-MM-dd HH:mm:ss"-->
                                        <!--start-placeholder="开始时间"-->
                                        <!--end-placeholder="结束时间"-->
                                        <!--align="center">-->
                                <!--</el-date-picker>-->
                            <!--</el-form-item>-->
                        <!--</el-form-item>-->

                        <!--<el-form-item label="消息有效期：">-->
                        <!--<el-radio-group v-model="appMsgForm.msgType">-->
                        <!--<el-radio label="是"></el-radio>-->
                        <!--<el-radio label="否"></el-radio>-->
                        <!--</el-radio-group>-->
                        <!--<el-form-item v-if="appMsgForm.msgType=='是'"-->
                        <!--prop="msgEffective"-->
                        <!--label="有效时长："-->
                        <!--label-width="100px"-->
                        <!--size="mini"-->
                        <!--style="margin: 10px auto 0; padding: 0">-->
                        <!--<el-input style="width: 80px"-->
                        <!--type="number"-->
                        <!--v-model="appMsgForm.msgEffective"></el-input>-->
                        <!--<span>&nbsp;(请输入0-72小时内的正整数，该时间段内在线过的用户均可收到通知)</span>-->
                        <!--</el-form-item>-->
                        <!--</el-form-item>-->

                        <el-form-item>
                            <el-button type="primary" style="width: 120px"
                                       @click="addOrUpdatePush">保存
                            </el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :lg="14" :md="24">
                    <el-button type="primary" style="width: 120px; float: right; margin-bottom: 20px"
                               @click="getPushList">历史记录
                    </el-button>
                    <el-card v-if="showAppMsgRecord">
                        <div slot="header">
                            <span>历史记录</span>
                            <el-button style="float: right; padding: 3px 0" type="text"
                                       @click="showAppMsgRecord=false">X
                            </el-button>
                        </div>
                        <el-table
                                fit
                                stripe
                                max-height="500"
                                :data='appMsgRecord'
                                v-loading='tableLoading'
                                :cell-style="{textAlign:'center'}"
                                :header-cell-style="{textAlign:'center'}"
                        >
                            <el-table-column label="日期"
                                             prop="createDate">
                            </el-table-column>
                            <el-table-column label="通知标题"
                                             prop="msgTitle">
                            </el-table-column>
                            <el-table-column label="通知内容"
                                             min-width="200px"
                                             prop="msgContent">
                            </el-table-column>
                            <el-table-column label="推送方式"
                                             prop="pushType">
                                <template slot-scope="scope">
                                    {{scope.row.pushType == 1 ? '即时' : '定时'}}
                                </template>
                            </el-table-column>
                            <!--<el-table-column label="信息有效日期"-->
                            <!--prop="">-->
                            <!--<template slot-scope="scope">-->
                            <!--{{scope.row.msgType == 1 ? '是' : '否'}}-->
                            <!--</template>-->
                            <!--</el-table-column>-->
                            <el-table-column label="操作人"
                                             prop="createBy">
                            </el-table-column>
                        </el-table>
                    </el-card>
                </el-col>
            </el-row>
        </template>

        <!-- 发新消息对话框 -->
        <el-dialog
                title="发送消息"
                :visible.sync="dialogVisible"
                width="45%"
                center
                @closed='dialogClosed'
        >
            <el-form
                    label-width="90px"
                    :model="dialogData"
                    :rules="rules"
                    ref="dialogForm"
                    status-icon
            >
                <el-row
                >
                    <el-form-item label="选择体系：">
                        <el-select v-model="dialogData.system"
                                   style="width:100%"
                        >
                            <el-option value='all' label="所有会员">所有会员</el-option>
                            <el-option value='level' label="会员等级">会员等级</el-option>
                            <el-option value='single' label="单个会员">单个会员</el-option>
                            <el-option value='multi' label="多个会员">多个会员</el-option>
                        </el-select>
                    </el-form-item>
                </el-row>

                <template v-if="dialogData.system == 'level'">
                    <el-row>
                        <el-form-item label="选择等级：">
                            <el-select v-model="dialogData.level" placeholder="请选择" clearable
                                       style="width:100%"
                            >
                                <el-option v-for="level in levelList" :label="level.levelName" :key='level.id'
                                           :value="level.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-row>
                </template>
                <template v-if="dialogData.system == 'single'">
                    <el-row>
                        <el-form-item label="会员账号：">
                            <el-input v-model="dialogData.account" placeholder="请输入账号查询">
                                <template slot="append">
                                    <el-button size="medium"
                                               @click="queryAccount('single')"
                                    >搜索
                                    </el-button>
                                </template>
                            </el-input>
                        </el-form-item>
                    </el-row>
                    <el-row
                            type="flex"
                            justify="space-between"
                            v-if="dialogData.singleMemberInfo"
                    >
                        <el-col :span="10">
                            <el-form-item
                                    label="会员账号："
                            >
                                <el-input v-model="dialogData.singleMemberInfo.account" readonly></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item
                                    label="余额："
                            >
                                <el-input v-model="dialogData.singleMemberInfo.money" readonly></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row
                            type="flex"
                            justify="space-between"
                            v-if="dialogData.singleMemberInfo"
                    >
                        <el-col :span="10">
                            <el-form-item
                                    label="会员状态："
                            >
                                <el-select
                                        v-model="dialogData.singleMemberInfo.state"
                                        readonly
                                        style="width:100%"
                                >
                                    <el-option
                                            label="正常"
                                            :value="1"
                                    ></el-option>
                                    <el-option
                                            label="冻结"
                                            :value="2"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item
                                    label="上级："
                            >
                                <el-input
                                        v-model="dialogData.singleMemberInfo.parentAccount"
                                        readonly
                                ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </template>

                <template v-if="dialogData.system == 'multi'">
                    <el-row>
                        <el-form-item label="账号列表">
                            <el-row
                                    type="flex"
                                    justify="space-between"
                            >
                                <el-col :span="20"
                                        v-if="dialogData.accounts.length>0"
                                >
                                    <el-card body-style="border:1px solid #ddd;padding:10px;">
                                        <el-tag
                                                v-for="tag in dialogData.accounts"
                                                :key="tag"
                                                closable
                                                style="margin:5px;"
                                                @close='removeAccountInAccounts(tag)'
                                        >
                                            {{tag}}
                                        </el-tag>
                                    </el-card>
                                </el-col>
                                <el-col :span="3">
                                    <el-button type="primary"
                                               style="width:100%"
                                               @click='innerVisible = true'
                                    >添加
                                    </el-button>
                                </el-col>
                            </el-row>
                        </el-form-item>
                    </el-row>
                    <el-dialog
                            width="30%"
                            title="会员账号搜索"
                            :visible.sync="innerVisible"
                            @closed='innerDialogClosed'
                            append-to-body
                    >
                        <el-form :model="innerDialogData"
                                 label-width="90px"
                        >
                            <el-form-item label="会员账号">
                                <el-input v-model="dialogData.account" placeholder="请输入">
                                    <template slot="append">
                                        <el-button size="medium"
                                                   @click="queryAccount('multi')"
                                        >搜索
                                        </el-button>
                                    </template>
                                </el-input>
                            </el-form-item>
                            <el-form-item label="查询结果"
                                          v-if="innerDialogData.multiMemberInfo.length>0"
                            >
                                <el-checkbox-group v-model="checkedAccount">
                                    <el-checkbox v-for="acc in innerDialogData.multiMemberInfo" :label="acc.account"
                                                 :key="acc.id">{{acc.account}}
                                    </el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="innerVisible = false">取 消</el-button>
                            <el-button type="primary" @click="multiAdd">确定</el-button>
                        </div>
                    </el-dialog>
                </template>

                <el-form-item label="标题：" prop="noticeTitle">
                    <el-input v-model.trim="dialogData.noticeTitle" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="内容：" prop="noticeContent">
                    <el-input v-model.trim="dialogData.noticeContent" placeholder="请输入至少5个字符"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
        <el-row
                type="flex" justify="end"
        >
          <el-button @click="dialogVisible = false"
                     style="width:120px;"
          >取 消</el-button>
          <el-button type="primary" :loading="dialogSaveLoading" @click="dialogSaveBtnHandle"
                     style="width:120px;"
          >保 存</el-button>
        </el-row>
      </span>
        </el-dialog>
        <!--给新会员发送邮件-->
        <el-dialog
                title="发送邮件"
                :visible.sync="newDdialogVisible"
                width="45%"
                center
                @closed='NewdialogClosed'

        >
            <el-form
                    :model="newDialogForm"
                    :rules="newDialogrules"
                    ref="newDialogForm"
                    v-loading="isLoading"

            >

                <el-form-item label="" prop="newDialogFormText">
                    <p style="font-size: 16px">给新注册会员发送邮件</p>
                    <el-input
                            class="newtext"
                            type="textarea"
                            :rows="2"
                            placeholder="请输入邮件内容"
                            v-model.trim="newDialogForm.newDialogFormText"
                    >
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="newDdialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogSaveNewBtn">保存</el-button>
            </div>
        </el-dialog>
        <!-- 查看消息对话框 -->
        <el-dialog
                title="查看邮件"
                :visible.sync="checkMessageDialogVisible"
                width="45%"
                center
                @closed='checkMessageDialogClosed'
        >
            <el-form
            >
                <el-row>
                    <el-form-item
                            label="标题："
                    >
                        <el-input
                                v-model="checkMessageDialogData.noticeTitle"
                                readonly
                        ></el-input>
                    </el-form-item>
                </el-row>
                <el-row
                        type="flex"
                        justify="space-between"
                >
                    <el-col
                            :span="11"
                    >
                        <el-form-item
                                label="发件人:"
                                label-width="60px"
                        >
                            <el-input
                                    v-model="checkMessageDialogData.createBy"
                                    readonly
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col
                            :span="11"
                    >
                        <el-form-item
                                label="发件时间:"
                                label-width="80px"
                        >
                            <el-input
                                    v-model="checkMessageDialogData.createDate"
                                    readonly
                            ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-form-item
                            label="邮件内容："
                    >
                        <el-input
                                readonly
                                v-model="checkMessageDialogData.noticeContent"
                                type="textarea"
                        ></el-input>
                    </el-form-item>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
        <!-- <el-button type="primary" @click="checkMessageDialogVisible = false">回 复</el-button> -->
        <el-button
                type="danger"
                @click="checkMessageDialogDelete"
                :loading="checkMessageDialogDeleteLoading"
        >删 除</el-button>
        <el-button @click="checkMessageDialogVisible = false">关 闭</el-button>
      </span>
        </el-dialog>

    </el-card>
</template>

<script>
    import messageRequest from '@/request/message'
    import financeRequest from "@/request/finance";
    import validator from '@/tool/validate'
    export default {
        name: 'InternalMessage',
        data() {
            return {
                title: '', //标题
                datetimerange: [], //日期范围
                state: 'inbox', //inbox收件箱  outbox发件箱
                activeName: 'inbox',
                pageNum: 1,
                pageSize: 10,
                total: 0,
                tableData: [],
                tableLoading: false,
                isLoading: false,
                dialogData: {  //对话框数据
                    system: '',   //发送消息体系
                    level: '',  //体系为会员等级  已选择的等级id
                    account: '',  //体系为单个会员  已输入的会员id
                    singleMemberInfo: '', //搜索会员账号返回的会员数据
                    accounts: [], //账号列表
                    noticeTitle: '', //消息标题
                    noticeContent: '', //消息内容
                },
                newDialogForm: {//新会员邮件对话框
                    newDialogFormText: '',
                    newId: ''
                },
                levelList: [],  //等级列表
                dialogVisible: false,
                newDdialogVisible: false,//给新用户发邮件
                dialogSaveLoading: false,
                dialogSearchLoading: false,

                rules: {
                    noticeTitle: [
                        {validator: validator.noticeTitle, trigger: 'blur'}
                    ],
                    noticeContent: [
                        {validator: validator.noticeContent, trigger: 'blur'}
                    ],

                },
                //新会员邮件对话框表单验证
                newDialogrules: {
                    newDialogFormText: [
                        {validator: validator.noticeContent, trigger: 'blur'}
                    ]
                },

                innerVisible: false, //多个会员搜索弹框
                innerDialogData: {
                    multiMemberInfo: [],//查询结果
                }, //多个会员数据
                checkedAccount: [], //选中的多个会员账号

                popData: [],  //发件箱查看收件人pop数据
                popLoading: false,  //pop的加载状态

                checkMessageDialogData: {  //查看邮件对话框数据
                },
                checkMessageDialogVisible: false,
                checkMessageDialogDeleteLoading: false,

                //app消息推送的form data
                appMsgTime: [],     //app消息推送时间
                appMsgForm: {
                    // msgEffective: 2,
                    // msgType: '是',
                    // pushType: '即时',  新需求，需要隐藏
                    msgTitle: '',
                    msgContent: ''
                },
                appMsgRules: {
                    msgTitle: [
                        {required: true, message: '必填项', trigger: 'blur'},
                        {max: 20, message: '最多输入20个字', trigger: 'blur'}
                    ],
                    msgContent: [
                        {required: true, message: '必填项', trigger: 'blur'},
                        {max: 100, message: '最多输入100个字', trigger: 'blur'}
                    ],
                    // msgEffective: [{required: true, message: '必填项', trigger: 'blur'}]
                },
                appMsgRecord: [],
                appRecordLoading: false,
                appRecordSaving: false,
                showAppMsgRecord: false
            }
        },
        methods: {
            tabsHandleClick(tab, event) { //切换收件箱发件箱
                this.state = tab.paneName;
                this.searchHandle();
            },
            searchHandle() { //点击搜索按钮
                this.pageNum = 1;
                this.queryHandle();
            },
            queryHandle() {  //查询
                this.tableLoading = true;
                let data = {
                    conditionsMap: {
                        beginDate: this.datetimerange ? this.datetimerange[0] : '',
                        endDate: this.datetimerange ? this.datetimerange[1] : '',
                        isAgent: 1,
                        isEmail: 1,
                        sort: "createDate",
                        sortOrder: "desc",
                        state: 1,
                        noticeTitle: this.title.trim()
                    },
                    limit: this.pageSize,
                    offset: (this.pageNum - 1) * this.pageSize,
                    sort: "createDate",
                    sortOrder: "desc"
                }
                if (this.state == 'inbox') {
                    messageRequest.getNoticeMsgList(data).then(res => {
                        if (res.rows) {
                            this.pageSize = res.limit;
                            this.pageNum = res.offset / res.limit + 1;
                            this.total = res.total;
                            this.tableData = res.rows;
                        } else {
                            this.$notify({
                                type: 'warning',
                                title: res.msg
                            })
                        }
                        this.tableLoading = false;
                    }).catch(err => {
                        console.log(err);
                        this.tableLoading = false;
                    })
                }
                if (this.state == 'outbox') {
                    data.conditionsMap.isAgent = 2;
                    messageRequest.getSendMsgList(data).then(res => {
                        if (res.rows) {
                            this.pageSize = res.limit;
                            this.pageNum = res.offset / res.limit + 1;
                            this.total = res.total;
                            this.tableData = res.rows;
                        } else {
                            this.$notify({
                                type: 'warning',
                                title: res.msg
                            })
                        }
                        this.tableLoading = false;
                    }).catch(err => {
                        console.log(err);
                        this.tableLoading = false;
                    })

                }
                if (this.state == 'App') {
                    this.tableLoading = false
                }
            },
            getRecipient(id) { //已发消息列表查看收件人
                this.popLoading = true;
                this.popData = [];
                messageRequest.userQueryList({id}).then(res => {
                    if (res.code == 200) {
                        this.popData = res.data;
                    } else {
                        this.$notify({
                            type: 'warning',
                            title: res.msg
                        })
                    }
                    this.popLoading = false;
                }).catch(err => {
                    console.log(err);
                    this.popLoading = false;
                })
            },

            queryUserLevelList() {  //获取用户等级列表
                messageRequest.queryUserLevelList({}).then(res => {
                    if (res.code == 200) {
                        this.levelList = res.data;
                    } else {
                        this.$notify({
                            type: 'warning',
                            title: res.msg
                        })
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            RequestfindUser(data,type){
                 financeRequest.findUser(data).then(res => {
                    if (res.code == 200) {
                        if(res.data==null){
                             this.$notify({
                                type: 'warning',
                                title: '用户不存在'
                            })
                        }else{
                            this.dialogData.singleMemberInfo = res.data;
                        }
                    } else {
                        this.$notify({
                            type: 'warning',
                            title: res.msg
                        })
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            messageRequestAccount(data,type){
                 messageRequest.queryAccount(data).then(res => {
                    if (res.code == 200) {
                        if(res.data==null){
                             this.$notify({
                                type: 'warning',
                                title: '用户不存在'
                            })
                        }else{
                            this.innerDialogData.multiMemberInfo = res.data;
                        }
                    } else {
                        this.$notify({
                            type: 'warning',
                            title: res.msg
                        })
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            queryAccount(type) {  //根据账号查找
                let data = {}
                if(type=='single'){
                    data.userAccount=this.dialogData.account
                    this.RequestfindUser(data)
                }else{
                     data.account=this.dialogData.account
                     data.flag = 2
                     this.messageRequestAccount(data)
                }
            },
            multiAdd() {   //确定添加多个会员账号
                let newarr = [...this.dialogData.accounts, ...this.checkedAccount];
                let newarr2 = Array.from(new Set(newarr)); //数组去重
                this.$set(this.dialogData, 'accounts', newarr2)
                this.innerVisible = false;
            },

            showMessage(row) {  //查看消息
                this.checkMessageDialogData = {
                    noticeTitle: row.noticeTitle,
                    createBy: row.createBy,
                    createDate: row.createDate,
                    noticeContent: row.noticeContent,
                    id: row.id,
                }
                this.checkMessageDialogVisible = true;
                //调用updateIsRead更改消息状态
                (row.isRead == '1') && messageRequest.updateIsRead({id: row.id}).then(res => {
                    if (res.code == '205') { //已读
                    } else {
                        this.$notify({
                            type: 'warning',
                            title: res.msg
                        })
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            checkMessageDialogClosed() {  //查看消息关闭回调
                this.checkMessageDialogData = {};
                this.queryHandle(); //更新列表
            },
            checkMessageDialogDelete() { //删除消息
                this.$confirm('确认删除消息吗?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(resolve => {
                    this.checkMessageDialogDeleteLoading = true;
                    let data = {
                        id: this.checkMessageDialogData.id,
                    }
                    if (this.state == 'inbox') {  //删除收件箱邮件
                        data.isAgent = 1;
                        messageRequest.deleteMsg(data).then(res => {
                            if (res.code == 200) {
                                this.checkMessageDialogDeleteLoading = false;
                                this.checkMessageDialogVisible = false;
                                this.$notify({
                                    type: 'success',
                                    title: res.msg
                                })
                                this.queryHandle();
                            } else {
                                this.$notify({
                                    type: 'warning',
                                    title: res.msg
                                })
                                this.checkMessageDialogDeleteLoading = false;
                            }
                        }).catch(err => {
                            console.log(err);
                            this.checkMessageDialogDeleteLoading = false;
                        })
                    }
                    if (this.state == 'outbox') {  //删除发件箱邮件
                        messageRequest.deleteSend(data).then(res => {
                            if (res.code == 200) {
                                this.checkMessageDialogDeleteLoading = false;
                                this.checkMessageDialogVisible = false;
                                this.$notify({
                                    type: 'success',
                                    title: res.msg
                                })
                                this.queryHandle();
                            } else {
                                this.$notify({
                                    type: 'warning',
                                    title: res.msg
                                })
                                this.checkMessageDialogDeleteLoading = false;
                            }
                        }).catch(err => {
                            console.log(err);
                            this.checkMessageDialogDeleteLoading = false;
                        })
                    }
                })
            },

            dialogCheckAllChange(val) { // 发送新消息接收成员全选
                this.dialogData.checkedItems = val ? this.dialogData.targets : [];
                this.dialogData.isIndeterminate = false;
            },
            dialogCheckedChange(value) {  //发送新消息成员选项变动
                let checkedCount = value.length;
                this.dialogData.checkAll = checkedCount === this.dialogData.targets.length;
                this.dialogData.isIndeterminate = checkedCount > 0 && checkedCount < this.dialogData.targets.length;
            },

            dialogClosed() {  //发新消息弹窗关闭
                this.dialogData = {
                    system: '',
                    level: '',
                    account: '',
                    singleMemberInfo: '',
                    accounts: [],
                    noticeTitle: '',
                    noticeContent: '',
                }
                this.$refs.dialogForm.clearValidate();
            },

            NewdialogClosed() {  //新会员发新消息弹窗关闭corner
                this.newDialogForm = {
                    noticeText: ''
                }
                this.$refs.newDialogForm.clearValidate();
            },

            innerDialogClosed() { //多个会员添加弹窗关闭
                this.dialogData.account = '';
                this.checkedAccount = [];
                this.innerDialogData.multiMemberInfo = '';
            },

            dialogSaveBtnHandle() {  //发送新消息
                this.dialogSaveLoading = true;
                if (!this.dialogData.system) {
                    this.$notify({
                        type: 'warning',
                        title: '请通过发送体系选择发送成员'
                    })
                    this.dialogSaveLoading = false;
                    return
                }
                let data = {
                    noticeContent: this.dialogData.noticeContent,
                    noticeTitle: this.dialogData.noticeTitle,
                    isAgent: 2,
                    isEmail: 1,
                    state: 1
                };
                if (this.dialogData.system == 'all') { //所有会员
                    data.conditionsMap = {};
                } else if (this.dialogData.system == 'level') { //会员等级
                    data.conditionsMap = {
                        levelId: this.dialogData.level + ''
                    }
                } else if (this.dialogData.system == 'single') { //单个会员
                    data.conditionsMap = {
                        accountList: [this.dialogData.account]
                    }
                } else if (this.dialogData.system == 'multi') { //多个会员
                    if(this.dialogData.accounts.length==0){
                          this.$notify({
                                type: 'warning',
                                title: '请先添加会员'
                            })
                            this.dialogSaveLoading = false;
                            return ;
                    }else{
                            data.conditionsMap = {
                                accountList: this.dialogData.accounts
                            }
                    }
                }
                this.$refs.dialogForm.validate().then(resolve => { //校验表单
                    messageRequest.addNoticeMsg(data).then(res => {
                        if (res.code == 200) {
                            this.$notify({
                                type: 'success',
                                title: res.msg
                            })
                            this.dialogSaveLoading = false;
                            this.dialogVisible = false;
                            this.queryHandle();
                        } else {
                            this.dialogSaveLoading = false;
                            this.$notify({
                                type: 'warning',
                                title: res.msg
                            })
                        }
                    }).catch(err => {
                        console.log(err);
                        this.dialogSaveLoading = false;
                    })
                }).catch(err => {
                    this.$notify({
                        type: 'warning',
                        title: '校验不通过，请检查页面错误提示。'
                    })
                    this.dialogSaveLoading = false;
                })
            },
            removeAccountInAccounts(account) { //从账号列表中删除某个账号
                const newarr = this.dialogData.accounts.concat();
                let idx = newarr.indexOf(account);
                newarr.splice(idx, 1)
                this.$set(this.dialogData, 'accounts', newarr)
            },
            addMessageNewBtn() {//点击给新会员添加公告corner
                this.newDdialogVisible = true
                this.isLoading = true;
                //   点开弹窗查询上次邮件内容
                let data = {
                    conditionsMap: {}
                };
                messageRequest.queryNewUserNotice(data).then(res => {
                    if (res.code == '200') {
                        this.isLoading = false;
                        this.newDialogForm.newDialogFormText = res.data.noticeContent;
                        this.newDialogForm.newId = res.data.id
                    } else {
                        this.isLoading = false;
                        this.$notify({
                            type: 'warning',
                            title: res.msg
                        })
                    }
                }).catch(err => {
                    console.log(err);
                    this.isLoading = false;
                })
            },

            dialogSaveNewBtn() {//提交给新会员发邮件保存弹窗corner
                this.$refs.newDialogForm.validate().then(resolve => {

                    this.isLoading = true;
                    let noticeContents = this.newDialogForm.newDialogFormText;
                    let Id = this.newDialogForm.newId;
                    let data = {
                        conditionsMap: {},
                        noticeContent: noticeContents,
                        id: Id
                    }
                    messageRequest.updateNewUserNotice(data).then(res => {
                        if (res.code == '200') {
                            this.isLoading = false;
                            this.newDdialogVisible = false;
                            this.$notify({
                                type: 'warning',
                                title: res.msg
                            })
                        } else {
                            this.isLoading = false;
                            this.$notify({
                                type: 'warning',
                                title: res.msg
                            })
                        }
                    }).catch(err => {
                        console.log(err);
                    })

                }).catch(err => {
                    this.$notify({
                        type: 'warning',
                        title: '校验不通过，请检查页面错误提示。'
                    })
                    this.tableLoading = false;
                })
            },
            sizeChangeHandle(size) {
                this.pageSize = size;
                this.queryHandle();
            },
            currentChangeHandle(crt) {
                this.pageNum = crt;
                this.queryHandle();
            },
            addMessageBtnHandle() {  //点击添加公告
                this.dialogVisible = true;
            },

            getPushList() {     //查询个推记录
                this.showAppMsgRecord = true;
                this.appRecordLoading = true;
                messageRequest.getPushList({}).then(res => {
                    this.appRecordLoading = false;
                    if (res.code == '200') {
                        this.appMsgRecord = res.data
                    } else {
                        this.$notify({
                            title: res.msg,
                            type: 'warning'
                        });
                    }
                }).catch(e => {
                    this.appRecordLoading = false;
                    this.$notify({
                        title: e,
                        type: 'error'
                    });
                })
            },
            addOrUpdatePush() { //添加个推
                this.appRecordSaving = true;
                this.$refs.appMsgForm.validate((valid) => {
                    if (valid) {
                        console.log("pushType:"+this.appMsgForm.pushType)
                        let data = {
                            startDate: this.appMsgTime ? this.appMsgTime[0] : undefined,
                            endDate: this.appMsgTime ? this.appMsgTime[1] : undefined,
                            // "id": 0,
                            // "createBy": "string",
                            msgContent: this.appMsgForm.msgContent,
                            // "msgEffective": this.appMsgForm.msgEffective,
                            msgTitle: this.appMsgForm.msgTitle,
                            // "msgType": this.appMsgForm.msgType == '是' ? '1' : '2',
                            // "pushType": this.appMsgForm.pushType == '即时' ? '1' : '2',
                            pushType: '1'
                            // "siteId": 0,
                        };
                        messageRequest.addOrUpdatePush(data).then(res => {
                            this.appRecordSaving = false;
                            if (res.code == '200') {
                                this.$notify({
                                    title: res.msg,
                                    type: 'success'
                                });
                                this.$refs.appMsgForm.resetFields();
                                if (this.showAppMsgRecord) {
                                    this.getPushList();
                                }
                            } else {
                                this.$notify({
                                    title: res.msg,
                                    type: 'warning'
                                });
                            }
                        }).catch(e => {
                            this.appRecordSaving = false;
                            this.$notify({
                                title: e,
                                type: 'error'
                            });
                        })
                    } else {
                        console.log('验证不通过!!');
                    }
                });
            }
        },
        created() {
            this.queryHandle();
            this.queryUserLevelList();
        },
    }
</script>

<style lang="scss" scoped>
    .flexdisplaydiv {
        display: flex;
        justify-content: flex-start;
        align-content: center;
        flex-flow: wrap;
        .el-checkbox {
            margin: 7px !important;
        }
    }

    .tags {
        display: flex;
        justify-content: space-around;
        align-content: center;
        flex-flow: row wrap;
        .el-tag {
            margin: 5px 0;
        }
    }
</style>

<style>
    .newtext textarea {
        width: 90%;
        margin: 0px auto;
        height: 80px;
    }
</style>

