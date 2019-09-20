import usrRequest from '@/request/member'

export default {
  /**
   * 会员管理
   */

  validateAccount : (rule, value, callback) => { //新增用户验证账号是否可用
    if (!value) {
      callback(new Error('账号不能为空'));
      return
    }else{
      let reg = new RegExp(/[a-z]{1,13}[0-9]{1,13}/) //字母开头
      if(reg.test(value)&&value.length>5&&value.length<15){
        usrRequest.checkAccount({parentAccount:value}).then(
          (res) => {
            if(res.code == '200'){
              callback();
            }else{
              callback(new Error(res.msg))
            }
          }
        )
      }else{
        return callback(new Error('请输入6到14位的字母+数字组合'));
      }
    }
  },
  validateSuperior : (rule, value, callback) => {  //新增用户检查代理商账号是否存在
    if (!value) {
      callback();
      return
    }
    usrRequest.checkAgent({parentAccount:value}).then(
      (res) => {
        if(res.code == '200'){
          callback();
        }else{
          callback(new Error(res.msg))
        }
      }
    )
  },
  validatePhone : (rule, value, callback) => { //验证手机号
    if(!value){
      callback();
      return
    }
    let reg = new RegExp(/^(1)\d{10}$/);
    if(reg.test(value)){
      callback();
    }else{
      callback(new Error('手机格式输入错误'))
    }
  },
  validateEmail : (rule, value, callback) => { //验证邮箱地址号
    if(!value){
      callback();
      return
    }
    let reg = new RegExp(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/);
    if(reg.test(value)){
      callback();
    }else{
      callback(new Error('邮箱地址不规范'))
    }
  },
  validateQq : (rule, value, callback) => { //验证QQ号
    if(!value){
      callback();
      return
    }
    let reg = new RegExp(/^[1-9][0-9]{4,10}$/);
    if(reg.test(value)){
      callback();
    }else{
      callback(new Error('QQ号码不规范'))
    }
  },
  validateBirthday : (rule, value, callback) => { //验证生日
    if(!value){
      callback();
      return
    }
    let year = value.split('-')[0];
    const now = new Date().getFullYear();
    if(year < 1901 || year > now - 5){
      callback(new Error('年龄不在合理范围，请修改'))
    }else{
      callback();
    }
  },
  validateName : (rule, value, callback) => { //验证真实姓名
    if(!value){
      callback();
      return
    }
    if(value.length > 30){
      callback(new Error('名字太长'))
    }else{
      callback();
    }
  },
  validateWechat : (rule, value, callback) => { //验证微信号
    var wxreg=/^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/;
    if(!value){
      callback();
      return
    }
    if(!wxreg.test(value)){
      callback(new Error('微信号码不规范'));
      return
    }
    if(value.length > 30){
      callback(new Error('微信号太长'))
    }else{
      callback();
    }
  },
  validatePassword: (r,v,c) => {  //会员详情 密码 资金密码
    if(!v){
      c();
      return
    }
    let reg = new RegExp(/^([a-z]|[A-Z]|[0-9]){6,14}$/);
    if(!reg.test(v)){
      c(new Error('请输入6到14位的字母+数字'));
      return
    }
    c();
  },
  validateAlipay : (rule, value, callback) => { //验证支付宝
    if(!value){
      callback();
      return
    }
    if(value.length > 30){
      callback(new Error('账号号太长'))
    }else{
      callback();
    }
  },
  validateBankAccount : (rule, value, callback) => { //验证银行卡号
    if(!value){
      callback();
      return
    }
    let reg = new RegExp(/^[0-9]{16,19}$/);//10-20
    if(reg.test(value)){
      callback();
    }else{
        callback(new Error('请输入16~19位银行卡号'))
    }
  },
  validateBankName : (rule, value, callback) => { //验证银行名称
    if(!value){
      callback();
      return
    }
    if(value.length > 30){
      callback(new Error('银行名称太长'))
    }else{
      callback();
    }
  },
  /**
   * 会员等级
   */
  checklevelName : (rule, value, callback) => { //等级名称限制为8个字节
    let string = value.replace(/[\u4e00-\u9fa5]/g,"aa");
    if(string.length > 8){
      callback(new Error('等级名称不能超过8个字节。(每个汉字占两个字节)'))
    }else{
      callback();
    }
  },
  /**
   * 游戏管理 新增房间
   */
  roomName : (rule, value, callback) => { //验证房间场次 必填 长度30内
    if(!value){
      callback(new Error('房间场次不能为空'));
      return
    }
    if(value.length > 30){
      callback(new Error('名称太长'))
      return
    }
    callback();
  },
  minMoney : (rule, value, callback) => { //验证房间最低金额 必填 最长10 最小0.01 小数点后2位
    if(!value){
      callback(new Error('最低金额不能为空'));
      return
    }else{
      var ints = ((value).indexOf('.') > -1)&&((value).split('.')[0]) || value;
      var flo = ((value).indexOf('.') > -1)&&((value).split('.')[1]) || '';
      var string = parseFloat(value);
      var firsts = parseFloat((value+'')[0]);
    }
    if((string+'').length != value.length || isNaN(string) || isNaN(firsts)){
      callback(new Error('只能输入数字'));
      return
    }
    if(flo.length > 2){
      callback(new Error('小数点后不能超过2位'));
      return
    }
    if(parseFloat(value)<0.01){
      callback(new Error('最低金额不能小于0.01'));
      return
    }
    if(flo){
      if(ints.length > 9){
        callback(new Error('数量太大，请输入10位以内的数字'))
        return
      }
    }else{
      if(ints.length > 10){
        callback(new Error('数量太大，请输入10位以内的数字'))
        return
      }
    }
    callback();
  },
  roomField : (rule, value, callback) => { //验证游戏底分 必填 最长10 最小0.01 小数点后2位
    if(!value){
      callback(new Error('游戏底分不能为空'));
      return
    }else{
      var ints = ((value).indexOf('.') > -1)&&((value).split('.')[0]) || value;
      var flo = ((value).indexOf('.') > -1)&&((value).split('.')[1]) || '';
      var string = parseFloat(value);
      var firsts = parseFloat(value[0]);
    }
    if(parseFloat(value)<0.01){
      callback(new Error('游戏底分不能小于0.01'));
      return
    }
    if((string+'').length != value.length || isNaN(string) || isNaN(firsts)){
      callback(new Error('只能输入数字'));
      return
    }
    if(flo.length > 2){
      callback(new Error('小数点后不能超过2位'));
      return
    }
    if(flo){
      if(ints.length > 9){
        callback(new Error('数量太大，请输入10位以内的数字'))
        return
      }
    }else{
      if(ints.length > 10){
        callback(new Error('数量太大，请输入10位以内的数字'))
        return
      }
    }
    callback();
  },
  chargeValue : (rule, value, callback) => { //验证收费设置 必填 最长10 最小0.01 小数点后2位
    if(!value){
      callback(new Error('收费设置不能为空'));
      return
    }else{
      var ints = ((value).indexOf('.') > -1)&&((value).split('.')[0]) || value;
      var flo = ((value).indexOf('.') > -1)&&((value).split('.')[1]) || '';
      var string = parseFloat(value);
      var firsts = parseFloat(value[0]);
    }
    if(value == '0.00'){
      callback();
      return
    }
    if((string+'').length != value.length || isNaN(string) || isNaN(firsts)){
      callback(new Error('只能输入数字'));
      return
    }
    if(flo.length > 2){
      callback(new Error('小数点后不能超过2位'));
      return
    }
    if(ints.length > 10){
      callback(new Error('数量太大，请输入10位以内的数字'))
      return
    }
    callback();
  },
  roomPassword:(rule,value,callback) => { //房间密码 非必填 字母+数字  2-6位
    let reg = new RegExp(/^([a-z]|[A-Z]|[0-9]){2,6}$/);
    if(!value){
      callback();
      return;
    }
    if(value.length > 6 || value.length <2){
      callback(new Error('密码长度需要为2-6位'))
      return
    }
    if(!reg.test(value)){
      callback(new Error('密码只能输入字母或数字'));
      return
    }
    callback();
  },
  /**
   * 公告管理
   */
  noticeContent:(r,v,c) => { //新建公告内容
    if(!v){
      c(new Error('公告内容不能为空'));
      return
    }
    if(v.length<5){
      c(new Error('请输入至少5个字符'));
      return
    }
    if(v.length>100){
      c(new Error('公告内容长度不能超过100'));
      return
    }
    c();
  },
  remark:(r,v,c) => { //新建公告备注
    if(!v){
      c();
      return
    }
    if(v.length>30){
      c(new Error('公告备注长度不能超过30'));
      return
    }
    c();
  },
  noticeTitle:(r,v,c) => { //站内消息标题
    if(!v){
      c(new Error('消息标题不能为空'));
      return
    }
    if(v.length>20){
      c(new Error('消息标题不能超过20个字符'));
      return
    }
    c();
  },
  // noticeContent:(r,v,c) => { //站内消息内容
  //   if(!v){
  //     c(new Error('消息内容不能为空'));
  //     return
  //   }
  //   if(v.length>100){
  //     c(new Error('消息标题不能超过100个字符'));
  //     return
  //   }
  //   c();
  // },
  /**
   * 推广管理
   */
  rebateRatio:(r,v,c) => { //返利设置-编辑返利-返点
    let reg = new RegExp(/^[0-9]+$/);
    if(v === 0){
      c();
      return
    }
    if(!v){
      c(new Error('返点不能为空'));
      return
    }
    if(!reg.test(v)){
      c(new Error('返点设置必须为整数'));
      return
    }
    if(v > 100){
      c(new Error('返点设置不合理'));
      return
    }
    c();
  },
  tdrebateRatio:(r,v,c) => { //返利设置-编辑返利-返点
    let reg = new RegExp(/^[0-9]+$/);
    if(v === 0){
      c();
      return
    }
    if(!v){
      c(new Error('返点不能为空'));
      return
    }
    if(!reg.test(v)){
      c(new Error('返点设置必须为整数'));
      return
    }
    if(v > 50){
      c(new Error('返点不能大于50'));
      return
    }
    c();
  },
  auditMultipleset:(r,v,c)=>{  //稽核设置倍数
    let reg = new RegExp(/^[0-9]+$/);
    if(v < 0){
      c(new Error('稽核倍数不能小于0'));
      return
    }
    if(!v){
      c(new Error('倍数不能为空'));
      return
    }
    if(!reg.test(v)){
      c(new Error('返点设置必须为整数'));
      return
    }
    c();
  },
  auditMultiple:(r,v,c)=>{  //稽核设置倍数
    let reg = new RegExp(/^[0-9]+$/);
    if(v <= 0){
      c(new Error('稽核倍数不能小于1'));
      return
    }
    if(!v){
      c(new Error('倍数不能为空'));
      return
    }
    if(!reg.test(v)){
      c(new Error('返点设置必须为整数'));
      return
    }
    if(v > 99){
      c(new Error('返点不能大于100'));
      return
    }
    c();
  },
  experience:(r,v,c) => { //返利设置-编辑返利-所需经验
    let reg = new RegExp(/^[0-9]+$/);
    if(v === 0){
      c();
      return
    }
    if(!v){
      c(new Error('经验设置不能为空'));
      return
    }
    if(!reg.test(v)){
      c(new Error('经验设置必须为整数'));
      return
    }
    if(v.length>10){
      c(new Error('经验设置长度不能超过10'));
      return
    }
    c();
  },
  selfCheckRebate:(r,v,c) => { //返利设置-编辑会员返利金额
    var flo = ((v+'').indexOf('.') > -1)&&((v+'').split('.')[1]) || '';
    if(v === 0){
      c();
      return
    }
    if(!v){
      c(new Error('金额设置不能为空'));
      return
    }
    if(flo.length > 2){
      c(new Error('小数点后不能超过2位'));
      return
    }
    if(flo.length > 2 && v.length>10){
      c(new Error('金额设置长度不能超过8位数'));
      return
    }else{
        if(flo.length>1){
            if(v.length>11){
              c(new Error('金额设置长度不能超过8位数'));
              return
            }
        }else{
           if(v.length>8){
            c(new Error('金额设置长度不能超过8位数'));
            return
           }
        }
    }
    c();
  },
  /**
   * 系统管理
   */
  account:(r,v,c) => { //子账号-添加-账号
    // let reg = new RegExp(/^([a-z]|[A-Z]|[0-9]){6,14}$/);
    let reg = new RegExp(/(?=^.{6,14}$)(?=(?:.*?\d){1})(?=(?:.*?[A-Za-z]){1})[0-9a-zA-Z!]*$/);
    if(!v){
      c(new Error('子账号不能为空'));
      return
    }
    if(!reg.test(v)){
      c(new Error('请输入6到14位的字母+数字'));
      return
    }
    c();
  },
  password:(r,v,c) => { //子账号-添加-密码
    let reg = new RegExp(/(?=^.{6,14}$)(?=(?:.*?\d){1})(?=(?:.*?[A-Za-z]){1})[0-9a-zA-Z!]*$/);
    if(!reg.test(v)){
      c(new Error('请输入6到14位的字母+数字'));
      return
    }
    c();
  },
  realname:(r,v,c) => { //子账号-添加-真实姓名
    if(!v){
      c();
      return
    }
    if(v.length>10){
      c(new Error('长度不能超过10个字'));
      return
    }
    c();
  },
  rolename:(r,v,c) => { //角色-添加-真实姓名
    if(!v){
      c(new Error('该项必填'));
      return
    }
    if(v.length>15){
      c(new Error('长度不能超过15个字'));
      return
    }
    c();
  },
  /*codeserviceUrlType:(r,v,c) => { //系统设置 - 全局参数 - 客服url
      console.log(v);
    let reg = new RegExp(/^https?:\/\/([^/]+)/);
    if(!v){
      c();
      return
    }
    if(!reg.test(v)){
      c(new Error('URL地址不规范'));
      return
    }
    c();
  },*/
    codeserviceUrlType:(r,v,c) => { //系统设置 - 全局参数 - 客服url
      console.log(v);
    let reg = new RegExp(/^https?:\/\/([^/]+)/);
    if(!v){
      c();
      return
    }
    if(!reg.test(v)){
      c(new Error('URL地址不规范'));
      return
    }
    c();
  },
  maxPayLimit:(r,v,c) => { //系统设置 - 全局参数 - 最大金额
    let reg = new RegExp(/^[0-9]+$/)
    if(!v){
      c();
      return
    }
    if(!reg.test(parseFloat(v))){
      c(new Error('只能输入数字'));
      return
    }
    if(!(v<1000000)){
      c(new Error('金额不规范'));
      return
    }
    c();
  },
  /**
   * 财务管理
   */
  manualoperatemoney:(r,v,c) => {  //最多两位小数
    let reg = new RegExp(/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/);
    console.log(v == 0)
    if(v == 0){
      c();
      return
    }else{
        if(!v){
          c(new Error('金额为必填项目'));
          return
        }
        if(!reg.test(v)){
          c(new Error('金额只能是数字,最多包含两位小数'));
          return
        }
    }
    c();
  },
  manualoperateremark:(r,v,c) => {
    if(!v){
      c(new Error('备注为必填项目'));
      return
    }
    c();
  },
  /**
   * 活动管理
   */
  amount:(r,v,c) => { //金额
    let reg = new RegExp(/^[0-9]+$/);

    console.log(v);


    if(!v){
      c(new Error('金额为必填项目'));
      return
    }
    if(!reg.test(v)){
      c(new Error('金额只能是数字'));
      return
    }
    c();
  },

  amountck:(r,v,c) => { //金额
    // var flo = ((v+'').indexOf('.') > -1)&&((v+'').split('.')[1]) || '';
    let reg = new RegExp(/^[0-9]+$/);
    if (parseInt(v) < 0) {
      c(new Error('金额不能为负数'));
    }
    if(v.length>11){
      c(new Error('金额设置长度不能超过11位数'));
      return
    }
    if(v ==='' || v=== undefined || v=== null){
      c(new Error('金额为必填项目'));
      return
    }
    if(!reg.test(v)){
      c(new Error('金额只能是数字不含小数点'));
      return
    }
    c();
  },

    /**
     * 出入款配置
     */
    minQuotaCheck: (r, v, c) => {
        if (!v) {
            c(new Error('请输入最低金额'))
        }
        if (parseInt(v) < 0) {
            c(new Error('最低金额不能小于0'));
        } else {
            c();
        }
    },
    userLevelCheck: (r,v,c) => {
        if (!v.length) {
            c(new Error('请选择会员等级'))
        } else {
            c()
        }
    },
    userLabelCheck: (r,v,c) => {
        if (!v.length) {
            c(new Error('请选择会员标签'))
        } else {
            c()
        }
    },
     maxQuotaCheck :(r, v, c) => {
        if (!v) {
            c(new Error('请输入最高金额'));
        }
        if (parseInt(v) < this.formData.minQuota) {
            c(new Error('最高金额不能小于最低金额'));
        } else
        if (v < 0){
            c(new Error('最高金额不能小于0'));
        } else{}
        c();
    },

    // 限制两位小数
    toFixed2(val) {
        if (val.indexOf('.') !== -1) {
            if (val.split(".")[1].length > 2) {
                if (isNaN(parseFloat(val))) return;
                val = parseFloat(val).toFixed(2);
            }
        }
        return val;
    },
    rmvFirst0(val) {
        if (val.indexOf('0') === 0 && val.indexOf('.') === -1 && val.length > 1) {
            val = val.substr(1);
        }
        return val;
    },

    //    代理名称

    merchantName: (r,v,c) =>{
        if (!v){
            c(new Error('请输入代理名称'));
        }else if(v.length>6){
            c(new Error('代理名称不能超过6个字符'));
            return
        }
        c();
    },

    //    开户行 最长只能输入30个字符 必填

    bankAccount: (r,v,c) =>{
        if (!v){
            c(new Error('请输入开户行不能超过30个字符'));
            return
        }
        if(v.length>30){
            c(new Error('不能超过30个字符'));
            return
        }
        c();
    },
    alias: (r,v,c) =>{
        if (!v){
            c();
            return
        }
        if(v.length>30){
            c(new Error('请输入别名不能超过30个字符'));
            return
        }
        c();
    },
    validateWechathave : (rule, value, callback) => { //验证微信号 必填
        let wxreg=/^[^\u4e00-\u9fa5]{2,100}$/;
        if(!value){
            // callback();
            callback(new Error('请输入微信号'));
            return
        }
        if(!wxreg.test(value)){
            callback(new Error('微信号码不规范'));
            return
        }
        if(value.length < 6 || value.length > 20){
            callback(new Error('请输入6-20位的微信号码'))
        }else{
            callback();
        }
    },
    // 排序只能输入数字
    sortNum:(r,v,c) => { //排序
        let reg = new RegExp(/^[0-9]+$/);
        if(!v){
            c(new Error('请输入排序'));
        }
        if(!reg.test(v)){
            c(new Error('排序只能是数字'));
            return
        }
        c();
    },


//    备注 最长只能输入50个字符

    remarks: (r,v,c) =>{
        if (!v){
            c();
            return
        }
        if(v.length>100){
            c(new Error('备注不能超过100个字符'))
            return
        }
        c();
    },


    validateBankAccounthave : (rule, value, callback) => { //验证银行卡号 必填
        if(!value){
            callback(new Error('请输入银行卡号'));
            return
        }
        let reg = new RegExp(/^[0-9]{10,20}$/);
        if(reg.test(value)){
            callback();
        }else{
            callback(new Error('请输入10~20位银行卡号'))
        }
    },
    validateBankNamehave : (rule, value, callback) => { //验证银行名称 必填
        if(!value){
            callback(new Error('请输入银行名称'));
            return
        }
        if(value.length > 30){
            callback(new Error('银行名称太长'))
        }else{
            callback();
        }
    },
    validateNamehove : (rule, value, callback) => { //验证真实姓名 必填
        if(!value){
            callback(new Error('请输入真实姓名'));
            return
        }
        if(value.length > 30){
            callback(new Error('名字太长'))
        }else{
            callback();
        }
    },
    merchantNamehove : (rule, value, callback) => { //验证商户名称 必填
        if(!value){
            callback(new Error('请输入商户名称不超过30个字符'))
            return
        }
        if(value.length > 30){
            callback(new Error('商户名称不超过30个字符'))
        }else{
            callback();
        }
    },
    merchantNohove : (rule, value, callback) => { //验证商户号 必填
        if(!value){
            callback(new Error('请输入商户号不超过100个字符'))
            return
        }
        if(value.length > 100){
            callback(new Error('商户号不超过100个字符'))
        }else{
            callback();
        }
    },
    codeMultiple:(r,v,c) => { //VIP打码倍数
        let reg = new RegExp(/^[0-9]+$/);
        if(!v){
            c(new Error('请输入VIP打码倍数'));
        }
        if(!reg.test(v)){
            c(new Error('VIP打码倍数只能是正整数'));
            return
        }
        if(v==0){
            c(new Error('VIP打码倍数必须大于0'));
            return
        }
        c();
    },

    //密钥 必填 任务264 取消限制
    // merchantKeyhove: (r,v,c) =>{
    //     // let Rex =/^[^\u4e00-\u9fa5]{2,30}$/;
    //     if (!v){
    //         c(new Error('请输入密钥'));
    //     }else if(v>50){
    //         c(new Error('请输入正确的密钥'))
    //         return
    //     }
    //     c();
    // },
    //公钥 必填 任务264 取消限制
    // merchantConsolehove: (r,v,c) =>{
    //     // let Rex =/^[^\u4e00-\u9fa5]{2,30}$/;
    //     if (!v){
    //         c(new Error('请输入公钥'));
    //     }else if(v>50){
    //         c(new Error('请输入正确的公钥'))
    //         return
    //     }
    //     c();
    // },
//前端官网设置 不能输入中文
    websiteUrl: (r,v,c) =>{
            let reg = /^[^\u4e00-\u9fa5]+$/;
        if (!v){
             return c(new Error('请输入前端官网设置'));
           }else if (!reg.test(v)){
               return c(new Error('请输入正确的前端官网设置'));
            }else {
            return c();
        }

        },
    //支付网关 必填
    gatewayhove: (r,v,c) =>{
        if (!v){
            c(new Error('请输入支付网关'));
        }else if(v>50){
            c(new Error('支付网关不得超过30个字符'))
            return
        }
        c();
    },

    //系统设置 域名管理   域名不需要填写http://www
    domainRule: (r,v,c) =>{
      if(!v){
        c(new Error('请输入域名'));
        return
      }
      if(v.startsWith('http:') || v.startsWith('www.')){
        c(new Error('域名不需要填写http或www'));
      }else{
        c()
      }
    },

    ProfitConfUnlimited:(r,v,c) => { //设置返利 推广等级用户名
      if(!v){
        c(new Error('请输入推广等级'));
        return
      }
      if(v.length>10){
        c(new Error('名字不能超过10个字'));
        return
      }
      c();
    },
    ProfitConfUnlimitedemoney:(r,v,c) => {  //设置返利 有效投注最多两位小数
      var flo = ((v+'').indexOf('.') > -1)&&((v+'').split('.')[1]) || '';
        if(v === 0){
          c();
          return
        }
        if(!v){
          c(new Error('金额设置不能为空'));
          return
        }
        if(flo.length > 2){
          c(new Error('小数点后不能超过2位'));
          return
        }
        if(flo.length > 2 && v.length>12){
          c(new Error('金额设置长度不能超过10位数'));
          return
        }else{
            if(flo.length>1){
                if(v.length>13){
                  c(new Error('金额设置长度不能超过10位数'));
                  return
                }
            }else{
              if(v.length>10){
                c(new Error('金额设置长度不能超过10位数'));
                return
              }
            }
        }
       c();
    },
    subordinateCount:(r,v,c) => { //返利设置-推荐人数
      let reg = new RegExp(/^[0-9]+$/);
      if(v === 0){
        c();
        return
      }
      if(!v){
        c(new Error('推荐人数不能为空'));
        return
      }
      if(!reg.test(v)){
        c(new Error('推荐人必须为整数'));
        return
      }
      if(v.length > 10){
        c(new Error('推荐人数不能超过10位数'));
        return
      }
      c();
    },
    commissionPer:(r,v,c) => {
      var flo = ((v+'').indexOf('.') > -1)&&((v+'').split('.')[1]) || '';
      if(v === 0){
        c();
        return
      }
      if(!v){
        c(new Error('返佣设置不能为空'));
        return
      }
      if(flo.length > 2){
        c(new Error('小数点后不能超过2位'));
        return
      }
      if(flo.length > 2 && v.length>7){
        c(new Error('返佣设置长度不能超过5位数'));
        return
      }else{
          if(flo.length>1){
              if(v.length>8){
                c(new Error('返佣设置长度不能超过5位数'));
                return
              }
          }else{
            if(v.length>5){
              c(new Error('返佣设置长度不能超过5位数'));
              return
            }
          }
      }
     c();
      // console.log(v == 0)
      // if(v == 0 || v < 0){
      //   c(new Error('返佣不能为0或小于0'));
      //   return
      // }
      // if(!v){
      //   c(new Error('返佣不能位空'));
      //   return
      // }
      // if(v.length > 4){
      //   c(new Error('返佣最长不能超过4位数'));
      //   return
      // } 
      // c();  
    },
}
