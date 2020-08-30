// 从redux中引入createstore用于创建最核心的store对象
// 引入applyMiddleware用于执行异步的中间件
import { createStore, applyMiddleware } from 'redux';
// 引入redux-thunk，由于执行异步redux
import thunk from 'redux-thunk';
// 引入redux-devtools-extension,用于使用redux调试工具
import { composeWithDevTools } from 'redux-devtools-extension';
// 引入汇总reducers的index文件，index.js可以省略,默认就是Index.js
import reducers from './reducers';
export default createStore(reducers, composeWithDevTools(applyMiddleware(thunk))) //应用异步中间件