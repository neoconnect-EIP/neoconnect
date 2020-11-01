const   db = require("../_helpers/db"),
        Shop = db.Shop,
        Inf = db.Influencer;

module.exports = {
    checkDuplicateField
}

async function checkField(fieldName, fieldData) {
    let obj = await Inf.findOne({
            where: { [fieldName] : fieldData}
    })
    if (obj)
        return obj
    return (await Shop.findOne({
        where: { [fieldName] : fieldData}
    }))
}

async function checkDuplicateField (body) {

    if (body.email && await checkField('email', body.email))
        return false;
    if (body.facebook && await checkField('facebook', body.facebook))
        return false;
    if (body.twitter && await checkField('twitter', body.twitter))
        return false;
    if (body.snapchat && await checkField('snapchat', body.snapchat))
        return false;
    if (body.instagram && await checkField('instagram', body.instagram))
        return false;
    if (body.pinterest && await checkField('pinterest', body.pinterest))
        return false;
    if (body.twitch && await checkField('twitch', body.twitch))
        return false;
    if (body.youtube && await checkField('youtube', body.youtube))
        return false;
    return true;
}
