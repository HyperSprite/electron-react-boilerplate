/* eslint global-require: 0, flowtype-errors/show-errors: 0 */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import { app, BrowserWindow, ipcMain } from 'electron';
import settings from 'electron-settings';
import 'reflect-metadata'; // for TypeORM decorators
import MenuBuilder from './menu';
import db from './db';
import config from './config.json';

/**
 * This is an IPC connection between the db and User actions
 */

ipcMain.on('USER', (event, ipcType, inputData) => {
  console.log('ipcMain', ipcType);
  switch (ipcType) {
    case 'USERS_FETCH':
      db.userFindAll(inputData)
        .then(data => event.sender.send('USERS_FETCH', { type: ipcType, data }))
        .catch(err =>
          event.sender.send('PAGE', { type: 'USER_ERROR', error: err })
        );
      break;
    case 'USER_ADD':
      db.userCreate(inputData)
        .then(data => {
          console.dir(data);
          return event.sender.send('USER_ADD', { type: ipcType, data });
        })
        .catch(err =>
          event.sender.send('PAGE', { type: 'USER_ERROR', error: err })
        );
      break;
    case 'USER_UPDATE':
    case 'USER_DELETE':
      console.log('ipcMain USER_UPDATE', ipcType);
      db.userUpdate(inputData)
        .then(data => {
          console.log('data', data);
          return event.sender.send(ipcType, { type: ipcType, data });
        })

        .catch(err =>
          event.sender.send('PAGE', { type: 'USER_ERROR', error: err })
        );
      break;
    default:
      event.sender.send('PAGE', {
        type: 'USER_ERROR',
        error: 'ipcMain USER - Missed case'
      });
      return null;
  }
});

/**
 * Start Electron stuff...
 */

let mainWindow = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
  const path = require('path');
  const p = path.join(__dirname, '..', 'app', 'node_modules');
  require('module').globalPaths.push(p);
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: config.mainWidth,
    height: config.mainHeight
  });

  if (!settings.has('app.appTitle')) {
    settings.setAll(config);
  }

  console.log('settings', settings.has('appTitle'));

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();
});
