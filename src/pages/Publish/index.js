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
  import { Link, useSearchParams } from 'react-router-dom'
  import './index.scss'
  import ReactQuill from 'react-quill'
  import 'react-quill/dist/quill.snow.css'
  import { createArticleAPI,getArticleDetailAPI,updateArticleAPI} from '@/apis/article'
import { useEffect, useState } from 'react'
import useChannel from '@/hooks/useChannel'

  
  const { Option } = Select
  
  const Publish = () => {

    const [imageList,setImageList]=useState([]);
    const [imageType,setImageType]=useState(0);//默认为无图类型

    //获取频道列表
    const {channelList}=useChannel();

    //回填数据
    //1.获取Form实例并绑定在From组件上
    const [form]=Form.useForm();
    //2.拿到query参数中的id
    const [searchParams]=useSearchParams();
    const articleId=searchParams.get('id');
    useEffect(()=>{
    //3.根据id获取文章详情数据
      async function getArticleDetail(){
        const res=await getArticleDetailAPI(articleId);
        //4.调用setFieldsValue方法实现数据回填

        //为什么无法实现封面回填？
        //数据结构的问题 set方法：{type：3} 返回的数据：{cover：{type：3}}

        form.setFieldsValue({
          ...res.data,
          type:res.data.cover.type
        });

        //回填封面列表
        setImageType(res.data.cover.type);//否则默认是无图状态，不显示上传框

        //显示图片 上传图片的接口格式需要：{url:url}
        setImageList(res.data.cover.images.map((item)=>{
          return {url:item}
        }));
        

      }
      if(articleId){
        getArticleDetail();
      }
    },[articleId,form])


    //用户提交表单
    function onFinish(formValue){
        //校验封面类型imageType是否和实际的图片列表imageList相匹配
        if(imageType!==imageList.length) return message.warning('The cover type and the number of images do not match.');
        //根据接口文档的格式修正数据格式
        const {title,content,channel_id} = formValue;
        const reqData={
            title,
            content,
            cover:{
                type:imageType,//封面模式
                //这个url处理逻辑只是在新增文章时的逻辑，由于新增文章和回显时的图片路径不一样，所以需要分别处理
                images:imageList.map(item => {

                  if(item.response){ //新增文章
                    return item.response.data.url
                  }else{ //编辑文章
                    return item.url;
                  }

                })//图片列表 ["url"]
            },
            channel_id
        }

        if(articleId){
          //调用编辑文章接口
          updateArticleAPI({
            ...reqData,
            id:articleId
          })
          message.success('Article modification successful.')
        }else{
          //调用发布文章接口
        createArticleAPI(reqData);
        message.success('Article published successfully.')
        }
        
    }

    //上传封面图片
    function onChange(value){
        console.log("ImageList",value.fileList);
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
              { title: <Link to={'/'}>Home</Link> },
              { title: `${articleId ? 'Edit':'Publish'}Article` },
            ]}
            />
          }
        >
          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ type: 0 }}//控制初始上传图片类型为无图
            onFinish={onFinish}
            form={form}
          >
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: 'Please enter the article title.' }]}
            >
              <Input placeholder="Please enter the article title." style={{ width: 400 }} />
            </Form.Item>
            <Form.Item
              label="Channel"
              name="channel_id"
              rules={[{ required: true, message: 'Please select the article channel.' }]}
            >
              <Select placeholder="Please select the article channel." style={{ width: 400 }}>
                {channelList.map(item => <Option key={item.id} value={item.id}>{item.name}</Option> )}
              </Select>
            </Form.Item>

            <Form.Item label="Cover">
            <Form.Item name="type">
              <Radio.Group onChange={onTypeChange}>
                <Radio value={1}>Single Image</Radio>
                <Radio value={3}>Three Images</Radio>
                <Radio value={0}>No Image</Radio>
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
              fileList={imageList}//当前显示的图片列表
            >
               <div style={{ marginTop: 8 }}>
                 <PlusOutlined />
               </div>
            </Upload>}
           </Form.Item>

            <Form.Item
              label="Content"
              name="content"
              rules={[{ required: true, message: 'Please enter the article content.' }]}
            >
                <ReactQuill
                  className="publish-quill"
                  theme="snow"
                  placeholder="Please enter the article content."
                />
            </Form.Item>
  
            <Form.Item wrapperCol={{ offset: 4 }}>
              <Space>
                <Button size="large" type="primary" htmlType="submit">
                Publish Article
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </div>
    )
  }
  
  export default Publish