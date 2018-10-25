import { ipcRenderer, remote } from 'electron';

const db = require('./db');

const currentDB = `${remote.app.getPath('desktop')}/tasks.db`;

db('DB_OPEN', currentDB);

ipcRenderer.on('TO_DB', (event, options) => {
  // console.log('background', 'TO_DB', options);
  const { rType, ...opts } = options;
  db(rType, opts)
    .then(dbData => {
      // console.log('background', 'FROM_DB', JSON.stringify(dbData));
      const result = { ...dbData, rType };
      if (rType !== 'DB_CLOSE') {
        ipcRenderer.send('FROM_DB', result);
      }
      return null;
    })
    .catch(error => {
      // console.log('background error', JSON.stringify(error));
      const result = { error, rType: 'SET_ERROR' };
      ipcRenderer.send('FROM_DB', result);
    });
});
