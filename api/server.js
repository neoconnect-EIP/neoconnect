require("rootpath")();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const db = require("./_helpers/db");

//Port localhost:8080
const PORT = 8080;

//Vérifie que la db existe sinon l'a créer
db.sequelize.sync().then(() => {
    console.log("Création des tables");
});

//Intéraction front-back
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

//Création des routes
app.use("/", require("./Shop/shop.controller"));
app.use("/", require("./Influencer/influencer.controller"));

//Lancement server
app.listen(PORT, function() {
    console.log(`Running on port ${PORT}`);
});