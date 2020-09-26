import React, { Component } from 'react'
import { Menu } from 'antd';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import menuList from '../../../config/menu-config'
import logo from '../../../static/images/logo.png';
import { createSaveTitleAction } from '../../../redux/actions/menu_action'
import './css/leftNav.less'

const { SubMenu, Item } = Menu;
@connect(
   state => ({ currentUser: state.userInfo }),
   {
      saveTitle: createSaveTitleAction  //单击菜单喊话保存当前菜单的title
   }
)
@withRouter
class LeftNav extends Component {

   // 创建菜单的方法，递归实现
   createMenu = (target) => {
      return (
         target.map(item => {
            if (this.hasAuth(item)) {  //调用遍历用户权限的方法
               if (!item.children) {
                  return (
                     <Item key={item.key} icon={item.icon} onClick={() => { this.props.saveTitle(item.title) }}>
                        <Link to={item.path}>
                           {item.title}
                        </Link>
                     </Item>
                  )
               } else {
                  return (
                     <SubMenu key={item.key} icon={item.icon} title={item.title}>
                        {this.createMenu(item.children)}
                     </SubMenu>
                  )
               }
            }
         })
      )
   }
   // 遍历当前用户的浏览权限
   hasAuth = (item) => {
      const { username, role } = this.props.currentUser.user
      if (username === 'admin') return true
      else if (item.children) return item.children.some(item2 => role.menus.indexOf(item2.key) !== -1)
      else if (!item.children) return role.menus.find(item3 => item.key === item3)
   }
   render() {
      console.log('leftNav---render');

      // 取出当前选中菜单项的key的路径
      let pathArr = this.props.location.pathname.split('/')
      return (
         <div>
            <header className='leftNav-header'>
               <img src={logo} alt="logo" />
               <h1>后台管理系统</h1>
            </header>
            <Menu
               // 设置当前选中项key为默认选中项，刷新丢失
               selectedKeys={pathArr.indexOf('product') !== -1 ? 'product' : pathArr[pathArr.length - 1]}
               //设置父级内子项被选中默认打开
               defaultOpenKeys={pathArr.splice(2)}
               mode="inline"
               theme="dark"
            >
               {
                  this.createMenu(menuList)
               }



            </Menu>
         </div>
      )
   }
}
export default LeftNav
