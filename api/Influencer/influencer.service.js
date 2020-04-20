const   db = require("../_helpers/db"),
        //jwt = require("jsonwebtoken"),
        bcrypt = require("bcrypt"),
        User = db.Influencer,
        Shop = db.Shop,
        CommentMark = require("../CommentMark/commentMark.service"),
        jwtUtils = require("../utils/jwt.utils"),
        GetImage = require("../UploadImage/uploadImage.service"),
        GetAllImage = require("../UploadImage/uploadImage.service");

//Vérifie que le shop existe dans la bdd
async function login(params) {
    const user = await User.findOne({
        where: {
            pseudo: params.pseudo,
        }
    });
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

async function getMyProfile(req) {
    let headerAuth = req.headers['authorization'];
    let userId = jwtUtils.getUserId(headerAuth);

    if (userId < 0)
        return (undefined);

    const list = await User.findOne({
        where: { id: userId },
        attributes: ['id', 'pseudo', 'userType', 'full_name', 'email', 'phone', 'postal', 'city', 'theme',
            'facebook', 'twitter', 'snapchat', 'instagram', 'userDescription']
    });
    if (list === null)
        return (undefined);
    list.userPicture = await GetImage.getImage({
        idLink: userId.toString(),
        type: 'User'
    });
    list.dataValues.comment = await CommentMark.getCommentByUserId(userId.toString());
    list.dataValues.mark = await CommentMark.getMarkByUserId(userId.toString());
    return (list);
}

async function getUserProfile(req) {
    let headerAuth = req.headers['authorization'];
    let userId = jwtUtils.getUserId(headerAuth);
    if (userId < 0)
        return (undefined);

    const list = await User.findOne({
        where: { id: req.params.id },
        attributes: ['id', 'pseudo', 'userType', 'full_name', 'email', 'phone', 'postal', 'city', 'theme',
            'facebook', 'twitter', 'snapchat', 'instagram', 'userDescription']
    });
    if (list === null)
        return (undefined);
    list.userPicture = await GetImage.getImage({
        idLink: req.params.id.toString(),
        type: 'User'
    });
    list.dataValues.comment = await CommentMark.getCommentByUserId(req.params.id.toString());
    list.dataValues.mark = await CommentMark.getMarkByUserId(req.params.id.toString());
    return (list);

}

async function modifyUserProfile(req) {
    let headerAuth = req.headers['authorization'];
    let userId = jwtUtils.getUserId(headerAuth);
    if (userId < 0)
        return (undefined);

    let user = await User.findOne({
        where: {id: userId}
    });

    if (user === null)
        return (undefined);

    Object.keys(req.body).forEach(function (item) {
        console.log(item); // key
        console.log(req.body[item]); // value
        user[item] = req.body[item];
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

    return (user.get( { plain: true } ))

}

async function listShop(req) {
    let headerAuth = req.headers['authorization'];
    let userId = jwtUtils.getUserId(headerAuth);

    if (userId < 0)
        return (undefined);

    const list = await Shop.findAll({
        attributes: ['id', 'pseudo', 'full_name', 'email', 'phone', 'postal', 'city', 'theme',
        'society', 'function', 'userDescription', 'website']
    });
    let newList = await GetImage.regroupImageData(list, 'User');
    return (newList);
}

module.exports = {
    login,
    getMyProfile,
    getUserProfile,
    modifyUserProfile,
    listShop
};