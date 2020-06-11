const   db = require("../_helpers/db"),
        bcrypt = require("bcrypt"),
        User = db.Influencer,
        Comment = db.Comment,
        Mark = db.Mark,
        Shop = db.Shop,
        jwtUtils = require("../utils/jwt.utils");
        userService = require("../User/user.service");

async function addComment(req) {
    let userId = jwtUtils.getUserId(req.headers['authorization']);
    let userType = jwtUtils.getUserType(headerAuth);
    let commentType = await userService.getProfile(req.params.id);
    if (commentType.userType === userType)
        return (undefined);

    console.log(commentType);
    console.log(userId);
    const dataComment = await Comment.create({
        idUser: req.params.id,
        type: commentType.userType,
        comment: req.body.comment,
        idPost: userId,
    });
    return (dataComment.get( { plain: true } ));
}

async function addMark(req) {
    let userId = jwtUtils.getUserId(req.headers['authorization']);

    let userType = jwtUtils.getUserType(headerAuth);
    let commentType = await userService.getProfile(req.params.id);
    if (commentType.userType === userType)
        return (undefined);

    const dataMark = await Mark.create({
        idUser: req.params.id,
        type: commentType.userType,
        mark: req.body.mark,
        idPost: userId,
    });
    return (dataMark.get( { plain: true } ));
}

async function addOfferComment(req) {
    let userId = jwtUtils.getUserId(req.headers['authorization']);

    const dataComment = await Comment.create({
        idOffer: req.params.id,
        comment: req.body.comment,
        idPost: userId,
    });
    return (dataComment.get( { plain: true } ));
}

async function addOfferMark(req) {
    let userId = jwtUtils.getUserId(req.headers['authorization']);

    const dataMark = await Mark.create({
        idOffer: req.params.id,
        mark: req.body.mark,
        idPost: userId,
    });
    return (dataMark.get( { plain: true } ));
}

async function getComment(req) {
    let dataComment = await Comment.findAll({
        where: {
            idUser: req.params.id,
        }
    });
    return (dataComment);
}

async function getMark(req) {
    const dataMark = await Mark.findAll({
        where: {
            idUser: req.params.id,
        }
    });
    return (dataMark);
}

async function getOfferComment(req) {
    let dataComment = await Comment.findAll({
        where: {
            idOffer: req.params.id
        }
    });
    return (dataComment);
}

async function getOfferMark(req) {
    const dataMark = await Mark.findAll({
        where: {
            idOffer: req.params.id
        }
    });
    return (dataMark);
}

async function getCommentByUserId(id) {
    let dataComment = await Comment.findAll({
        where: {
            idUser: id,
        }
    }).map(el => el.get({ plain: true }));
    dataComment = await addUserInformation(dataComment);
    return (dataComment);
}

async function getCommentByOfferId(id) {
    let dataComment = await Comment.findAll({
        where: {
            idOffer: id,
        }
    }).map(el => el.get({ plain: true }));
    dataComment = await addUserInformation(dataComment);
    return (dataComment);
}

async function getMarkByUserId(id) {
        let dataMark = await Mark.findAll({
        where: {
            idUser: id,
        }
    }).map(el => el.get({ plain: true }));
    return (dataMark);
}

async function getMarkByOfferId(id) {
    let dataMark = await Mark.findAll({
        where: {
            idOffer: id,
        }
    }).map(el => el.get({ plain: true }));
    return (dataMark);
}

async function addUserInformation(allComment) {
    if (allComment === null)
        return (undefined);
    for(let i = 0; i < allComment.length; i++) {
        let user = await Shop.findOne({
            where: { id: allComment[i].idPost },
            attributes: ['pseudo']
        });
        if (user === null) {
            let user = await User.findOne({
                where: { id: allComment[i].idPost },
                attributes: ['pseudo']
            });
            allComment[i].pseudo = user.dataValues.pseudo
        }
        else {
            allComment[i].pseudo = user.dataValues.pseudo
        }
    }
    return (allComment);
}

module.exports = {
    addComment,
    addMark,
    addOfferComment,
    addOfferMark,
    getComment,
    getMark,
    getOfferComment,
    getOfferMark,
    getCommentByUserId,
    getMarkByUserId,
    getCommentByOfferId,
    getMarkByOfferId
};