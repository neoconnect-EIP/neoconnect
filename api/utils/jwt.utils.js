const jwt = require('jsonwebtoken');

const JWT_SIGN_SECRET = 'dfmfjt4j69oefk40k430dklkgf0ljkmldjflje939ee249fkdfk24edwgfwsg948fjdkfkdhfekru39ru39';

// Exported functions
module.exports = {
    generateTokenForUser: function(userData) {
        return jwt.sign({
                userId: userData.id,
                userType: userData.userType
            },
            JWT_SIGN_SECRET,
            {
                expiresIn: '24h'
            })
    },
    parseAuthorization: function(authorization) {
        return (authorization != null) ? authorization.replace('Bearer ', '') : null;
    },
    getUserId: function(authorization) {
        let userId = -1;
        let token = module.exports.parseAuthorization(authorization);
        if(token != null) {
            try {
                let jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
                if(jwtToken != null)
                    userId = jwtToken.userId;
            } catch(err) { }
        }
        return userId;
    },
    getUserType: function(authorization) {
        let token = module.exports.parseAuthorization(authorization);
        let jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
        return (jwtToken.userType);
    }
};
