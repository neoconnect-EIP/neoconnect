//Définition des champs Pour "Shop" dans la bdd
module.exports = (sequelize, Sequelize) =>  {
    const Shop = sequelize.define(
        "Shop",
        {
         pseudo: {
             type: Sequelize.STRING
         },
         password: {
             type: Sequelize.STRING
         },
         full_name: {
             type: Sequelize.STRING
         },
         email: {
             type: Sequelize.STRING
         },
         phone: {
             type: Sequelize.STRING
         },
         society: {
             type: Sequelize.STRING
         },
         fonction: {
             type: Sequelize.STRING
         },
         postal: {
            type: Sequelize.STRING
        },
         city: {
            type: Sequelize.STRING
        },
         theme: {
            type: Sequelize.STRING
        }
     },
     { freezeTableName: true }   
    );
    return Shop;
};