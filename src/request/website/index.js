import request from '@/request'
import formdata from '@/tool/formdata'

const prefix = "";

export default {
  uploadFile:data => request({  //文件上传
    url:'/upload/uploadFile?pathType='+data.pathType+'&fileName='+data.fileName+'&bundleId='+data.bundleId,
    method:'post',
    headers:{
      'Content-Type':'multipart/form-data'
    },
    data:formdata({file:data.file}),
    onUploadProgress:data.progcallback
  }),
  getPictureList:data => request({  //获取图片列表
    url:'/pic/getPictureList',
    method:'post',
    data:data
  }),
  addAdsPicture:data => request({  //保存广告图
    url:'/pic/addAdsPicture',
    method:'post',
    data:data
  }),
  addOrEditPicture:data => request({  //新增轮播图
    url:'/pic/addOrEditPicture',
    method:'post',
    data:data
  }),
  delPicture:data => request({  //删除轮播图
    url:'/pic/delPicture',
    method:'post',
    data:data
  }),
}