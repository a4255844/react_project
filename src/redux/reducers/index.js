// 在index.js文件中汇总所有的reducers,把所有的reducers文件全部引入
import counterReducer from './counter_reducer';
import personReducer from './person_reducer';
// 引入redux内用来汇总reducers的方法combineReducers
import { combineReducers } from 'redux';
// store中保存了所有组件的状态，是一个一般对象
// combineReducers方法，接受一个对象作为参数，这个对象最终就是store中保存的对象
// 对象中的key就是store中对应的其中一个组件,value就是对应组件的状态
export default combineReducers({
  count: counterReducer,
  person: personReducer
})