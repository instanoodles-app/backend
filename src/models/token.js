module.exports = function(sequelize, DataTypes) {
  const Token = sequelize.define('token', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, foreignKey: true },
    value: { type: DataTypes.STRING }
  }, {
    classMethods: {
      initTables: () => {
        Token.sync();
      },
      associate: models => {
        Token.belongsTo(models.user);
      }
    }
  });
  return Token;
};