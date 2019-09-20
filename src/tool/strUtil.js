/**
 * 图片路径处理方法   
 * 后端返回的图片路径可能是http开头的绝对路径，也可能是ip开头的路径
 * 对于后者需要在路径前面拼接'//'
 */
export default (str) => {
    let _url;
    if(str.startsWith('http')){
        _url = str
    }else{
        _url = '//'+str
    }
    return _url;
}