import React from 'react';
import {
   HomeOutlined,
   AppstoreOutlined,
   UnorderedListOutlined,
   ToolOutlined,
   UserOutlined,
   SafetyOutlined,
   AreaChartOutlined,
   BarChartOutlined,
   LineChartOutlined,
   PieChartOutlined
} from '@ant-design/icons';
// 侧边栏导航数据结构
export default [
   {
      key: 'home',            //对应path
      icon: <HomeOutlined />,  //对应小图标
      title: '首页',             //对应标题
      path: '/admin/home'    //对应路径
   },
   {
      key: 'prod_about',
      icon: <AppstoreOutlined />,
      title: '商品',
      children: [
         {
            key: 'category',
            icon: <UnorderedListOutlined />,
            title: '分类管理',
            path: '/admin/prod_about/category'
         }, {
            key: 'product',
            icon: <ToolOutlined />,
            title: '商品管理',
            path: '/admin/prod_about/product'
         }
      ]
   }, {
      key: 'user',
      icon: <UserOutlined />,
      title: '用户管理',
      path: '/admin/user'
   }, {
      key: 'role',
      icon: <SafetyOutlined />,
      title: '角色管理',
      path: '/admin/role'
   }, {
      key: 'charts',
      icon: <AreaChartOutlined />,
      title: '图形图表',
      children: [
         {
            key: 'bar',
            icon: <BarChartOutlined />,
            title: '柱状图',
            path: '/admin/charts/bar'
         }, {
            key: 'line',
            icon: <LineChartOutlined />,
            title: '折线图',
            path: '/admin/charts/line'
         }, {
            key: 'pie',
            icon: <PieChartOutlined />,
            title: '饼图',
            path: '/admin/charts/pie'
         }
      ]
   }

]