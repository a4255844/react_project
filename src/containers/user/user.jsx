import { Card, Button, Table, Modal, Input, Form, message, Select } from 'antd';
import React, { Component } from 'react';
import dayjs from 'dayjs';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { reqAddUser, reqGetUserList, reqUpdateUser, reqDeleteUser } from '@/api'
const { Item } = Form
const { Option } = Select;
const { confirm } = Modal;
export default class User extends Component {
   state = {
      visible: false,
      roleList: [],
      userList: [],
      currentUser: '',
      isLoading: true
   }
   componentDidMount() {
      this.getUserList()

   }
   // 请求用户列表
   getUserList = async () => {
      const result = await reqGetUserList()
      const { data, status, msg } = result
      const { users, roles } = data
      if (status === 0) this.setState({ userList: users.reverse(), roleList: roles, isLoading: false })
      else message.error(msg)
   }
   // // 请求角色列表
   // getRoleList = async () => {
   //    const result = await reqGetRoleList()
   //    const { data, status, msg } = result
   //    if (status === 0) this.setState({ roleList: data })
   //    else message.error(msg)
   // }
   // 新增角色展示弹窗
   showModal = (item) => {
      //通过item._id 来判断是新增用户还是修改用户
      const { phone, username, email, role_id, _id } = item
      if (_id) { //如果有_id则回显表单的数据
         this.setState({ currentUser: item })
         this.user = item
         if (this.userForm) this.userForm.setFieldsValue({ phone, username, email, role_id })
      } else { //如果没有_id则清空表单
         this.userForm && this.userForm.resetFields()
         this.user = null
      }
      this.setState({
         visible: true,
      });
   };
   //------------------------------新增角色弹窗区域start
   //   点击新增角色确认的回调
   handleOk = async () => {
      let values = await this.userForm.validateFields() //验证表单
      if (values) {   //如果成功拿到结果，则发送请求
         const { currentUser } = this.state
         let result
         if (!currentUser._id) {
            result = await reqAddUser(values)
            let userList = [...this.state.userList]
            userList.unshift(result.data)
            this.setState({ userList })
         } else {
            result = await reqUpdateUser({ ...values, _id: currentUser._id })
            this.getUserList()
         }
         const { status, msg } = result
         if (status === 0) {
            message.success('操作成功')
            this.setState({
               visible: false,
               currentUser: ''
            })
         } else message.error(msg)
      }
   };
   //   新增角色&修改角色取消的回调
   handleCancel = () => {
      this.setState({
         currentUser: '',
         visible: false
      });
   };
   deleteUser = (item) => {
      confirm({
         title: `确定删除${item.username}吗?`,
         icon: <ExclamationCircleOutlined />,
         onOk: async () => {
            const result = await reqDeleteUser(item._id)
            const { status, msg } = result
            if (status === 0) {
               message.success('删除成功')
               this.getUserList()
            }
            else message(msg)
         },
      });

   }
   render() {
      const dataSource = this.state.userList
      const columns = [
         {
            title: '姓名',
            dataIndex: 'username',
            key: 'username',
            width: '10%'
         },
         {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email',
            width: '20%'
         },
         {
            title: '电话',
            dataIndex: 'phone',
            key: 'phone',
            width: '15%'
         },
         {
            title: '注册时间',
            dataIndex: 'create_time',
            key: 'create_time',
            width: '20%',
            render: create_time => dayjs(create_time).format('YYYY年MM月DD日 HH:mm:ss')
         },
         {
            title: '所属角色',
            dataIndex: 'role_id',
            key: 'role_id',
            width: '15%',
            render: (role_id) => {
               let result = this.state.roleList.find(item => role_id === item._id)
               // if (result) return result.name
               return result && result.name
            }
         },
         {
            title: '操作',
            align: 'center',
            key: 'action',
            render: (item) => {
               return (
                  <div>
                     <Button type="link" onClick={() => this.showModal(item)}>修改</Button>
                     <Button type="link" onClick={() => this.deleteUser(item)}>删除</Button>
                  </div>
               )
            }
         },

      ];
      const { phone, username, email, role_id, _id } = this.state.currentUser
      return (
         <div>
            <Card title={<Button
               type="primary"
               onClick={this.showModal}
            >
               创建用户
            </Button>}
            >
               <Table
                  dataSource={dataSource}
                  columns={columns}
                  bordered
                  rowKey='_id'
                  loading={this.state.isLoading}
                  pagination={{
                     pageSize: 5,
                     showQuickJumper: true
                  }}
               >

               </Table>
            </Card>
            <Modal
               title={_id ? '修改用户' : '创建用户'}
               visible={this.state.visible}
               onOk={this.handleOk}
               onCancel={this.handleCancel}
               okText="确定"
               cancelText="取消"
            >
               <Form
                  ref={Form => this.userForm = Form}
                  labelAlign
                  initialValues={{ phone, username, email, role_id }}
                  labelCol={{ span: 4 }}
               >
                  <Item
                     label="用户名"
                     name="username"
                     rules={[{ required: true, message: '用户名必须输入！' }]}
                  >
                     <Input type="text" placeholder="用户名" />
                  </Item>
                  {
                     this.user ?
                        null :
                        <Item
                           label="密码"
                           name="password"
                           rules={[{ required: true, message: '密码必须输入！' }]}
                        >
                           <Input type="password" placeholder="密码" />
                        </Item>
                  }

                  <Item
                     label="手机号"
                     name="phone"
                     rules={[{ required: true, message: '手机号必须输入！' }]}
                  >
                     <Input type="text" placeholder="手机号" />
                  </Item>
                  <Item
                     label="邮箱"
                     name="email"
                     rules={[{ required: true, message: '邮箱必须输入！' }]}
                  >
                     <Input type="text" placeholder="邮箱" />
                  </Item>
                  <Item
                     label="角色"
                     name="role_id"
                     rules={[{ required: true, message: '必须选择一个角色！' }]}
                  >
                     <Select placeholder="请选择角色类型">
                        {
                           this.state.roleList.map(item => {
                              return <Option key={item._id}>{item.name}</Option>
                           })
                        }
                     </Select>
                  </Item>
               </Form>
            </Modal>
         </div >
      )
   }
}