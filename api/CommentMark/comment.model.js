module.exports = (sequelize, Sequelize) =>  {
    return sequelize.define(
        "Comment",
        {
            idUser: {
                type: Sequelize.STRING,
                default: undefined
            },
            idOffer: {
                type: Sequelize.STRING,
                default: undefined
            },
            type: {
                type: Sequelize.STRING,
                default: undefined
            },
            comment: {
                type: Sequelize.STRING,
                default: undefined
            }
        },
        { freezeTableName: true }
    );
};