const   env = require("./env"),
        Sequelize = require("sequelize");

//Connection to DB
const sequelize = new Sequelize(env.database, env.username, env.password, {
    host: env.host,
    dialect: env.dialect
});

//Start DB
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
db.Offre = require("../Offers/offres.model")(sequelize, Sequelize);
db.OfferApply = require("../Offers/offerApply.model")(sequelize, Sequelize);

module.exports = db;