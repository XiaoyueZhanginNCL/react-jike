import {
    Card,
    Breadcrumb,
    Form,
    Button,
    Radio,
    Input,
    Upload,
    Space,
    Select,
    message
  } from 'antd'
  import { PlusOutlined } from '@ant-design/icons'
  import { Link } from 'react-router-dom'
  import './index.scss'
  import ReactQuill from 'react-quill'
  import 'react-quill/dist/quill.snow.css'
  import { getChannelListAPI,createArticleAPI } from '@/apis/article'
import { useEffect, useState } from 'react'

  
  const { Option } = Select
  
  const Publish = () => {

    const [channelList,setChannelList]=useState([]);
    const [imageList,setImageList]=useState([]);
    const [imageType,setImageType]=useState(0);//默认为无图类型

    useEffect(()=>{
        //获取频道列表
        async function getChannel(){
            const res=await getChannelListAPI();
            setChannelList(res.data.channels);
        }

        getChannel();
    },[])

    //用户提交表单
    function onFinish(formValue){
        //校验封面类型imageType是否和实际的图片列表imageList相匹配
        if(imageType!==imageList.length) return message.warning('封面类型和图片数量不匹配');
        //根据接口文档的格式修正数据格式
        const {title,content,channel_id} = formValue;
        const reqData={
            title,
            content,
            cover:{
                type:imageType,//封面模式
                images:imageList.map(item => item.response.data.url)//图片列表
            },
            channel_id
        }
        //调用发布文章接口
        createArticleAPI(reqData);
        message.success('发布文章成功')
    }

    //上传封面图片
    function onChange(value){
        // console.log(value);
        setImageList(value.fileList)
    }

    //切换上传图片类型
    function onTypeChange(event){
        setImageType(event.target.value);
    }
    return (
      <div className="publish">
        <Card
          title={
            <Breadcrumb items={[
              { title: <Link to={'/'}>首页</Link> },
              { title: '发布文章' },
            ]}
            />
          }
        >
          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ type: 0 }}//控制初始上传图片类型为无图
            onFinish={onFinish}
          >
            <Form.Item
              label="标题"
              name="title"
              rules={[{ required: true, message: '请输入文章标题' }]}
            >
              <Input placeholder="请输入文章标题" style={{ width: 400 }} />
            </Form.Item>
            <Form.Item
              label="频道"
              name="channel_id"
              rules={[{ required: true, message: '请选择文章频道' }]}
            >
              <Select placeholder="请选择文章频道" style={{ width: 400 }}>
                {channelList.map(item => <Option key={item.id} value={item.id}>{item.name}</Option> )}
              </Select>
            </Form.Item>

            <Form.Item label="封面">
            <Form.Item name="type">
              <Radio.Group onChange={onTypeChange}>
                <Radio value={1}>单图</Radio>
                <Radio value={3}>三图</Radio>
                <Radio value={0}>无图</Radio>
              </Radio.Group>
            </Form.Item>
            {/* listType:决定选择文件框的外观样式
                showUploadList：控制显示上传列表
                action:配置图片上传的接口地址
                name:接口要求的字段名
                onChange:在事件中拿到当前图片数据，并存储到React状态中
             */}
            {imageType>0 && <Upload
              listType="picture-card"
              showUploadList
              action={'http://geek.itheima.net/v1_0/upload'}
              onChange={onChange}
              name='image'
              maxCount={imageType}//控制最多上传文件的数量
            >
               <div style={{ marginTop: 8 }}>
                 <PlusOutlined />
               </div>
            </Upload>}
           </Form.Item>

            <Form.Item
              label="内容"
              name="content"
              rules={[{ required: true, message: '请输入文章内容' }]}
            >
                <ReactQuill
                  className="publish-quill"
                  theme="snow"
                  placeholder="请输入文章内容"
                />
            </Form.Item>
  
            <Form.Item wrapperCol={{ offset: 4 }}>
              <Space>
                <Button size="large" type="primary" htmlType="submit">
                  发布文章
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </div>
    )
  }
  
  export default Publish