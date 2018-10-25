const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const changeCase = require('change-case');

const basename = path.basename(__filename);
const db = {};

const caseChange = changeCase.camelCase;

const sequelize = new Sequelize(null, null, null, {
  dialect: 'sqlite',
  storage: './tests/models-test.db', // only used for testing
  logging: false
});

fs.readdirSync(__dirname)
  .filter(
    file =>
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
  )
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file));
    db[caseChange(model.name)] = model;
    console.log('db model: ', caseChange(model.name), ' for ', file);
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
