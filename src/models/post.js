module.exports = function(sequelize, DataTypes) {
  const Post = sequelize.define('post', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    authorId: { type: DataTypes.INTEGER, foreignKey: true, required: true },
    textContent: { type: DataTypes.STRING, required: true },
    imageUrl: { type: DataTypes.STRING, required: true }
  }, {
    classMethods: {
      initTables: () => {
        Post.sync();
      },
      associate: models => {
        Post.hasMany(models.like);
        Post.hasMany(models.comment);
        Post.belongsTo(models.user, { foreignKey: 'authorId' });
      },
      isValid: post => {
        if (!post) {
          return false;
        }

        if (!post.textContent || !post.imageUrl) {
          return false;
        }

        if (typeof post.textContent != 'string') {
          return false;
        }

        if (post.textContent.length > 300) {
          return false;
        }

        return true;
      }
    }
  });
  return Post;
};