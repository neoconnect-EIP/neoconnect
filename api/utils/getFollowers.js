const { URL_IA } = process.env,
	fetch = require("../utils/fetch");

module.exports = {
    getTiktokFollowers,
    getTwitchFollowers,
    getPinterestFollowers,
    getInstagramFollowers,
    getTwitterFollowers,
    getYoutubeFollowers,
    setupTiktokFollowers,
    setupTwitchFollowers,
    setupPinterestFollowers,
    setupInstagramFollowers,
    setupTwitterFollowers,
    setupYoutubeFollowers
}

async function setupTiktokFollowers(user) {
    let tiktokObj = {
        "username": user.tiktok
    }
    try {
        let response = await fetch.postFetch(`${URL_IA}/followersTiktok`, tiktokObj, undefined);
        if (response.status == 200) {
            if (response.body.success == true) {
                return response.body.tiktok.followers;
            }
        }
    } catch (e) { 
        console.log(e);
    }
}

async function getTiktokFollowers(user) {
    if (user.tiktok != null) {
        let tiktokObj = {
            "username": user.tiktok
        }
        try {
            let response = await fetch.postFetch(`${URL_IA}/followersTiktok`, tiktokObj, undefined);
            if (response.status == 200) {
                if (response.body.success == true) {
                    let tiktokArray = [];
                    tiktokArray.push(Object.values(user.tiktokNb)[Object.values(user.tiktokNb).length - 1]);
                    tiktokArray.push(response.body.tiktok.followers);
                    user.update({
                        tiktokNb: tiktokArray
                    });
                }
            }
        } catch (e) { 
            console.log(e);
        }
    }
}

async function setupTwitchFollowers(user) {
    if (user.twitch != null) {
        let twitchObj = {
            "username": user.twitch
        }
        try {
            let response = await fetch.postFetch(`${URL_IA}/followersTwitch`, twitchObj, undefined);
            if (response.status == 200) {
                if (response.body.success == true) {
                    return response.body.twitch.followers;
                }
            }
        } catch (e) { 
            console.log(e);
        }
    }
}

async function getTwitchFollowers(user) {
    if (user.twitch != null) {
        let twitchObj = {
            "username": user.twitch
        }
        try {
            let response = await fetch.postFetch(`${URL_IA}/followersTwitch`, twitchObj, undefined);
            if (response.status == 200) {
                if (response.body.success == true) {
                    let twitchArray = [];
                    twitchArray.push(Object.values(user.twitchNb)[Object.values(user.twitchNb).length - 1]);
                    twitchArray.push(response.body.twitch.followers);
                    user.update({
                        twitchNb: twitchArray
                    });
                }
            }
        } catch (e) { 
            console.log(e);
        }
    }
}

async function setupPinterestFollowers(user) {
    if (user.pinterest != null) {
        let pinterestObj = {
            "token": user.pinterest
        }
        try {
            let response = await fetch.postFetch(`${URL_IA}/followersPinterest`, pinterestObj, undefined);
            if (response.status == 200) {
                if (response.body.success == true) {
                    return response.body.pinterest.followers;
                }
            }
        } catch (e) { 
            console.log(e);
        }
    }
}

async function getPinterestFollowers(user) {
    if (user.pinterest != null) {
        let pinterestObj = {
            "token": user.pinterest
        }
        try {
            let response = await fetch.postFetch(`${URL_IA}/followersPinterest`, pinterestObj, undefined);
            if (response.status == 200) {
                if (response.body.success == true) {
                    let pinterestArray = [];
                    pinterestArray.push(Object.values(user.pinterestNb)[Object.values(user.pinterestNb).length - 1]);
                    pinterestArray.push(response.body.pinterest.followers);
                    user.update({
                        pinterestNb: pinterestArray
                    });
                }
            }
        } catch (e) { 
            console.log(e);
        }
    }
}

async function setupInstagramFollowers(user) {
    if (user.instagram != null) {
        let instagramObj = {
            "username": user.instagram
        }
        try {
            let response = await fetch.postFetch(`${URL_IA}/followersInstagram`, instagramObj, undefined);
            if (response.status == 200) {
                if (response.body.success == true) {
                    return response.body.instagram.followers;
                }
            }
        } catch (e) { 
            console.log(e);
        }
    }
}

async function getInstagramFollowers(user) {
    if (user.instagram != null) {
        let instagramObj = {
            "username": user.instagram
        }
        try {
            let response = await fetch.postFetch(`${URL_IA}/followersInstagram`, instagramObj, undefined);
            if (response.status == 200) {
                if (response.body.success == true) {
                    let instagramArray = [];
                    instagramArray.push(Object.values(user.instagramNb)[Object.values(user.instagramNb).length - 1]);
                    instagramArray.push(response.body.instagram.followers);
                    user.update({
                        instagramNb: instagramArray
                    });
                }
            }
        } catch (e) { 
            console.log(e);
        }
    }
}

async function setupTwitterFollowers(user) {
    if (user.twitter != null) {
        let twitterObj = {
            "username": user.twitter
        }
        try {
            let response = await fetch.postFetch(`${URL_IA}/followersTwitter`, twitterObj, undefined);
            if (response.status == 200) {
                if (response.body.success == true) {
                    return response.body.twitter.followers;
                }
            }
        } catch (e) { 
            console.log(e);
        }
    }
}


async function getTwitterFollowers(user) {
    if (user.twitter != null) {
        let twitterObj = {
            "username": user.twitter
        }
        try {
            let response = await fetch.postFetch(`${URL_IA}/followersTwitter`, twitterObj, undefined);
            if (response.status == 200) {
                if (response.body.success == true) {
                    let twitterArray = [];
                    twitterArray.push(Object.values(user.twitterNb)[Object.values(user.twitterNb).length - 1]);
                    twitterArray.push(response.body.twitter.followers);
                    user.update({
                        twitterNb: twitterArray
                    });
                }
            }
        } catch (e) { 
            console.log(e);
        }
    }
}

async function setupYoutubeFollowers(user) {
    if (user.youtube != null) {
        let youtubeObj = {
            "username": user.youtube
        }
        try {
            let response = await fetch.postFetch(`${URL_IA}/followersYoutube`, youtubeObj, undefined);
            if (response.status == 200) {
                if (response.body.success == true) {
                    return response.body.youtube.followers;
                }
            }
        } catch (e) { 
            console.log(e);
        }
    }
}

async function getYoutubeFollowers(user) {
    if (user.youtube != null) {
        let youtubeObj = {
            "username": user.youtube
        }
        try {
            let response = await fetch.postFetch(`${URL_IA}/followersYoutube`, youtubeObj, undefined);
            if (response.status == 200) {
                if (response.body.success == true) {
                    let youtubeArray = [];
                    youtubeArray.push(Object.values(user.youtubeNb)[Object.values(user.youtubeNb).length - 1]);
                    youtubeArray.push(response.body.youtube.followers);
                    user.update({
                        youtubeNb: youtubeArray
                    });
                }
            }
        } catch (e) { 
            console.log(e);
        }
    }
}