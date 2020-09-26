import React, { Component } from 'react'
import { Card, Button, List, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { reqProductById, reqCategoryList } from '@/api'
import './detail.less';
const { Item } = List
@connect(
   state => ({
      productList: state.saveProductList,
      categoryList: state.saveCategoryList
   }),
)
class Detail extends Component {
   state = {
      categoryId: '',
      desc: '',
      detail: '',
      imgs: [],
      name: '',
      price: '',
      categoryName: '',
      isLoading: true
   }
   componentDidMount() {
      const productListArr = this.props.productList
      const categoryListArr = this.props.categoryList
      if (productListArr.length) {
         // 判断，如果存在currentProduct,就把它解构并放入状态
         const currentProduct = productListArr.find(item => item._id === this.props.match.params.id)
         if (currentProduct) {
            // this.setState方法是异步执行的，所以我们无法在同一个函数内获取当前保存在状态内的数据
            this.categoryId = currentProduct.categoryId //取出categordId放到this内
            this.setState({ ...currentProduct })
         }
      } else this.getProductById() //直接刷新页面，需要重新请求数据
      // 从redux中取出商品分类列表的id,进行对比，如果和当前商品一致，则把商品分类的名字存入状态
      if (categoryListArr.length) {
         const currentCategory = categoryListArr.find(item => item._id === this.categoryId)
         const { name } = currentCategory
         if (currentCategory) this.setState({ categoryName: name, isLoading: false })
      } else this.reqCategoryList() //直接刷新页面，需要重新请求数据
   }
   //根据商品id请求商品列表
   getProductById = async () => {
      let result = await reqProductById(this.props.match.params.id)
      const { status, data, msg } = result
      if (status === 0) this.setState({ ...data })
      else message.error(msg, 2)
   }
   // 请求获取商品分类列表
   reqCategoryList = async () => {
      let result = await reqCategoryList()
      const { status, data, msg } = result;
      if (status === 0) {
         let result = data.find(item => item._id === this.state.categoryId)
         if (result) this.setState({ categoryName: result.name, isLoading: false })
         else message.error(msg, 2)
      }
   }
   render() {
      return (
         <Card
            title={
               <div>
                  <Button
                     size='small'
                     type='link'
                     icon={<ArrowLeftOutlined />}
                     onClick={() => { this.props.history.goBack() }}
                  />
                  <span>商品详情</span>
               </div>
            }
            loading={this.state.isLoading}
         >
            <List >
               <Item className="list-item">
                  <span className="item-left">商品名称：</span>
                  <span>{this.state.name}</span>
               </Item>
               <Item className="list-item">
                  <span className="item-left">商品描述：</span>
                  <span> {this.state.desc}</span>
               </Item>
               <Item className="list-item">
                  <span className="item-left">商品价格：</span>
                  <span>{this.state.price + '元'}</span>
               </Item>
               <Item className="list-item">
                  <span className="item-left">所属分类：</span>
                  <span>{this.state.categoryName}</span>
               </Item>
               <Item className="list-item">
                  <span className="item-left">商品图片：</span>
                  {
                     this.state.imgs.map((item, index) => {
                        return <img key={index} src={'/upload/' + item} alt="商品图片" />
                     })
                  }
               </Item>
               <Item className="list-item">
                  <span className="item-left">商品详情：</span>
                  <span dangerouslySetInnerHTML={{ __html: this.state.detail }}></span>
               </Item>
            </List>
         </Card>
      )
   }
}
export default Detail