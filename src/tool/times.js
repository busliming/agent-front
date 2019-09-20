/**
 * 时间相关工具类
 */
export default {
  /**
   * Date对象转年月日
   */
  DateToYMD:date => {
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = date.getDate() < 10 ? ('0'+date.getDate()) : date.getDate();
    return Y+M+D;
  },
  /**
   * Date对象转年月日时分秒
   */
  DateToYMDHMS:date => {
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = (date.getDate() < 10 ? ('0'+date.getDate()) : date.getDate())+' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return Y+M+D+h+m+s;
  },
}

/**
 * 年月日时分秒字符串转时间
 * 5分钟前
 * 2小时前
 * 1天前
 * 1月前
 * 1年前
 */
export const YMDHMStoTIME = (ymdhms) => {
  if(!ymdhms){return ''}
  let timstamp =new Date().getTime() - new Date(ymdhms).getTime();
  let mm = parseInt((timstamp * 167 / 10000000).toFixed(2))+'分钟前';
  let hh = parseInt((timstamp * 278 /1000000000).toFixed(2))+'小时前';
  let dd = parseInt((timstamp * 116 /10000000000).toFixed(2))+'天前';
  let MM = parseInt((timstamp * 38 /100000000000).toFixed(2))+'月前'; 
  let YY = parseInt((timstamp * 317/10000000000000).toFixed(2))+'年前';

  let arr = [YY,MM,dd,hh,mm];
  let flag = false;
  let arr2 = arr.map(item => {
    if(!flag){
      if(parseInt(item)>0){
        flag = true
        return item
      }else{
        return ''
      }
    }else{
      return ''
    }
  })
  if(arr2.join('') === ''){
    return '刚刚'
  }else{
    return arr2.join('');
  }
}