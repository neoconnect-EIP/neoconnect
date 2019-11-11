const   db = require("../_helpers/db"),
        bcrypt = require("bcrypt"),
        Inf = db.Influencer,
        Shop = db.Shop,
        jwtUtils = require("../utils/jwt.utils");

//Vérifie que le shop existe dans la bdd
async function login(params) {
    let user = await Inf.findOne({
        where: {
            pseudo: params.pseudo,
        }
    });
    if (user === null) {
        user = await Shop.findOne({
            where: {
                pseudo: params.pseudo,
            }
        })
    }
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

//Créer un shop dans la bdd en fonction des params
async function registerInf(params) {
    if (params === undefined ||
        params.pseudo === undefined ||
        params.password === undefined ||
        (await Inf.findOne({where: {pseudo: params.pseudo}})) ||
        (await Shop.findOne({where: {pseudo: params.pseudo}}))
    )
            return (undefined);

    let hash = bcrypt.hashSync(params.password, 5);
    const user = await Inf.create({
            pseudo: params.pseudo,
            password: hash,
            userType: "influencer",
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
    return {
        "token" : jwtUtils.generateTokenForUser(user)
    }
}

//Créer un shop dans la bdd en fonction des params
async function registerShop(params) {
    if (params === undefined ||
        params.pseudo === undefined ||
        params.password === undefined ||
        await Shop.findOne({where: {pseudo: params.pseudo}}) ||
        await Inf.findOne({where: {pseudo: params.pseudo}})
    )
        return (undefined);

    let hash = bcrypt.hashSync(params.password, 5);
    const user = await Shop.create({
        pseudo: params.pseudo,
        password: hash,
        userType: "shop",
        full_name: params.full_name,
        email: params.email,
        phone: params.phone,
        postal: params.postal,
        city: params.city,
        theme: params.theme,
        function: params.function,
        society: params.society
    });
    return {
        "token" : jwtUtils.generateTokenForUser(user)
    }
}



module.exports = {
    login,
    registerInf,
    registerShop,
};