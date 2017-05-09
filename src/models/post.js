module.exports = function(sequelize, DataTypes) {
  const Post = sequelize.define('post', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primraryKey: true },
    userId: { type: DataTypes.INTEGER, foreignKey: true, required: true },
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
        Post.belongsTo(models.user);
      }
    }
  });
  return Post;
};