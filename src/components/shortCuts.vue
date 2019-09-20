<template>
  <div class="global_components_short_cuts_wrapper">
    <el-select @change="changeHandle" v-model="value" placeholder="速选" clearable 
      style='width:80px;'
    >
      <el-option label="今天" value='jint'></el-option>
      <el-option label="昨天" value='zuot'></el-option>
      <el-option label="本周" value='benz'></el-option>
      <el-option label="上周" value='shangz'></el-option>
      <el-option label="本月" value='beny'></el-option>
      <el-option label="上月" value='shangy'></el-option>
    </el-select>
  </div>
</template>

<script>
/**
 * 财务管理模块，速选功能；
 * @author:Nathan;
 * @argument:见props注释
 */
import times from '@/tool/times'

export default {
  name:'shortCuts',
  props:{
    currentContext:{  //父组件上下文  需要传入父组件的this对象
      required:true
    },
    _value:{required:false},//默认绑定值
    currentModelName:{  //需要改变的父组件的数据模型名称字符串  申请日期/处理日期绑定的数据模型 
      required:true
    },
    currentQueryHandle:{  //父组件的查询方法字符串  点击查询按钮时调用的方法
      required:true
    },
  },
  data(){
    return {
      value:"",  //当前选中的值
    }
  },
    mounted(){
        this.value = this._value._date
    },
  methods:{
    parentHandleclick(){
        this.value=''  
    },
    changeHandle(){ //下拉菜单改变事件
      let range;
      switch(this.value){
        case 'jint':
        range = this.getToday();
        break;
        case 'zuot':
        range = this.getYesterday();
        break;
        case 'benz':
        range = this.getThisWeek();
        break;
        case 'shangz':
        range = this.getPrevWeek();
        break;
        case 'beny':
        range = this.getThisMonth();
        break;
        case 'shangy':
        range = this.getPrevMonth();
        break;
      }
      //未对类型进行判断，暂定日期选择器都是daterange类型
      this.currentContext._self[this.currentModelName] = range; 
      //调用查询方法
      this.currentContext._self[this.currentQueryHandle](); 
    },
    getToday(){ //获取今天
      let daterange = [];
      daterange.push(times.DateToYMD(new Date()));
      daterange.push(times.DateToYMD(new Date()));
      return daterange;
    },
    getYesterday(){ //获取昨天
      let daterange = [];
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
      end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
      daterange.push(times.DateToYMD(start));
      daterange.push(times.DateToYMD(end));
      return daterange;
    },
    getThisWeek(){  //获取本周
      let daterange = [];
      let benznow = new Date(); 
      let day = benznow.getDay();
      let benzMondayTime;
      if(day == 0){
        benzMondayTime = benznow.getTime() - 6*3600 * 1000 * 24 ;
      }else{
        benzMondayTime = benznow.getTime() - (day-1)*3600 * 1000 * 24 ;
      }
      daterange.push(times.DateToYMD(new Date(benzMondayTime)));
      daterange.push(times.DateToYMD(benznow));
      return daterange;
    }, 
    getPrevWeek(){  //获取上周
      let daterange = [];
      let shangznow = new Date(); 
      let shangzday = shangznow.getDay();
      let shangzMondayTime;
      if(shangzday == 0){
        shangzMondayTime = shangznow.getTime() - 6*3600 * 1000 * 24 ;  //本周一
      }else{
        shangzMondayTime = shangznow.getTime() - (shangzday-1)*3600 * 1000 * 24 ;  //本周一
      }
      let prevMondayTime = shangzMondayTime - 7*3600 * 1000 * 24; //上周一
      let prevSundayTime = shangzMondayTime - 1*3600 * 1000 * 24; //上周日
      daterange.push(times.DateToYMD(new Date(prevMondayTime)));
      daterange.push(times.DateToYMD(new Date(prevSundayTime)));
      return daterange;
    },
    getThisMonth(){ //获取本月
      let daterange = [];
      const end = new Date();
      const start = new Date();
      const firstDay = start.getTime()-(start.getDate()-1)*3600*1000*24;//本月一号
      daterange.push(times.DateToYMD(new Date(firstDay)));
      daterange.push(times.DateToYMD(end));
      return daterange;
    },
    getPrevMonth(){  //获取上月
      let daterange = [];
      const start = new Date();
      const prevLastDay = start.getTime()-(start.getDate())*3600*1000*24;//上月最后一天
      const prevFirstDay = prevLastDay-(new Date(prevLastDay).getDate()-1)*3600*1000*24//上月第一天
      daterange.push(times.DateToYMD(new Date(prevFirstDay)));
      daterange.push(times.DateToYMD(new Date(prevLastDay)));
      return daterange;
    },
  }
}
</script>

<style lang="scss" scoped>
.global_components_short_cuts_wrapper{
  padding-left: 10px;
  .el-input__inner{
    background: deeppink;
  }
}
</style>
