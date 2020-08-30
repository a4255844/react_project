import { connect } from 'react-redux';
import Counter from '../components/counter.jsx';
import {
  creatIncrementAction,
  creatDecrementAction,
  creatIncrementAsyncAction
} from '../redux/actions/counter_action';

export default connect(
  (state) => ({ count: state.count, person: state.person }), //此处的state是store所管理的那个超级state，它是一个对象，里面包含所有的状态
  {
    increment: creatIncrementAction,
    decrement: creatDecrementAction,
    incrementAsync: creatIncrementAsyncAction
  }
)(Counter)
