import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Layout } from 'antd';
import { connect } from 'react-redux';
import { createDeleteUserInfoAction } from '../../redux/actions/login_action';
// import { reqCategoryList } from '../../api'
import Home from '../../components/home/home';
import Bar from '../bar/bar'
import Category from '../category/category'
import Line from '../line/line'
import Pie from '../pie/pie'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import './css/admin.less';
import Header from './header/header';
const { Footer, Sider, Content } = Layout;
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

    let { isLogin } = this.props.userInfo
    if (isLogin) {
      return (
        <Layout className='admin'>
          <Sider>Sider</Sider>
          <Layout>
            <Header />
            <Content className='content'>
              <Switch>
                <Route path="/admin/home" component={Home} />
                <Route path="/admin/prod_about/category" component={Category} />
                <Route path="/admin/prod_about/product" component={Product} />
                <Route path="/admin/user" component={User} />
                <Route path="/admin/role" component={Role} />
                <Route path="/admin/charts/bar" component={Bar} />
                <Route path="/admin/charts/line" component={Line} />
                <Route path="/admin/charts/pie" component={Pie} />
              </Switch>
            </Content>
            <Footer className="footer">
              推荐使用谷歌浏览器，获得更佳的页面操作体验
            </Footer>
          </Layout>
        </Layout>
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