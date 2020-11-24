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
                    let date = new Date();
                    let dateUpdate = date.getDate().toString() + "/" + (date.getMonth() + 1).toString() + "-" + date.getHours().toString() + "H";
                    let tiktokArray = [];
                    let tiktokArrayDate = [];
                    if (user.tiktokNb != null) {
                        tiktokArray = Object.values(user.tiktokNb);
                        tiktokArrayDate = Object.values(user.tiktokUpdateDate);
                    }
                    tiktokArray.push(response.body.tiktok.followers);
                    tiktokArrayDate.push(dateUpdate);
                    if (tiktokArray.length >= 10) {
                        tiktokArray.remove[0];
                        tiktokArrayDate.remove[0];
                    }
                    user.update({
                        tiktokNb: tiktokArray,
                        tiktokUpdateDate: tiktokArrayDate
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
                    let date = new Date();
                    let dateUpdate = date.getDate().toString() + "/" + (date.getMonth() + 1).toString() + "-" + date.getHours().toString() + "H";
                    let twitchArray = [];
                    let twitchArrayDate = [];
                    if (user.twitchNb != null) {
                        twitchArray = Object.values(user.twitchNb);
                        twitchArrayDate = Object.values(user.twitchUpdateDate);
                    }
                    twitchArray.push(response.body.twitch.followers);
                    twitchArrayDate.push(dateUpdate);
                    if(twitchArray.length >= 10) {
                        twitchArray.remove[0];
                        twitchArrayDate.remove[0];
                    }
                    user.update({
                        twitchNb: twitchArray,
                        twitchUpdateDate: twitchArrayDate
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
                    let date = new Date();
                    let dateUpdate = date.getDate().toString() + "/" + (date.getMonth() + 1).toString() + "-" + date.getHours().toString() + "H";
                    let pinterestArray = [];
                    let pinterestArrayDate = [];
                    if (user.pinterestNb != null) {
                        pinterestArray = Object.values(user.pinterestNb);
                        pinterestArrayDate = Object.values(user.pinterestUpdateDate);
                    }
                    pinterestArray.push(response.body.pinterest.followers);
                    pinterestArrayDate.push(dateUpdate);
                    if (pinterestArray.length >= 10) {
                        pinterestArray.remove[0];
                        pinterestArrayDate.remove[0];
                    }
                    user.update({
                        pinterestNb: pinterestArray,
                        pinterestUpdateDate: pinterestArrayDate
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
                    let date = new Date();
                    let dateUpdate = date.getDate().toString() + "/" + (date.getMonth() + 1).toString() + "-" + date.getHours().toString() + "H";
                    let instagramArray = [];
                    let instagramArrayDate = [];
                    if (user.instagramNb != null) {
                        instagramArray = Object.values(user.instagramNb);
                        instagramArrayDate = Object.values(user.instagramUpdateDate);
                    }
                    instagramArray.push(response.body.instagram.followers);
                    instagramArrayDate.push(dateUpdate);
                    if (instagramArray.length >= 10) {
                        instagramArray.remove[0];
                        instagramArrayDate.remove[0];
                    }
                    user.update({
                        instagramNb: instagramArray,
                        instagramUpdateDate: instagramArrayDate
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
                    let date = new Date();
                    let dateUpdate = date.getDate().toString() + "/" + (date.getMonth() + 1).toString() + "-" + date.getHours().toString() + "H";
                    let twitterArray = [];
                    let twitterArrayDate = [];
                    if (user.twitterNb != null) {
                        twitterArray = Object.values(user.twitterNb);
                        twitterArrayDate = Object.values(user.twitterUpdateDate);
                    }
                    twitterArray.push(response.body.twitter.followers);
                    twitterArrayDate.push(dateUpdate)
                    if (twitterArray.length >= 10) {
                        twitterArray.remove[0];
                        twitterArrayDate.remove[0];
                    }
                    user.update({
                        twitterNb: twitterArray,
                        twitterUpdateDate: twitterArrayDate
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
                    let date = new Date();
                    let dateUpdate = date.getDate().toString() + "/" + (date.getMonth() + 1).toString() + "-" + date.getHours().toString() + "H";
                    let youtubeArray = [];
                    let youtubeArrayDate = [];
                    if (user.youtubeNb != null) {
                        youtubeArray = Object.values(user.youtubeNb);
                        youtubeArrayDate = Object.values(user.youtubeUpdateDate);
                    }
                    youtubeArray.push(response.body.youtube.followers);
                    youtubeArrayDate.push(dateUpdate);
                    if (youtubeArray >= 10) {
                        youtubeArray.remove[0];
                        youtubeArrayDate.remove[0];                    
                    }
                    user.update({
                        youtubeNb: youtubeArray,
                        youtubeUpdateDate: youtubeArrayDate
                    });
                }
            }
        } catch (e) { 
            console.log(e);
        }
    }
}