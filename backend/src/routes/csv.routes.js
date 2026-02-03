const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../config/multer");
const csvController = require("../controllers/csv.controller");

router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  csvController.uploadCSV
);

module.exports = router;
