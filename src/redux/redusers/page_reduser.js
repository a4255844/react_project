import { SAVE_CURRENTPAGE, SAVE_IS_SEARCH } from '../action_types'
const initPageState = 1
export function operPage(preState = initPageState, action) {
   // console.log(action);
   const { type, data } = action;
   let newState;
   switch (type) {
      case SAVE_CURRENTPAGE:
         newState = data
         return newState;
      default:
         return preState
   }
}
const initIsSearch = ''
export function operIsSearch(preState = initIsSearch, action) {
   // console.log(action);
   const { type, data } = action;
   let newState;
   switch (type) {
      case SAVE_IS_SEARCH:
         newState = data
         return newState;
      default:
         return preState
   }
}


