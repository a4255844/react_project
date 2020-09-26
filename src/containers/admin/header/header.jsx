import React, { Component } from 'react';
import { Button, Modal } from 'antd';
import { FullscreenOutlined, FullscreenExitOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import screenfull from 'screenfull';
import dayjs from 'dayjs';
import { withRouter } from 'react-router-dom' //在非路由组件内使用withRouter高阶组件，使其具有路由组件特性
import { connect } from 'react-redux'
import { createDeleteUserInfoAction } from '../../../redux/actions/login_action';
import { reqWeather } from '../../../api'
import './css/header.less';
import menuConfig from '../../../config/menu-config';
const { confirm } = Modal;
@connect(
   state => ({ userInfo: state.userInfo, title: state.title }),
   { deleteUserInfo: createDeleteUserInfoAction }
)
@withRouter
class Header extends Component {
   state = {
      isFull: false,
      timeNow: '',
      weatherInfo: {},
      title: ''
   }
   // 切换全屏
   fullScreen = () => {
      screenfull.toggle();
   }
   // 监听screenfull的状态 改变state
   componentDidMount() {
      screenfull.on('change', () => {
         let isFull = !this.state.isFull
         this.setState({ isFull })
      });
      // 页面显示时间的状态
      this.timeid = setInterval(() => {
         this.setState({
            timeNow: dayjs().format('YYYY年MM月DD日 HH:mm:ss')
         })
      }, 1000);
      // 页面加载请求天气接口
      this.getWeather()
      //   页面加载保存当前路由的title到state
      this.getTitle()
   }
   // 卸载组建前关闭定时器
   componentWillUnmount() {
      clearInterval(this.timeid)
   }
   // 请求天气接口
   getWeather = async () => {
      let result = await reqWeather()
      this.setState({ weatherInfo: result })

   }
   // 点击退出登录
   logout = () => {
      let { deleteUserInfo } = this.props
      confirm({
         title: '确定退出吗？',
         icon: <ExclamationCircleOutlined />,
         content: '若退出将注销用户访问该网站，需重新验证用户名和密码！',
         okText: '确定',
         cancelText: '取消',
         onOk() {
            deleteUserInfo()
         },
      });
   }
   // 遍历找到对应路由的title
   getTitle = () => {
      console.log('---getTitle---');
      // 把路由路径分隔成数组
      let pathArr = this.props.location.pathname.split('/');
      // 获取路径的最后项
      let pathKey = pathArr[pathArr.length - 1]
      // 如果路径中包含product,就默认使用
      if (pathArr.indexOf('product') !== -1) pathKey = 'product'
      let result;
      // 遍历，如果目标key和pathKey相等，则表示找到该目标，并使用该目标的title
      menuConfig.forEach(item => {
         if (item.children instanceof Array) {
            let temp = item.children.find(citem => {
               return citem.key === pathKey
            })
            if (temp) result = temp.title
         } else {
            if (item.key === pathKey) {
               result = item.title
            }
         }
      })
      this.setState({ title: result })
   }
   render() {
      let { isFull, weatherInfo } = this.state
      let { user } = this.props.userInfo
      return (
         <header className='header'>
            <div className="header-top">
               <Button size="small" onClick={this.fullScreen}>
                  {/* 判断是否全屏显示对应的图标 */}
                  {isFull ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
               </Button>
               <span className="user">
                  欢迎 {user.username}
               </span>
               <Button size="small" type="link" onClick={this.logout}>退出登录</Button>
            </div>
            <div className="header-bottom">
               <div className="header-bottom-left">
                  {this.props.title || this.state.title}
               </div>
               <div className="header-bottom-right">
                  {this.state.timeNow}
                  <img src={weatherInfo.dayPictureUrl} alt="天气图片" />
                  {weatherInfo.weather} &nbsp;&nbsp; 温度：{weatherInfo.temperature}
               </div>
            </div>
         </header>
      )
   }
}
export default Header