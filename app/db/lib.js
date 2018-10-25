import path from 'path';
import { remote } from 'electron';
import changeCase from 'change-case';

const caseChange = changeCase.camelCase;

const envSwitch = {
  development: path.join(__dirname, '..'),
  test: path.join(__dirname, '..', '..')
};

const dirSwitch = dir =>
  envSwitch[process.env.NODE_ENV]
    ? path.join(envSwitch[process.env.NODE_ENV], dir)
    : path.join(remote.getGlobal('mainPath'), 'dist', dir);

export { caseChange, dirSwitch };
