import React, { Component } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom'
import { reqLogin } from '../../api';
import { createSaveUserInfoAction } from '../../redux/actions/login_action';
import './css/login.less'
import logo from '../../static/images/logo.png';
const { Item } = Form;
@connect(
   (state) => ({ userInfo: state.userInfo }),
   {
      saveUserInfo: createSaveUserInfoAction,
   }
)
class Login extends Component {

   componentDidMount() {
      console.log(this.props);
      // 每次访问login页面时先判断是否已经登录
      let { isLogin } = this.props.userInfo
      if (isLogin) {
         return <Redirect to='/admin/home' />
      }
   }
   onFinish = async values => {
      // let { username, password } = values
      // reqLogin(username, password)
      //   .then((response) => {
      //     console.log(response.data);
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   })
      // 拿到响应成功的数据
      const result = await reqLogin(values)
      let { status, msg, data } = result

      // 若用户名密码正确，跳转admin
      if (status === 0) {
         // 登陆成功，保存用户数据到状态
         this.props.saveUserInfo(data)
         //跳转路由admin
         this.props.history.replace('/admin')

      } else {
         message.warning(msg, 1)  //若用户名或密码错误提示用户
      }
   }

   // 密码验证器，自定义校验
   pwdValidator = (a, value) => {
      let errMsgArr = [];
      if (!value.trim()) return Promise.reject('请输入密码')
      if (value.length < 4) errMsgArr.push('密码必须大于等于4位')
      if (value.length > 12) errMsgArr.push('密码必须小于等于12位')
      if (!(/^\w+$/).test(value)) return Promise.reject('密码必须是字母数字下划线组成')
      if (errMsgArr.length !== 0) return Promise.reject(errMsgArr)
      else return Promise.resolve()

   }

   render() {
      return (
         <div className='login' >
            <header>
               <img src={logo} alt="logo" />
               <h1>后台管理系统</h1>
            </header>
            <section>
               <h1>用户登录</h1>
               <Form
                  className="login-form"
                  onFinish={this.onFinish}
               >
                  <Item
                     name="username"
                     // 声明校验用户名
                     rules={[
                        { required: true, message: '请输入用户名!', },
                        { max: 12, message: '用户名必须小于等于12位' },
                        { min: 4, message: '用户名必须大于等于4位' },
                        { pattern: /^\w+$/, message: '用户名必须是字母数字下划线组成' },
                     ]}
                  >
                     <Input prefix={<UserOutlined className="site-form-item-icon" style={{ opacity: 0.3 }} />} placeholder="用户名" />
                  </Item>
                  <Item
                     name="password"
                     rules={[{ validator: this.pwdValidator }]}
                  >
                     <Input
                        prefix={<LockOutlined className="site-form-item-icon" style={{ opacity: 0.3 }} />}
                        type="password" autoComplete="off"
                        placeholder="密码"
                     />
                  </Item>
                  <Item>
                     <Button type="primary" htmlType="submit" className="login-form-button" block>
                        登录
                     </Button>
                  </Item>
               </Form>
            </section>
         </div>
      )
   }

}
export default Login
// export default connect(
//   (state) => ({ userInfo: state.userInfo }),
//   {
//     saveUserInfo: createSaveUserInfoAction,
//   }
// )(Login)

/*
1. 高阶函数
  定义: 如果函数接收的参数是函数或者返回值是函数
  例子: Promise() / then() / 定时器 / 数组遍历相关方法 / bind() / $() / $.get() / Form.create()
  好处: 更加动态, 更加具有扩展性

2. 高阶组件
  定义: 参数为组件，返回值为新组件的函数
  例子: Form.create()(组件) / withRouter(组件) / connect()(组件)
  与高阶函数的关系?
      高阶组件是一个特别的高阶函数
      接收的是组件函数, 同时返回新的组件函数
  作用:
      React 中用于复用组件逻辑的一种高级技巧

Form.create()(Login), 接收一个Form组件, 返回一个新组件
  Form.create = function () {
    const form = 创建一个强大form对象
    return function (FormComponent) {
      return class WrapComponent extends Component {
        render () {
          return <Login form={form}/>
        }
      }
    }
  }
  const LoginWrap = Form.create()(Login)

*/