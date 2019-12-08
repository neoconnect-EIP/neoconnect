const   db = require("../_helpers/db"),
        bcrypt = require("bcrypt"),
        User = db.Influencer,
        Comment = db.Comment,
        Mark = db.Mark,
        Shop = db.Shop,
        jwtUtils = require("../utils/jwt.utils");

async function addComment(req) {
    let headerAuth = req.headers['authorization'];
    let userId = jwtUtils.getUserId(headerAuth);
    if (userId < 0)
        return (userId);

    const dataComment = await Comment.create({
        idUser: req.params.id,
        type: req.body.type,
        comment: req.body.comment
    });
    return (dataComment.get( { plain: true } ));
}

async function addMark(req) {
    let headerAuth = req.headers['authorization'];
    let userId = jwtUtils.getUserId(headerAuth);
    if (userId < 0)
        return (undefined);

    const dataMark = await Mark.create({
        idUser: req.params.id,
        type: req.body.type,
        mark: req.body.mark
    });
    return (dataMark.get( { plain: true } ));
}

async function getComment(req) {
    let headerAuth = req.headers['authorization'];
    let userId = jwtUtils.getUserId(headerAuth);
    if (userId < 0)
        return (userId);

    let dataComment = await Comment.findAll({
        where: {
            idUser: req.params.id,
            type: req.params.type
        }
    });
    return (dataComment);
}

async function getMark(req) {
    let headerAuth = req.headers['authorization'];
    let userId = jwtUtils.getUserId(headerAuth);
    if (userId < 0)
        return (userId);

    const dataMark = await Mark.findAll({
        where: {
            idUser: req.params.id,
            type: req.params.type
        }
    });
    return (dataMark);
}

module.exports = {
    addComment,
    addMark,
    getComment,
    getMark
};