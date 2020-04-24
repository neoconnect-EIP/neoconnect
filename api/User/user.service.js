const   db = require("../_helpers/db"),
        bcrypt = require("bcrypt"),
        Inf = db.Influencer,
        Shop = db.Shop,
        Mark = db.Mark,
        jwtUtils = require("../utils/jwt.utils"),
        UploadImage = require("../UploadImage/uploadImage.service");

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

async function searchUser(req) {
    let headerAuth = req.headers['authorization'];
    let userId = jwtUtils.getUserId(headerAuth);
    if (userId < 0)
        return (undefined);

     list = await Inf.findOne({
        where: { pseudo: req.body.pseudo},
        attributes: ['id', 'pseudo', 'userType', 'theme']
    });
    if (list === null)
        list = await Shop.findOne({
            where: { pseudo: req.body.pseudo},
            attributes: ['id', 'pseudo', 'userType', 'theme']
        });
    if (list === null)
        return (undefined);
    list.userPicture = await GetImage.getImage({
        idLink: list.id.toString(),
        type: 'User'
    });
    list.mark = await Mark.findAll({
        where: {
            idUser: list.id.toString(),
        }
    });
    return (list);
}

async function deleteUser(req) {
    let headerAuth = req.headers['authorization'];
    let userId = jwtUtils.getUserId(headerAuth);
    if (userId < 0)
        return (undefined);
        
    let user = await Inf.findOne({
        where: {
            id: userId
        }
    });
    if (user === null) {
        user = await Shop.findOne({
            where: {
                id: userId
            }
        })
    }
    await user.destroy();
}

async function getProfile(id) {
    let user = await Inf.findOne({
        where: {
            id: id
        }
    });
    if (user === null) {
        user = await Shop.findOne({
            where: {
                id: id
            }
        });
        if (user === null)
            return (undefined)
    }
    return (user.get( { plain: true } ));
}

async function takeHighId() {
    const valueInf = await Inf.max('id');
    const valueShop = await Shop.max('id');

    if (isNaN(valueInf)) {
        if (isNaN(valueShop))
            return (0);
        return (valueShop)
    }
    if (isNaN(valueShop))
        return (valueInf);
    if (isNaN(valueInf))
        return (valueShop);
    if (valueInf < valueShop)
        return (valueShop);
    return (valueInf);
}

async function registerInf(params) {
    if (params === undefined ||
        params.pseudo === undefined ||
        params.password === undefined ||
        (await Inf.findOne({where: {pseudo: params.pseudo}})) ||
        (await Shop.findOne({where: {pseudo: params.pseudo}}))
    )
            return (undefined);

    const idMax = await takeHighId();

    let hash = bcrypt.hashSync(params.password, 5);
    const user = await Inf.create({
            id: idMax + 1,
            pseudo: params.pseudo,
            password: hash,
            userType: "influencer",
            full_name: params.full_name,
            email: params.email,
            phone: params.phone,
            postal: params.postal,
            city: params.city,
            userDescription: params.userDescription,
            theme: params.theme,
            facebook: params.facebook,
            twitter: params.twitter,
            snapchat: params.snapchat,
            instagram: params.instagram
        });
    if (params.userPicture !== undefined) {
        const imageData = await UploadImage.uploadImage({
            idLink: user.id,
            type: 'User',
            image: [{
                "imageName": `${user.id}_${user.pseudo}`, "imageData": params.userPicture}]
        })
    }
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

    const idMax = await takeHighId();

    let hash = bcrypt.hashSync(params.password, 5);
    const user = await Shop.create({
        id: idMax + 1,
        pseudo: params.pseudo,
        password: hash,
        userType: "shop",
        full_name: params.full_name,
        email: params.email,
        phone: params.phone,
        postal: params.postal,
        city: params.city,
        userDescription: params.userDescription,
        theme: params.theme,
        function: params.function,
        society: params.society,
        website: params.website,
        facebook: params.facebook,
        twitter: params.twitter,
        snapchat: params.snapchat,
        instagram: params.instagram
    });
    if (params.userPicture !== undefined) {
        const imageData = await UploadImage.uploadImage({
            idLink: user.id,
            type: 'User',
            image: [{
                "imageName": `${user.id}_${user.pseudo}`, "imageData": params.userPicture}]
        })
    }
    return {
        "token" : jwtUtils.generateTokenForUser(user)
    }
}



module.exports = {
    login,
    searchUser,
    deleteUser,
    registerInf,
    registerShop,
    getProfile
};