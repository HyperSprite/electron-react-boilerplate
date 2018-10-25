import chalk from 'chalk';
// eslint-disable-next-line
import { tasks } from './controllers';
// eslint-disable-next-line
import { close, open } from './connection';

const actionTypes = {
  TASK_FETCH_ALL: tasks.taskFetchAll,
  TASK_UPDATE: tasks.taskUpdate,
  DB_CLOSE: close,
  DB_OPEN: open
};

const db = (rType, inputData) => {
  if (process.env !== 'production') {
    console.log(
      chalk.white('\n> db : ', rType, '\n'),
      chalk.blue(JSON.stringify(inputData))
    );
  }
  if (!actionTypes[rType]) {
    console.log('db: missed actionTypes', rType);
    return { type: 'DB_ERROR', error: 'no method' };
  }

  return actionTypes[rType](inputData)
    .then(data => ({ rType, data }))
    .catch(error => ({ rType: 'DB_ERROR', error }));
};

module.exports = db;
