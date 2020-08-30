// 从redux中引入createstore用于创建最核心的store对象
import { createStore } from 'redux';
// 引入手下
import reducer from './reducer.js'
export default createStore(reducer)