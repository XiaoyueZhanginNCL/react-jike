import { Link, useNavigate } from 'react-router-dom'
import { Card, Breadcrumb, Form, Button, Radio, DatePicker, Select,Popconfirm} from 'antd'
import { Table, Tag, Space } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import img404 from '@/assets/error.png'
import useChannel from '@/hooks/useChannel'
import { useState,useEffect } from 'react'
import { getArticleListAPI,deleteArticleAPI } from '@/apis/article'
const dayjs = require('dayjs');

const { Option } = Select
const { RangePicker } = DatePicker

const Article = () => {
  const navgiate=useNavigate();

    const columns = [
        {
          title: 'Cover',
          dataIndex: 'cover',
          width: 120,
          render: cover => {
            return <img src={cover.images[0] || img404} width={80} height={60} alt="" />
          }
        },
        {
          title: 'Title',
          dataIndex: 'title',
          width: 220
        },
        {
          title: 'Status',
          dataIndex: 'status',
          //data —— 后端返回的状态status 根据它来做条件渲染
          //data===1 待审核
          //data===2 审核通过
          render: data => data===1 ? <Tag color="warning">Pending Review</Tag> : <Tag color="success">Approved</Tag>
        },
        {
          title: 'Publication Time',
          dataIndex: 'pubdate'
        },
        {
          title: 'Number of Reads',
          dataIndex: 'read_count'
        },
        {
          title: 'Number of Comments',
          dataIndex: 'comment_count'
        },
        {
          title: 'Number of Likes',
          dataIndex: 'like_count'
        },
        {
          title: 'Action',
          render: data => {
            return (
              <Space size="middle">
                <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={()=>{navgiate(`/publish?id=${data.id}`)}} />
                <Popconfirm
                  title="Delete the task"
                  description="Are you sure to delete this task?"
                  onConfirm={()=>{onConfirm(data)}}
                  okText="Yes"
                   cancelText="No">  

                  <Button
                  type="primary"
                  danger
                  shape="circle"
                  icon={<DeleteOutlined />}
                />

                 </Popconfirm>
              </Space>
            )
          }
        }
      ]

  //获取频道列表
  const {channelList} =useChannel();

  //获取文章列表
  const [list,setList]=useState([]);
  const [count,setCount]=useState(0);

  //根据条件渲染文章列表，准备参数
  const [reqData,setReqData] =useState({
    status:'',
    channel_id:'',
    begin_pubdate:'',
    end_pubdate:'',
    page:1,
    per_page:4
  })


  useEffect(()=>{
      async function getList(){
          const res=await getArticleListAPI(reqData);
          setList(res.data.results);
          setCount(res.data.total_count);
      }

      getList();
  },[reqData])
  

  //获取筛选数据
  function onFinish(values){
    setReqData({
      ...reqData,
      status:values.status,
      channel_id:values.channel_id,
      begin_pubdate:dayjs(values.date[0]).format('YYYY-MM-DD'),
      end_pubdate:dayjs(values.date[1]).format('YYYY-MM-DD'),
    })
  }

  //分页
  function onPageChange(value){
    const page=value.current;
    setReqData({
      ...reqData,
      page
    })
  }

  //确认删除
  async function onConfirm(data){
    // console.log(data);
    await deleteArticleAPI(data.id);//确保删除完成后在进行渲染
    setReqData({//重新渲染列表数据
      ...reqData
    })
  }

  return (
    <div>
      <Card
        title={
          <Breadcrumb items={[
            { title: <Link to={'/'}>首页</Link> },
            { title: 'Article List' },
          ]} />
        }
        style={{ marginBottom: 20 }}
      >
        <Form initialValues={{ status: '' }} onFinish={onFinish}>
          <Form.Item label="Status" name="status">
            <Radio.Group>
              <Radio value={''}>All</Radio>
              <Radio value={0}>Draft</Radio>
              <Radio value={2}>Approved</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="Channel" name="channel_id">
            <Select
              placeholder="Please select the article channel."
              defaultValue="lucy"
              style={{ width: 120 }}
            >
              {channelList.map( item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
            </Select>
          </Form.Item>

          <Form.Item label="Date" name="date">
            <RangePicker ></RangePicker>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginLeft: 40 }}>
            Filter
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* 表格区域 */}
      <Card title={`${count} results found based on the filtering criteria.`}>
        <Table rowKey="id" columns={columns} dataSource={list} 
        pagination={{//实现分页功能 页数=数据总数/每页条数
          total:count,
          pageSize:reqData.per_page,
        }} onChange={onPageChange}/>
      </Card>
    </div>
  )
}

export default Article