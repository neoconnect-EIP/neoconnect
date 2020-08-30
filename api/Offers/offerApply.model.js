module.exports = (sequelize, Sequelize) =>  {
    return sequelize.define(
        "OfferApply",
        {
            idUser: {
                type: Sequelize.INTEGER,
                default: undefined
            },
            idOffer: {
                type: Sequelize.INTEGER,
                default: undefined
            },
            status: {
                type: Sequelize.STRING,
                default: undefined
            }
        },
        { freezeTableName: true }
    );
};