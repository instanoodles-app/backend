module.exports = function(sequelize, DataTypes) {
  const Comment = sequelize.define('comment', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primraryKey: true },
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
      }
    }
  });
  return Comment;
};