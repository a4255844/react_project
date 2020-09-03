import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { createDeleteUserInfoAction } from '../../redux/actions/login_action';
// 使用装饰器来处理高阶组件
@connect(
  state => ({ userInfo: state.userInfo }),
  {
    deleteUserInfo: createDeleteUserInfoAction
  }
)
class Admin extends Component {
  componentDidMount() {
    console.log(this.props);

  }
  logout = () => {
    this.props.deleteUserInfo()
  }
  render() {
    let { isLogin, user } = this.props.userInfo
    if (isLogin) {
      return (
        <div>
          <div>登陆成功，欢迎{user.username}</div>
          <button onClick={this.logout}>退出登录</button>
        </div>
      )
    } else {
      return <Redirect to="/login" />
    }


  }
}
export default Admin

// export default connect(
//   state => ({ userInfo: state.userInfo }),
//   {
//     deleteUserInfo: createDeleteUserInfoAction
//   }
// )(Admin)