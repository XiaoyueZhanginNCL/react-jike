//统一的用户状态管理

import { createSlice } from "@reduxjs/toolkit";
import {request} from '@/utils/index'
import { getToken, setToken as _setToken } from '@/utils'

const userStore=createSlice({
    name:'user',
    initialState:{
        token: getToken() || '',
        userInfo:''
    },
    reducers:{
        //同步修改方法
        setToken(state,action){
            state.token=action.payload;
            _setToken(state.token)
        },
        setUserInfo(state,action){
            state.userInfo=action.payload;
        }
    }
})

const {setToken,setUserInfo}=userStore.actions;

//异步方法 完成登录获取token
const fetchLogin=(loginForm)=>{
    return async (dispatch)=>{
        //1.发送异步请求,接收返回数据中的token（如果账号存在）
        const res=await request.post('/authorizations',loginForm)
        //2.提交同步action进行token的存入
        dispatch(setToken(res.data.token))
    }
}

const fetchUserInfo=()=>{
    return async (dispatch)=>{
        const res=await request.get('/user/profile');
        dispatch(setUserInfo(res.data));
    }
}


const userReducer =userStore.reducer;

export {setToken,fetchLogin,setUserInfo,fetchUserInfo}

export default userReducer;