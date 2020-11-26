const   db = require("../_helpers/db"),
        { Op } = require("sequelize"),
        Shop = db.Shop,
        User = db.Influencer,
        Offer = db.Offre,
        jwtUtils = require("../utils/jwt.utils"),
        GetImage = require("../UploadImage/uploadImage.service"),
        CommentMark = require("../CommentMark/commentMark.service"),
        OfferService = require("../Offers/offres.service"),
        ShopService = require("../Shop/shop.service"),
        Mark = db.Mark;


async function get5FamousLast7Days(type, userId = null) {
    let dateOneWeekAgo = new Date();
    dateOneWeekAgo.setTime(dateOneWeekAgo.getTime() - 604800000);

    let list;
    if (type === 'influencer') {
        list = await User.findAll({
            order: [['visitNumber', 'DESC']],
            attributes: ['id'],
            where: {
                createdAt: {
                    [Op.gt]: dateOneWeekAgo,
                }
            },
            limit: 5
        });
        for (let i = 0; i < list.length; i++) {
            list[i] = await getInfProfile(list[i].id)
        }
    }
    else if (type === 'shop') {
        list = await Shop.findAll({
            order: [['visitNumber', 'DESC']],
            attributes: ['id'],
            where: {
                createdAt: {
                    [Op.gt]: dateOneWeekAgo,
                }
            },
            limit: 5
        });
        for (let i = 0; i < list.length; i++) {
            list[i] = await getShopProfile(list[i].id)
            list[i].dataValues.follow = await ShopService.getFollow(list[i].id, userId);
        }
    }
    else {
        list = await Offer.findAll({
            order: [['visitNumber', 'DESC']],
            attributes: ['id'],
            where: {
                createdAt: {
                    [Op.gt]: dateOneWeekAgo,
                }
            },
            limit: 5
        });
        for (let i = 0; i < list.length; i++) {
            list[i] = await getOffer(list[i].id)
            list[i].dataValues.status = await OfferService.getApply(userId, list[i].id)
        }
    }
    return (list);
}

async function get5Famous(type, userId = null) {
    let list;
    if (type === 'influencer') {
        list = await User.findAll({
            order: [['visitNumber', 'DESC']],
            attributes: ['id'],
            limit: 5
        });
        for (let i = 0; i < list.length; i++) {
            list[i] = await getInfProfile(list[i].id)
        }
    }
    else if (type === 'shop') {
        list = await Shop.findAll({
            order: [['visitNumber', 'DESC']],
            attributes: ['id'],
            limit: 5
        });
        for (let i = 0; i < list.length; i++) {
            list[i] = await getShopProfile(list[i].id)
            list[i].dataValues.follow = await ShopService.getFollow(list[i].id, userId);
        }
    }
    else {
        list = await Offer.findAll({
            order: [['visitNumber', 'DESC']],
            attributes: ['id'],
            limit: 5
        });
        for (let i = 0; i < list.length; i++) {
            list[i] = await getOffer(list[i].id)
            list[i].dataValues.status = await OfferService.getApply(userId, list[i].id)
        }
    }
    return (list);
}

async function getMarkAverage(req) {
    if (req.params.id === undefined)
        return ({status: 400, message: "Bad Request, Please give a id"});

    let allMark = await Mark.findAll({
       where: {idUser: req.params.id}
    });
    return ({status: 200, message: allMark});
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

async function offerLastMonth(req) {
    if (req.params.id === undefined)
        return ({status: 400, message: "Bad Request, Please give a id"});
    const list = await Shop.findOne({
        where: { id: req.params.id },
        attributes: ['id', 'pseudo', 'userType', 'full_name', 'email', 'phone', 'postal', 'city', 'userDescription', 'theme',
            'society', 'function']
    });
    if (list === null)
        return ({status: 200, message: list});
    list.userPicture = await GetImage.getImage({
        idLink: req.params.id.toString(),
        type: 'User'
    });
    return ({status: 200, message: list});
}

function takeOnly5BestAverage(list) {
    if (list.length <= 5)
        return (list);
    let newList = [];
    for (let i = 0; i < 5; i++) {
        let index = 0;
        for (let j = 0; j < list.length; j++) {
            if (list[index].average < list[j].average)
                index = j;

        }
        newList.push(list[index]);
        list.splice(index, 1);
    }
    return (newList);
}

async function get5BestMarkAverage(type, userId = null) {
    let list = [];
    if (type === 'influencer') {
        let inf = await User.findAll({
            attributes: ['id']
        });
        for (let i = 0; i < inf.length; i++) {
            let mark = await getMarkAverageUser(inf[i].dataValues.id);
            if (mark !== null)
                list.push({id: inf[i].dataValues.id, average: mark});
        }
        list = takeOnly5BestAverage(list);
        for (let i = 0; i < list.length; i++) {
            list[i] = await getInfProfile(list[i].id)
        }
    }
    else if (type === 'shop') {
        let shop = await Shop.findAll({
            attributes: ['id']
        });
        for (let i = 0; i < shop.length; i++) {
            let mark = await getMarkAverageUser(shop[i].dataValues.id);
            if (mark !== null)
                list.push({id: shop[i].dataValues.id, average: mark});
        }
        list = takeOnly5BestAverage(list);
        for (let i = 0; i < list.length; i++) {
            list[i] = await getShopProfile(list[i].id)
            list[i].dataValues.follow = await ShopService.getFollow(list[i].id, userId);
        }
    }
    else {
        let offer = await Offer.findAll({
            attributes: ['id']
        });
        for (let i = 0; i < offer.length; i++) {
            let mark = await getMarkAverageOffer(offer[i].dataValues.id);
            if (mark !== null)
                list.push({id: offer[i].dataValues.id, average: mark});
        }
        list = takeOnly5BestAverage(list);
        for (let i = 0; i < list.length; i++) {
            list[i] = await getOffer(list[i].id)
            list[i].dataValues.status = await OfferService.getApply(userId, list[i].id)
        }
    }
    return (list);
}

async function getInfProfile(id) {
    let list = await User.findOne({
        where: { id: id },
        attributes: ['id', 'pseudo', 'userType', 'full_name', 'email', 'phone', 'postal', 'city', 'theme',
            'sexe','pinterest','twitch','youtube','facebook', 'twitter', 'snapchat', 'instagram', 'userDescription', 'visitNumber']
    });
    list.userPicture = await GetImage.getImage({
        idLink: id.toString(),
        type: 'User'
    });
    list.dataValues.average = await getMarkAverageUser(`${id}`);
    list.dataValues.comment = await CommentMark.getCommentByUserId(id.toString());
    list.dataValues.mark = await CommentMark.getMarkByUserId(id.toString());
    return (list);

}

async function getShopProfile(id) {
    const list = await Shop.findOne({
        where: { id: id },
        attributes: ['id', 'pseudo', 'userType', 'full_name', 'email', 'phone', 'postal', 'city', 'userDescription', 'theme',
            'society', 'function', 'website', 'twitter', 'facebook', 'snapchat', 'instagram', 'visitNumber']
    });
    list.userPicture = await GetImage.getImage({
        idLink: id.toString(),
        type: 'User'
    });
    list.dataValues.average = await getMarkAverageUser(`${id}`);
    list.dataValues.comment = await CommentMark.getCommentByUserId(id.toString());
    list.dataValues.comment = await CommentMark.getCommentByUserId(id.toString());
    return (list);
}

async function getOffer(id) {
    let offer = await Offer.findOne({
        where: {id: id}
    });
    const dataImage = await GetImage.getImage({
        idLink: offer.id.toString(),
        type: 'Offer'
    });
    offer.productImg = dataImage;
    offer.dataValues.average = await getMarkAverageOffer(`${offer.id}`);
    offer.dataValues.comment = await CommentMark.getCommentByOfferId(`${offer.id}`);
    return (offer);
}

async function actuality(req) {
    let userType = jwtUtils.getUserType(req.headers['authorization']);
    let userId = jwtUtils.getUserId(req.headers['authorization']);
    let listActuality;
    if (userType === 'influencer')
        listActuality = {
            listShopNotes: await get5BestMarkAverage('shop', userId),
            listShopPopulaire: await get5Famous('shop', userId),
            listShopTendance: await get5FamousLast7Days('shop', userId),
            listOfferNotes: await get5BestMarkAverage('offer', userId),
            listOfferPopulaire: await get5Famous('offer', userId),
            listOfferTendance: await get5FamousLast7Days('offer', userId)
        };
    else {
        listActuality = {
            listInfNotes: await get5BestMarkAverage('influencer'),
            listInfPopulaire: await get5Famous('influencer'),
            listInfTendance: await get5FamousLast7Days('influencer')
        }
    }
    return ({status: 200, message: listActuality});
}

module.exports = {
    getMarkAverage,
    offerLastMonth,
    getMarkAverageOffer,
    getMarkAverageUser,
    actuality
};