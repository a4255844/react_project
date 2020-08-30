import { INCREMENT, DECREMENT } from './action_types.js';
// 创建一个同步的action,用于加
export const creatIncrementAction = value => ({ type: INCREMENT, data: value });
// 创建一个同步的action，用于减
export const creatDecrementAction = value => ({ type: DECREMENT, data: value });
// 创建一个异步的action，用于1秒后加
export const creatIncrementAsyncAction = (value, delay) => {
  return dispatch => {
    setTimeout(() => {
      dispatch(creatIncrementAction(value))
    }, delay);
  }
}
/*
如果return的是一个对象，则表示为同步的action 对象的格式很固定
如果return的是一个函数，则表示为异步的action，函数的参数很固定是dispatch(用于派发)，
*/