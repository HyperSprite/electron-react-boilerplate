// @flow
import { TASK_UPDATE, TASK_FETCH_ALL } from '../actions/tasks';

const arrUpdateOrCreateObj = (arr = [], item) => {
  const index = arr.map(aI => aI.id).indexOf(item.id);
  return index === -1
    ? [item, ...arr]
    : [...arr.slice(0, index), item, ...arr.slice(index + 1)];
};

const isArr = arr => (Array.isArray(arr) ? arr : []);

export type taskStateType = Array<task>;

export default function(state: taskStateType = [], action) {
  switch (action.type) {
    case TASK_UPDATE:
      return arrUpdateOrCreateObj(state, action.payload[0]);
    case TASK_FETCH_ALL:
      return [...isArr(action.payload)];
    default:
      return state;
  }
}
