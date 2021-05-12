//fichier des routes pour les sauces
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const saucesCtrl = require("../controllers/sauces");
const multer = require("../middleware/multer-config");

router.post("/", auth, multer, saucesCtrl.createSauce);
router.post("/:id/like", auth, saucesCtrl.sauceLike);
router.get("/", auth, saucesCtrl.getAllSauces);
router.get("/:id", auth, saucesCtrl.getOneSauce);
router.put("/:id", auth, saucesCtrl.modifySauce);
router.delete("/:id", auth, saucesCtrl.deleteSauce);

module.exports = router;