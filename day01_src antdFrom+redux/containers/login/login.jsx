import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { demo1, demo2 } from '../../redux/actions/test_action'
import './css/login.less'
import logo from './images/logo.png';
const { Item } = Form;


// antd的组件
const NormalLoginForm = () => {
  // 点击登录的回调
  const onFinish = values => {
    console.log('Received values of form: ', values);
  }

  return (
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
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
        // 自定义校验密码,失败的promise和成功的promise都要传递，否则影响下面代码执行
        rules={[
          {
            validator(rule, value) {
              if (!value) {
                return Promise.reject('请输入密码')
              } else if (value.length < 4) {
                return Promise.reject('密码必须大于等于4位')
              } else if (value.length > 12) {
                return Promise.reject('密码必须小于等于12位')
              } else if (!(/^\w+$/).test(value)) {
                return Promise.reject('密码必须是字母数字下划线组成')
              } else {
                return Promise.resolve()
              }

            }
          }
        ]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" style={{ opacity: 0.3 }} />}
          type="password"
          placeholder="密码"
        />
      </Item>
      <Item>
        <Button type="primary" htmlType="submit" className="login-form-button" block>
          登录
                </Button>
      </Item>
    </Form>
  );
};
class Login extends Component {
  componentDidMount() {
    console.log(this.props);

  }
  render() {
    let { test } = this.props

    return (
      <div className='login' >
        <header>
          <img src={logo} alt="logo" />
          <h1>后台管理系统 {test}</h1>
        </header>
        <section>
          <h1>用户登录</h1>
          <NormalLoginForm />
        </section>
      </div>
    )
  }

}
export default connect(
  (state) => ({ test: state.test }),
  {
    peiqi: demo1,
    qiaozhi: demo2
  }
)(Login)

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