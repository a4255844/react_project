import axios from 'axios';
import { message } from 'antd';
import NProgress from 'nprogress';
import qs from 'querystring';
import 'nprogress/nprogress.css';
import store from '../redux/store';
import { createDeleteUserInfoAction } from '../redux/actions/login_action';
// 设置响应超时时间
const instance = axios.create({
  timeout: 4000
});
// 请求拦截器
instance.interceptors.request.use(config => {
  // 请求进度条特效开始
  NProgress.start()
  console.log(config);
  // 从保存的用户状态中获取token,如果有token则为请求加上请求头，参考API文档内的方法
  // 如果不加token可能会报错401没有权限
  let { token } = store.getState().userInfo;
  if (token) config.headers.Authorization = 'atguigu_' + token;

  let { method, data } = config;
  // 若是post请求
  if (method.toLowerCase() === 'post') {
    // 若传递过来的参数是对象
    if (data instanceof Object) {
      config.data = qs.stringify(data)
    }
  }
  return config
})
// 响应拦截器
instance.interceptors.response.use(
  // 若成功，走这里
  response => {
    // 请求进度条特效结束终止
    NProgress.done()
    return response.data
  },
  // 若失败走这里
  error => {
    // 请求进度条特效结束终止
    NProgress.done()

    console.log(error.response.status);

    if (error.response.status === 401) {
      store.dispatch(createDeleteUserInfoAction())

    }
    message.error(error.message, 1)

    // 失败后中断promise链
    return new Promise(() => { })
  }
)


export default instance