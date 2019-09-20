import request from '@/request'

export default {
  LoginByUsername:data => request({ //登陆
    url:'/newLogin',
    method:'post',
    data:data
  }),
  validateType:data => request({ //查询绑定
    url:'/validateType',
    method:'post',
    data:data
  }),
  gitspreadReport:() => request({ //查询绑定
    url:'/promotion/model',
    method:'get',
  }),

}