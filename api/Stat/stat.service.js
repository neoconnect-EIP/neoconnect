const   db = require("../_helpers/db"),
        Shop = db.Shop,
        User = db.Influencer,
        jwtUtils = require("../utils/jwt.utils"),
        Mark = db.Mark;


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
        where: { idUser : id },
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
        where: {idOffer: id},
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

module.exports = {
    getMarkAverage,
    offerLastMonth,
    getMarkAverageOffer,
    getMarkAverageUser
};