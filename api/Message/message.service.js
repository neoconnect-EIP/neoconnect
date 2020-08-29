const   db = require("../_helpers/db"),
    User = db.Influencer,
    Shop = db.Shop,
    Message = db.Message,
    jwtUtils = require("../utils/jwt.utils"),
    GetImage = require("../UploadImage/uploadImage.service"),
    validation = require('../utils/validation');

async function get(req) {
    let userId = jwtUtils.getUserId(req.headers['authorization']);
    let message = await Message.findAll({
        where: {user_1: userId.toString()},
        attributes: ['id', 'user_1', 'user_2', 'createdAt', 'updatedAt']
    });
    message = message.concat(await Message.findAll({
        where: {user_2: userId.toString()},
        attributes: ['id', 'user_1', 'user_2', 'createdAt', 'updatedAt']
    }));

    for (let i = 0; i < message.length; i++) {
        let userPseudo = message[i].user_1;
        if (message[i].user_1 === userId.toString())
            userPseudo = message[i].user_2;
        let user = (await User.findOne({where: {id: userPseudo}, attributes: ['id', 'pseudo']}));
        if (user != null) {
            message[i].dataValues.pseudo = user.pseudo;
            message[i].dataValues.userPicture = await GetImage.getImage({
                idLink: user.id.toString(),
                type: 'User'
            });
        } else {
            user = await Shop.findOne({where: {id: userPseudo}, attributes: ['id', 'pseudo']});
            message[i].dataValues.pseudo = user.pseudo;
            message[i].dataValues.userPicture = await GetImage.getImage({
                idLink: user.id.toString(),
                type: 'User'
            });
        }   
    }
    return ({status: 200, message: message});
}

async function getById(id) {
    if (id === undefined || id === '')
        return ({status: 400, message: "Bad request, No Id"});
    let chan = await Message.findOne({where: {id: id}});
    if (!chan)
        return ({status: 400, message: "No Channel with this id"});
    chan = JSON.parse(chan.data);
    return({status: 200, message: chan})
}

async function add(req) {
    let userId = jwtUtils.getUserId(req.headers['authorization']);
    if (req.body.userId === undefined || req.body.message === undefined ||
        req.body.message === '' || req.body.userId === '')
        return ({status: 400, message: "Bad request"});
    if (userId.toString() === req.body.userId)
        return ({status: 400, message: "Same Id"});
    let user = await User.findOne({where: {id: userId}});
    if (!user)
        user = await Shop.findOne({where: {id: userId}});
    if (!user)
        return ({status: 400, message: "No user"});
    let toUser = await Shop.findOne({where: {id: req.body.userId}});
    if (!toUser)
        toUser = await User.findOne({where: {id: req.body.userId}});
    if (!toUser)
        return ({status: 400, message: "No user"});
    let chan = await Message.findOne({where: {user_1: userId.toString(), user_2: req.body.userId}});
    if (!chan)
        chan = await Message.findOne({where: {user_2: userId.toString(), user_1: req.body.userId}});
    if (!chan) {
        let data = {
            data: [{
                userId: userId,
                pseudo: user.pseudo,
                message: req.body.message,
                date: new Date()
            }]
        };
        const channel = await Message.create({
            user_1: userId,
            user_2: req.body.userId,
            data : JSON.stringify(data).toString()
        });
        return ({status: 200, message: "OK"});
    }
    let data = JSON.parse(chan.data);
    data.data.push({
        userId: userId,
        pseudo: user.pseudo,
        message: req.body.message,
        date: new Date()
    });
    chan['data'] = JSON.stringify(data).toString();
    await chan.save().then(() => {});
    return ({status: 200, message: "Ok"})
}

module.exports = {
    get,
    getById,
    add
};
