//Définition des champs Pour "Influencer" dans la bdd
module.exports = (sequelize, Sequelize) =>  {
    return sequelize.define(
        "Influencer",
        {
         pseudo: {
             type: Sequelize.STRING,
             default: undefined
         },
         password: {
             type: Sequelize.STRING,
             default: undefined
         },
         full_name: {
             type: Sequelize.STRING,
             default: undefined
         },
         email: {
             type: Sequelize.STRING,
             default: undefined
         },
         phone: {
             type: Sequelize.STRING,
             default: undefined
         },
         postal: {
             type: Sequelize.STRING,
             default: undefined
        },
         city: {
             type: Sequelize.STRING,
             default: undefined
        },
        theme: {
            type: Sequelize.STRING,
            default: undefined
        },
        facebook: {
            type: Sequelize.STRING,
            default: undefined
        },
        twitter: {
            type: Sequelize.STRING,
            default: undefined
        },
        snaptchat: {
            type: Sequelize.STRING,
            default: undefined
        },
        instagram: {
            type: Sequelize.STRING,
            default: undefined
        }
        },
     { freezeTableName: true }
    );
};