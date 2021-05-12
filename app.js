const express = require("express"); //importation de Express
const helmet = require("helmet");//sécurisation de l'API
const bodyParser = require("body-parser");// body au format JSON
const mongoose = require("mongoose");// modélisation des objets
require('dotenv').config();//utilisation de dotenv pour la variable d environnement d'accès à la BDD 
const path = require("path");// désigne le chemin join pour servir les fichier images statiques
const userRoutes = require("./routes/user");
const saucesRoutes = require("./routes/sauces");

mongoose.connect(process.env.DB_URI, //utilisation du fichier .env (à mettre dans le .gitignore pour la sécurité)
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !')) //promise 
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

/**middleware qui intègre les headers pour autorisés les requètes bloquées par CORS */
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());
app.use(helmet());

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use("/api/auth", userRoutes);
app.use("/api/sauces", saucesRoutes);

module.exports = app;//export la fonction app vers le fichier server.js
