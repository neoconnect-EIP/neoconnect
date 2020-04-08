module.exports = (sequelize, Sequelize) =>  {
    return sequelize.define(
        "Offer",
        {
            idUser: {
                type: Sequelize.INTEGER,
                default: undefined
            },
            productImg: {
                type: Sequelize.ARRAY(Sequelize.TEXT),
                default: undefined
            },
            productName: {
                type: Sequelize.STRING,
                default: undefined
            },
            productSex: {
                type: Sequelize.STRING,
                default: undefined
            },
            productDesc: {
                type: Sequelize.STRING,
                default: undefined
            },
            productSubject: {
                type: Sequelize.STRING,
                default: undefined
            },
            brand: {
                type: Sequelize.STRING,
                default: undefined
            },
            color: {
                type: Sequelize.STRING,
                default: undefined
            }
        },
        { freezeTableName: true }
    );
};