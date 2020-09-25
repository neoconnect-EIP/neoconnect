//Définition des champs Pour "Influencer" dans la bdd
module.exports = (sequelize, Sequelize) =>  {
    return sequelize.define(
        "IA",
        {
            twitter: {
                type: Sequelize.INTEGER,
                default: 0
            },
            instagram: {
                type: Sequelize.INTEGER,
                default: 0
            },
            pinterest: {
                type: Sequelize.INTEGER,
                default: 0
            },
            twitch: {
                type: Sequelize.INTEGER,
                default: 0
            },
            youtube: {
                type: Sequelize.INTEGER,
                default: 0
            },
            tiktok: {
                type: Sequelize.INTEGER,
                default: 0
            },
            facebook: {
                type: Sequelize.INTEGER,
                default: 0
            }
        },
        { freezeTableName: true }
    );
};
