const   db = require("../_helpers/db");
        IA = db.IA;

        let tokenIA = '23455thdvcz4cybxvr.zcecrvx;sa3roxi5xzokpDLZx4lz;wQXEKo';

async function iaInfo(req) {
    if (req.headers.authorization === null || req.headers.authorization !== tokenIA)
        return ({status: 400, message: "Bad Request, Bad Token IA"});
    const iaCount = await IA.findOne({
        where: { id: 1}
    });
    if (iaCount === null)
        return ({status: 200, message: "No Data"});

    return ({status: 200, message: iaCount});
}

async function iaPostInfo(req) {
    if (req.headers.authorization === null || req.headers.authorization !== tokenIA)
        return ({status: 400, message: "Bad Request, Bad Token IA"});
    if (req.body === undefined || req.body.socialNetwork === undefined || req.body.socialNetwork !== 'twitter' &&
        req.body.socialNetwork !== 'instagram' && req.body.socialNetwork !== 'pinterest' &&
        req.body.socialNetwork !== 'twitch' && req.body.socialNetwork !== 'youtube' &&
        req.body.socialNetwork !== 'tiktok' && req.body.socialNetwork !== 'facebook')
        return ({status: 400, message: "Bad Request, Please give a valid social network"});
    let iaCount = await IA.findOne({
        where: { id: 1 }
    });
    if (iaCount !== null) {
        iaCount[req.body.socialNetwork] = iaCount[req.body.socialNetwork] + 1;
        iaCount.save().then(() => {});
        return ({status: 200, message: iaCount});
    } else {
        return ({status: 200,
            message:
                await IA.create({[req.body.socialNetwork]: 1})
        });
    }
}

module.exports = {
    iaInfo,
    iaPostInfo
};
