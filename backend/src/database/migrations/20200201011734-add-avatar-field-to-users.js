module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'avatar_id', {
      type: Sequelize.INTEGER,
      references: { model: 'files', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NUll',
      allowNull: true,
    });
  },

  down: queryInterface => {
    return queryInterface.dropColumn('users', 'avatar_id');
  },
};
