const   db = require("../_helpers/db"),
        Shop = db.Shop,
        User = db.Influencer,
        jwtUtils = require("../utils/jwt.utils"),
        Mark = db.Mark;


async function getMarkAverage(req) {
    let headerAuth = req.headers['authorization'];
    let userId = jwtUtils.getUserId(headerAuth);

    if (userId < 0 || req.params.id === undefined)
        return (undefined);

    let allMark = await Mark.findAll({
       where: {idUser: req.params.id}
    });
    if (allMark === null)
        return (undefined);
    let average = 0;
    console.log(allMark);
    return (average);
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
    let headerAuth = req.headers['authorization'];
    let userId = jwtUtils.getUserId(headerAuth);
    if (userId < 0)
        return (undefined);

    console.log(req.params.id);

    const list = await Shop.findOne({
        where: { id: req.params.id },
        attributes: ['id', 'pseudo', 'userType', 'full_name', 'email', 'phone', 'postal', 'city', 'userDescription', 'theme',
            'society', 'function']
    });
    if (list === null)
        return (undefined);
    list.userPicture = await GetImage.getImage({
        idLink: req.params.id.toString(),
        type: 'User'
    });
    return (list);
}

module.exports = {
    getMarkAverage,
    offerLastMonth,
    getMarkAverageOffer
};