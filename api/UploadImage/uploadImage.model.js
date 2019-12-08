module.exports = (sequelize, Sequelize) =>  {
    return sequelize.define(
        "Image",
        {
            ImageName: {
                type: Sequelize.STRING,
                default: undefined
            },
            Type: {
                type: Sequelize.STRING,
                default: undefined
            },
            IdLink: {
                type: Sequelize.STRING,
                default: undefined
            },
        },
        { freezeTableName: true }
    );
};