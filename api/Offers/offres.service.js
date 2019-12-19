const   jwt = require("jsonwebtoken"),
		db = require("../_helpers/db"),
		bcrypt = require("bcrypt"),
        Offer = db.Offre,
    	Shop = db.Shop,
        User = db.Influencer,
        OfferApply = db.OfferApply,
        config = require("../config"),
		jwtUtils = require("../utils/jwt.utils");
        UploadImage = require("../UploadImage/uploadImage.service");
        GetImage = require("../UploadImage/uploadImage.service");
        GetAllImage = require("../UploadImage/uploadImage.service");

module.exports = {
	insert,
	getAll,
	getById,
    getByShop,
	update,
    apply,
	delete: _delete,
    getApplyOffer,
    getApplyUser
};

async function getAll(req) {
    let headerAuth = req.headers['authorization'];
    let userId = jwtUtils.getUserId(headerAuth);
    if (userId < 0)
        return (undefined);

    const list = await Offer.findAll();
    let newList = await GetImage.regroupImageData(list, 'Offer');
    return (newList);
}

async function getById(req) {
    let headerAuth = req.headers['authorization'];
    let userId = jwtUtils.getUserId(headerAuth);
    if (userId < 0)
        return (undefined);

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
	return (user);
}

async function getByShop(req) {
    let headerAuth = req.headers['authorization'];
    let userId = jwtUtils.getUserId(headerAuth);
    if (userId < 0)
        return (undefined);

    let listShop = await Offer.findAll({
        where: {idUser: req.params.id}
    });
    if (listShop.length === 0)
        return ("No offer");
    if (listShop === undefined || listShop.length === 0)
        return (undefined);
    let newList = await GetImage.regroupImageData(listShop, 'Offer');
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
    let headerAuth = req.headers['authorization'];
    let userId = jwtUtils.getUserId(headerAuth);

    if (userId < 0)
        return (undefined);
    const user = await Offer.create({
        idUser: userId,
		productName: req.body.productName,
		productSex: req.body.productSex,
		productDesc: req.body.productDesc,
		productSubject: req.body.productSubject
	});
    if (req.body.productImg === undefined || isJson(req.body.productImg))
        return (user.get({ plain: true}));
    console.log(req.body.productImg.length);
    const imageData = await UploadImage.uploadImage({
        idLink: user.id,
        type: 'Offer',
        image: req.body.productImg
    });
    user.productImg = req.body.productImg;
	return (user.get( { plain: true } ));
}

async function update(req) {
    let headerAuth = req.headers['authorization'];
    let userId = jwtUtils.getUserId(headerAuth);
    if (userId < 0)
        return (undefined);

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

    offer.save().then(() => {});

    return (offer.get( { plain: true } ))
}

async function _delete(req) {
    let headerAuth = req.headers['authorization'];
    let userId = jwtUtils.getUserId(headerAuth);
    if (userId < 0)
        return (undefined);

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
    let headerAuth = req.headers['authorization'];
    let userId = jwtUtils.getUserId(headerAuth);
    if (userId < 0)
        return (undefined);

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

async function getApplyOffer(req) {
    let headerAuth = req.headers['authorization'];
    let userId = jwtUtils.getUserId(headerAuth);
    if (userId < 0)
        return (undefined);

    let apply = await OfferApply.findAll({
        where: {idOffer: req.params.id}
    });
    if (apply === undefined || apply.length === 0)
        return (undefined);
    return (apply);
}

async function getApplyUser(req) {
    let headerAuth = req.headers['authorization'];
    let userId = jwtUtils.getUserId(headerAuth);
    if (userId < 0)
        return (undefined);

    let apply = await OfferApply.findAll({
        where: {idUser: req.params.id}
    });
    if (apply === undefined || apply.length === 0)
        return (undefined);
    return (apply);
}