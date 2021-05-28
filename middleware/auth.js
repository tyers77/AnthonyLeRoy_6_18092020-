/**middleware permettant l'authentification du token et de l userid envoyé par le frontend */
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]//on récupere dans le header authorization le 2eme élément apres le vide
        const decodedToken = jwt.verify(token,process.env.CLE_TOKEN); //on verifie le token avec la méthode verify et la clé */
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw "user Id non valable";
        } else {
            next()
        }
    } catch {
        res.status(401).json({
            error: new error("invalid request")
        });
    }
};