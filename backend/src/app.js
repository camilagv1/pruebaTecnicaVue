const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { sequelize } = require("./models");
const authRoutes = require("./routes/auth.routes");
const documentRoutes = require("./routes/document.routes");
const csvRoutes = require("./routes/csv.routes");

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/csv", csvRoutes);


app.get("/index", (req, res) => {
  res.send("API OK");
});

const PORT = process.env.PORT || 3000;

// Retry connection to database with exponential backoff
const connectWithRetry = async (retries = 10, delay = 3000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await sequelize.authenticate();
      console.log("Conexión a la base de datos establecida.");
      await sequelize.sync();
      app.listen(PORT, () => {
        console.log(`Servidor corriendo en puerto ${PORT}`);
      });
      return;
    } catch (err) {
      console.log(`Intento ${i + 1}/${retries} - Esperando a MySQL...`);
      if (i === retries - 1) {
        console.error("DB error:", err);
        process.exit(1);
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

connectWithRetry();
