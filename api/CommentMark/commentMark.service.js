const   db = require("../_helpers/db"),
        bcrypt = require("bcrypt"),
        User = db.Influencer,
        Comment = db.Comment,
        Mark = db.Mark,
        Shop = db.Shop,
        GetImage = require("../UploadImage/uploadImage.service"),
        jwtUtils = require("../utils/jwt.utils");

async function getProfile(id) {
    let user = await User.findOne({
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

async function addComment(req) {
    if (req.params === undefined || req.params.id === undefined || req.body.comment === undefined)
        return ({status: 400, message: "Bad Request, Please give id and comment"});
    let userId = jwtUtils.getUserId(req.headers['authorization']);
    let userType = jwtUtils.getUserType(req.headers['authorization']);
    let commentType = await getProfile(req.params.id);
    if (commentType.userType === userType)
        return ({status: 400, message: "Bad Request, you cannot comment on a user in the same category as yours"});
    const dataComment = await Comment.create({
        idUser: req.params.id,
        type: commentType.userType,
        comment: req.body.comment,
        idPost: userId,
    });
    return ({status: 200, message: dataComment.get( { plain: true } )});
}

async function addMark(req) {
    if (req.params === undefined || req.params.id === undefined || req.body.mark === undefined)
        return ({status: 400, message: "Bad Request, Please give id and mark"});
    let userId = jwtUtils.getUserId(req.headers['authorization']);

    let userType = jwtUtils.getUserType(req.headers['authorization']);
    let commentType = await getProfile(req.params.id);
    if (commentType.userType === userType)
        return ({status: 400, message: "Bad Request, you cannot mark on a user in the same category as yours"});

    const dataMark = await Mark.create({
        idUser: req.params.id,
        type: commentType.userType,
        mark: req.body.mark,
        idPost: userId,
    });
    return ({status: 200, message: dataMark.get( { plain: true } )});
}

async function addOfferComment(req) {
    if (req.params === undefined || req.params.id === undefined || req.body.comment === undefined)
        return ({status: 400, message: "Bad Request, Please give id and comment"});
    let userId = jwtUtils.getUserId(req.headers['authorization']);

    const dataComment = await Comment.create({
        idOffer: req.params.id,
        comment: req.body.comment,
        idPost: userId,
    });
    return ({status:200, message: dataComment.get( { plain: true } )});
}

async function addOfferMark(req) {
    if (req.params === undefined || req.params.id === undefined || req.body.mark === undefined)
        return ({status: 400, message: "Bad Request, Please give id and mark"});
    let userId = jwtUtils.getUserId(req.headers['authorization']);

    const dataMark = await Mark.create({
        idOffer: req.params.id,
        mark: req.body.mark,
        idPost: userId,
    });
    return ({status: 200, message: dataMark.get( { plain: true } )});
}

async function getComment(req) {
    if (req.params === undefined || req.params.id === undefined)
        return ({status: 400, message: "Bad Request, Please give a id"});
    let dataComment = await Comment.findAll({
        where: {
            idUser: req.params.id,
        }
    });
    return ({status: 200, message: dataComment});
}

async function getMark(req) {
    if (req.params === undefined || req.params.id === undefined)
        return ({status: 400, message: "Bad Request, Please give a id"});
    const dataMark = await Mark.findAll({
        where: {
            idUser: req.params.id,
        }
    });
    return ({status: 200, message: dataMark});
}

async function getOfferComment(req) {
    if (req.params === undefined || req.params.id === undefined)
        return ({status: 400, message: "Bad Request, Please give a id"});
    let dataComment = await Comment.findAll({
        where: {
            idOffer: req.params.id
        }
    });
    return ({status: 200, message: dataComment});
}

async function getOfferMark(req) {
    if (req.params === undefined || req.params.id === undefined)
        return ({status: 400, message: "Bad Request, Please give a id"});
    const dataMark = await Mark.findAll({
        where: {
            idOffer: req.params.id
        }
    });
    return ({status: 200, message: dataMark});
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
    dataMark = await addUserInformation(dataMark);
    return (dataMark);
}

async function getMarkByOfferId(id) {
    let dataMark = await Mark.findAll({
        where: {
            idOffer: id,
        }
    }).map(el => el.get({ plain: true }));
    dataMark = await addUserInformation(dataMark);
    return (dataMark);
}

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

async function addUserInformation(allComment) {
    if (allComment === null)
        return (undefined);
    for(let i = 0; i < allComment.length; i++) {
        let user = await Shop.findOne({
            where: { id: allComment[i].idPost },
            attributes: ['id', 'pseudo']
        });
        if (user === null) {
            let user = await User.findOne({
                where: { id: allComment[i].idPost },
                attributes: ['id', 'pseudo']
            });
            allComment[i].pseudo = user.dataValues.pseudo
            allComment[i].userPicture = await GetImage.getImage({
                idLink: user.dataValues.id.toString(),
                type: 'User'
            });
            allComment[i].average = await getMarkAverageUser(`${user.dataValues.id}`);
         }
        else {
            allComment[i].pseudo = user.dataValues.pseudo
            allComment[i].userPicture = await GetImage.getImage({
                idLink: user.dataValues.id.toString(),
                type: 'User'
            });
            allComment[i].average = await getMarkAverageUser(`${user.dataValues.id}`);
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