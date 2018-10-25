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
import MenuBuilder from './menu';

global.mainPath = __dirname;

let mainWindow = null;
let backgroundWindow = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const debug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (debug) {
  require('electron-debug')();
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
  if (debug) {
    await installExtensions();
  }

  // background db mgmt
  const backgroundURL = `file://${__dirname}/background.html`;

  backgroundWindow = new BrowserWindow({ show: debug });
  if (debug) {
    backgroundWindow.webContents.openDevTools();
  }

  backgroundWindow.loadURL(backgroundURL);

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  // DB comunication for UI to DB
  ipcMain.on('TO_DB', (event, options) => {
    // console.log('main', 'TO_DB', options);
    backgroundWindow.webContents.send('TO_DB', options);
  });

  // DB comunication for DB to UI
  ipcMain.on('FROM_DB', (event, options) => {
    // console.log('main', 'FROM_DB', options);
    mainWindow.webContents.send('FROM_DB', options);
  });

  mainWindow.on('closed', () => {
    backgroundWindow.webContents.send('TO_DB', { rType: 'DB_CLOSE' });
    ipcMain.removeAllListeners(['TO_DB', 'FROM_DB']);
    backgroundWindow.close();
    backgroundWindow = null;
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();
});
