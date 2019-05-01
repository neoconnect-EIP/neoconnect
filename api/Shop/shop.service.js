const jwt = require("jsonwebtoken");
const db = require("../_helpers/db");
const User = db.user;
const Shop = db.Shop;

module.exports = {
    login,
    register
};

//Vérifie que le shop existe dans la bdd
async function login(params) {
    const user = await Boutique.findOne({
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
    if (await Shop.findOne({ where: { pseudo: params.pseudo}})) {
        throw 'Pseudo "' + pseudo + '" is already taken';
    }
    Shop.create({
        pseudo: params.pseudo,
        password: params.password,
        full_name: params.full_name,
        email: params.email,
        phone: params.phone,
        society: params.society,
        fonction: params.fonction,
        postal: params.postal,
        city: params.city,
        theme: params.theme,
    });
}