const   jwt = require("jsonwebtoken"),
        db = require("../_helpers/db"),
        User = db.Influencer,
        Shop = db.Shop,
        config = require("../config");

//Vérifie que le shop existe dans la bdd
async function login(params) {
    const user = await User.findOne({
        where: {
            pseudo: params.pseudo,
            password: params.password
        }
    });
    if (user) {
        const token = jwt.sign({ sub: user.id }, config.secretJWT);
        return {
            user,
            token
        };
    }
}

//Créer un shop dans la bdd en fonction des params
async function register(params) {
    if (params === undefined ||
        await User.findOne({ where: { pseudo: params.pseudo}})) {
        throw 'Pseudo "' + pseudo + '" is already taken';
    }
    User.create({
        pseudo: params.pseudo,
        password: params.password,
        full_name: params.full_name,
        email: params.email,
        phone: params.phone,
        postal: params.postal,
        city: params.city,
        theme: params.theme,
        facebook: params.facebook,
        twitter: params.twitter,
        snapchat: params.snapchat,
        instagram: params.instagram
    });
    //console.log(db);
}

async function listShop() {
    const list = await Shop.findAll({
       attributes: ['pseudo', 'full_name']
    });
    return (list);
}

module.exports = {
    login,
    register,
    listShop
};