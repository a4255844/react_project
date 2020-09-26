import React, { Component } from 'react'
import { Card, Button, Form, Input, Select, message } from 'antd';
import {
   ArrowLeftOutlined
} from '@ant-design/icons';
import { connect } from 'react-redux'
import { reqCategoryList, reqAddProduct, reqProductById, reqUpdateProduct } from '@/api';
import PicturesWall from './PicturesWall'
import RichTextEditor from './rich_text_editor'
const { Item } = Form
const { Option } = Select;
@connect(
   state => ({
      getCategory: state.saveCategoryList,
      getProduct: state.saveProductList
   }),
   {}
)
class AddUpdate extends Component {
   state = {
      categoryList: [],
      operaType: 'add'
   }
   componentDidMount() {
      const { getCategory, getProduct } = this.props
      const { id } = this.props.match.params
      // 如果执行下面的判断则为修改页面，如果getProduct内有数据，找到对应的商品信息放入状态
      if (id) {
         if (getProduct.length) {
            let result = getProduct.find(item => id === item._id)
            this.setState({ operaType: 'update' })
            this.echoData(result) //回显数据
         }
         else this.getProductById(id) //如果没有就发请求获取
         // 如果getCategory内有数据
         if (getCategory.length) this.setState({ categoryList: getCategory })
         else this.getCategoryList() //如果没有就发请求获取
      } else {  //此分支为新增页面
         // 如果getCategory内有数据
         if (getCategory.length) this.setState({ categoryList: getCategory })
         else this.getCategoryList() //如果没有就发请求获取
      }
   }
   //修改商品回显数据
   echoData = (data) => {
      const { name, desc, price, categoryId, imgs, detail } = data
      // 通过form实例的方法修改字符串，数值，类型的数据
      this.refs.productForm.setFieldsValue({ name, desc, price, categoryId })
      // 通过组件方法回显数据图片和富文本编辑器
      this.PicturesWall.setFileList(imgs)
      this.refs.RichTextEditor.setRichText(detail)
   }
   // 请求商品分类列表
   getCategoryList = async () => {
      let result = await reqCategoryList()
      const { data, status } = result
      if (status === 0) this.setState({ categoryList: data })
   }
   // 根据id获取商品
   getProductById = async (id) => {
      const result = await reqProductById(id)
      const { data, status } = result
      if (status === 0) {
         this.setState({ operaType: 'update' })
         this.echoData(data) //回显数据
      }
   }
   // 表单提交的回调
   onFinish = async (values) => {
      // 从PicturesWall中获取图片名字的数组
      console.log(values);
      const { id } = this.props.match.params
      console.log(id);
      values.imgs = this.PicturesWall.imagesArr()
      //从richTextEditor中获取用户输入的富文本内容
      values.detail = this.refs.RichTextEditor.getRichText()
      let result
      if (id) result = await reqUpdateProduct({ ...values, _id: id }) //更新商品的请求
      else result = await reqAddProduct(values) //新增商品的请求
      const { status, msg } = result
      if (status === 0) {
         message.success(this.state.operaType === 'add' ? '添加商品成功' : '修改商品成功')
         this.props.history.replace("/admin/prod_about/product")
      } else message.error(msg)
   }
   render() {
      const { operaType } = this.state
      return (
         <div>
            <Card title={
               <div>
                  <Button
                     size='small'
                     type='link'
                     icon={<ArrowLeftOutlined />}
                     onClick={() => this.props.history.goBack()}
                  >
                  </Button>
                  <span>{operaType === 'add' ? '添加商品' : '修改商品'}</span>
               </div>
            }>
               <Form
                  initialValues={{ categoryId: '' }}
                  onFinish={this.onFinish}
                  size='middle'
                  ref="productForm"
               >
                  <Item
                     label="商品名称"
                     name="name"
                     // 声明校验器内容
                     rules={[
                        { required: true, message: '商品名称必须输入!', }
                     ]}
                     wrapperCol={{ md: 8 }} //设置响应式栅格，输入控件
                  >
                     <Input placeholder="请输入商品名称" style={{ borderRadius: 5 + 'px' }}></Input>
                  </Item>
                  <Item
                     label="商品描述"
                     name="desc"
                     // 声明校验器内容
                     rules={[
                        { required: true, message: '商品描述必须输入!', }
                     ]}
                     wrapperCol={{ md: 8 }} //设置响应式栅格，输入控件
                  >
                     <Input placeholder="请输入商品描述" style={{ borderRadius: 5 + 'px' }}></Input>
                  </Item>
                  <Item
                     label="商品价格"
                     name="price"
                     // 声明校验器内容
                     rules={[
                        { required: true, message: '商品价格必须输入!', }
                     ]}
                     wrapperCol={{ md: 8 }} //设置响应式栅格，输入控件
                  >
                     <Input
                        placeholder="请输入商品价格"
                        style={{ borderRadius: 5 + 'px' }}
                        prefix="￥"
                        addonAfter="元"
                        type='number'
                     />
                  </Item>
                  <Item
                     label="商品分类"
                     name="categoryId"
                     // 声明校验器内容
                     rules={[
                        { required: true, message: '必须选择一个分类' }
                     ]}
                     wrapperCol={{ md: 8 }} //设置响应式栅格，输入控件
                  >
                     <Select style={{ borderRadius: 5 + 'px' }}>
                        <Option value=''>请选择分类</Option>
                        {
                           this.state.categoryList.map((item) => {
                              return <Option key={item._id} value={item._id}>{item.name}</Option>
                           })
                        }
                     </Select>
                  </Item>
                  <Item
                     name="imgs"
                     label="商品图片"
                     wrapperCol={{ md: 12 }}
                     style={{ marginLeft: "12px" }}
                  >
                     <PicturesWall ref={PicturesWall => this.PicturesWall = PicturesWall} />
                  </Item>
                  <Item
                     label="商品详情"
                     wrapperCol={{ md: 18 }} //设置响应式栅格，输入控件
                     style={{ marginLeft: "12px" }}
                  >
                     <RichTextEditor ref="RichTextEditor" />
                  </Item>
                  <Button type="primary" htmlType="submit">
                     提交
                  </Button>
               </Form>
            </Card>
         </div>
      )
   }
}
export default AddUpdate