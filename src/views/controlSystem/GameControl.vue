<template>
    <el-card class="finance-conf">
        <el-row type="flex" justify="start" style="margin-bottom: 15px;">
            <el-button type="success" @click="setInventory">批量设置库存衰减</el-button>
        </el-row>
        <el-tabs
                v-model="activeName"
                type="border-card"
                @tab-click="handleClick"
                @before-leave="handleLeave"
        >
            <el-tab-pane label="下注类" name="first" ref="first">
                <CommonGameClass
                        v-if="activeName == 'first'"
                        type="1"
                ></CommonGameClass>
            </el-tab-pane>
            <el-tab-pane label="对战类" name="second">
                <CommonGameClass
                        v-if="activeName == 'second'"
                        type="3"
                ></CommonGameClass>
            </el-tab-pane>
            <el-tab-pane label="捕鱼类" name="third">
                <CommonGameClass
                        v-if="activeName == 'third'"
                        type="2"
                ></CommonGameClass>
            </el-tab-pane>
        </el-tabs>

        <!-- 批量设置库存衰减弹框 -->
        <el-dialog
                title="批量设置库存衰减"
                :visible.sync="dialogVisible1"
                width="50%"
        >
            <el-form :model="dialogData1"
                     label-width="100px"
                     ref="dialogData1"
                     :rules="rules1"
                     v-loading="dialogLoading1"
            >
                <el-row type="flex" justify="space-around">
                    <el-form-item label="库存衰减：" prop="inventoryMinus1" required style="width: 50%;">
                        <el-input placeholder="填写0-5%" type="number" v-model.number="dialogData1.inventoryMinus1">
                            <template slot="append">%</template>
                        </el-input>
                    </el-form-item>

                </el-row>
                <el-row type="flex" justify="center">
                    <div style="text-align: center;">
                        所有房间库存衰减设置
                    </div>
                </el-row>
            </el-form>
            <template slot="footer">
                <el-button size="medium"
                           @click='resetAdd1'
                >取消</el-button>
                <el-button size="medium"
                           :loading="dialogLoading1"
                           @click='saveWarningValue1'
                >保存</el-button>
            </template>
        </el-dialog>
    </el-card>
</template>

<script>
    import controlSystem from '@/request/controlSystem'
    const CommonGameClass = () =>
    import("@/views/controlSystem/components/CommonGameClass.vue");
    export default {
        name: "GameControl",
        data() {
            var checkInventoryMinus1 = (rule, value, callback) => {//验证输入库存衰减
                let reg = new RegExp(/^[0-5]{1}$/);
                if(!reg.test(value)|| parseInt(value) <0 || parseInt(value)>5 || (value+'').indexOf('.')>-1){
                 return   callback(new Error('请输入0-5的整数'))
                }
                callback();
            };
            return {
                activeName: "first",
                index: 0,
                levels: [],
                labels: [],
                //批量设置库存
                dialogVisible1:false,
                dialogData1:{inventoryMinus1:''},
                dialogLoading1:false,
                rules1: {
                    inventoryMinus1: [
                        {required: true, message: '必填项', trigger: 'blur'},
                        {validator: checkInventoryMinus1, trigger: ['blur', 'change']}
                    ],
                }
            };
        },
        components: {
            CommonGameClass,
        },
        methods: {
            setInventory(){//批量设置库存删减
                this.dialogVisible1=true;
                this.dialogData1={inventoryMinus1:''};
            },
            resetAdd1(){//修改弹框取消
                this.dialogVisible1=false;
                this.dialogData1={inventoryMinus1:''};
            },
            saveWarningValue1(){//保存
                this.$refs["dialogData1"].validate(valid => {
                    if (valid) {
                        this.dialogLoading1 = true;
                       let data = {
                            stockWeak: this.dialogData1.inventoryMinus1,//库存衰减
                        };
                        controlSystem
                           .setBatchinVentory(data)
                           .then(res => {
                           if (res.code == "200") {
                               this.$notify.success({title: res.msg});
                           } else {
                                   this.$notify.warning({title: res.msg});
                           }
                           this.dialogLoading1 = false;
                           this.dialogVisible1 = false;
                           //this.queryHandle(); //重新查询
                   })
                       .catch(err => {
                               console.log(err);
                       });
                    } else {
                        this.$message.error({message: "验证不通过，请检查错误提示"});
                        this.dialogLoading1 = false;
                    }
            });
            },
            handleClick(tab, event) {
                this.index = tab.index;
                this.activeName = tab.name;

                 //console.log(this.index, this.activeName);
            },
            handleLeave(activeName, oldActiveName) {
                //console.log("1", activeName, "2", oldActiveName);
            },
        },
        created() {}
    };
</script>

<style lang="scss" scoped>
    .bottom {
        height: auto;
    }
</style>
