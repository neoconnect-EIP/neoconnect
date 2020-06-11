'use strict';

const   jwtUtils = require("./jwt.utils");

module.exports = {
    checkRegex: function(regex, string) {
        const regexTest = RegExp(regex);
        if (regexTest.test(string))
            return (true);
        return (false)

    },
    
    checkToken: async function (req, res, next) {
        if (req.headers.authorization === undefined)
            return (res.status(401).json('Unauthorized, Please Put a token in authorization field in Header'));

        let headerAuth = req.headers['authorization'];
        let userId = jwtUtils.getUserId(headerAuth);
        if (userId < 0)
            return (res.status(401).json('Bad Token'));
        next();
    }
};