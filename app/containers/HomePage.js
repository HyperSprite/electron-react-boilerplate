// @flow
import { connect } from 'react-redux';
import Home from '../components/Home';
import * as TaskActions from '../actions/tasks';

function mapStateToProps(state) {
  return {
    tasks: state.tasks
  };
}

export default connect(
  mapStateToProps,
  TaskActions
)(Home);
