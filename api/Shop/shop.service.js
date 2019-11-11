const   db = require("../_helpers/db"),
        Shop = db.Shop,
        User = db.Influencer,
        bcrypt = require("bcrypt"),
        jwtUtils = require("../utils/jwt.utils");


//Vérifie que le shop existe dans la bdd
async function login(params) {
    const user = await Shop.findOne({
        where: {
            pseudo: params.pseudo,
        }
    });
    if (user && bcrypt.compareSync(params.password, user.password)) {
        return {
            "userId" : user.id,
            "userType" : user.userType,
            "token" : jwtUtils.generateTokenForUser(user)
        }
    }
    else
        return (undefined);
}

async function getUserProfile(req) {
    let headerAuth = req.headers['authorization'];
    let userId = jwtUtils.getUserId(headerAuth);

    if (userId < 0)
        return (undefined);

    const list = await Shop.findOne({
        where: { id: userId },
        attributes: ['id', 'pseudo', 'userType', 'full_name', 'email', 'phone', 'postal', 'city', 'theme',
            'society', 'function']
    });
    return (list);
}

async function modifyUserProfile(req) {
    let headerAuth = req.headers['authorization'];
    let userId = jwtUtils.getUserId(headerAuth);
    if (userId < 0)
        return (undefined);

    let user = await Shop.findOne({
        where: {id: userId}
    });

    Object.keys(req.body).forEach(function (item) {
        user[item] = req.body[item];
    });
    user.save().then(() => {});
    return (user.get( { plain: true } ))

}

async function listInf(req) {
    let headerAuth = req.headers['authorization'];
    let userId = jwtUtils.getUserId(headerAuth);

    if (userId < 0)
        return (undefined);

    const list = await User.findAll({
        attributes: ['pseudo', 'full_name', 'email', 'phone', 'postal', 'city', 'theme',
        'facebook', 'twitter', 'snapchat', 'instagram']
    });
    return (list);
}

module.exports = {
    login,
    getUserProfile,
    modifyUserProfile,
    listInf
};