import { SAVE_USER_INFO, DELETE_USER_INFO } from '../action_types'
// 保存用户登录信息的action到localStorage
export const createSaveUserInfoAction = (value) => {
  localStorage.setItem('user', JSON.stringify(value.user))
  localStorage.setItem('token', value.token)
  return { type: SAVE_USER_INFO, data: value }
}
// 用户登录信息的action从localStorage中删除
export const createDeleteUserInfoAction = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token')
  return { type: DELETE_USER_INFO }
}