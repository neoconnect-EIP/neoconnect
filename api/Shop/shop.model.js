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
                default: "shop"
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
            theme: {
                type: Sequelize.STRING,
                default: undefined
            }
        },
        { freezeTableName: true }
    );
};