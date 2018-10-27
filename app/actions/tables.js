// @flow
import { ipcRenderer } from 'electron';
import type { Dispatch } from '../reducers/types';

export const TABLE_FETCH_ALL = 'TABLE_FETCH_ALL';
export const TABLE_REMOVE = 'TABLE_REMOVE';
export const TABLE_UPDATE = 'TABLE_UPDATE';
export const FETCHING_ON = 'FETCHING_ON';
export const FETCHING_OFF = 'FETCHING_OFF';
export const SET_ERROR = 'SET_ERROR';

export type optionDBAction = {
  rType: string,
  [key: string]: any
};

// options example { rType: TABLE_FETCH_ALL, table: 'tasks', isDeleted: false }
export function dbAction(options: optionDBAction) {
  const { rType, table } = options;
  ipcRenderer.send('TO_DB', options);
  return (dispatch: Dispatch) => {
    dispatch({ type: FETCHING_ON });
    try {
      ipcRenderer.once(rType, (event, dbReturn) => {
        // const { rType, ...result } = dbReturn;
        dispatch({ type: rType, payload: { table, data: dbReturn.data } });
        dispatch({ type: FETCHING_OFF });
      });
    } catch (error) {
      console.log('dbAction', error);
      dispatch({ type: SET_ERROR, payload: error });
    }
  };
}
