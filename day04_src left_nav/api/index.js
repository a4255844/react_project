import jsonp from 'jsonp';
import { message } from 'antd';
import myAxios from './myAxios'
import { BASE_URL, CITY, WEATHER_AK } from '../config';
// 如果后端服务器没有配置接收json格式的数据，需要自己转换，用到queryString库
// 登录请求
export const reqLogin = (username, password) => myAxios.post(`${BASE_URL}/login`, { username, password })
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
            new Promise(() => { })
         } else {
            //如果成功调用resolve
            const { dayPictureUrl, temperature, weather } = data.results[0].weather_data[0]
            const weatherObj = { dayPictureUrl, temperature, weather }
            resolve(weatherObj)
         }
      })
   })
}