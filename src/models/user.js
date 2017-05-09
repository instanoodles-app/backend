module.exports = function (sequelize, DataTypes) {
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
        },
        isValid: user => {
          if (!user) {
            return false;
          }

          if (!user.username || !user.displayName || !user.bioDescription || !user.email) {
            return false;
          }

          if (typeof user.username != 'string' ||
            typeof user.displayName != 'string' ||
            typeof user.bioDescription != 'string' ||
            typeof user.email != 'string') {
            return false;
          }

          if (user.email.test(/\S+@\S+\.\S+/)) {
            return false;
          }

          if (user.username.length > 32 || user.displayName.length > 64 || user.bioDescription.length > 256) {
            return false;
          }

          return true;
        }
      }
    });
  return User;
};