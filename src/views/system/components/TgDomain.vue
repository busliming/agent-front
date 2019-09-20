<template>
  <div class="tgDomain">
    <div class="text-box" style="line-height:30px;">1.为了防止拦截，在使用微信或者QQ打开推广域名时，可填写一个推广域名跳转地址。
      <br>2.推广域名跳转地址，只会在使用微信和QQ访问推广域名时才会生效，其他方式不会生效
      <br>3.打开推广域名跳转地址后，此页面会引导用户用浏览器进行打开。
    </div>
    <div class="domain-list">
      <el-form class="item" :inline="true" ref="PopuDomadata" v-loading="loading" :model="PopuD">
          <div class="item" v-for="(el, index) in PopuD.PopuDomadata" :key="index">
            <el-form-item>
              <el-radio v-model="checkedId" :label="index" :value="el.popuStatus">勾选开启</el-radio>
            </el-form-item>  
            <el-form-item class="item-input-1" :rules="moreNotifyOjbectRules.moreNotifyOjbectName"
                                               :prop="'PopuDomadata.' + index + '.domainUrl'"
            >
                   <el-input placeholder="请输入内容" v-model="el.domainUrl">
                      <template slot="prepend">推广域名跳转地址:</template>
                   </el-input>
            </el-form-item>
            <el-form-item label="对应官网域名：" class="item-input-2">
              <el-select   v-model="selectedWebsite[index].domainId" placeholder="请选择">
                  <el-option v-for="(item,ind) in website" :key="ind" :label="item.domainUrl" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-button type="danger" icon="el-icon-minus" v-if="indexcircle" @click="removeConfig(index)" circle></el-button>
            <el-button
              v-if="index===PopuD.PopuDomadata.length-1"
              type="success"
              icon="el-icon-plus"
              @click="addConfig(index)"
              circle
            ></el-button>
          </div>
        <div class="btn-center">
          <el-button type="primary" @click="submission('PopuDomadata')">保存</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import systemRequest from "@/request/system";

export default {
  data() {
    return {
        moreNotifyOjbectRules:{
             moreNotifyOjbectName: [{ required: true, message: '域名地址不能为空', trigger: 'blur' },
          {
            validator: (rule, value, callback) => { ///[\u4E00-\u9FA5]/g.test(value)
                 if (/[\u4E00-\u9FA5]/g.test(value)) {
                      callback(new Error('禁止输入中文'))
                     } 
                 else {
                      var reg = new RegExp("[`~!@#$^&*()=|{}':',\\[\\]<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
                      if (reg.test(value)) {
                      callback(new Error('不能含有特殊字符'))
                      } else {
                      callback()
                      }
                  }
            },
            trigger: 'blur'
          }
        ]
      },
      // testData,
      checkedId: 0,
      timer: null,
      PopuD:{
            PopuDomadata:[], //查询站点推广域名 
      },
      selectedWebsite:[], //对应官网域名
      website:'', //查询站点H5域名列表
      loading:false,
      indexcircle:true,
      // checkItem: {}
    };
  },
  props: {
      CNAMEName: String,
    },
  watch:{
     selectedWebsite:{
            handler(val, oldVal){
                // for(let i=0;i<oldVal.length;i++){
                //     console.log(oldVal[i].domainId)
                // }
                if(oldVal.length<=1){
                    this.indexcircle=false
                    this.checkedId=0
                }else{
                    this.indexcircle=true
                }

            },
            deep:true
     }
  },
  methods: { 
     getSiteH5Domains(){ //查询站点H5域名列表
           systemRequest.getSiteH5Domains().then(res => {
                if(res.code == 200){  
                    this.website=res.data
                    for(let o=0;o<this.PopuD.PopuDomadata.length;o++){
                      for(let i=0;i<res.data.length;i++){
                           if(Object.is(this.PopuD.PopuDomadata[o].domainId,res.data[i].id)){
                               // this.selectedWebsite[o].domainId=res.data[i].id   
                                this.$set(this.selectedWebsite[o],'domainId',res.data[i].id)
                           }
                       }
                    }
                  }else{
                    this.$notify({
                      type:'warning',
                      title:res.msg
                    })
                  }
           })
     },
     getSitePopuDomains(){ //查询站点推广域名
           systemRequest.getSitePopuDomains().then(res => {
                if(res.code == 200){
                     this.PopuD.PopuDomadata=res.data
                      if(res.data.length==0){
                        this.addConfig(0)
                      }else{
                          for(let i=0;i<res.data.length;i++){
                            this.selectedWebsite.push({'domainId':''})
                            if(res.data[i].popuStatus==1){
                               this.checkedId = i
                            }
                          }
                      }
                    
                }else{
                    this.$notify({
                      type:'warning',
                      title:res.msg
                    })
                }
            }).then(res => {
                 this.getSiteH5Domains()
            }).catch(e => { 
                console.log(e);
            })
     },
     async submission(formName){  //提交域名绑定
       let vm=this 
         this.$refs[formName].validate((valid) => {
            if (valid) {
                if(vm.setstatus()){
                    let datas={
                        details:this.PopuD.PopuDomadata.filter(item => item.domainUrl!='' && item.domainId!=0)
                    }
                    vm.loading = true;
                    systemRequest.addOrUpSitePopuDomains(datas).then(res => {
                         if(res.code == 200){
                            this.$notify.success({title:'保存成功'})
                            this.PopuD.PopuDomadata = this.PopuD.PopuDomadata.filter(item => item.domainUrl!='' && item.domainId!=0)
                         }else{
                            this.$notify({
                              type:'warning',
                              title:res.msg
                            })
                          }
                        vm.loading = false;  
                    }).catch(e => { 
                        console.log(e);
                    })
                }
            } else {
              return false;
            }
         })


         
    },
    setstatus(){
        for (let i=0;i<this.PopuD.PopuDomadata.length;i++) {
             this.$set(this.PopuD.PopuDomadata[i],'popuStatus',0)
             this.$set(this.PopuD.PopuDomadata[i],'domainId',this.selectedWebsite[i].domainId) 
        }        
         this.$set(this.PopuD.PopuDomadata[this.checkedId],'popuStatus',1)
         this.$set(this.PopuD.PopuDomadata[this.checkedId],'domainId',this.selectedWebsite[this.checkedId].domainId)
         if(this.PopuD.PopuDomadata[this.checkedId].domainUrl==''){
                   this.$notify({
                      type:'warning',
                      title:'选定域名不能为空'
                    })
                   return false;
         }
         if(this.selectedWebsite[this.checkedId].domainId==''){
                   this.$notify({
                      type:'warning',
                      title:'官网域名不能为空'
                    })
                   return false;
         }
       return true  
    },
    // 增加推广域名跳转地址配置
    addConfig(index) {
      if(index<49){
          const dataItem = {
            id:0,
            domainUrl:"",
            popuStatus:0,
            domainId:0,
          };
          this.PopuD.PopuDomadata.push(dataItem);
          this.selectedWebsite.push({'domainId':''})
      }else{
           this.$message('最多只能添加五十条域名绑定');
      }
    },
    // 删除推广域名跳转地址配置
    removeConfig(index) {
      this.PopuD.PopuDomadata.splice(index, 1);
      this.selectedWebsite.splice(index,1)
    }
  },
  created () {
    //  this.getSiteH5Domains()
      this.getSitePopuDomains()
  }
};
</script>

<style lang="scss" scoped>
.text-box {
  margin-bottom: 30px;
}
.btn-center {
  margin-top: 20px;
  text-align: center;
}
</style>

<style lang="scss">
.tgDomain {
  .el-form-item.item-input-1 {
    width: 50%;
    .el-form-item__content {
      width: 100%;
    }
  }
}
</style>
