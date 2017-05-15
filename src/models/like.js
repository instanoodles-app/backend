module.exports = function(sequelize, DataTypes) {
  const Like = sequelize.define('like', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
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
      },
      isValid: like => {
        if (!like) {
          return null;
        }

        if (!like.userId || !like.postId) {
          return null;
        }

        if (typeof like.userId != 'number' || typeof like.postId != 'number') {
          return null;
        }

        return Like.count({
          where: {
            userId: like.userId,
            postId: like.postId
          }
        });
      }
    }
  });
  return Like;
};