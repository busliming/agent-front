import axios from 'axios'
import store from '@/store/store'
import md5 from 'blueimp-md5'
import Vue from 'vue'
import ElementUI   from 'element-ui'//引入ElementUI 提示登录超时
import  '../element-variables.scss'
Vue.use(ElementUI);

//md5hex
const mapping = [2, 0, 3, 1];
const remapping = [ 1, 3, 0, 2];
const mov = mapping.length;
const changeInt = (a, encrypt) => {
    // 排除0
    if (encrypt && a == 22369621) {
        return 44739242;
    } else if (!encrypt && a == 44739242) {
        return 22369621;
    }
    let b = 0;
    for (let i = 0, j = 26 - mov / 2; i < 26 / (mov / 2); ++i, j -= mov / 2) {
        b |= (encrypt ? mapping[Math.abs(a % mov)] : remapping[Math.abs(a % mov)]) << j;
        a >>>= mov / 2;
    }
    return b;
}

//获取session里的token
const getToken = function(){
  return window.sessionStorage.getItem('token');
}

// 创建axios实例
const service = axios.create({
  baseURL: '/api',
  timeout: 0
})

// request拦截器
service.interceptors.request.use(config => {
  if (getToken()){ //带上token
    let accountId = window.sessionStorage.getItem('accountId');
    config.headers['Authorization'] = getToken();
    config.headers['auth'] = md5(changeInt(accountId,true) + ":" + getToken())
    return config
  }else{ 
    return config
  }
}, error => {
  return Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(response => {
    console.log(response.data)
    if(response.data.code){
        let code = parseInt(response.data.code);
        if(code==200){
            return response.data
        }else{
            if(code == 511){ //token失效
                console.log("511错误")
                ElementUI.MessageBox.alert('登录超时,请重新登录！！！！', '警告', {
                    confirmButtonText: '确定',
                    callback: action => {
                        ElementUI.MessageBox.close();
                        store.dispatch('LogOut').then(() => {
                            location.reload()
                        })
                    }
                });
            }else{
                return response.data;
            }
        }
    }else {
        return response.data;
    }
    // if(response.status == '200'){
    //   return response.data
    // }else{
    //   return Promise.reject('http status code 非200的错误')
    // }
  },
  error => {
    console.log(JSON.stringify(error.response));
    let code = error.response!=null?error.response.data.code:'';
    if(code == '511'){ //token失效
        console.log("511错误")
        ElementUI.MessageBox.alert('登录超时,请重新登录！！！！', '警告', {
            confirmButtonText: '确定',
            callback: action => {
                ElementUI.MessageBox.close();
                store.dispatch('LogOut').then(() => {
                    location.reload()
                })
            }
        });
    }else{
      return Promise.reject('当前请求过多，请稍后在试')
     // return Promise.reject(error)
    }
  }
)

export default service
