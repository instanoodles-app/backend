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
      },
      isValid: follower => {
        return Follower.count({
          where: follower
        }).then(c => c == 0)
      }
    }
  });
  return Follower;
};