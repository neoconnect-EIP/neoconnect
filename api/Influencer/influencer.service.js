const   db = require("../_helpers/db"),
        bcrypt = require("bcrypt"),
        User = db.Influencer,
        Shop = db.Shop,
        CommentMark = require("../CommentMark/commentMark.service"),
        jwtUtils = require("../utils/jwt.utils"),
        utils = require("../utils/themeSelection"),
        validation = require('../utils/validation'),
        GetImage = require("../UploadImage/uploadImage.service"),
        statService = require("../Stat/stat.service"),
        commentService = require("../CommentMark/commentMark.service"),
        GetAllImage = require("../UploadImage/uploadImage.service");

async function getMyProfile(req) {
    let userId = jwtUtils.getUserId(req.headers['authorization']);

    const list = await User.findOne({
        where: { id: userId },
        attributes: ['id', 'pseudo', 'userType', 'full_name', 'email', 'phone', 'postal', 'city', 'theme',
            'sexe','pinterest','twitch','youtube','facebook', 'twitter', 'snapchat', 'instagram', 'userDescription']
    });
    list.userPicture = await GetImage.getImage({
        idLink: userId.toString(),
        type: 'User'
    });
    list.dataValues.average = await statService.getMarkAverageUser(`${userId}`);
    list.dataValues.comment = await CommentMark.getCommentByUserId(userId.toString());
    list.dataValues.mark = await CommentMark.getMarkByUserId(userId.toString());
    return ({status: 200, message: list});
}

async function getUserProfile(req) {
    if (req.params === undefined || req.params.id === undefined)
        return ({status: 400, message: "Bad Request, Please give a id"});
    const list = await User.findOne({
        where: { id: req.params.id },
        attributes: ['id', 'pseudo', 'userType', 'full_name', 'email', 'phone', 'postal', 'city', 'theme',
           'sexe','pinterest','twitch','youtube','facebook', 'twitter', 'snapchat', 'instagram', 'userDescription']
    });
    if (list === null)
        return ({status: 400, message: "Bad Request, User doesn't exist"});
    list.userPicture = await GetImage.getImage({
        idLink: req.params.id.toString(),
        type: 'User'
    });
    list.dataValues.average = await statService.getMarkAverageUser(`${req.params.id}`);
    list.dataValues.comment = await CommentMark.getCommentByUserId(req.params.id.toString());
    list.dataValues.mark = await CommentMark.getMarkByUserId(req.params.id.toString());
    return ({status:200, message: list});

}

async function modifyUserProfile(req) {
    let userId = jwtUtils.getUserId(req.headers['authorization']);

    let user = await User.findOne({
        where: {id: userId}
    });

    if (user === null)
        return (undefined);

    Object.keys(req.body).forEach(function (item) {
        user["pseudo"] = req.body["pseudo"];
        user["email"] = req.body["email"];
        user["full_name"] = req.body["full_name"];
        user["phone"] = req.body["phone"];
        user["postal"] = req.body["postal"];
        user["city"] = req.body["city"];
        user["theme"] = utils.themeSelection(req.body["theme"]);
        user["userDescription"] = req.body["userDescription"];
        user["sexe"] = req.body["sexe"];
        user["pinterest"] = req.body["pinterest"];
        user["twitch"] = req.body["twitch"];
        user["youtube"] = req.body["youtube"];
        user["facebook"] = req.body["facebook"];
        user["twitter"] = req.body["twitter"];
        user["snapchat"] = req.body["snapchat"];
        user["instagram"] = req.body["instagram"];
    });

    if (req.body.password !== undefined) {
        user['password'] = bcrypt.hashSync(req.body.password, 5);
    }

    if (req.body.userPicture !== undefined) {
        await GetImage.editImage({
            idLink: user.id.toString(),
            type: 'User'
        });
        await GetImage.uploadImage({
            idLink: user.id,
            type: 'User',
            image: [{
                "imageName": `${user.id}_${user.pseudo}`, "imageData": req.body.userPicture}]
        })
    }

    user.save().then(() => {});

    user.userPicture = await GetImage.getImage({
        idLink: userId.toString(),
        type: 'User'
    });

    return ({status:200, message: user.get({ plain: true })})

}

async function listShop(req) {
    const list = await Shop.findAll({
        attributes: ['id', 'pseudo', 'full_name', 'email', 'phone', 'postal', 'city', 'theme',
        'society', 'function', 'userDescription', 'website', 'twitter', 'facebook', 'snapchat', 'instagram']
    });
    let newList = await GetImage.regroupImageData(list, 'User');
    for(let i = 0; i < newList.length; i++) {
        newList[i].dataValues.average = await statService.getMarkAverageUser(`${newList[i].id}`);
        newList[i].dataValues.comment = await commentService.getCommentByUserId(`${newList[i].id}`);
    }
    return ({status: 200, message:newList});
}

module.exports = {
    getMyProfile,
    getUserProfile,
    modifyUserProfile,
    listShop
};
