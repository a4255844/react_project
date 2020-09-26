import React, { Component } from 'react';
import { Card, Button, Table, message, Modal, Input, Form } from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import { connect } from 'react-redux'
import { PAGE_SIZE } from '../../config'
import { createSaveCategoryAction } from "@/redux/actions/category_action";
import { reqAddCategory, reqCategoryList, reqUpdateCategory } from '@/api'
const { Item } = Form
@connect(
   state => ({}),
   { saveCateList: createSaveCategoryAction }
)
class Category extends Component {
   formRef = React.createRef();
   state = {
      categoryName: [],  //商品分类列表
      visible: false,     //控制弹窗展示或者隐藏
      operType: '',      //操作类型（新增？修改）
      isLoading: true,   //控制isLoading是否展示
      currentItem: ''    //当前选中的目标放入状态
   }
   componentDidMount() {
      this.getCategoryList()
   }

   // 请求获取商品列表
   getCategoryList = async () => {
      let { status, data, err } = await reqCategoryList()
      if (status === 0) {
         this.setState({ categoryName: data.reverse(), isLoading: false })
         this.props.saveCateList(data)
      }
      else message.error(err)
   }

   // 用于展示新增弹窗
   // showAdd = () => {
   //    this.setState({
   //       visible: true,
   //       operType: 'add',
   //       currentName: ''
   //    });
   // };
   // // 用于展示修改弹窗
   // showUpdate = (categoryObj) => {
   //    const { name } = categoryObj; //实时的值在这里取
   //    this.setState({
   //       currentItem: categoryObj,
   //       visible: true,
   //       operType: 'update'
   //    });
   //    //弹窗非第一次展示，设置表单默认值（第一次靠initialValues）
   //    if (this.formRef.current) this.formRef.current.setFieldsValue({ categoryName: name })
   //    // this.formRef.initialValues = { name: this.state.currentItem.name }
   // };

   // 新增分类和修改分类共用一个展示窗口
   showModal = (categoryObj) => {
      // 点击按钮，尝试获取目标
      let { _id, name } = categoryObj
      // 判断是否为修改，如果拿到即为修改
      if (_id && name) {
         this.setState({
            currentItem: categoryObj,
            visible: true,
            operType: 'update'
         });
      } else {  //不是修改就是新增
         this.setState({
            visible: true,
            operType: 'add',
            currentName: ''
         });
      }
      //弹窗非第一次展示，设置表单默认值（第一次靠initialValues）
      if (this.formRef.current) this.formRef.current.setFieldsValue({ categoryName: name })

   }

   // 点击ok的弹窗回调
   handleOk = () => {
      // 获取Form实例的获取值的方法
      const { getFieldsValue } = this.formRef.current
      // 拿到返回值，返回值为当前input框内输入的值
      let { categoryName } = getFieldsValue()
      console.log(categoryName);
      // 校验数据
      if (!categoryName || !categoryName.trim()) message.error('分类不能为空', 1)  //数据不合法  
      else {            //数据合法
         //   如果是新增商品分类
         if (this.state.operType === 'add') this.addCategory(categoryName)  //调用新增商品分类的方法，发请求
         // 如果是修改商品分类
         if (this.state.operType === 'update') {
            // 获取当前状态内对应的_id，通过_id修改商品分类
            let { _id } = this.state.currentItem
            // 封装数据为对象，对象的key参考API文档而定
            const updateObj = { categoryId: _id, categoryName }
            this.updateCategory(updateObj)  //调用修改商品分类的方法，发请求
         }
      }
   }
   // 取消弹窗的回调
   handleCancel = () => {
      this.setState({
         visible: false,
      });
      // 重置表单域
      this.formRef.current.resetFields()

   };
   // 请求新增商品列表
   addCategory = async (categoryName) => {
      let result = await reqAddCategory(categoryName)
      const { status, data, msg } = result;
      if (status === 0) {
         message.success('添加商品分类成功', 1)
         // 成功获取原状态，并添加数据到原状态内
         let categoryName = [...this.state.categoryName] //注意复杂数据类型不能直接修改，需要深度拷贝后在添加
         categoryName.unshift(data)
         // 请求完全成功后，修改状态展示最新的分类列表 和隐藏窗口
         this.setState({ categoryName, visible: false })
         this.formRef.current.resetFields() //重置表单
      }
      if (status === 1) {
         message.error(msg, 1)
      }

   }
   updateCategory = async (updateObj) => {
      const result = await reqUpdateCategory(updateObj)
      const { status, msg } = result
      if (status === 0) {
         message.success('修改分类成功！', 1)
         this.getCategoryList()
         this.setState({
            visible: false,
         })

      }
      if (status === 1) message.error(msg, 1)
   }
   render() {
      // const { categoryName } = this.state
      const { operType, visible } = this.state
      const columns = [
         {
            title: '分类名称',
            dataIndex: 'name',  //数据索引项控制该列展示的信息
            key: '1'      //不是一个必要的属性，写上效率高
         },
         {
            title: '操作',
            // dataIndex: 'name',
            // key: '1',
            render: (categoryObj) => <Button onClick={() => this.showModal(categoryObj)} type="link">修改分类</Button>,
            width: '25%',
            align: 'center'
         },
      ];
      const data = this.state.categoryName
      return (
         < div >
            <Card extra={<Button icon={<PlusOutlined />} type='primary' onClick={this.showModal}> 增加</Button>}  >
               <Table
                  columns={columns}
                  dataSource={data}
                  bordered
                  rowKey="_id"
                  pagination={{
                     pageSize: PAGE_SIZE,
                     showQuickJumper: true
                  }}
                  loading={this.state.isLoading}
               />
            </Card>
            <Modal
               title={operType === 'add' ? '新增分类' : '修改分类'}
               visible={visible}
               onOk={this.handleOk}
               onCancel={this.handleCancel}
            >
               <Form ref={this.formRef} initialValues={{ categoryName: this.state.currentItem.name }} >
                  <Item
                     name="categoryName"
                     // 声明校验用户名
                     rules={[
                        { required: true, message: '请输入商品分类!', }
                     ]}
                  >
                     <Input placeholder="请输入分类名称" style={{ borderRadius: 5 + 'px' }}></Input>
                  </Item>
               </Form>
            </Modal>
         </div >
      )


   }
}
export default Category