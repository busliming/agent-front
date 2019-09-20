/**
 * 动态计算所有表格页面表格高度
 * 操作dom 在$nextTick中执行
 * 改方法建议在获取表格数据后调用
 */

 export default  (some) => {
  some.$nextTick(function () {  //计算表格高度
    let ch = document.querySelector('.bottom>section>.el-card').clientHeight; //card容器高度
    let tot = document.querySelector('.bottom>section>.el-card>.el-card__body>.el-table').offsetTop; //表格偏移高度
    let pch = document.querySelector('.bottom>section>.el-card>.el-card__body>.el-row>.el-pagination').clientHeight; //分页高度
    let tableHeight = ch - tot - pch;
    some.$data.TABLEMAXHEIGHT = tableHeight;
  })
}
