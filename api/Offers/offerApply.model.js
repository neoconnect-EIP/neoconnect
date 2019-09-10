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
            }
        },
        { freezeTableName: true }
    );
};