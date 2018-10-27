// @flow
import { connect } from 'react-redux';
import Home from '../components/Home';
import * as TableActions from '../actions/tables';

function mapStateToProps(state) {
  return {
    tasks: state.tables.tasks
  };
}

export default connect(
  mapStateToProps,
  TableActions
)(Home);
