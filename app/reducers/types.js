import type { Dispatch as ReduxDispatch, Store as ReduxStore } from 'redux';

export type counterStateType = {
  +counter: number
};

export type taskType = {
  createdAt: string,
  id: string,
  isActive: boolean,
  isDeleted: boolean,
  name: string,
  updatedAt: string
};

export type taskStateType = Array<taskType>;

type State = {
  counterStateType: counterStateType,
  taskStateType: taskStateType
};

export type Action = {
  +type: string
};

export type GetState = () => State;

export type Dispatch = ReduxDispatch<Action>;

export type Store = ReduxStore<GetState, Action>;
