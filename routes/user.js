const express = require("express");//pour la création du router
const router = express.Router();//création du router
const userCtrl = require("../controllers/user");//le controller pour associé les foctions aux différentes routes

router.post("/signup",userCtrl.signup);//route d envoi des infos connexion de l utilisateur pour la creation
router.post("/login",userCtrl.login);// route d envoi des infos connexion de l utilisateur pour la connexion 

module.exports = router;