<template>
    <el-card>
        <el-form>
            <el-row>
                <el-form-item label="进入游戏后自动弹出">
                    <el-switch v-model="widget" @click.native.stop="updateWidGet"></el-switch>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item>
                    <el-radio-group v-model="activityType">
                        <el-radio-button label="1">活动任务</el-radio-button>
                        <el-radio-button label="2">平台公告</el-radio-button>
                    </el-radio-group>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item>
                    <el-button
                            size="medium"
                            type="primary"
                            @click='addNewBtnClick'
                            v-hasauth:ActivtyListAddBtn
                    >添加
                    </el-button>
                </el-form-item>
            </el-row>
        </el-form>
        <el-table
                :data="tableData"
                v-loading="isloading"
                style="width: 100%;margin-top:10px;"
                :border='true'
                :fit='true'
                size="medium"
                stripe
                :cell-style='{textAlign:"center"}'
                :header-cell-style="{textAlign:'center'}"
                highlight-current-row
                :default-sort="{prop: 'onLineAccountNumber', order: 'descending'}"
        >
            <el-table-column
                    prop="activityName"
                    label="活动名称"
            >
            </el-table-column>
            <el-table-column
                    label="活动时间"
            >
                <template
                        slot-scope="scope"
                >
                    <template v-if="scope.row.activityBegin || scope.row.activityEnd">
                        {{scope.row.activityBegin | timeFormatter}} ~ {{scope.row.activityEnd | timeFormatter}}
                    </template>
                    <template v-else>永久</template>
                </template>
            </el-table-column>
            <el-table-column
                    prop="status"
                    label="状态"
            >
                <template
                        slot-scope="scope"
                >
                    <span v-if="scope.row.status == 1">启用</span>
                    <span v-if="scope.row.status == 0">禁用</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="activitySort"
                    label="排序"
                    width="55"
            >
            </el-table-column>
            <el-table-column
                    prop=""
                    label=""
                    width="200"
            >
                <template
                        slot-scope="scope"
                >
                    <el-row type="flex"
                            justify="center">
                        <el-button size="mini"
                                   icon="el-icon-caret-top"
                                   @click="switchPosition(scope.row, 1)">
                            上移
                        </el-button>
                        <el-button size="mini"
                                   icon="el-icon-caret-bottom"
                                   @click="switchPosition(scope.row, 2)">
                            下移
                        </el-button>
                    </el-row>
                </template>
            </el-table-column>
            <el-table-column
                    label="操作"
            >
                <template
                        slot-scope="scope"
                >
                    <el-row
                            type="flex"
                            justify="center"
                    >
                        <el-button size="mini"
                                   @click='editBtnClick(scope.row)'
                        >编辑
                        </el-button>
                        <el-button size="mini"
                                   @click='deleteBtnClick(scope.row)'
                        >删除
                        </el-button>
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
    </el-card>
</template>

<script>
    import activtyRequest from '@/request/activty'
    import timeFormat from '@/tool/times'

    export default {
        name: 'activtyList',
        data() {
            return {
                widget: 1,
                activityType: '1',

                tableData: [],
                isloading: false,

                pageSize: 10,
                total: 0,
                pageNum: 1,
            }
        },
        watch: {
            activityType(val) {
                this.pageNum = 1;
                window.sessionStorage.setItem('activityType', this.activityType);
                this.getTableData()
            },
        },
        filters:{
            timeFormatter(val) {
                let date = new Date(val);
                return timeFormat.DateToYMDHMS(date)
            }
        },
        methods: {
            addNewBtnClick() {
                let widget = this.widget ? '1' : '2';
                window.sessionStorage.setItem('activityType', this.activityType);
                window.sessionStorage.setItem('widget', widget);
                console.log(this.activityType)
                this.$router.push({
                     //path: '/activty/activtyList/addActivty',
                     name: '添加活动',
                     //query: { type:this.activityType}
                });
            },
            getTableData() {
                this.isloading = true;
                let data = {
                    "activityType": this.activityType,
                    "limit": this.pageSize,
                    "offset": (this.pageNum - 1) * this.pageSize,
                    // "sort": "id",
                    // "sortOrder": "desc"
                };
                activtyRequest.list(data).then(res => {
                    if (res.code == '200') {
                        if (res.data.rows.length > 0) {
                            this.widget = res.data.rows[0].widget == 1 ? true : false;
                        }
                        this.tableData = res.data.rows;
                        this.pageSize = res.data.limit;
                        this.total = res.data.total;
                        this.pageNum = res.data.offset / res.data.limit + 1;
                    } else {
                        this.$notify({
                            type: 'warning',
                            title: res.msg
                        })
                    }
                    this.isloading = false;
                }).catch(err => {
                    console.log(err);
                    this.isloading = false;
                })
            },
            // 修改游戏自动弹出开关
            updateWidGet() {
                let val = this.widget;
                let data = {
                    createBy: '',
                    siteId: '',
                    widget: val ? 1 : 2
                };
                activtyRequest.updateWidGet(data).then(res => {
                    if (res.code == '200') {
                        this.getTableData();
                    } else {
                        this.widget = !val;
                        this.$notify.error({title:res.msg})
                    }
                }).catch(e => {
                    this.widget = !val;
                    this.$notify.error({title:'请求失败！'});
                })
            },
            switchPosition(row, val) {
                let data = {
                    activityType: this.activityType,
                    firstId: row.id,
                    secondId: val   //"1.上移,2,下移"
                };
                activtyRequest.updateSort(data).then(res => {
                    if (res.code == '200') {
                        this.$notify.success({title:res.msg});
                        this.getTableData();
                    } else {
                        this.$notify.error({title:res.msg});
                    }
                });
            },
            editBtnClick(row) {
                window.sessionStorage.setItem('activityData', JSON.stringify(row));
                this.$router.push({
                    name: '编辑活动',
                    params: {id: row.id}
                })
            },
            deleteBtnClick(row) {
                this.$confirm('确认删除吗?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let data = {
                        id: row.id
                    };
                    activtyRequest.delete(data).then(res => {
                        if (res.code == 200) {
                            this.$notify({
                                type: 'success',
                                title: '删除成功'
                            });
                            this.getTableData();
                        } else {
                            this.$notify({
                                type: 'warning',
                                title: res.msg
                            })
                        }
                    }).catch(err => {
                        console.log(err)
                    })
                })
            },

            sizeChangeHandle(sz) {
                this.pageSize = sz;
                this.getTableData();
            },
            currentChangeHandle(crt) {
                this.pageNum = crt;
                this.getTableData();
            }
        },
        created() {
            this.getTableData();
        },
        activated() {
            this.getTableData();
        },
    }
</script>

