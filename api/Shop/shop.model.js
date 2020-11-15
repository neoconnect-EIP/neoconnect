//Définition des champs Pour "Shop" dans la bdd
module.exports = (sequelize, Sequelize) =>  {
    return Shop = sequelize.define(
        "Shop",
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
            society: {
                type: Sequelize.STRING,
                default: undefined
            },
            function: {
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
            website: {
                type: Sequelize.STRING,
                default: undefined
            },
            twitter: {
                type: Sequelize.STRING,
                default: undefined
            },
            facebook: {
                type: Sequelize.STRING,
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
            }
        },
        { freezeTableName: true }
    );
};