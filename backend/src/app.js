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

sequelize
  .authenticate()
  .then(() => sequelize.sync())
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  })
  .catch((err) => console.error("DB error:", err));
