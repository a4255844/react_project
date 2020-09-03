import { combineReducers } from 'redux';
import loginRetuser from './login_reduser';
export default combineReducers({
  userInfo: loginRetuser
})