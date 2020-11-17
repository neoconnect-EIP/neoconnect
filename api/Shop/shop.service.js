const   db = require("../_helpers/db"),
        Shop = db.Shop,
        User = db.Influencer,
        Mark = db.Mark,
        Follow = db.Follow,
        Offer = db.Offre,
        CommentMark = require("../CommentMark/commentMark.service"),
        bcrypt = require("bcrypt"),
        jwtUtils = require("../utils/jwt.utils"),
        utils = require("../utils/themeSelection"),
        GetImage = require("../UploadImage/uploadImage.service"),
        commentService = require("../CommentMark/commentMark.service"),
        verifyDuplicateField = require("../utils/verifyDuplicateFieldUser"),
        GetAllImage = require("../UploadImage/uploadImage.service"),
        OfferApply = db.OfferApply;

async function getMarkAverageUser(id) {
    if (id === undefined)
        return (undefined);
    let allMark = await Mark.findAll({
        where: { idUser : id.toString() },
        attributes: ['mark']
    });
    if (allMark.length === 0)
        return (null);
    let array = [];
    for (let i = 0; i < allMark.length; i++) {
        array.push(parseInt(allMark[i].dataValues.mark))
    }
    let average = (array) => array.reduce((a, b) => a + b) / array.length;
    return (average(array));
}

async function getMarkAverageOffer(id) {
    if (id === undefined)
        return (undefined);
    let allMark = await Mark.findAll({
        where: {idOffer: id.toString()},
        attributes: ['mark']
    });
    if (allMark.length === 0)
        return (null);
    let array = [];
    for (let i = 0; i < allMark.length; i++) {
        array.push(parseInt(allMark[i].dataValues.mark))
    }
    let average = (array) => array.reduce((a, b) => a + b) / array.length;
    return (average(array));
}

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
    list.dataValues.average = await getMarkAverageUser(`${userId}`);
    let listOffer = await Offer.findAll({
        where: {idUser: userId.toString()}
    });
    if (listOffer === undefined || listOffer.length === 0) {
        list.dataValues.average = 0;
    } else {
        let avg = 0;
        for (let i = 0; i < listOffer.length; i++) {
            avg += await getMarkAverageOffer(`${listOffer[i].id}`)
        }
        list.dataValues.average = avg / listOffer.length;
    }
    list.dataValues.mark = await CommentMark.getMarkByUserId(userId.toString());
    list.dataValues.comment = await CommentMark.getCommentByUserId(userId.toString());
    let listShop = await Offer.findAll({
        where: {idUser: userId}
    });
    list.dataValues.nbOfferPosted = listShop.length;
    return ({status: 200, message: list});
}

async function getUserProfile(req) {
    if (req.params === undefined || req.params.id === undefined)
        return ({status: 400, message: "Bad Request, Please give a id"});
    let userId = jwtUtils.getUserId(req.headers['authorization']);
    const list = await Shop.findOne({
        where: { id: req.params.id },
        attributes: ['id', 'pseudo', 'userType', 'full_name', 'email', 'phone', 'postal', 'city', 'userDescription', 'theme',
            'society', 'function', 'website', 'twitter', 'facebook', 'snapchat', 'instagram', 'visitNumber', 'countParrainage', 'codeParrainage']
    });
    if (list === null)
        return ({status: 400, message: "Bad Request, User doesn't exist"});
    list["visitNumber"] = list.visitNumber + 1;
    list.save().then(() => {});
    list.userPicture = await GetImage.getImage({
        idLink: req.params.id.toString(),
        type: 'User'
    });
    list.dataValues.average = await getMarkAverageUser(`${req.params.id}`);
    list.dataValues.comment = await CommentMark.getCommentByUserId(req.params.id.toString());
    list.dataValues.mark = await CommentMark.getMarkByUserId(req.params.id.toString());
    list.dataValues.follow = await getFollow(req.params.id, userId);
    let listShop = await Offer.findAll({
        where: {idUser: req.params.id}
    });
    list.dataValues.nbOfferPosted = listShop.length;
    let allFollow = await Follow.findAll({
        where: { idFollow: req.params.id},
        attributes: ['idUser', 'idFollow']
    });
    list.dataValues.nbFollows = allFollow.length;
    return ({status:200, message: list});
}

async function modifyUserProfile(req) {
    let userId = jwtUtils.getUserId(req.headers['authorization']);

    let user = await Shop.findOne({
        where: {id: userId}
    });

    let duplicate = await verifyDuplicateField.checkDuplicateField(req.body);
    if (!duplicate)
        return ({status: 400, message: "Error, account already exists"});


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
        newList[i].dataValues.average = await getMarkAverageUser(`${newList[i].id}`);
        newList[i].dataValues.comment = await commentService.getCommentByUserId(`${newList[i].id}`);
        let offerApplied = await OfferApply.findAll({
            where: {idUser: newList[i].id.toString(), status: "accepted"}
        });
        newList[i].dataValues.nbOfferApplied = offerApplied.length;
    }
    return ({status: 200, message:newList});
}

async function searchShop(req) {
    let headerAuth = req.headers['authorization'];
    let userId = jwtUtils.getUserId(headerAuth);
    if (userId < 0)
        return (undefined);

    if (req.body === undefined || req.body.pseudo === undefined) {
        return (undefined);
    }

    let list = await Shop.findOne({
        where: { pseudo: req.body.pseudo},
        attributes: ['id', 'pseudo', 'userType', 'userDescription', 'theme', 'email', 'phone', 'visitNumber', 'countParrainage', 'codeParrainage']
    });
    if (list === null)
        return (undefined);
    list["visitNumber"] = list.visitNumber + 1;
    list.save().then(() => {});
    list.userPicture = await UploadImage.getImage({
        idLink: list.id.toString(),
        type: 'User'
    });
    list.dataValues.average = await getMarkAverageUser(`${list.id}`);
    list.dataValues.comment = await CommentMark.getCommentByUserId(list.id.toString());
    list.dataValues.mark = await CommentMark.getMarkByUserId(list.id.toString());
    let listShop = await Offer.findAll({
        where: {idUser: list.id}
    });
    list.dataValues.nbOfferPosted = listShop.length;
    let follow = await Follow.findOne({
        where: { idUser: userId, idFollow: list.id}
    });
    if (follow != null) {
        list.dataValues.follow = true
    } else {
        list.dataValues.follow = false
    }
    
    let allFollow = await Follow.findAll({
        where: { idFollow: list.id},
        attributes: ['idUser', 'idFollow']
    });
    list.dataValues.nbFollows = allFollow.length;
    return (list);
}

async function followShop(req) {
    if (req.params.id === undefined)
        return ({status: 400, message: "Bad request, this request need id"});
    let userId = jwtUtils.getUserId(req.headers['authorization']);
    let userType = jwtUtils.getUserType(req.headers['authorization']);
    if (userType !== 'influencer')
        return ({status: 401, message: "Unauthorized"});
    let user = await User.findOne({
        where: { id: userId},
        attributes: ['id']
    });
    let shop = await Shop.findOne({
        where: { id: req.params.id},
        attributes: ['id']
    });
    if (user === null || shop === null)
        return ({status: 401, message: "User doesn't exist"});
    let follow = await Follow.findOne({
        where: { idUser: user.id, idFollow: shop.id}
    });
    if (follow !== null)
        return ({status: 400, message: "Bad request, your already follow this shop"});
    await Follow.create({
        idUser: user.id,
        idFollow: shop.id
    });
    return ({status: 200, message: "Follow success"});
}

async function unfollowShop(req) {
    if (req.params.id === undefined)
        return ({status: 400, message: "Bad request, this request need id"});
    let userId = jwtUtils.getUserId(req.headers['authorization']);
    let userType = jwtUtils.getUserType(req.headers['authorization']);
    if (userType !== 'influencer')
        return ({status: 401, message: "Unauthorized"});
    let follow = await Follow.findOne({
        where: { idUser: userId, idFollow: req.params.id}
    });
    if (follow === null)
        return ({status: 400, message: "Bad request, your don't follow this shop"});
    await follow.destroy();
    return ({status: 200, message: "Unfollowed success"});
}

async function getFollow(idShop, idUser) {
    if (!await Follow.findOne({
        where: { idUser: idUser, idFollow: idShop}
    }))
        return (false);
    return (true)
}

async function getAllFollow(req) {
    if (req.params.id === undefined)
        return ({status: 400, message: "Bad request, this request need id"});
    let follow = await Follow.findAll({
        where: { idFollow: req.params.id},
        attributes: ['idUser', 'idFollow']
    });
    if (follow === null)
        return ({status: 200, message: follow});
    for (let i = 0; i < follow.length; i++) {
        let tmp = await User.findOne({where:{id: follow[i].idUser}, attributes: ['id', 'pseudo', 'email']});
        follow[i].dataValues.id = tmp.id;
        follow[i].dataValues.pseudo = tmp.pseudo;
        follow[i].dataValues.email = tmp.email;
    }
    return ({status: 200, message: follow});
}

async function getMyFollowUps(req) {
    let userId = jwtUtils.getUserId(req.headers['authorization']);
    let userType = jwtUtils.getUserType(req.headers['authorization']);
    if (userType !== 'influencer')
        return ({status: 401, message: "Unauthorized"});
    let follow = await Follow.findAll({
        where: { idUser: userId},
        attributes: ['idUser', 'idFollow']
    });
    if (follow === null)
        return ({status: 200, message: follow});
    for (let i = 0; i < follow.length; i++) {
        let tmp = await Shop.findOne({where:{id: follow[i].idFollow}, attributes: ['id', 'pseudo', 'email']});
        follow[i].dataValues.id = tmp.id;
        follow[i].dataValues.pseudo = tmp.pseudo;
        follow[i].dataValues.email = tmp.email;
    }
    return ({status: 200, message: follow});
}



module.exports = {
    getMyProfile,
    getUserProfile,
    modifyUserProfile,
    listInf,
    searchShop,
    followShop,
    unfollowShop,
    getAllFollow,
    getMyFollowUps,
    getFollow
};
