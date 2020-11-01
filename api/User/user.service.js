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
        statService = require("../Stat/stat.service"),
        verifyDuplicateField = require("../utils/verifyDuplicateFieldUser"),
        commentService = require("../CommentMark/commentMark.service");
        UploadImage = require("../UploadImage/uploadImage.service");

//Vérifie que le shop existe dans la bdd
async function login(params) {
    if (params === undefined || params.pseudo === undefined
        || params.password === undefined)
        return ({status: 400, message: "Bad Request, Please give a pseudo and a password"});
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
            status: 200,
            message: {
                "userId": user.id,
                "userType": user.userType,
                "theme": user.theme,
                "token": jwtUtils.generateTokenForUser(user)
            }
        }
    }
    else
        return ({status: "401", message: "Bad Request, User doesn't exist or password is incorrect"});
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

async function reportUser(req) {
    let headerAuth = req.headers['authorization'];
    let userId = jwtUtils.getUserId(headerAuth);
    if (userId < 0)
        return ({status: 401, message: "Bad Token"});

    let userReported = await Inf.findOne({
            where: {id: req.params.id}
        });
    if (userReported === null)
        {
            userReported = await Shop.findOne({
                where: {id: req.params.id}
            });
        }
    if (userReported === null)
        return ({status: 400, message: "Bad Request: ID inexistant"});
    const { pseudo, subject, message} = req.body;
    if (!pseudo || !subject || !message)
        return ({status: 400, message: "Bad Request: Merci de renseigner les champs suivants pseudo, subject, message"});
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'contact.neoconnect@gmail.com',
            pass: 'neo!support123'
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    var mailOptions = {
        from: "NeoConnect",
        to: 'contact.neoconnect@gmail.com',
        subject: "Signalement d'un utilisateur",
        text: "Signalement de " + pseudo + "\n" + "Sujet: " + subject + "\n" + "Message: " + message
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log("Error :", error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    return ({status: 200, message: "Signalement envoyé pour l'id " + userReported.id});
}

async function deleteUser(req) {
    let headerAuth = req.headers['authorization'];
    let userId = jwtUtils.getUserId(headerAuth);
    if (userId < 0)
        return ({status: 401, message: "Bad token"});
        
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
    if (user != null) {
        await user.destroy();
        return ({status: 200, message: "Utilisateur supprimer"});
    } else {
        return ({status: 400, message: "Utilisateur introuvable"});
    }
}

async function userSuggestion(req) {
    let userId = jwtUtils.getUserId(req.headers['authorization']);
    let userType = jwtUtils.getUserType(req.headers['authorization']);
    if (userId < 0)
        return ({status: 401, message: "Bad Token"});
    let user;
    if (userType === 'influencer')
        user = await Inf.findOne({
        where: { id: userId},
        attributes: ['theme']});
    else
        user = await Shop.findOne({
            where: { id: userId},
            attributes: ['theme']});

    let list;
    if (userType === 'influencer') {
        list = await Shop.findAll({
            where: {theme: user.theme},
            attributes: ['id', 'pseudo', 'full_name', 'email', 'phone', 'postal', 'city', 'theme',
                'society', 'function', 'userDescription', 'website', 'twitter', 'facebook', 'snapchat', 'instagram'],
            limit: 5
        });
    } else {
        list = await Inf.findAll({
            where: {theme: user.theme},
            attributes: ['id', 'pseudo', 'full_name', 'email', 'phone', 'postal', 'city', 'theme',
                'facebook', 'sexe', 'pinterest', 'twitch', 'youtube', 'twitter', 'snapchat', 'instagram', 'userDescription'],
            limit: 5
        });
    }
    if (list.length === 0)
        return ({status: 400, message: "No Data"});
    let newList = await UploadImage.regroupImageData(list, 'User');
    for(let i = 0; i < newList.length; i++) {
        newList[i].dataValues.average = await statService.getMarkAverageUser(`${newList[i].id}`);
        newList[i].dataValues.comment = await commentService.getCommentByUserId(`${newList[i].id}`);
    }
    return ({status: 200, message:newList});
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
        params.email === undefined)
        return ({status: 400, message: "Bad Request, Please give a pseudo, email and a password"});
    if ((await Inf.findOne({where: {pseudo: params.pseudo}})) ||
        (await Shop.findOne({where: {pseudo: params.pseudo}})))
        return ({status: 400, message: "Bad Request, User already exist"});
    if (!validation.checkRegex('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{4,18}$', params.password))
        return ({status: 400, message: "Invalid password, the password must contain at least 1 capital letter, 1 small letter, 1 number and must be between 4 and 18 characters"});
    if (!validation.checkRegex('^(\\w{4,24})$', params.pseudo))
        return ({status: 400, message: "Invalid Pseudo, the pseudo must be between 4 and 24 characters"});

    let duplicate = await verifyDuplicateField.checkDuplicateField(params);
    if (!duplicate)
        return ({status: 400, message: "Error, account already exists"});

    if (params.instagram !== undefined ||
        params.twitter !== undefined ||
        params.facebook !== undefined ||
        params.snapchat !== undefined ||
        params.pinterest !== undefined ||
        params.twitch !== undefined ||
        params.youtube !== undefined) {
        if (await verifyUser(params))
            return ({status: 400, message: "Invalid social network account"});
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
            youtube: params.youtube,
            visitNumber: 0
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
        status: 200,
        message: {
            "token" : jwtUtils.generateTokenForUser(user)
        }
    }
}

async function registerShop(params) {
    if (params === undefined
        || params.pseudo === undefined
        || params.password === undefined
        || params.email === undefined)
        return ({status: 400, message: "Bad Request, Please give a pseudo, email and a password"});
    if (await Shop.findOne({where: {pseudo: params.pseudo}}) ||
        await Inf.findOne({where: {pseudo: params.pseudo}}))
        return ({status: 400, message: "Bad Request, User already exist"});
    if (!validation.checkRegex('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{4,18}$', params.password))
        return ({status: 400, message: "Invalid password, the password must contain at least 1 capital letter, 1 small letter, 1 number and must be between 4 and 18 characters"});
    if (!validation.checkRegex('^(\\w{4,24})$', params.pseudo))
        return ({status: 400, message: "Invalid Pseudo, the pseudo must be between 4 and 24 characters"});

    let duplicate = await verifyDuplicateField.checkDuplicateField(params);
    if (!duplicate)
        return ({status: 400, message: "Error, account already exists"});

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
        instagram: params.instagram,
        visitNumber: 0
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
        status: 200,
        message: {
            "token": jwtUtils.generateTokenForUser(user)
        }
    }
}

module.exports = {
    login,
    reportUser,
    deleteUser,
    userSuggestion,
    registerInf,
    registerShop,
    getProfile
};
