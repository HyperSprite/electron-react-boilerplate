/* eslint global-require: 0, flowtype-errors/show-errors: 0 */
import model from '../connection';

const db = {};

// TABLE_FETCH_ALL
db.tableFetchAll = async ({ table, ...options }) => {
  console.log(`tableFetchAll table: ${table}, options: `, options);

  const result = await model[table]
    .findAll({ where: options, order: [['createdAt', 'DESC']] })
    .then(foundItems =>
      foundItems.map(item => ({
        ...item.get({ plain: true })
      }))
    )
    .catch(err => console.log(err));
  return result;
};

db.upsert = (table, data, id) => {
  if (id) {
    return model[table].find({ where: { id } }).then(foundItem => {
      if (foundItem) {
        return data ? foundItem.update(data) : foundItem;
      }
      return model[table].create({ ...data, id });
    });
  }
  return model[table].create(data);
};

// TABLE_REMOVE
// TABLE_UPDATE
db.tableUpdate = async ({ id, table, ...updateData }) => {
  const result = await db
    .upsert(table, updateData, id)
    .then(updatedItem => updatedItem.get({ plain: true }))
    .catch(err => {
      if (err.errors) {
        return { message: 'error', errors: err.errors };
      }
      console.log('err', err);
      const newErr = err.toString();
      return { message: 'error', errors: { message: newErr } };
    });
  return [result];
};

export default db;
