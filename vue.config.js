module.exports = {
  productionSourceMap:false,
  devServer:{
    disableHostCheck:true, //忽略host检查
    proxy: {  //代理/api请求到正确的服务
      '/api': {
        context: () => true,
        // target: 'http://172.20.101.28:8082/',
         target: 'http://agent.huihuang300.com',
        //  target: 'http://agent6.huihuang500.com:9090',
        // target: 'http://agent.huihuang200.com:9090',
        // pathRewrite: {'^/api' : ''},
      },
    }
  }
}
