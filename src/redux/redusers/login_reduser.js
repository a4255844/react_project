import { SAVE_USER_INFO, DELETE_USER_INFO } from '../action_types'
// 刷新浏览器初始化状态前，先读取localStorage内的数据
let user = JSON.parse(localStorage.getItem('user'));
let token = localStorage.getItem('token')
// 如果拿到localStorage的数据，则修改初始化状态,否则为默认值
const initState = {
  user: user || '',
  token: token || '',
  isLogin: user && token ? true : false
}
export default function operTest(preState = initState, action) {
  // console.log(action);
  const { type, data } = action;
  let newState;
  switch (type) {
    case SAVE_USER_INFO:
      newState = { user: data.user, token: data.token, isLogin: true }
      return newState;
    case DELETE_USER_INFO:
      newState = { user: '', token: '', isLogin: false }
      return newState;
    default:
      return preState
  }
}