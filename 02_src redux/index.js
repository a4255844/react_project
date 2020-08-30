import React from 'react';
import ReactDOM from 'react-dom';
import store from './redux/store.js'
import App from './App.jsx';

ReactDOM.render(<App store={store} />, document.getElementById('root'))
// 调用store身上的sunscribe(订阅)方法，传递回调函数强制更新dom
store.subscribe(() => {
  ReactDOM.render(<App store={store} />, document.getElementById('root'))
})