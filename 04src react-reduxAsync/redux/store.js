// 从redux中引入createstore用于创建最核心的store对象
// 引入applyMiddleware用于执行异步的中间件
import { createStore, applyMiddleware } from 'redux';
// 引入手下reducer.js
import reducer from './reducer.js'
// 引入redux-thunk，由于执行异步redux
import thunk from 'redux-thunk';
// 引入redux-devtools-extension,用于使用redux调试工具
import { composeWithDevTools } from 'redux-devtools-extension';
export default createStore(reducer, composeWithDevTools(applyMiddleware(thunk))) //应用异步中间件