const bcrypt = require("bcrypt");//bcrypt package de cryptage
const User = require("../models/User");//importation du model User c est le fichier User.js qui contient le modèle a utilisé
const jwt = require('jsonwebtoken');//jsonwebtoken
const sanitize = require("mongo-sanitize");//nettoyeur permet de sécurisé les requètes

/**fonction pour l'enregistrement des nouveaux utilisateurs */
exports.signup = (req, res, next) => {
    let password = sanitize(req.body.password);
    let buff = new Buffer.from(req.body.email);//Buffer est utilisé pour la masquage de l'email
    bcrypt.hash(password, 10)//salt=10 c'est le nombre de tour d 'algorytm pour securisez le hash
        .then(hash => {      //1er chose à faire hachage du mot de pass fonction asynchrone
            const user = new User({ //aller voir le modèle
                email: buff.toString("base64"),
                password: hash //permet de sauvegarder le hash du password et nom le password en clair
            });
            user.save()
                .then(() => res.status(201).json({ message: "utilisateur crée" }))//201 création de ressources
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));//erreur serveur
};
/**fonction pour la connexion des utilisateurs existants */
exports.login = (req, res, next) => {
    let password = sanitize(req.body.password);
    let buff = new Buffer.from(req.body.email);
    //trouvé le user dans la base de données avec le mail
    User.findOne({//objet de comparaison c est le email on compare le mail envoyé par le front avec les mails de la bdd
        email: buff.toString("base64"),
    })
        .then(user => { //verification si on a récuperer un user ou pas
            if (!user) { //si on a pas trouver de user on retourne
                return res.status(401).json({ error });
            }
            //on a trouver un user et on va utilisé bcrypt
            bcrypt.compare(password, user.password)//hash enregistrer plus haut
                //dans le .then on recoit un boolean 
                .then(valid => { //retour false
                    if (!valid) {
                        return res.status(401).json({ error: "Mot de passe incorrect" });
                    }
                    //retour true
                    return res.status(200).json({ //renvoi d un objet avec l id de lutilisateur
                        userId: user._id,
                        //token d'authentification
                        token: jwt.sign(    //création de l'objet a encoder
                            { userId: user._id },
                            /*clé secret pour l'encodage*/"RANDOM_TOKEN_SECRET",
                            /**argument de configuration pour l'expiration */
                            { expiresIn: "24h" } //chaque token durera 24heures
                        )
                    });
                })
                .catch(error => res.status(500).json({error}));
        })
        .catch(error => res.status(500).json({error}));
};