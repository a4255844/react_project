import { SAVE_CURRENTPAGE, SAVE_IS_SEARCH } from '../action_types'
export const createSaveCurrentPageAction = (value) => {
   return { type: SAVE_CURRENTPAGE, data: value }
}
export const createSaveIsSearchAction = (value) => {
   return { type: SAVE_IS_SEARCH, data: value }
}