import jsonp from 'jsonp';
import { message } from 'antd';
import myAxios from './myAxios'
import { BASE_URL, CITY, WEATHER_AK } from '../config';
// 如果后端服务器没有配置接收json格式的数据，需要自己转换，用到queryString库
// 登录请求
export const reqLogin = loginObj => myAxios.post(`${BASE_URL}/login`, loginObj)
// 获取商品分类的请求
export const reqCategoryList = () => myAxios.get(`${BASE_URL}/manage/category/list`)
// 请求天气接口，此接口支持使用jsonp解决跨域问题
// 请求jsonp的回调函数返回值需要传递给它外层的函数，此时需要使用promise解决
export const reqWeather = () => {
   return new Promise((resolve, reject) => {
      jsonp(`http://api.map.baidu.com/telematics/v3/weather?location=${CITY}&output=json&ak=${WEATHER_AK}`, (err, data) => {
         if (err) {
            // 如果失败，提示用户，并中断promise链
            message.error('请求天气接口出错，请联系管理员！')
            return new Promise(() => { })
         } else {
            //如果成功调用resolve
            const { dayPictureUrl, temperature, weather } = data.results[0].weather_data[0]
            const weatherObj = { dayPictureUrl, temperature, weather }
            resolve(weatherObj)
         }
      })
   })
}
// 新增商品分类的请求
export const reqAddCategory = (categoryName) => myAxios.post(`${BASE_URL}/manage/category/add`, { categoryName })
// 修改商品分类的请求
export const reqUpdateCategory = (updateObj) => myAxios.post(`${BASE_URL}/manage/category/update`, { ...updateObj })
// 获取商品列表
export const reqProductList = (pageNum, pageSize) => myAxios.get(`${BASE_URL}/manage/product/list`, { params: { pageNum, pageSize } })
// 更新商品状态的请求
export const reqUpdateProdStatus = (itemObj) => myAxios.post(`${BASE_URL}/manage/product/updateStatus`, { ...itemObj })
// 获取搜索商品列表
export const reqSearchList = (pageNum, pageSize, searchType, keyword) => myAxios.get(`${BASE_URL}/manage/product/search`, { params: { pageNum, pageSize, [searchType]: keyword } })

// 根据商品ID获取商品
export const reqProductById = (productId) => myAxios.get(`${BASE_URL}/manage/product/info`, { params: { productId } })
// 根据图片名称删除图片
export const reqDelectImg = (name) => myAxios.post(`${BASE_URL}/manage/img/delete`, { name })
//添加商品的请求
export const reqAddProduct = (values) => myAxios.post(`${BASE_URL}/manage/product/add`, { ...values })
//  更新商品的请求
export const reqUpdateProduct = (values) => myAxios.post(`${BASE_URL}/manage/product/update`, { ...values })
// 添加角色的请求
export const reqAddRole = (roleName) => myAxios.post(`${BASE_URL}/manage/role/add`, { roleName })
// 获取角色列表
export const reqGetRoleList = () => myAxios.get(`${BASE_URL}/manage/role/list`)
// 更新角色权限的请求
export const reqUpdateRole = (updateRoleObj) => myAxios.post(`${BASE_URL}/manage/role/update`, { ...updateRoleObj, auth_time: Date.now() })
// 添加用户的请求
export const reqAddUser = (userObj) => myAxios.post(`${BASE_URL}/manage/user/add`, { ...userObj })
// 获取用户列表
export const reqGetUserList = () => myAxios.get(`${BASE_URL}/manage/user/list`)
// 更新用户
export const reqUpdateUser = (userObj) => myAxios.post(`${BASE_URL}/manage/user/update`, { ...userObj })
// 删除用户
export const reqDeleteUser = (userId) => myAxios.post(`${BASE_URL}/manage/user/delete`, { userId })
