//所有有关用户的请求

import { request } from "@/utils";


//登录请求
export const loginAPI=(formData)=>{
    return request({
        url:'/authorizations',
        method:'POST',
        data:formData
    })
}

//获取用户信息
export const getProfileAPI=()=>{
    return request({
        url:'/user/profile',
        method:'GET',
    })
}