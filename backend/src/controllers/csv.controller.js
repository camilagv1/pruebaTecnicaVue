const path = require("path");
const { Document } = require("../models");
const { processCSV } = require("../services/csvValidator.service");

exports.uploadCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Archivo requerido" });
    }

    const filePath = req.file.path;

    // Procesa y valida el CSV
    const rows = await processCSV(filePath);

    // Guarda metadata del documento
    const document = await Document.create({
      filename: req.file.originalname,
      filepath: path.resolve(filePath), // guardamos la ruta
      recordsCount: rows.length,
      userId: req.user.id,
    });

    res.status(201).json({
      message: "CSV procesado correctamente",
      document,
    });
  } catch (error) {
    // Normalize different error shapes into an array of error objects
    let errors = [];
    if (Array.isArray(error)) {
      errors = error;
    } else if (error && error.message) {
      errors = [{ row: null, field: null, error: error.message }];
    } else {
      errors = [{ row: null, field: null, error: String(error) }];
    }

    // Build a clearer top-level message including the field name when available
    let message = "Error de validación en el CSV";
    if (errors && errors.length) {
      const first = errors[0];
      if (first.field) {
        // If the validator returned a generic 'Campo obligatorio', make it specific
        if (first.error && first.error.toLowerCase().includes("campo obligatorio")) {
          message = `${first.field} es requerido`;
        } else if (first.error) {
          message = `${first.field}: ${first.error}`;
        } else {
          message = `${first.field} es requerido`;
        }
      } else if (first.error) {
        message = first.error;
      }
    }

    res.status(400).json({ message });
  }
};

