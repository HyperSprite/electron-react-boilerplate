/* eslint global-require: 0, flowtype-errors/show-errors: 0 */
// eslint-disable-next-line
import { tasks } from '../connection';

const db = {};

db.taskFetchAll = async options => {
  const result = await tasks
    .findAll({ where: options, order: [['createdAt', 'DESC']] })
    .then(theseTasks =>
      theseTasks.map(thisTask => ({
        ...thisTask.get({ plain: true })
      }))
    )
    .catch(err => console.log(err));
  return result;
};

const upsert = (data, id) => {
  if (id) {
    return tasks
      .find({ where: { id } })
      .then(foundTask => (data ? foundTask.update(data) : foundTask));
  }
  return tasks.create(data);
};

db.taskUpdate = async ({ id, ...updateData }) => {
  const result = await upsert(updateData, id)
    .then(updatedTask => [updatedTask.get({ plain: true })])
    .catch(err => {
      if (err.errors) {
        return { message: 'error', errors: err.errors };
      }
      console.log('err', err);
      const newErr = err.toString();
      return { message: 'error', errors: [{ message: newErr }] };
    });
  return result;
};

export default db;
