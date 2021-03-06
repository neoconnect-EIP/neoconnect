const   db = require("../_helpers/db"),
        bcrypt = require("bcrypt"),
        User = db.Influencer,
        Shop = db.Shop,
        Offer = db.Offre,
        Follow = db.Follow,
        CommentMark = require("../CommentMark/commentMark.service"),
        jwtUtils = require("../utils/jwt.utils"),
        utils = require("../utils/themeSelection"),
        validation = require('../utils/validation'),
        getFollowers = require('../utils/getFollowers'),
        GetImage = require("../UploadImage/uploadImage.service"),
        statService = require("../Stat/stat.service"),
        commentService = require("../CommentMark/commentMark.service"),
        verifyDuplicateField = require("../utils/verifyDuplicateFieldUser"),
        ShopService = require("../Shop/shop.service"),
        GetAllImage = require("../UploadImage/uploadImage.service"),
        OfferApply = db.OfferApply;

async function updateFollowers() {
    const list = await User.findAll();
    for (let i = 0; i < list.length; i++) {
        getFollowers.getTiktokFollowers(list[i]);
        getFollowers.getPinterestFollowers(list[i]);
        getFollowers.getTwitchFollowers(list[i]);
        getFollowers.getInstagramFollowers(list[i]);
        getFollowers.getTwitterFollowers(list[i]);
        getFollowers.getYoutubeFollowers(list[i]);
    }
}

setInterval(updateFollowers, 3600000); 

async function getMyProfile(req) {
    let userId = jwtUtils.getUserId(req.headers['authorization']);

    const list = await User.findOne({
        where: { id: userId },
        attributes: {exclude: ['password']}
    });
    list.userPicture = await GetImage.getImage({
        idLink: userId.toString(),
        type: 'User'
    });
    list.dataValues.average = await statService.getMarkAverageUser(`${userId}`);
    list.dataValues.comment = await CommentMark.getCommentByUserId(userId.toString());
    list.dataValues.mark = await CommentMark.getMarkByUserId(userId.toString());
    let offerApplied = await OfferApply.findAll({
        where: {idUser: userId}
    });
    list.dataValues.nbOfferApplied = offerApplied.length;
    return ({status: 200, message: list});
}

async function getUserProfile(req) {
    if (req.params === undefined || req.params.id === undefined)
        return ({status: 400, message: "Bad Request, Please give a id"});
    let list = await User.findOne({
        where: { id: req.params.id },
        attributes: ['id', 'pseudo', 'userType', 'full_name', 'email', 'phone', 'postal', 'city', 'theme',
           'sexe', 'tiktok', 'pinterest','twitch','youtube','facebook', 'twitter', 'snapchat', 'instagram', 'userDescription',
            'visitNumber', 'countParrainage', 'codeParrainage']
    });
    if (list === null)
        return ({status: 400, message: "Bad Request, User doesn't exist"});
    list["visitNumber"] = list.visitNumber + 1;
    list.save().then(() => {});
    list.userPicture = await GetImage.getImage({
        idLink: req.params.id.toString(),
        type: 'User'
    });
    list.dataValues.average = await statService.getMarkAverageUser(`${req.params.id}`);
    list.dataValues.comment = await CommentMark.getCommentByUserId(req.params.id.toString());
    list.dataValues.mark = await CommentMark.getMarkByUserId(req.params.id.toString());
    let offerApplied = await OfferApply.findAll({
        where: {idUser: req.params.id}
    });
    list.dataValues.nbOfferApplied = offerApplied.length;
    return ({status:200, message: list});

}

async function modifyUserProfile(req) {
    let userId = jwtUtils.getUserId(req.headers['authorization']);

    let user = await User.findOne({
        where: {id: userId}
    });

    if (user === null)
        return ({status:400, message: "No User"});

    let duplicate = await verifyDuplicateField.checkDuplicateInfField(req.body);
    if (!duplicate)
        return ({status: 400, message: "Error, account already exists"});

    let date = new Date();
    let dateUpdate = date.getDate().toString() + "/" + (date.getMonth() + 1).toString() + "-" + date.getHours().toString() + "H";
    if (user["youtube"] != req.body["youtube"] && req.body["youtube"]) {
        user["youtubeNb"] = [await getFollowers.setupYoutubeFollowers(req.body)]
        user["youtubeUpdateDate"] = [dateUpdate]
    }
    if (user["twitter"] != req.body["twitter"] && req.body["twitter"]) {
        user["twitterNb"] = [await getFollowers.setupTwitterFollowers(req.body)]
        user["twitterUpdateDate"] = [dateUpdate]
    }
    if (user["tiktok"] != req.body["tiktok"] && req.body["tiktok"]) {
        user["tiktokNb"] = [await getFollowers.setupTiktokFollowers(req.body)]
        user["tiktokUpdateDate"] = [dateUpdate]
    }
    if (user["twitch"] != req.body["twitch"] && req.body["twitch"]) {
        user["twitchNb"] = [await getFollowers.setupTwitchFollowers(req.body)]
        user["twitchUpdateDate"] = [dateUpdate]
    }
    if (user["instagram"] != req.body["instagram"] && req.body["instagram"]) {
        user["instagramNb"] = [await getFollowers.setupInstagramFollowers(req.body)]
        user["instagramUpdateDate"] = [dateUpdate]
    }
    if (user["tiktok"] != req.body["tiktok"] && req.body["tiktok"]) {
        user["tiktokNb"] = [await getFollowers.setupTiktokFollowers(req.body)]
        user["tiktokUpdateDate"] = [dateUpdate]
    }
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
        user["tiktok"] = req.body["tiktok"];
        user["pinterest"] = req.body["pinterest"];
        user["twitch"] = req.body["twitch"];
        user["youtube"] = req.body["youtube"];
        user["facebook"] = req.body["facebook"];
        user["twitter"] = req.body["twitter"];
        user["snapchat"] = req.body["snapchat"];
        user["instagram"] = req.body["instagram"];
    });

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
    let userId = jwtUtils.getUserId(req.headers['authorization']);
    const list = await Shop.findAll({
        attributes: ['id', 'pseudo', 'full_name', 'email', 'phone', 'postal', 'city', 'theme',
        'society', 'function', 'userDescription', 'website', 'twitter', 'facebook', 'snapchat', 'instagram']
    });
    
    let newList = await GetImage.regroupImageData(list, 'User');
    for(let i = 0; i < newList.length; i++) {
        newList[i].dataValues.average = await statService.getMarkAverageUser(`${newList[i].id}`);
        newList[i].dataValues.comment = await commentService.getCommentByUserId(`${newList[i].id}`);
        newList[i].dataValues.follow = await ShopService.getFollow(newList[i].id, userId)
        let listShop = await Offer.findAll({
            where: {idUser: newList[i].id}
        });
        newList[i].dataValues.nbOfferPosted = listShop.length
        let allFollow = await Follow.findAll({
            where: { idFollow: newList[i].id},
            attributes: ['idUser', 'idFollow']
        });
        newList[i].dataValues.nbFollows = allFollow.length;
    }
    return ({status: 200, message:newList});
}

async function searchInf(req) {
    let headerAuth = req.headers['authorization'];
    let userId = jwtUtils.getUserId(headerAuth);
    if (userId < 0)
        return ({status:401, message: "Bad Token"});
    if (req.body === undefined || req.body.pseudo === undefined) {
        return (undefined);
    }
    let list = await User.findOne({
        where: { pseudo: req.body.pseudo},
        attributes: ['id', 'pseudo', 'userType','userDescription', 'theme', 'email', 'phone',
        'countParrainage', 'codeParrainage']
    });
    if (list === null)
        return (undefined);
    list.userPicture = await UploadImage.getImage({
        idLink: list.id.toString(),
        type: 'User'
    });
    list.dataValues.average = await statService.getMarkAverageUser(`${list.id}`);
    list.dataValues.comment = await CommentMark.getCommentByUserId(list.id.toString());
    list.dataValues.mark = await CommentMark.getMarkByUserId(list.id.toString());
    let offerApplied = await OfferApply.findAll({
        where: {idUser: list.id.toString(), status: "accepted"}
    });
    list.dataValues.nbOfferApplied = offerApplied.length;
    return (list);
}

module.exports = {
    getMyProfile,
    getUserProfile,
    modifyUserProfile,
    listShop,
    searchInf,
    updateFollowers
};
