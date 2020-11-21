const   db = require("../_helpers/db"),
        Shop = db.Shop,
        Inf = db.Influencer;

module.exports = {
    checkDuplicateInfField,
    checkDuplicateShopField
}

async function checkInfField(fieldName, fieldData) {
    let obj = await Inf.findOne({
            where: { [fieldName] : fieldData}
    })
    if (obj)
        return obj
}

async function checkDuplicateInfField (body) {

    if (body.email && await checkInfField('email', body.email))
        return false;
    if (body.facebook && await checkInfField('facebook', body.facebook))
        return false;
    if (body.twitter && await checkInfField('twitter', body.twitter))
        return false;
    if (body.snapchat && await checkInfField('snapchat', body.snapchat))
        return false;
    if (body.instagram && await checkInfField('instagram', body.instagram))
        return false;
    if (body.pinterest && await checkInfField('pinterest', body.pinterest))
        return false;
    if (body.twitch && await checkInfField('twitch', body.twitch))
        return false;
    if (body.youtube && await checkInfField('youtube', body.youtube))
        return false;
    return true;
}

async function checkShopField(fieldName, fieldData) {
    let obj = await Shop.findOne({
            where: { [fieldName] : fieldData}
    })
    if (obj)
        return obj
}

async function checkDuplicateShopField (body) {

    if (body.email && await checkShopField('email', body.email))
        return false;
    if (body.facebook && await checkShopField('facebook', body.facebook))
        return false;
    if (body.twitter && await checkShopField('twitter', body.twitter))
        return false;
    if (body.snapchat && await checkShopField('snapchat', body.snapchat))
        return false;
    if (body.instagram && await checkShopField('instagram', body.instagram))
        return false;
    return true;
}
