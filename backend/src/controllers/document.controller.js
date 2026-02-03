const { Document, User } = require("../models");

exports.getDocuments = async (req, res) => {
  console.log("MODELS:", require("../models"));

  try {
    const documents = await Document.findAll({
      include: {
        model: User,
        attributes: ["name"],
      },
      order: [["createdAt", "DESC"]],
    });

    // `userName` directamente en cada documento para facilitar el frontend
    const docsWithUser = documents.map((d) => {
      const obj = d.toJSON();
      obj.userName = d.User ? d.User.name : null;
      return obj;
    });

    res.json(docsWithUser);
 } catch (error) {
  console.error("ERROR GET DOCUMENTS:", error);
  res.status(500).json({
    message: "Error al obtener documentos",
    error: error.message,
  });
}

};


exports.deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const document = await Document.findByPk(id);
    if (!document) {
      return res.status(404).json({ message: "Documento no encontrado" });
    }

    await document.destroy();
    res.json({ message: "Documento eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar documento", error });
  }
};
exports.downloadDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const document = await Document.findByPk(id);
    if (!document) {
      return res.status(404).json({ message: "Documento no encontrado" });
    }

    res.download(document.filepath, document.filename);
  } catch (error) {
    res.status(500).json({ message: "Error al descargar archivo" });
  }
};
