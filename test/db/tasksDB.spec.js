import faker from 'faker';
import { rm } from 'shelljs';
import chalk from 'chalk';
import db from '../../app/db';

const currentDB = './test/db/task-test.db';
const journalDB = './test/db/task-test.db-journal';

const delay = time => new Promise(resolve => setTimeout(resolve, time));
// taskFetchAll(task)
// taskUpdate(task)
// takes a task object, object of task type, email address is required

// id:
// name:
// isActive:
// isDeleted:
// createdAt:
// updatedAt:

const task = () => ({
  name: faker.company.bs()
});

describe('task db', () => {
  beforeAll(async () => {
    // removes old test db and journal files if they exist
    rm('-f', currentDB);
    rm('-f', journalDB);

    await db('DB_OPEN', currentDB);
    await delay(1000);
    console.log(
      chalk.white(
        '\nTest DB - DB_OPEN Done ..............................\n\n\n\n\n\n'
      )
    );
  });
  // the extra space in the  console log is compensating for a jest --watch covering output
  afterAll(async () => {
    await delay(500);
    await db('DB_CLOSE', currentDB);
    console.log(
      chalk.white('\nTest DB - Done ..............................\n\n\n\n\n\n')
    );
  });

  const tasks = {};
  const table = 'tasks';

  it('should create a full task from single object and return task', async () => {
    const fakeTask = { ...task(), table };
    const newTask = await db('TABLE_UPDATE', fakeTask);

    expect(await newTask).toEqual({
      rType: 'TABLE_UPDATE',
      data: expect.any(Array)
    });
    tasks.taskZero = await newTask.data[0];
    expect(await tasks.taskZero).toEqual(
      expect.objectContaining({
        id: await expect.any(String),
        name: fakeTask.name,
        isDeleted: false,
        isActive: true,
        updatedAt: expect.any(Date),
        createdAt: expect.any(Date)
      })
    );
  });

  it('should find complete task and return', async () => {
    const foundTask = await db('TABLE_FETCH_ALL', {
      table,
      id: tasks.taskZero.id
    });
    expect(await foundTask.data[0]).toEqual(
      expect.objectContaining({
        id: tasks.taskZero.id,
        name: tasks.taskZero.name,
        isDeleted: tasks.taskZero.isDeleted,
        isActive: tasks.taskZero.isActive,
        createdAt: tasks.taskZero.createdAt
      })
    );
  });

  it('should delete task', async () => {
    const fakeTask = task();
    const newTask = await db('TABLE_UPDATE', {
      table,
      name: fakeTask.name
    });

    expect(await newTask).toEqual(
      expect.objectContaining({
        rType: 'TABLE_UPDATE',
        data: expect.any(Array)
      })
    );
    expect(await newTask.data[0]).toEqual(
      expect.objectContaining({
        name: newTask.data[0].name,
        isDeleted: false
      })
    );

    const updateUserTrash = await db('TABLE_UPDATE', {
      table,
      isDeleted: true,
      name: newTask.data[0].name,
      id: newTask.data[0].id
    });
    expect(await updateUserTrash.data[0]).toEqual(
      expect.objectContaining({
        name: newTask.data[0].name,
        id: newTask.data[0].id,
        isDeleted: true
      })
    );
  });

  it('should find seed task and return', async () => {
    const foundTask = await db('TABLE_FETCH_ALL', {
      table,
      id: '46904306-9184-4bff-8640-77dae0fb99b6'
    });
    expect(await foundTask.data[0]).toEqual(
      expect.objectContaining({
        id: '46904306-9184-4bff-8640-77dae0fb99b6',
        name: 'Make Delete Button',
        isDeleted: false,
        isActive: true,
        updatedAt: expect.any(Date),
        createdAt: expect.any(Date)
      })
    );
  });
});
