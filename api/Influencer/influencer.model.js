//Définition des champs Pour "Influencer" dans la bdd
module.exports = (sequelize, Sequelize) =>  {
    const Influencer = sequelize.define(
        "Influencer",
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
         postal: {
            type: Sequelize.STRING
        },
         city: {
            type: Sequelize.STRING
        },
        theme: {
            type: Sequelize.STRING
        },
        facebook: {
            type: Sequelize.STRING
        },
        twitter: {
            type: Sequelize.STRING
        },
        snaptchat: {
            type: Sequelize.STRING
        },
        instagram: {
            type: Sequelize.STRING
        }
},
     { freezeTableName: true }   
    );
    return Influencer;
};