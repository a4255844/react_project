import { combineReducers } from 'redux';
import loginRetuser from './login_reduser';
import menuReduser from './menu_reduser';
import operProductList from './product_reduser';
import { operIsSearch, operPage } from './page_reduser';
import categoryReduser from "./category_reduser";
export default combineReducers({
   userInfo: loginRetuser,
   title: menuReduser,
   saveProductList: operProductList,
   saveCategoryList: categoryReduser,
   saveCurrentPage: operPage,
   saveIsSearch: operIsSearch
})