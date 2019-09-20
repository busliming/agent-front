<template>
  <div class="WxCodeWithdrawConf" v-loading="loading">
    <el-form ref="form" :model="form" :inline="true" :rules="rules">
      <el-form-item label="是否开启">
        <el-switch v-model="form.enable"></el-switch>
      </el-form-item>
      <div class="t-text">微信公众号配置：</div>
      <el-form-item prop="appId" class="input100">
        <el-input placeholder="微信公众号appid" :disabled="isDisabled" v-model.trim="form.appId" clearable>
          <template slot="prepend">微信公众号appid：</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="mchId" class="input100">
        <el-input placeholder="微信支付商户号mchId" :disabled="isDisabled" v-model.trim="form.mchId" clearable>
          <template slot="prepend">微信支付商户号mchId：</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="wechatKey" class="input100">
        <el-input placeholder="微信公众号密钥key" :disabled="isDisabled" v-model.trim="form.wechatKey" clearable>
          <template slot="prepend">微信公众号密钥key：</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="payKey" class="input100">
        <el-input placeholder="微信支付秘钥" :disabled="isDisabled" v-model.trim="form.payKey" clearable>
          <template slot="prepend">微信支付秘钥：</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="weChatPublicNumber" class="input100">
        <el-input placeholder="微信公众号" :disabled="isDisabled" v-model.trim="form.weChatPublicNumber" clearable>
          <template slot="prepend">微信公众号：</template>
        </el-input>
      </el-form-item>
      <div class="t-text">公众号充值界面的充值金额设定（单位：元）：</div>
      <div class="amount-arr">
        <div class="item" v-for="(a, i) in Object.values(amounts)" :key="i">
          <el-form-item label="充值金额">
            <el-input
                    v-model="amounts[`amount_${i+1}`]"
                    @keyup.native="amounts[`amount_${i+1}`]=amounts[`amount_${i+1}`].replace(/[^\d.]/g,'')"
                    :disabled="isDisabled"
                    placeholder="请输入"
                    clearable
            ></el-input>
          </el-form-item>
        </div>
      </div>

      <el-form-item label="会员等级">
        <el-checkbox
                :indeterminate="isIndeterminate"
                :disabled="isDisabled"
                v-model="checkAll"
                @change="checkAllHandle"
        >全选</el-checkbox>
        <el-checkbox-group v-model="checkedLvs" :disabled="isDisabled" @change="checkLvHandle">
          <el-checkbox v-for="lv in userLevels" :label="lv.id" :key="lv.id">{{lv.levelName}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="充值说明" class="input100" prop="remark">
        <el-input type="textarea" class="input100"  placeholder="请输入100字以内文字" :disabled="isDisabled" v-model.trim="form.remark"></el-input>
      </el-form-item>
      <el-form-item class="input100" style="text-align: center">
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
    import finance from "@/request/finance";

    export default {
        data() {
            return {
                loading: false,
                // 表单数据
                form: {
                    id: null,
                    enable: null,
                    appId: "",
                    mchId: "",
                    wechatKey: "",
                    payKey: "",
                    weChatPublicNumber: "",
                    amount: "",
                    remark: "",
                    userLevel: ""
                },
                rules: {},
                // 充值金额设定
                amounts: {
                    amount_1: 10,
                    amount_2: 50,
                    amount_3: 100,
                    amount_4: 200,
                    amount_5: 500,
                    amount_6: 1000,
                    amount_7: 5000,
                    amount_8: 10000,
                    amount_9: 20000,
                    amount_10: "",
                    amount_11: "",
                    amount_12: ""
                },
                isamounts: false,
                // 会员等级选择 全选
                checkAll: false,
                // 所有会员等级
                userLevels: [],
                // 所有会员等级ID（全选）
                userLevelsId: [],
                // 已选中的会员等级
                checkedLvs: [],
                // 控制全选按钮样式
                isIndeterminate: false
            };
        },
        computed: {
            // 若关闭公众号支付功能则不可操作表单
            isDisabled() {
                return !this.form.enable;
            }
        },
        watch: {
            //
            // "form.enable"() {
            //   this.setSwitch();
            // },
            checkedLvs(newVal) {
                this.form.userLevel = newVal.join(",");
            },
        },
        methods: {
            // 设置表单验证
            setFormValidate() {
                // const fields = ['appId', 'mchId', 'wechatKey', 'weChatPublicNumber']
                let data = {
                    remark: [
                        {required: true, message: '请输入活动名称', trigger: 'blur'},
                        {min: 0, max: 100, message: '请输入100字以内的说明', trigger: 'blur'}
                    ],
                }
                let fields = {
                    appId: "微信公众号appid",
                    mchId: "微信支付商户号mchId",
                    wechatKey: "微信公众号密钥key",
                    payKey: "微信支付秘钥",
                    weChatPublicNumber: "微信公众号",
                };
                for (let o in fields) {
                    this.rules[o] = [
                        {
                            required: true,
                            message: `请输入${fields[o]}（最多输入601个字符）`,
                            trigger: "blur"
                        }
                    ];
                }
                Object.assign(this.rules, data);
            },
            // 查询微信公众号入款配置
            queryConfig() {
                finance
                    .listByWeChatPublic()
                    .then(res => {
                        this.loading = false;
                        if (res.code == 200) {
                            this.form = Object.assign(this.form, res.data);
                            this.form.wechatKey = res.data.weChatKey;
                            var arr = res.data.userLevel.split(",").map(el => el - 0);
                            var arr1 = [];

                            arr1 = this.$store.getters.levelListName;

                            var arrList = [];//接收过滤后的选中项
                            for (var i = 0; i < arr.length; i++) {
                                for (var j = 0; j < arr1.length; j++) {
                                    if (arr1[j].id == arr[i]) {
                                        arrList.push(arr[i]);
                                        break;//跳出此层循环
                                    }
                                }
                            }
                            this.checkedLvs = arrList;
                            this.checkLvHandle(arrList);
                            //this.isIndeterminate = this.checkedLvs.length > 0 ? true : false;
                            this.mapAmount(this.form.amount);

                        } else {
                            this.$notify.warning({title: res.msg});
                        }
                    })
                    .catch(e => {
                        console.log(e);
                    });
            },
            // 金额
            mapAmount(data) {
                data = data.split(",");
                for (let i = 0; i < 12; i++) {
                    this.amounts[`amount_${i + 1}`] = data[i] || "";
                }
            },
            // 获取厅主的会员等级
            getLevelList() {
                /* console.log()
            this.userLevels = this.$store.getters.levelListName;
            this.userLevelsId = this.userLevels.map(el => el.id);
            console.log(this.userLevels);
            console.log(this.userLevelsId);*/
                finance
                    .getLevelList()
                    .then(res => {
                        if (res.code == 200) {
                            this.userLevelsId = [];
                            this.userLevels = [];
                            this.userLevels = res.data;
                            this.userLevelsId = res.data.map(el => el.id);
                            this.$store.dispatch('clearLevelParams1');
                            this.$store.dispatch('setLevelParams1', res.data);
                            console.log(this.$store.getters.levelListName);
                            console.log(this.userLevelsId);
                            this.queryConfig();//再此出调用解决异步问题
                        } else {
                            this.$notify.warning({title: res.msg});
                        }
                    })
                    .catch(e => {
                        console.log(e);
                    });
            },
            // 设置开关
            // setSwitch() {
            //   if(!this.form.id){
            //     return
            //   }
            //   this.loading = true;
            //   const param = {
            //     enable: this.form.enable,
            //     id: this.form.id
            //   };
            //   finance
            //     .changeWeChat(param)
            //     .then(res => {
            //       this.loading = false;
            //       if (res.code == 200) {
            //         this.form.data = !this.form.data;
            //       } else {
            //         this.$notify.warning({ title: res.msg });
            //       }
            //     })
            //     .catch(e => {
            //       console.log(e);
            //     });
            // },
            // 微信公众号入款配置 添加 编辑
            addWeChatPublic() {
                if (!this.checkedLvs.length) {
                    this.$message({
                        type: "error",
                        message: "请选择会员等级"
                    });
                    return false;
                }
                this.loading = true;
                this.form.amount = Object.values(this.amounts).join(",");
                let levelarr = [];
                if (this.form.userLevel != '' && this.form.userLevel != undefined && this.form.userLevel != null) {
                    levelarr = Array.from(new Set(this.form.userLevel.split(","))); //数组去重
                    this.form.userLevel = levelarr.join(",");
                }
                const params = this.form;
                finance.addWeChatPublic(params).then(res => {
                    this.loading = false;
                    if (res.code == 200) {
                        this.queryConfig();
                    }
                    this.$notify.success({title: res.msg});
                });
            },
            // 点击全选全选时触发
            checkAllHandle() {
                this.checkedLvs = this.checkAll ? this.userLevelsId : [];
                this.isIndeterminate = false;
            },
            // 选择会员等级时触发
            checkLvHandle(value) {
                let checkedCount = value.length;
                var count = 0;

                if (this.userLevelsId.length == 0) {
                    count = this.$store.getters.levelListName.length;
                } else {
                    count = this.userLevelsId.length;
                }
                this.checkAll = checkedCount === count;
                this.isIndeterminate = checkedCount > 0 && checkedCount < count;
            },
            isamount() { //判断是否输入金额
                for (let i = 1; i < 13; i++) {
                    if (this.amounts[`amount_${i}`] == '') {
                        this.isamounts = false
                    } else {
                        return this.isamounts = true
                    }
                }
            },
            // 保存
            onSubmit() {
                this.isamount()
                if (this.isamounts) {
                    this.$refs.form.validate(valid => {
                        if (!valid) return;
                        if (!this.form.amount) console.log("submit");
                        this.addWeChatPublic();
                    });
                } else {
                    this.$message({
                        type: "error",
                        message: "至少输入一个充值金额"
                    });
                }
            }
        },
        mounted() {

            this.getLevelList();

            this.setFormValidate();
        },
        activated() {

            this.getLevelList();

            this.setFormValidate();
        }
    };
</script>

<style lang="scss" scoped>
  .t-text {
    margin-bottom: 20px;
  }
</style>


<style lang="scss">
  .WxCodeWithdrawConf {
    .el-form {
      // width: 80%;
      .el-form-item {
      }
      .el-input-group--prepend {
        // margin-bottom: 20px;
      }
      .amount-arr {
        display: flex;
        flex-wrap: wrap;
        .item {
          width: 19%;
        }
      }
      .input100 {
        width: 100%;
        .el-form-item__content {
          width: 89%;
        }
      }
    }
  }
</style>
