import axios from "axios";
//根域名配置和超时时间
const request= axios.create({
    baseURL: 'http://geek.itheima.net/v1_0',
    timeout: 5000
  })

// 添加请求拦截器,在请求发送之前做拦截，设置自定义参数
request.interceptors.request.use((config)=> {
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
    return Promise.reject(error)
})

export { request }