import Sequelize, { DataTypes } from 'sequelize';
import fs from 'fs-extra';
import path from 'path';
import { format } from 'date-fns';
import chalk from 'chalk';
import migrate from './migration';
import { caseChange, dirSwitch } from './lib';

const db = {
  Sequelize,
  DataTypes,
  Op: Sequelize.Op
};

const modelsDir = dirSwitch('models');

// currentDB is a full path to a new or existing sqlite.db file
db.open = async currentDB => {
  db.currentDB = currentDB;
  fs.readdir(modelsDir, (err, items) => {
    if (err) {
      console.log(chalk.white('modelsDir ERROR:'), err);
    } else {
      console.log(chalk.white('modelsDir:'), items);
    }
  });
  // fs.ensureFileSync(currentDB); // for use without migrations
  const migRes = await migrate(currentDB, 'migrateUp', 'migrations');
  const seedRes = await migrate(currentDB, 'migrateUp', 'model-seeds');
  console.log(
    chalk.white('Open Setup:'),
    chalk.blue(`migrations: ${migRes}, seeds ${seedRes}`)
  );
  console.log(chalk.white('Open DB:'), chalk.blue(currentDB));
  db.sequelize = await new Sequelize(null, null, null, {
    dialect: 'sqlite',
    storage: currentDB,
    logging: false,
    operatorsAliases: Sequelize.Op
  });
  /*
  * Models
  */

  fs.readdirSync(modelsDir)
    .filter(
      file =>
        file.indexOf('.') !== 0 &&
        file !== 'index.js' &&
        file.slice(-3) === '.js'
    )
    .forEach(file => {
      const model = db.sequelize.import(path.join(modelsDir, file));
      db[caseChange(model.name)] = model;
      console.log(
        chalk.white('Open DB model:'),
        `${caseChange(model.name)} from ${file}`
      );
    });

  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  return (
    db.sequelize
      // .sync() // for use without migrations
      .then(() => {
        console.log(
          chalk.white(
            `models/index     Success: ${currentDB} // Database & tables created!`
          )
        );
        return 'DB_ON';
      })
      .catch(err =>
        console.log(
          chalk.yellow(`models/index     Error: ${currentDB} // ${err}`)
        )
      )
  );
};

db.close = async () =>
  db.sequelize
    .close()
    .then(() => {
      const filename = path.parse(db.currentDB).name;
      const dbFolder = path.parse(db.currentDB).dir;
      const backupDir = path.join(dbFolder, 'backup');
      fs.ensureDir(backupDir);
      const backupFile = `${filename}-${format(new Date(), 'YYYY-MM-DD')}.db`;
      const backupPath = path.join(backupDir, backupFile);
      return fs.copySync(db.currentDB, backupPath);
    })
    .then(() => {
      console.log(chalk.white('DB Closed:'), chalk.blue('Saved!'));
      return null;
    })
    .catch(err => console.log('err', err));

export default db;

/**
 * Configuration for
 * SQLite3 - https://github.com/mapbox/node-sqlite3
 * Sequelizejs - https://github.com/sequelize/sequelize
 *
 * Relations:
 * hasOne inserts key into Target
 * belongsTo inserts key into Source
 * belongsToMany
 * hasMany inserts into many Targets
 */
