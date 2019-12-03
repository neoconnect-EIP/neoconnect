module.exports = (sequelize, Sequelize) =>  {
    return sequelize.define(
        "ForgotPassword",
        {
            email: {
                type: Sequelize.STRING,
                default: undefined
            },
            resetPasswordToken: {
                type: Sequelize.STRING,
                default: undefined
            },
            resetPasswordExpires: {
                type: Sequelize.DATE,
                default: undefined
            }
        },
        { freezeTableName: true }
    );
};