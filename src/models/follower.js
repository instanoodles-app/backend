module.exports = function(sequelize, DataTypes) {
  const Follower = sequelize.define('follower', {
    userId1: { type: DataTypes.INTEGER, foreignKey: true },
    userId2: { type: DataTypes.INTEGER, foreignKey: true },
  }, {
    classMethods: {
      initTables: () => {
        Follower.sync();
      },
      associate: models => {
        Follower.belongsTo(models.user);
      }
    }
  });
  return Follower;
};