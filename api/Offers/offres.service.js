const   jwt = require("jsonwebtoken"),
		db = require("../_helpers/db"),
		bcrypt = require("bcrypt"),
        Offer = db.Offre,
    	Shop = db.Shop,
        User = db.Influencer,
        OfferApply = db.OfferApply,
        config = require("../config"),
		jwtUtils = require("../utils/jwt.utils"),
        UploadImage = require("../UploadImage/uploadImage.service"),
        GetImage = require("../UploadImage/uploadImage.service"),
        GetAllImage = require("../UploadImage/uploadImage.service"),
        commentService = require("../CommentMark/commentMark.service");
        statService = require("../Stat/stat.service");

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
    reportOffer
};

async function paramOffer(req) {
    let value = Object.entries(req.query)[0][1];
    let field = Object.entries(req.query)[0][0];
    let list = undefined;
    if (field === 'productSex') {
        list = await Offer.findAll({
            where: {
                productSex: value
            }
        });
    }
    else if (field === 'brand') {
        list = await Offer.findAll({
            where: {
                brand: value
            }
        });
    }
    else if (field === 'color') {
        list = await Offer.findAll({
            where: {
                color: value
            }
        });
    }
    else if (field === 'order') {
        if (value === 'desc') {
            list = await Offer.findAll({
                order: [['updatedAt', 'DESC']]
            });
        }
        else {
            list = await Offer.findAll({
                order: [['updatedAt', 'ASC']]
            });
        }
    }
    else {
        list = await Offer.findAll();
    }
    return (list)
}

async function getAll(req) {
    let list = undefined;
    if (Object.entries(req.query).length !== 0 && Object.entries(req.query).length !== 2)
        list = await paramOffer(req);
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
        color: req.body.color
	});
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
    const apply = await OfferApply.create({
       idUser: userId,
       idOffer: req.params.id
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
       apply[i].dataValues.emailShop = shop.email;
    }
    return (apply);
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
    const { offerName, message} = req.body;
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
        text: "Signalement de l'offre " + offerName + "\n" + "Message: " + message
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