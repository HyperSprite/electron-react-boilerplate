// @flow
import { ipcRenderer } from 'electron';
import type { Dispatch } from '../reducers/types';

export const TASK_FETCH_ALL = 'TASK_FETCH_ALL';
export const TASK_UPDATE = 'TASK_UPDATE';
export const FETCHING_ON = 'FETCHING_ON';
export const FETCHING_OFF = 'FETCHING_OFF';
export const SET_ERROR = 'SET_ERROR';

export type optionDBAction = {
  rType: string,
  [key: string]: any
};

// options example { rType: TASK_FETCH_ALL, { isDeleted: false } }
export function dbAction(options: optionDBAction) {
  ipcRenderer.send('TO_DB', options);
  return (dispatch: Dispatch) => {
    dispatch({ type: FETCHING_ON });
    try {
      ipcRenderer.once('FROM_DB', (event, dbReturn) => {
        const { rType, ...result } = dbReturn;
        dispatch({ type: rType, payload: result.data });
        dispatch({ type: FETCHING_OFF });
      });
    } catch (error) {
      console.log('dbAction', error);
      dispatch({ type: SET_ERROR, payload: error });
    }
  };
}
