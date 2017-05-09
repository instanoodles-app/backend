module.exports = function(sequelize, DataTypes) {
  const Token = sequelize.define('token', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primraryKey: true },
    userId: { type: DataTypes.INTEGER, foreignKey: true },
    value: { type: DataTypes.STRING }
  }, {
    classMethods: {
      initTables: () => {
        Token.sync();
      },
      associate: models => {
        Token.hasOne(models.user);
      }
    }
  });
  return Token;
};