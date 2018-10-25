import chalk from 'chalk';
// import childProcess from 'child_process';
// import Promise from 'bluebird';
import Sequelize from 'sequelize';
import Umzug from 'umzug';
import fs from 'fs';
import { dirSwitch } from './lib';

const migrationDir = dirSwitch('migrations');

const migrate = (currentDB, action) => {
  fs.readdir(migrationDir, (err, items) => {
    if (err) {
      console.log(chalk.white('migrationDir ERROR:'), err);
    } else {
      console.log(chalk.white('migrationDir:'), items);
    }
  });
  // console.log('migration currentDB', currentDB);
  const sequelize = new Sequelize(null, null, null, {
    dialect: 'sqlite',
    storage: currentDB,
    logging: false
  });

  const umzug = new Umzug({
    storage: 'sequelize',
    storageOptions: {
      sequelize
    },

    migrations: {
      params: [
        sequelize.getQueryInterface(), // queryInterface
        sequelize.constructor, // DataTypes
        () => {
          throw new Error('Migration file error.');
        }
      ],
      path: migrationDir,
      pattern: /\.js$/
    },

    logging: () => {
      // console.log.apply(null, arguments);
      // console.log('migration', migrationDir);
    }
  });

  function logUmzugEvent(eventName) {
    return name => {
      console.log(`${name} ${eventName}`);
    };
  }
  umzug.on('migrating', logUmzugEvent('migrating'));
  umzug.on('migrated', logUmzugEvent('migrated'));
  umzug.on('reverting', logUmzugEvent('reverting'));
  umzug.on('reverted', logUmzugEvent('reverted'));

  const actions = {
    migrateUp: () => umzug.up(),
    migrateDown: () => umzug.down()
    // migrateReset: () => umzug.down({ to: 0 }),
    // migrateHardReset: () =>
    //   new Promise((resolve, reject) => {
    //     setImmediate(() => {
    //       try {
    //         console.log(`dropdb ${currentDB}`);
    //         childProcess.spawnSync(`dropdb ${currentDB}`);
    //         console.log(`createdb ${currentDB}`);
    //         childProcess.spawnSync(`createdb ${currentDB}`);
    //         resolve();
    //       } catch (err) {
    //         // console.log(err);
    //         reject(err);
    //       }
    //     });
    //   }),
    // migrateStatus: () => {
    //   const result = {};
    //   return umzug
    //     .executed()
    //     .then(executed => {
    //       result.executed = executed;
    //       return umzug.pending();
    //     })
    //     .then(pending => {
    //       result.pending = pending;
    //       return result;
    //     })
    //     .then(({ executed, pending }) => {
    //       // eslint-disable-next-line
    //       executed = executed.map(m => {
    //         // eslint-disable-next-line
    //         m.name = path.basename(m.file, '.js');
    //         return m;
    //       });
    //       // eslint-disable-next-line
    //       pending = pending.map(m => {
    //         // eslint-disable-next-line
    //         m.name = path.basename(m.file, '.js');
    //         return m;
    //       });
    //       const current =
    //         executed.length > 0 ? executed[0].file : '<NO_MIGRATIONS>';
    //       const status = {
    //         current,
    //         executed: executed.map(m => m.file),
    //         pending: pending.map(m => m.file),
    //       };
    //       console.log(JSON.stringify(status, null, 2));
    //       return { executed, pending };
    //     });
    // },
  };

  actions[action]();
};

export default migrate;
