//文章模块的所有请求

import { request } from "@/utils";


//获取频道列表请求
export const getChannelListAPI=()=>{
    return request({
        url:'/channels',
        method:'GET',
    })
}

//发布文章
export const createArticleAPI=(data)=>{
    return request({
        url:'/mp/articles?draft=false',
        method:'POST',
        data
    })
}

//获取文章列表
export const getArticleListAPI=(params)=>{
    return request({
        url:'/mp/articles',
        method:'GET',
        params
    })
}
