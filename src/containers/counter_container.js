import { connect } from 'react-redux';
import Counter from '../components/counter.jsx';
import { creatIncrementAction, creatDecrementAction } from '../redux/action_creators.js';

export default connect(
  (state) => ({ count: state }),
  {
    increment: creatIncrementAction,
    decrement: creatDecrementAction
  }
)(Counter)
