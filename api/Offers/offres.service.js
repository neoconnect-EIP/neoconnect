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
    getApplyUser
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
    return (newList);
}

async function getById(req) {
    let user = await Offer.findOne({
        where: {id: req.params.id}
    });
    if (user === null)
    	return (undefined);
    const dataImage = await GetImage.getImage({
        idLink: user.id.toString(),
        type: 'Offer'
    });
    user.productImg = dataImage;
    user.dataValues.average = await statService.getMarkAverageOffer(`${user.id}`);
    user.dataValues.comment = await commentService.getCommentByOfferId(`${user.id}`);
	return (user);
}

async function getByShop(req) {
    let listShop = await Offer.findAll({
        where: {idUser: req.params.id}
    });
    if (listShop.length === 0)
        return ("No offer");
    if (listShop === undefined || listShop.length === 0)
        return (undefined);
    let newList = await GetImage.regroupImageData(listShop, 'Offer');
    for(let i = 0; i < newList.length; i++) {
        newList[i].dataValues.average = await statService.getMarkAverageOffer(`${newList[i].id}`);
        newList[i].dataValues.comment = await commentService.getCommentByOfferId(`${newList[i].id}`);
    }
    return (newList);
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
        return (user.get({ plain: true}));
    const imageData = await UploadImage.uploadImage({
        idLink: user.id,
        type: 'Offer',
        image: req.body.productImg
    });
    user.productImg = req.body.productImg;
	return (user.get( { plain: true } ));
}

async function update(req) {
    let userId = jwtUtils.getUserId(req.headers['authorization']);

    let user = await Shop.findOne({
        where: {id: userId}
    });
    let offer = await Offer.findOne({
        where: {id: req.params.id}
    });
    if (user === null || offer === null || offer['idUser'] !== userId)
        return (undefined);

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

    return (offer.get( { plain: true } ))
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
    let userId = jwtUtils.getUserId(req.headers['authorization']);

    let user = await User.findOne({
        where: {id: userId}
    });
    let offer = await Offer.findOne({
        where: {id: req.params.id}
    });
    if (user === null || offer === null)
        return (undefined);
    const apply = await OfferApply.create({
       idUser: userId,
       idOffer: req.params.id
    });

    return (offer.get( { plain: true } ));
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
    let apply = await OfferApply.findAll({
        where: {idOffer: req.params.id}
    });
    if (apply === undefined || apply.length === 0)
        return (undefined);
    return (apply);
}

async function getApplyUser(req) {
    let apply = await OfferApply.findAll({
        where: {idUser: req.params.id}
    });
    if (apply === undefined || apply.length === 0)
        return ([]);
    for (let i = 0; i < apply.length; i++) {
        let offer = await Offer.findOne({where: {id:apply[i].idOffer}});
        let shop = await Shop.findOne({where: {id: offer.idUser}});
       apply[i].dataValues.productName = offer.productName;
       apply[i].dataValues.brand = offer.brand;
       apply[i].dataValues.emailShop = shop.email;
    }
    return (apply);
}