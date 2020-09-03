import { combineReducers } from 'redux';
import loginRetuser from './login_reduser';
import menuReduser from './menu_reduser'
export default combineReducers({
   userInfo: loginRetuser,
   title: menuReduser
})