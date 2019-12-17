module.exports = (sequelize, Sequelize) =>  {
    return sequelize.define(
        "Mark",
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
            mark: {
                type: Sequelize.STRING,
                default: undefined
            },
            idPost: {
                type: Sequelize.STRING,
                default: undefined
            }
        },
        { freezeTableName: true }
    );
};