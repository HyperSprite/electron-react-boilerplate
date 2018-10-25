// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes';
import styles from './Home.css';

type Props = {
  dbAction: () => void,
  tasks: Array<Object>
};

const style = {
  outer: { padding: 10 },
  list: { marginTop: 10, maxHeight: 250, overflowY: 'auto', textAlign: 'left' },
  input: { marginLeft: 5 }
};

export default class Home extends Component<Props> {
  props: Props;

  constructor() {
    super();
    this.state = { name: '' };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const { dbAction } = this.props;
    // setTimeout is here becaues the database wont be ready by
    // the time we get here.
    setTimeout(
      () => dbAction({ rType: 'TASK_FETCH_ALL', isDeleted: false }),
      1000
    );
  }

  handleChange(event) {
    const { value } = event.target;
    this.setState({ name: value });
  }

  handleSubmit(event) {
    const { dbAction } = this.props;
    const { name } = this.state;
    event.preventDefault();
    dbAction({ rType: 'TASK_UPDATE', name });
    this.setState({ name: '' });
  }

  render() {
    const { tasks } = this.props;
    const { name } = this.state;
    return (
      <div className={styles.container} data-tid="container">
        <h2>Home</h2>
        <Link to={routes.COUNTER}>to Counter</Link>
        <div style={style.outer}>
          <form onSubmit={this.handleSubmit}>
            <input
              id="name"
              type="text"
              value={name}
              onChange={this.handleChange}
              style={style.input}
              aria-label="Name"
            />
            <input type="submit" value="Submit" />
          </form>
          <div style={style.list}>
            <ul>
              {tasks && tasks.map(task => <li key={task.id}>{task.name}</li>)}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
