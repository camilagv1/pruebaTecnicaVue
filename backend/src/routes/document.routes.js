const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const documentController = require("../controllers/document.controller");

router.get("/", authMiddleware, documentController.getDocuments);

router.get(
  "/download/:id",
  authMiddleware,
  documentController.downloadDocument
);
// SOLO ADMIN
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware,
  documentController.deleteDocument
);

module.exports = router;
