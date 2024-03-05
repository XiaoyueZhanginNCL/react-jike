import { Layout, Menu, Popconfirm } from 'antd'
import {
  HomeOutlined,
  DiffOutlined,
  EditOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import './index.scss'
import { Outlet, useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { fetchUserInfo,clearUserInfo } from '@/store/modules/user'
import { useEffect } from 'react'
import { useDispatch,useSelector } from 'react-redux'

const { Header, Sider } = Layout

const items = [
  {
    label: 'Home',
    key: '/',
    icon: <HomeOutlined />,
  },
  {
    label: 'Article Management',
    key: '/article',
    icon: <DiffOutlined />,
  },
  {
    label: 'Create Article',
    key: '/publish',
    icon: <EditOutlined />,
  },
]

const GeekLayout = () => {
  const navigate=useNavigate();
  const location=useLocation();
  const dispatch=useDispatch();
  const name=useSelector(state=>state.user.userInfo.name);

  useEffect(()=>{
    dispatch(fetchUserInfo());
  },[dispatch])

  const selectedKey=location.pathname;//拿到当前路由路径
  function onMenuClicked(values){
    // console.log(values)
    const path=values.key;
    navigate(path);
  }

  function onConfirmExit(){
    dispatch(clearUserInfo());
    navigate('/login')
  }

  return (
    <Layout>
      <Header className="header">
        <div className="logo" />
        <div className="user-info">
          <span className="user-name">{name}</span>
          <span className="user-logout">
            <Popconfirm title="Are you sure you want to exit?" okText="Yes" cancelText="Cancel" onConfirm={onConfirmExit}>
              <LogoutOutlined /> Exit
            </Popconfirm>
          </span>
        </div>
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            theme="dark"
            selectedKeys={selectedKey}
            items={items}
            onClick={onMenuClicked}
            style={{ height: '100%', borderRight: 0 }}></Menu>
        </Sider>
        <Layout className="layout-content" style={{ padding: 20 }}>
          {/* 二级路由出口 */}
          <Outlet></Outlet>
        </Layout>
      </Layout>
    </Layout>
  )
}
export default GeekLayout