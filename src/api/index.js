import myAxios from './myAxios'
import { BASE_URL } from '../config';
// 如果后端服务器没有配置接收json格式的数据，需要自己转换，用到queryString库
export const reqLogin = (username, password) => myAxios.post(`${BASE_URL}/login`, { username, password })

