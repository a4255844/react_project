import React, { Component } from 'react';
import { Button, Modal } from 'antd';
import { FullscreenOutlined, FullscreenExitOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import screenfull from 'screenfull';
import { connect } from 'react-redux'
import { createDeleteUserInfoAction } from '../../../redux/actions/login_action';
import { reqWeather } from '../../../api'
import './css/header.less';
import dayjs from 'dayjs';
const { confirm } = Modal;
@connect(
  state => ({ userInfo: state.userInfo }),
  { deleteUserInfo: createDeleteUserInfoAction }
)
class Header extends Component {
  state = {
    isFull: false,
    timeNow: '',
    weatherInfo: {}
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

  }
  componentWillUnmount() {
    clearInterval(this.timeid)
  }
  // 请求天气接口
  getWeather = async () => {
    let result = await reqWeather()
    this.setState({ weatherInfo: result })

  }

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
          <div className="header-bottom-left">分类管理</div>
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