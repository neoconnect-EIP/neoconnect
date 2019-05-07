const env = require("./env");
const Sequelize = require("sequelize");

//Connection à la base de donées
const sequelize = new Sequelize(env.database, env.username, env.password, {
    host: env.host,
    dialect: env.dialect
});

//lance la base de données
sequelize
    .authenticate()
    .then(() => {
        console.log(
            "PostgresSQL en cours avec Sequelize avec la db " + env.database
        );
    })
    .catch(err => {
        console.log(err);
    });

//Intégration de Sequelize dans db
const db =  {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

//Création des champs de la bdd via leur route
db.Influencer = require("../Influencer/influencer.model")(sequelize, Sequelize);
db.Shop = require("../Shop/shop.model")(sequelize, Sequelize);


module.exports = db;