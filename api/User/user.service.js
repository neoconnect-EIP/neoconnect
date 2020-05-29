const   db = require("../_helpers/db"),
        bcrypt = require("bcrypt"),
        Inf = db.Influencer,
        Shop = db.Shop,
        Mark = db.Mark,
        { URL_IA } = process.env,
        jwtUtils = require("../utils/jwt.utils"),
        fetch = require("../utils/fetch"),
        validation = require("../utils/validation"),
        utils = require("../utils/themeSelection"),
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

async function verifyUser(params) {
    let obj = {
        "instagram": "",
        "twitter": "",
        "youtube": "",
        "facebook": "",
        "twitch": "",
        "snapchat": "",
        "pinterest": ""
    };

    for (const property in obj) {
        if (params[property] !== undefined) {
            obj[property] = params[property]
        }
    }
    obj.insta = obj.instagram;

    let response;
    try {
        response = await fetch.postFetch(`${URL_IA}/getLinks`, obj, undefined);
        if (response.status !== 200)
            return (undefined);
        response = JSON.parse(response.body);

    }
    catch (e) {
        console.log(e);
        return (undefined)
    }

    for (const property in obj) {
        if (response[property] !== undefined && response[property].isBot !== false) {
            return (true)
        }
    }
    return (undefined)
}

async function searchUser(req) {
    let headerAuth = req.headers['authorization'];
    let userId = jwtUtils.getUserId(headerAuth);
    if (userId < 0)
        return (undefined);

     list = await Inf.findOne({
        where: { pseudo: req.body.pseudo},
        attributes: ['id', 'pseudo', 'userType', 'theme', 'email', 'phone']
    });
    if (list === null)
        list = await Shop.findOne({
            where: { pseudo: req.body.pseudo},
            attributes: ['id', 'pseudo', 'userType', 'theme', 'email', 'phone']
        });
    if (list === null)
        return (undefined);
    list.userPicture = await GetImage.getImage({
        idLink: list.id.toString(),
        type: 'User'
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

    if (!validation.checkRegex('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{4,12}$', params.password)
        || !validation.checkRegex('^(\\w{4,12})$', params.pseudo))
        return (undefined);



    if (params.instagram !== undefined ||
        params.twitter !== undefined ||
        params.facebook !== undefined ||
        params.snapchat !== undefined ||
        params.pinterest !== undefined ||
        params.twitch !== undefined ||
        params.youtube !== undefined) {
        if (await verifyUser(params))
            return (undefined);
    }

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
            theme: utils.themeSelection(params.theme),
            facebook: params.facebook,
            twitter: params.twitter,
            snapchat: params.snapchat,
            instagram: params.instagram,
            sexe: params.sexe,
            pinterest: params.pinterest,
            twitch: params.twitch,
            youtube: params.youtube
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

    if (!validation.checkRegex('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{4,12}$', params.password)
        || !validation.checkRegex('^(\\w{4,12})$', params.pseudo))
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
        theme: utils.themeSelection(params.theme),
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
