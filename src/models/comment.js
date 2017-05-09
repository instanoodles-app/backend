module.exports = function(sequelize, DataTypes) {
  const Comment = sequelize.define('comment', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, foreignKey: true, required: true },
    postId: { type: DataTypes.INTEGER, foreignKey: true, required: true },
    content: { type: DataTypes.STRING, required: true }
  }, {
    classMethods: {
      initTables: () => {
        Comment.sync();
      },
      associate: models => {
        Comment.belongsTo(models.user);
        Comment.belongsTo(models.post);
      },
      isValid: comment => {
        if (!comment) {
          return false;
        }

        if (!comment.userId || !comment.postId || !comment.content) {
          return false;
        }

        if (typeof comment.userId != 'number' || typeof comment.postId != 'number' || typeof comment.content != 'string') {
          return false;
        }

        if (comment.content.length > 300) {
          return false;
        }

        return true;
      }
    }
  });
  return Comment;
};