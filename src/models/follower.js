module.exports = function(sequelize, DataTypes) {
  const Follower = sequelize.define('follower', {
    userId: { type: DataTypes.INTEGER, foreignKey: true },
    followingId: { type: DataTypes.INTEGER, foreignKey: true },
  }, {
    classMethods: {
      initTables: () => {
        Follower.sync();
      },
      associate: models => {
      }
    }
  });
  return Follower;
};