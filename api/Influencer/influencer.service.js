const   jwt = require("jsonwebtoken"),
        db = require("../_helpers/db"),
        bcrypt = require("bcrypt"),
        User = db.Influencer,
        Shop = db.Shop,
        config = require("../config");

//Vérifie que le shop existe dans la bdd
async function login(params) {
    const user = await User.findOne({
        where: {
            pseudo: params.pseudo,
        }
    });
    if (user && bcrypt.compareSync(params.password, user.password)) {
        const token = jwt.sign({ sub: user.id }, config.secretJWT);
        return {
            token
        };
    }
    else
        return (undefined);
}

//Créer un shop dans la bdd en fonction des params
async function register(params) {
    if (params === undefined ||
        params.pseudo === undefined ||
        params.password === undefined ||
        await User.findOne({where: {pseudo: params.pseudo}}))
            return (undefined);

    let hash = bcrypt.hashSync(params.password, 5);
    const user = User.create({
            pseudo: params.pseudo,
            password: hash,
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
        const token = jwt.sign({ sub: user.id }, config.secretJWT);
        return {
            token
        };
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