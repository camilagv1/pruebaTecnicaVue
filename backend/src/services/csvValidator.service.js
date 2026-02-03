const fs = require("fs");
const csv = require("csv-parser");

const validateRow = (row, index) => {
  const errors = [];

  // correo: String (email obligatorio)
  if (!row.correo || !/^\S+@\S+\.\S+$/.test(row.correo)) {
    errors.push({ row: index, field: "correo", error: "Formato de correo inválido", value: row.correo || null, expected: "email" });
  }

  // nombre: String (obligatorio)
  if (!row.nombre || typeof row.nombre !== "string" || row.nombre.length === 0) {
    errors.push({ row: index, field: "nombre", error: "Nombre obligatorio", value: row.nombre || null, expected: "string" });
  }

  // telefono: Número (obligatorio) — solo dígitos
  if (!row.telefono) {
    errors.push({ row: index, field: "telefono", error: "Teléfono obligatorio", value: null, expected: "digits" });
  } else {
    const digits = String(row.telefono).replace(/[^0-9]/g, "");
    if (!/^[0-9]+$/.test(digits)) {
      errors.push({ row: index, field: "telefono", error: "Teléfono debe contener sólo dígitos", value: row.telefono, expected: "digits" });
    }
  }

  // ciudad: String (obligatorio)
  if (!row.ciudad || typeof row.ciudad !== "string" || row.ciudad.length === 0) {
    errors.push({ row: index, field: "ciudad", error: "Ciudad obligatoria", value: row.ciudad || null, expected: "string" });
  }

  // notas: String (opcional)
  if (row.notas && typeof row.notas !== "string") {
    errors.push({ row: index, field: "notas", error: "Notas debe ser texto", value: row.notas, expected: "string" });
  }

  return errors;
};


exports.processCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const errors = [];
    let rowIndex = 1;
    let headersNormalized = null;
    const requiredHeaders = ["correo", "nombre", "telefono", "ciudad"];

    const stream = fs.createReadStream(filePath).pipe(csv());

    let finished = false;
    stream.on("headers", (headers) => {
      headersNormalized = headers.map((h) => (h ? h.trim().toLowerCase() : h));
      const missing = requiredHeaders.filter((h) => !headersNormalized.includes(h));
      if (missing.length && !finished) {
        finished = true;
        const first = missing[0];
        const expectedMap = { correo: "email", nombre: "string", telefono: "digits", ciudad: "string" };
        const errObj = {
          row: 0,
          field: first,
          error: "Campo obligatorio",
          value: null,
          expected: expectedMap[first] || null,
        };
        // Detener el parseo y rechazar de inmediato con el primer error
        stream.destroy();
        return reject([errObj]);
      }
    });

    stream.on("data", (rawRow) => {
      if (finished) return;
        // Normaliza encabezados y recorta valores (claves en minúsculas)
        const row = {};
        Object.keys(rawRow).forEach((k) => {
          const key = k ? k.trim().toLowerCase() : k;
          const value = rawRow[k] != null ? String(rawRow[k]).trim() : rawRow[k];
          row[key] = value;
        });

        const rowErrors = validateRow(row, rowIndex);
      if (rowErrors.length) {
        // Devolver solo el primer error encontrado
        finished = true;
        const firstError = rowErrors[0];
        stream.destroy();
        return reject([firstError]);
      }
      results.push(row);
      rowIndex++;
    });

    stream.on("end", () => {
      if (finished) return; // already rejected
      if (errors.length) {
        // En caso de fallback: devolver el primer error, si existe
        return reject([errors[0]]);
      }
      resolve(results);
    });

    stream.on("error", (err) => {
      if (finished) return;
      finished = true;
      reject(err);
    });
  });
};
