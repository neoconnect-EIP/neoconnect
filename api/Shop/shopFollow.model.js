module.exports = (sequelize, Sequelize) =>  {
    return sequelize.define(
        "ShopFollow",
        {
            idUser: {
                type: Sequelize.INTEGER,
                default: undefined
            },
            idFollow: {
                type: Sequelize.INTEGER,
                default: undefined
            }
        },
        { freezeTableName: true }
    );
};