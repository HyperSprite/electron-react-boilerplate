// name: { plural: 'tasks', singular: 'task' },
module.exports = (sequelize, DataTypes) => {
  const tasks = sequelize.define(
    'tasks',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
        set(name) {
          this.setDataValue('name', name ? name.toString().trim() : '');
        }
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {}
  );
  // eslint-disable-next-line
  tasks.associate = models => {
    // associations can be defined here
  };
  return tasks;
};
