import { connect } from 'react-redux';
import Counter from '../components/counter.jsx';
import { creatIncrementAction, creatDecrementAction } from '../redux/action_creators.js';
// connect内定义两个方法，一个负责控制传递状态，一个负责传递dispatch

// 完整的写法
// let mapStateToProps = (state) => ({ count: state })
// let mapDispatchToProps = (dispatch) => ({
//   increment: (value) => dispatch(creatIncrementAction(value)),
//   decrement: (value) => dispatch(creatDecrementAction(value))
// })

// export default connect(mapStateToProps, mapDispatchToProps)(Counter);

// 简写
export default connect(
  (state) => ({ count: state }),
  // 第二个参数只需要写一个对象就可以,key是我们定义的，value也是我们定义的，其余的react-redux帮我们封装好了
  {
    increment: creatIncrementAction,
    decrement: creatDecrementAction
  }
)(Counter)
// 简写方式react-redux底层帮你把第二个形参对象做了封装
// connect(creatIncrementAction) {
//   return value => dispatch(creatIncrementAction(value))
// }