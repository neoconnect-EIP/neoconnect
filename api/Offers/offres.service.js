const   jwt = require("jsonwebtoken"),
		db = require("../_helpers/db"),
		bcrypt = require("bcrypt"),
        Offer = db.Offre,
    	Shop = db.Shop,
        User = db.Influencer,
        OfferApply = db.OfferApply,
        Follow = db.Follow,
        config = require("../config"),
		jwtUtils = require("../utils/jwt.utils"),
        UploadImage = require("../UploadImage/uploadImage.service"),
        GetImage = require("../UploadImage/uploadImage.service"),
        GetAllImage = require("../UploadImage/uploadImage.service"),
        commentService = require("../CommentMark/commentMark.service");
        statService = require("../Stat/stat.service");
        nodemailer = require('nodemailer');


module.exports = {
	insert,
	getAll,
	getById,
    getByShop,
	update,
    apply,
    removeApply,
	delete: _delete,
    getApplyOffer,
    getApplyUser,
    shareOffer,
    reportOffer,
    sharePublication,
    offerSuggestion,
    chooseApply
};

async function paramOffer(req) {
    let list = undefined;
    if (req.hasOwnProperty('order')) {
        var orderValue = req['order'];
        delete req['order'];
        list = await Offer.findAll({
            order: [['updatedAt', orderValue]],
            where: req
        })
    } else {
        list = await Offer.findAll({
            where: req
        })
    }
    return (list)
}

async function getAll(req) {
    let list = undefined;
    if (Object.keys(req.query).length !== 0)
        list = await paramOffer(req.query);
    else
        list = await Offer.findAll();
    let newList = await GetImage.regroupImageData(list, 'Offer');
    for(let i = 0; i < newList.length; i++) {
        newList[i].dataValues.average = await statService.getMarkAverageOffer(`${newList[i].id}`);
        newList[i].dataValues.comment = await commentService.getCommentByOfferId(`${newList[i].id}`);
    }
    return ({status: 200, message: newList});
}

async function getById(req) {
    if (req.params === undefined || req.params.id === undefined)
        return ({status: 400, message: "Bad Request, Please give a id"});
    let user = await Offer.findOne({
        where: {id: req.params.id}
    });
    if (user === null)
        return ({status: 400, message: "Bad id, Offer doesn't exist"});
    user["visitNumber"] = user.visitNumber + 1;
    user.save().then(() => {});
    const dataImage = await GetImage.getImage({
        idLink: user.id.toString(),
        type: 'Offer'
    });
    user.productImg = dataImage;
    user.dataValues.average = await statService.getMarkAverageOffer(`${user.id}`);
    user.dataValues.comment = await commentService.getCommentByOfferId(`${user.id}`);
    return ({status: 200, message: user});
}

async function getByShop(req) {
    if (req.params === undefined || req.params.id === undefined)
        return ({status: 400, message: "Bad Request, Please give a id"});
    let listShop = await Offer.findAll({
        where: {idUser: req.params.id}
    });
    if (listShop.length === 0)
        return ({status: 200, message: listShop});
    if (listShop === undefined || listShop.length === 0)
        return ({status: 400, message: "No shop"});
    let newList = await GetImage.regroupImageData(listShop, 'Offer');
    for(let i = 0; i < newList.length; i++) {
        newList[i].dataValues.average = await statService.getMarkAverageOffer(`${newList[i].id}`);
        newList[i].dataValues.comment = await commentService.getCommentByOfferId(`${newList[i].id}`);
    }
    return ({status: 200, message: newList});
}

function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

async function insert(req) {
    let userId = jwtUtils.getUserId(req.headers['authorization']);
    const user = await Offer.create({
        idUser: userId,
		productName: req.body.productName,
		productSex: req.body.productSex,
		productDesc: req.body.productDesc,
		productSubject: req.body.productSubject,
        brand: req.body.brand,
        color: req.body.color,
        visitNumber: 0
	});
    sendMailToFollowersOfShop(userId);
    if (req.body.productImg === undefined || isJson(req.body.productImg))
        return ({status: 200, message: user.get( { plain: true } )});
    const imageData = await UploadImage.uploadImage({
        idLink: user.id,
        type: 'Offer',
        image: req.body.productImg
    });
    user.productImg = req.body.productImg;
    return ({status: 200, message: user.get( { plain: true } )});
}

async function update(req) {
    if (req.params === undefined || req.params.id === undefined)
        return ({status: 400, message: "Bad Request, Please give a id"});
    let userId = jwtUtils.getUserId(req.headers['authorization']);

    let user = await Shop.findOne({
        where: {id: userId}
    });
    let offer = await Offer.findOne({
        where: {id: req.params.id}
    });
    if (user === null || offer === null || offer['idUser'] !== userId)
        return ({status: 400, message: "Bad Request, This Offer doesn't exist or it is not yours"});

    Object.keys(req.body).forEach(function (item) {
        offer[item] = req.body[item];
    });

    offer.dataValues.updatedAt = new Date();

    if (req.body.productImg !== undefined) {
        await GetImage.editImage({
            idLink: offer.id.toString(),
            type: 'Offer'
        });
        await GetImage.uploadImage({
            idLink: req.params.id,
            type: 'Offer',
            image: req.body.productImg
        })
    }

    await offer.save().then(() => {});

    offer.productImg = await GetImage.getImage({
        idLink: user.id.toString(),
        type: 'Offer'
    });
    offer.dataValues.average = await statService.getMarkAverageOffer(`${user.id}`);

    return ({status:200, message:offer.get( { plain: true } )})
}

async function _delete(req) {
    let userId = jwtUtils.getUserId(req.headers['authorization']);

    let user = await Shop.findOne({
        where: {id: userId}
    });
    let offer = await Offer.findOne({
        where: {id: req.params.id}
    });
    if (user === null || offer === null || offer['idUser'] !== userId)
        return (undefined);

    await OfferApply.destroy({
        where: {idOffer: req.params.id}
    });

    await offer.destroy();

    return ("Offer destroy");
}

async function apply(req) {
    if (req.params === undefined || req.params.id === undefined)
        return ({status: 400, message: "Bad Request, Please give a id"});
    let userId = jwtUtils.getUserId(req.headers['authorization']);

    let user = await User.findOne({
        where: {id: userId}
    });
    let offer = await Offer.findOne({
        where: {id: req.params.id}
    });
    if (user === null || offer === null)
        return ({status: 400, message: "Bad Request, Offer doesn't exist"});
    if (await OfferApply.findOne({where: {idUser: userId, idOffer: req.params.id}}))
        return ({status: 400, message: "Bad Request, your already apply to this offer"});
    const apply = await OfferApply.create({
       idUser: userId,
       idOffer: req.params.id,
        status: 'pending'
    });

    return ({status:200, message:offer.get( { plain: true } )});
}

async function removeApply(req) {
    let userId = jwtUtils.getUserId(req.headers['authorization']);

    let user = await User.findOne({
        where: {id: userId}
    });
    let offer = await Offer.findOne({
        where: {id: req.params.id}
    });
    if (user === null || offer === null)
        return (undefined);
    offerApply = await OfferApply.findOne({
            where: {
                idUser: userId,
                idOffer: req.params.id
            }
        });
  if (offerApply === null)
        return (undefined);

    await offerApply.destroy();

    return ("Apply destroy");
}

async function getApplyOffer(req) {
    if (req.params === undefined || req.params.id === undefined)
        return ({status: 400, message: "Bad Request, Please give a id"});
    let apply = await OfferApply.findAll({
        where: {idOffer: req.params.id}
    });
    for (let i = 0; i < apply.length; i++) {
        let user = await User.findOne({where: {id: apply[i]['idUser']}});
        apply[i].dataValues['pseudoUser'] = user.pseudo;
    }
    return ({status: 200, message: apply});
}

async function getApplyUser(req) {
    if (req.params === undefined || req.params.id === undefined)
        return ({status: 400, message: "Bad Request, Please give a id"});
    let apply = await OfferApply.findAll({
        where: {idUser: req.params.id}
    });
    if (apply === undefined || apply.length === 0)
        return ({status: 200, message: apply});
    for (let i = 0; i < apply.length; i++) {
        let offer = await Offer.findOne({where: {id:apply[i].idOffer}});
        let shop = await Shop.findOne({where: {id: offer.idUser}});
        apply[i].dataValues.productName = offer.productName;
        apply[i].dataValues.brand = offer.brand;
        if (shop === undefined)
            return ({status: 200, message: apply});
        apply[i].dataValues.emailShop = shop.email;
    }
    return ({status: 200, message: apply});
}

async function chooseApply(req) {
    let userId = jwtUtils.getUserId(req.headers['authorization']);
    let userType = jwtUtils.getUserType(req.headers['authorization']);
    if (userType !== 'shop')
        return ({status: 400, message: "Bad Request, Only for Shop"});
    if (req.body.idUser === undefined || req.body.idOffer === undefined || req.body.status === undefined)
        return ({status: 400, message: "Bad Request, please Put idUser, idOffer and status in body"});
    if (req.body.status !== true && req.body.status !== false)
        return ({status: 400, message: "Bad Request, Bad field status"});
    let offer = await Offer.findOne({
        where: {
            idUser : userId,
            id: req.body.idOffer
        }
    });
    if (offer === null)
        return ({status: 400, message: "Bad Request, No authorized"});
    let apply = await OfferApply.findOne({
        where: {
            idUser: req.body.idUser,
            idOffer: req.body.idOffer,
            status: 'pending'
        }
    });
    if (apply === null)
        return ({status: 400, message: "Bad Request, No apply"});
    let status;
    if (req.body.status === true)
        status = 'accepted';
    else
        status = 'refused';
    apply["status"] = status;
    apply.save().then(() => {});

    let inf = await User.findOne({
        where: {
            id: req.body.idUser
        }
    });
    if (inf["email"] === undefined)
        return ({status: 200, message: "Success"});


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
        to: inf["email"],
        subject: `Offer apply ${status}`,
        text: `Votre inscription a l'offre ${offer['productName']} a ete ${status}`
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log("Error :", error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    return ({status: 200, message: "Success"});


}

async function shareOffer(req) {
    let headerAuth = req.headers['authorization'];
    let userId = jwtUtils.getUserId(headerAuth);
    if (userId < 0)
        return (undefined);

    let me = await User.findOne({
            where: {id: userId}
        });
    let user = await User.findOne({
            where: {id: req.body.userId}
        });
    if (user === null)
    return ({status: 400, message: "Bad Request: Utilisateur inexistant"});
    let offer = await Offer.findOne({
        where: {id: req.params.id},
        attributes: ['id', 'productName', 'productSubject']
    });
    if (offer === null)
        return ({status: 400, message: "Bad Request: Offre inexistante"});

    const dataImage = await GetImage.getImage({
        idLink: offer.id.toString(),
        type: 'Offer'
    });

    offer.productImg = dataImage;
    offer.link = "http://168.63.65.106/dashboard/item?id=" + offer.id.toString()

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
        from: me.pseudo,
        to: user.email,
        subject: "Partage d'une offre",
        text: me.pseudo + " souhaite partager cette offre avec vous:" + "\n" + offer.link
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log("Error :", error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    return ({status: 200, message: "Offre partagée"});
}

async function reportOffer(req) {
    let headerAuth = req.headers['authorization'];
    let userId = jwtUtils.getUserId(headerAuth);
    if (userId < 0)
        return (undefined);

    let offerReported = await Offer.findOne({
            where: {id: req.params.id}
        });
        if (offerReported === null)
        return ({status: 400, message: "Bad Request: ID inexistant"});
    const { offerName, subject,  message} = req.body;
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
        subject: "Signalement d'une offre",
        text: "Signalement de l'offre " + offerName + "\n" + "Sujet: " + subject +  "\n" + "Message: " + message
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log("Error :", error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    return ({status: 200, message: "Signalement envoyé pour l'id " + offerReported.id});
}

async function sharePublication(req) {
    let userId = jwtUtils.getUserId(req.headers['authorization']);
    if (req.body === undefined || req.params.id === undefined)
        return ({status: 400, message: "Bad Request, Please give a id"});
    let offer = await Offer.findOne({
        where: {id: req.params.id}
    });
    if (offer === null)
        return ({status: 400, message: "Bad Request, id is invalid"});
    let shop = await Shop.findOne({
        where: {id: offer.idUser}
    });
    if (shop.email === null)
        return ({status: 400, message: "Bad Request, Shop has no email"});
    let user = await User.findOne({
        where: {id: userId}
    });
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
        to: shop.email,
        subject: `Share Offer by ${user.pseudo}`,
        text: "Voici les liens de partage de l'influencer\n" +
            `facebook : ${req.body.facebook}\n` +
            `twitter : ${req.body.twitter}\n` +
            `instagram : ${req.body.instagram}\n` +
            `pinterest : ${req.body.pinterest}\n` +
            `twitch : ${req.body.twitch}\n` +
            `youtube : ${req.body.youtube}\n` +
            `tiktok : ${req.body.tiktok}`
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log("Error :", error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    return ({status: 200, message: "Share success"});
}

async function offerSuggestion(req) {
    let userId = jwtUtils.getUserId(req.headers['authorization']);
    let userType = jwtUtils.getUserType(req.headers['authorization']);
    let user;
    if (userType === 'influencer')
        user = await User.findOne({
            where: { id: userId},
            attributes: ['theme']});
    else
        user = await Shop.findOne({
            where: { id: userId},
            attributes: ['theme']});

    let list;

    list = await Offer.findAll({
        where: {productSubject : user.theme},
        limit: 5
    });
    if (list.length === 0)
        return ({status: 400, message: "No Data"});
    let newList = await GetImage.regroupImageData(list, 'Offer');
    for(let i = 0; i < newList.length; i++) {
        newList[i].dataValues.average = await statService.getMarkAverageOffer(`${newList[i].id}`);
        newList[i].dataValues.comment = await commentService.getCommentByOfferId(`${newList[i].id}`);
    }
    return ({status: 200, message: newList});
}

async function sendMailToFollowersOfShop(idShop) {
    let follow = await Follow.findAll({
        where: { idFollow: idShop},
        attributes: ['idUser', 'idFollow']
    });
    if (follow === null || follow.length === 0)
        return (true);
    for (let i = 0; i < follow.length; i++) {
        let tmp = await User.findOne({where:{id: follow[i].idUser}, attributes: ['email']});
        follow[i].dataValues.email = tmp.dataValues.email;
    }
    let shop = await Shop.findOne({where:{id: idShop}, attributes: ['email', 'pseudo']});
    for (let i = 0; i < follow.length; i++) {
        if (follow[i].dataValues.email !== null) {
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'contact.neoconnect@gmail.com',
                    pass: 'neo!support123'
                },
                tls: {
                    rejectUnauthorized: false
                }
            });
            let mailOptions = {
                from: "NeoConnect",
                to: follow[i].dataValues.email,
                subject: `Nouvelle offre de ${shop.dataValues.pseudo}`,
                text: `L'utilisateur ${shop.dataValues.pseudo} vient de poster une nouvelle Offre\n` +
                    `Venez vite sur notre site pour en prendre connaissance`
            };

            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log("Error :", error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        }
    }
    return (true);
}