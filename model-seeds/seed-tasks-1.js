'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('tasks', [
      {
        id: '46904306-9184-4bff-8640-77dae0fb99b6',
        name: 'Make Delete Button',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '423f6376-6930-423d-8f6e-44bb32da092e',
        name: 'Make Completed Button',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('tasks', null, {});
  }
};
