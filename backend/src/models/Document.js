const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Document extends Model {}

  Document.init(
    {
      filename: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      filepath: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      recordsCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Document",
    }
  );

  return Document;
};
