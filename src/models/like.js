module.exports = function(sequelize, DataTypes) {
  const Like = sequelize.define('like', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primraryKey: true },
    userId: { type: DataTypes.INTEGER, foreignKey: true, required: true },
    postId: { type: DataTypes.INTEGER, foreignKey: true, required: true }
  }, {
    classMethods: {
      initTables: () => {
        Like.sync();
      },
      associate: models => {
        Like.belongsTo(models.user);
        Like.belongsTo(models.post);
      }
    }
  });
  return Like;
};