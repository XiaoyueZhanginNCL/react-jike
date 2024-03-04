//获取频道列表
import { useEffect, useState } from 'react'
import { getChannelListAPI } from '@/apis/article';


function useChannel(){
    const [channelList,setChannelList]=useState([]);

    useEffect(()=>{
        //获取频道列表
        async function getChannel(){
            const res=await getChannelListAPI();
            setChannelList(res.data.channels);
        }

        getChannel();
    },[])

    return {
        channelList
    };
}

export default useChannel


