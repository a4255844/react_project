import { SAVE_PRODUCT_LIST } from '../action_types'
const initState = []
export default function operProductList(preState = initState, action) {
   // console.log(action);
   const { type, data } = action;
   let newState;
   switch (type) {
      case SAVE_PRODUCT_LIST:
         newState = [...data]
         return newState;
      default:
         return preState
   }
}
