const   db = require("../_helpers/db"),
        Shop = db.Shop,
        User = db.Influencer,
        CommentMark = require("../CommentMark/commentMark.service"),
        bcrypt = require("bcrypt"),
        jwtUtils = require("../utils/jwt.utils"),
        utils = require("../utils/themeSelection"),
        GetImage = require("../UploadImage/uploadImage.service"),
        statService = require("../Stat/stat.service"),
        commentService = require("../CommentMark/commentMark.service"),
        GetAllImage = require("../UploadImage/uploadImage.service");

async function getMyProfile(req) {
    let userId = jwtUtils.getUserId(req.headers['authorization']);
    
    const list = await Shop.findOne({
        where: { id: userId },
        attributes: ['id', 'pseudo', 'userType', 'full_name', 'email', 'phone', 'postal', 'city', 'userDescription', 'theme',
            'society', 'function', 'website', 'twitter', 'facebook', 'snapchat', 'instagram']
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
    const list = await Shop.findOne({
        where: { id: req.params.id },
        attributes: ['id', 'pseudo', 'userType', 'full_name', 'email', 'phone', 'postal', 'city', 'userDescription', 'theme',
            'society', 'function', 'website', 'twitter', 'facebook', 'snapchat', 'instagram']
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

    let user = await Shop.findOne({
        where: {id: userId}
    });

    Object.keys(req.body).forEach(function (item) {
        user["pseudo"] = req.body["pseudo"];
        user["email"] = req.body["email"];
        user["full_name"] = req.body["full_name"];
        user["phone"] = req.body["phone"];
        user["postal"] = req.body["postal"];
        user["city"] = req.body["city"];
        user["theme"] = utils.themeSelection(req.body["theme"]);
        user["userDescription"] = req.body["userDescription"];
        user["facebook"] = req.body["facebook"];
        user["twitter"] = req.body["twitter"];
        user["snapchat"] = req.body["snapchat"];
        user["instagram"] = req.body["instagram"];
        user["society"] = req.body["society"];
        user["function"] = req.body["function"];
        user["website"] = req.body["website"];
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

async function listInf(req) {
    const list = await User.findAll({
        attributes: ['id', 'pseudo', 'full_name', 'email', 'phone', 'postal', 'city', 'theme',
        'facebook', 'sexe', 'pinterest', 'twitch', 'youtube', 'twitter', 'snapchat', 'instagram', 'userDescription']
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
    listInf
};
