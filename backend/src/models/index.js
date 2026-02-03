const sequelize = require("../config/database");

const UserModel = require("./User");
const DocumentModel = require("./Document");

const User = UserModel(sequelize);
const Document = DocumentModel(sequelize);

// Relaciones
User.hasMany(Document, { foreignKey: "userId" });
Document.belongsTo(User, { foreignKey: "userId" });

module.exports = {
  sequelize,
  User,
  Document,
};
