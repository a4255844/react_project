import React, { Component } from 'react';
import { Card, Button, Table, Modal, Input, Form, message, Tree } from 'antd';
import dayjs from 'dayjs';
import { connect } from 'react-redux'
import { reqAddRole, reqGetRoleList, reqUpdateRole } from '@/api'
import treeArr from '@/config/tree_config'
const { Item } = Form
@connect(
   state => ({ userName: state.userInfo }),
   {}
)
class Role extends Component {
   state = {
      visibleAdd: false,  //控制新增角色弹窗
      visibleAuth: false, //控制授权弹窗
      roleList: [],     //角色列表
      currentRole: '',  //当前角色名
      currentRoleId: '', //当前角色_Id
      checkedKeys: [],   //选中的受控
      isLoading: true
   };
   // 页面挂载，展示所有角色类型
   componentDidMount() {
      this.getRoleList()
   }
   // 请求展示角色列表的方法
   getRoleList = async () => {
      const result = await reqGetRoleList()
      const { status, data, msg } = result
      if (status === 0) {
         this.setState({ roleList: data, isLoading: false })
      } else message.error(msg)
   }
   // 新增角色展示弹窗
   showAddModal = () => {
      this.setState({
         visibleAdd: true,
      });
   };
   //------------------------------新增角色弹窗区域start
   //   点击新增角色确认的回调
   handleAddOk = async () => {
      let { roleName } = this.roleForm.getFieldValue() //从form实例上获取值
      const result = await reqAddRole(roleName)
      const { status, msg } = result
      if (status === 0) {
         message.success('添加角色成功!')
         this.setState({
            visibleAdd: false,
         });
         this.roleForm.resetFields()
         this.getRoleList()
      }
      else message.error(msg)

   };
   //   点击新增角色取消的回调
   handleAddCancel = () => {
      this.setState({
         visibleAdd: false,
      });
   };
   //--------------------------------新增角色end
   //---------------------------授权弹窗start
   //展示授权弹窗
   showAuthModal = (currenRole) => {
      // 回显数据，遍历找到对应的数据
      const { roleList } = this.state
      let result = roleList.find(item => currenRole._id === item._id)
      if (result) this.setState({ checkedKeys: result.menus }) //放入状态
      this.setState({
         visibleAuth: true,
         currentRole: currenRole.name,
         currentRoleId: currenRole._id
      });
   };
   // 授权弹窗确认的回调，发送请求修改角色权限
   handleAuthOk = async () => {
      const { checkedKeys, currentRoleId } = this.state
      if (checkedKeys.indexOf('home') === -1) checkedKeys.push('home') //默认追加首页给所有角色
      const { username } = this.props.userName.user
      const result = await reqUpdateRole({ _id: currentRoleId, menus: checkedKeys, auth_name: username })
      const { status, msg } = result
      if (status === 0) {
         message.success('授权成功！')
         this.getRoleList()
         this.setState({
            visibleAuth: false,
         });
      }
      else message.error(msg)
   };
   //   授权弹窗取消的回调
   handleAuthCancel = () => {
      this.setState({
         visibleAuth: false,
      });
   };
   //---------------------------授权弹窗end
   //---------------------------树形菜单start
   onCheck = (checkedKeys) => {
      console.log('onCheck', checkedKeys);
      this.setState({ checkedKeys })
   };
   //---------------------------树形菜单end

   render() {
      const dataSource = this.state.roleList
      const columns = [
         {
            title: '角色名称',
            dataIndex: 'name',
            key: 'name',
            width: '15%',
         },
         {
            title: '创建时间',
            dataIndex: 'create_time',
            key: 'create_time',
            width: "25%",
            render: item => dayjs(item).format('YYYY年MM月DD日 HH:mm:ss')
         },
         {
            title: '授权时间',
            dataIndex: 'auth_time',
            key: 'auth_time',
            width: "25%",
            render: item => item ? dayjs(item).format('YYYY年MM月DD日 HH:mm:ss') : ''
         },
         {
            title: '授权人',
            dataIndex: 'auth_name',
            key: 'auth_name',
         },
         {
            title: '操作',
            render: currenRole => <Button type="link" onClick={() => this.showAuthModal(currenRole)}>设置权限</Button>
         },

      ];
      return (
         <div>
            <Card title={<Button
               type="primary"
               onClick={this.showAddModal}
            >
               添加角色
            </Button>}
            >
               <Table
                  dataSource={dataSource}
                  columns={columns}
                  bordered
                  rowKey='_id'
                  loading={this.state.isLoading}
               >

               </Table>
            </Card>
            <Modal
               title="添加角色"
               visible={this.state.visibleAdd}
               onOk={this.handleAddOk}
               onCancel={this.handleAddCancel}
               okText="确定"
               cancelText="取消"
            >
               <Form
                  ref={Form => this.roleForm = Form}
               >
                  <Item
                     label="角色名称"
                     name="roleName"
                     rules={[{ required: true, message: '角色名称必须输入！' }]}
                  >
                     <Input />
                  </Item>
               </Form>
            </Modal>
            <Modal
               title={`设置角色权限--->` + this.state.currentRole}
               visible={this.state.visibleAuth}
               onOk={this.handleAuthOk}
               onCancel={this.handleAuthCancel}
               okText="确定"
               cancelText="取消"
            >
               <Tree
                  checkable  //菜单可勾选
                  onCheck={this.onCheck}  //勾选某个菜单的回调
                  checkedKeys={this.state.checkedKeys} //用于收集树形组件中所有勾选的key，值为数组
                  treeData={treeArr}  //菜单数据源
                  defaultExpandAll={true}//默认展开所有树节点
               />
            </Modal>
         </div >
      )

   }
}
export default Role