import axios from "axios";
import { getToken,clearToken } from "./token";
import router
 from "@/router";
//根域名配置和超时时间
const request= axios.create({
    baseURL: 'http://geek.itheima.net/v1_0',
    timeout: 7000
  })

// 添加请求拦截器,在请求发送之前做拦截，设置自定义参数
request.interceptors.request.use((config)=> {
    //操作这个config，注入token数据
    //1.获取token
    const token=getToken();
    //2.按照后端的格式要求做token拼接
    if(token){
      config.headers.Authorization=`Bearer ${token}`
    }
    return config
  }, (error)=> {
    return Promise.reject(error)
})

// 添加响应拦截器，在响应返回到客户端之前做拦截，重点处理返回的数据
request.interceptors.response.use((response)=> {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response.data
  }, (error)=> {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    //用户长时间未操作，token失效，再去请求接口，后端返回401
    if (error.response.status === 401) {
      clearToken()
      router.navigate('/login')
      window.location.reload()
    }
    return Promise.reject(error)
})

export { request }