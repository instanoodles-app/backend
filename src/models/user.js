module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primraryKey: true },
    username: { type: DataTypes.STRING, required: true },
    displayName: { type: DataTypes.STRING, required: true },
    bioDescription: { type: DataTypes.STRING, required: true },
    email: { type: DataTypes.STRING, required: true },
    passwordHash: { type: DataTypes.STRING, required: true },
  }, {
    classMethods: {
      initTables: () => {
        User.sync();
      },
      associate: models => {
        User.hasOne(models.token);
        User.hasMany(models.post);
        User.hasMany(models.like);
        User.hasMany(models.comment);
      }
    }
  });
  return User;
};