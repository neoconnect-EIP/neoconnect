//Définition des champs Pour "Message" dans la bdd
module.exports = (sequelize, Sequelize) =>  {
    return sequelize.define(
        "Message",
        {
            user_1: {
                type: Sequelize.STRING,
                default: undefined
            },
            user_2: {
                type: Sequelize.STRING,
                default: undefined
            },
            data: {
                type: Sequelize.TEXT,
                default: undefined
            }
        },
        { freezeTableName: true }
    );
};
