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
            userType: {
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
            userPicture: {
                type: Sequelize.ARRAY(Sequelize.TEXT),
                default: undefined
            },
            userDescription: {
                type: Sequelize.STRING,
                default: undefined
            },
            theme: {
                type: Sequelize.STRING,
                default: undefined
            },
            sexe: {
                type: Sequelize.STRING,
                default: undefined
            },
            tiktok: {
                type: Sequelize.STRING,
                default: undefined
            },
            tiktokNb: {
                type: Sequelize.ARRAY(Sequelize.INTEGER),
                default: undefined
            },
            tiktokUpdateDate: {
                type: Sequelize.ARRAY(Sequelize.STRING),
                default: undefined
            },
            pinterest: {
                type: Sequelize.STRING,
                default: undefined
            },
            pinterestNb: {
                type: Sequelize.ARRAY(Sequelize.INTEGER),
                default: undefined
            },
            pinterestUpdateDate: {
                type: Sequelize.ARRAY(Sequelize.STRING),
                default: undefined
            },
            twitch: {
                type: Sequelize.STRING,
                default: undefined
            },
            twitchNb: {
                type: Sequelize.ARRAY(Sequelize.INTEGER),
                default: undefined
            },
            twitchUpdateDate: {
                type: Sequelize.ARRAY(Sequelize.STRING),
                default: undefined
            },
            youtube: {
                type: Sequelize.STRING,
                default: undefined
            },
            youtubeNb: {
                type: Sequelize.ARRAY(Sequelize.INTEGER),
                default: undefined
            },
            youtubeUpdateDate: {
                type: Sequelize.ARRAY(Sequelize.STRING),
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
            twitterNb: {
                type: Sequelize.ARRAY(Sequelize.INTEGER),
                default: undefined
            },
            twitterUpdateDate: {
                type: Sequelize.ARRAY(Sequelize.STRING),
                default: undefined
            },
            snapchat: {
                type: Sequelize.STRING,
                default: undefined
            },
            instagram: {
                type: Sequelize.STRING,
                default: undefined
            },
            instagramNb: {
                type: Sequelize.ARRAY(Sequelize.INTEGER),
                default: undefined
            },
            instagramUpdateDate: {
                type: Sequelize.ARRAY(Sequelize.STRING),
                default: undefined
            },
            visitNumber: {
                type: Sequelize.INTEGER,
                default: 0
            },
            codeParrainage: {
                type: Sequelize.STRING,
                default: undefined
            },
            countParrainage: {
                type: Sequelize.INTEGER,
                default: 0
            },
            isParraine: {
                type: Sequelize.BOOLEAN,
                default: false
            }
        },
        { freezeTableName: true }
    );
};
