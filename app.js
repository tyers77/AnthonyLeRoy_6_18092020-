const express = require("express"); //importation de Express
const helmet = require("helmet");
const sanitize = require("sanitize");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const userRoutes = require("./routes/user");
const saucesRoutes = require("./routes/sauces");

mongoose.connect(`mongodb+srv://tyers40:alr230182@pekocko.vpmrn.mongodb.net/pekocko?retryWrites=true&w=majority`,
{ useNewUrlParser: true,
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
//Helmet vous aide à sécuriser vos applications Express en définissant divers en-têtes HTTP. 
app.use(helmet());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use("/api/auth",userRoutes);
app.use("/api/sauces", saucesRoutes);

module.exports = app;//export la fonction app vers le fichier server.js
