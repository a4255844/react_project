import { Card, Button, Select, Input, Table, message } from 'antd';
import {
   PlusOutlined
} from '@ant-design/icons';
import { connect } from 'react-redux'
import React, { Component } from 'react';
import { reqProductList, reqUpdateProdStatus, reqSearchList } from '@/api';
import { PAGE_SIZE } from '@/config';
import { createSaveProductAction } from '@/redux/actions/product_action';
import { createSaveCurrentPageAction, createSaveIsSearchAction } from '@/redux/actions/page_action'
const { Option } = Select;
@connect(
   state => ({
      currentPage: state.saveCurrentPage,
      isSearch: state.saveIsSearch
   }),
   {
      saveProductList: createSaveProductAction,
      savecurrentPage: createSaveCurrentPageAction,
      saveIsSearch: createSaveIsSearchAction
   }
)
class Product extends Component {
   state = {
      productList: [],
      total: '',
      currentPage: '',
      keyword: '',
      searchType: 'productName',
      isLoading: true
   }
   // 组件挂在前，修改状态
   static getDerivedStateFromProps(props) {
      if (props.isSearch) {
         const { keyword, searchType } = props.isSearch
         return { keyword, searchType }
      } else return null;
   }
   // 组件挂载结束后，请求一次，默认请求第一页数据
   componentDidMount() {
      this.getProductList()
   }
   // 组件卸载时，保存当前页面值到redux,返回时页面会固定在当前页面
   componentWillUnmount() {
      const { currentPage, searchType, keyword } = this.state
      this.props.savecurrentPage(currentPage)
      this.props.saveIsSearch({ searchType, keyword })
   }
   // 请求商品列表和请求搜索的商品列表的判断逻辑写在一起,实现代码复用，而且会减少很多麻烦
   // 设置默认请求的页面，在redux内取
   getProductList = async (pageNum = this.props.currentPage) => {
      const { searchType, keyword } = this.state
      let result
      if (keyword || this.isSearch) {
         result = await reqSearchList(pageNum, PAGE_SIZE, searchType, keyword)
      }
      else result = await reqProductList(pageNum, PAGE_SIZE)
      const { data, status, msg } = result
      if (status === 0) {
         const { list, total, pageNum } = data
         this.setState({ productList: list, total, currentPage: pageNum, isLoading: false })
         this.props.saveProductList(this.state.productList)
      } else message.error(msg, 1)
   }
   // 更新商品状态
   updateProdStatus = async ({ _id, status }) => {
      status = status === 1 ? 2 : 1;
      const itemObj = { productId: _id, status };
      let result = await reqUpdateProdStatus(itemObj);
      if (result.status === 0) {
         message.success('更新状态成功！', 1);
         // this.getProductList()
         // 手动修改数据，减少与服务器的交互
         let productList = [...this.state.productList]
         productList = productList.map(item => {
            if (item._id === _id) item.status = status
            return item
         })
         this.setState({ productList })
      }
      else message.error('更新状态失败！', 1)
   }
   render() {
      const dataSource = this.state.productList
      const columns = [
         {
            title: '商品名称',
            dataIndex: 'name',
            key: 'name',
            width: '20%'
         },
         {
            title: '商品描述',
            dataIndex: 'desc',
            key: 'desc',
         },
         {
            title: '价格',
            dataIndex: 'price',
            key: 'price',
            align: 'center',
            width: '10%',
            render: dataIndex => '￥' + dataIndex
         },
         {
            title: '状态',
            // dataIndex: 'status',  //注释掉后，可以拿到整项数据结构
            key: 'status',
            align: 'center',
            width: '10%',
            render: item => {
               return (
                  <div>
                     <Button
                        type={item.status === 1 ? 'danger' : 'primary'}
                        onClick={() => this.updateProdStatus(item)}
                     >
                        {item.status === 1 ? '下架' : '上架'}
                     </Button> <br />
                     <span>{item.status === 1 ? '在售' : '已下架'}</span>
                  </div>
               )
            }
         },
         {
            title: '操作',
            // dataIndex: 'opera',
            key: 'opera',
            align: 'center',
            width: '10%',
            render: (item) => {
               return (
                  <div>
                     <Button type="link"
                        onClick={() => {
                           this.props.history.push(this.props.match.path + `/detail/${item._id}`)
                        }}>详情</Button> <br />
                     <Button
                        type="link"
                        onClick={() => this.props.history.push(this.props.match.path + `/add_update/${item._id}`)}
                     >修改</Button>
                  </div>
               )
            }

         },
      ];
      return (
         <div>
            <Card
               title={
                  <div>
                     <Select
                        onChange={value => this.setState({ searchType: value })}
                        defaultValue="productName"
                        style={{ width: 120 }}
                     >
                        <Option value="productName">按名称搜索</Option>
                        <Option value="productDesc">按描述搜索</Option>
                     </Select>
                     <Input
                        onChange={event => this.setState({ keyword: event.target.value })}
                        placeholder="请输入关键字"
                        style={{ margin: '0 10px', width: "25%" }}
                        allowClear
                     />
                     <Button type="primary"
                        onClick={() => {
                           this.isSearch = true;  //识别当前动作为搜索
                           this.getProductList()
                        }}
                     >搜索
                     </Button>
                  </div>
               }
               extra={
                  <Button
                     type="primary"
                     onClick={() => this.props.history.push(this.props.match.path + `/add_update`)}
                  >
                     <PlusOutlined />添加商品</Button>
               }
            >
               <Table
                  dataSource={dataSource}  //表格的数据源
                  columns={columns}       //表格列配置
                  bordered         //边框
                  pagination={{
                     current: this.state.currentPage,   //当前是第几页
                     pageSize: PAGE_SIZE,  //每页多大
                     total: this.state.total, //数据总数
                     onChange: this.getProductList  //页码改变的回调
                  }}
                  rowKey='_id' //指定唯一值对应项
                  loading={this.state.isLoading}
               />;
            </Card>
         </div>
      )


   }
}
export default Product