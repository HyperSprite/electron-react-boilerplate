// @flow
import { TABLE_FETCH_ALL, TABLE_REMOVE, TABLE_UPDATE } from '../actions/tables';

const arrUpdateOrCreateObj = (arr = [], item, actionType) => {
  const index = arr.map(aI => aI.id).indexOf(item.id);
  const newItem = actionType !== TABLE_REMOVE ? [item] : [];
  return index === -1
    ? [item, ...arr]
    : [...arr.slice(0, index), ...newItem, ...arr.slice(index + 1)];
};

const isArr = arr => (Array.isArray(arr) ? arr : []);

export type tablesStateType = {
  [key: string]: Array<{}>
};

const defaultState = {
  tasks: []
};

export default function(state: tablesStateType = defaultState, action) {
  const { type, payload } = action;
  switch (type) {
    case TABLE_REMOVE:
      return {
        ...state,
        [payload.table]: arrUpdateOrCreateObj(
          state[payload.table],
          payload.data[0],
          TABLE_REMOVE
        )
      };
    case TABLE_UPDATE:
      return {
        ...state,
        [payload.table]: arrUpdateOrCreateObj(
          state[payload.table],
          payload.data[0]
        )
      };
    case TABLE_FETCH_ALL:
      return {
        ...state,
        [payload.table]: [...isArr(payload.data)]
      };
    default:
      return state;
  }
}
