const   express = require("express"),
        router = express.Router(),
        userService = require("./shop.service");

router.get("/shop/me", getMyProfile);
router.put("/shop/me", modifyUserProfile);

router.get("/shop/listInf", listInf);
router.get("/shop/:id", getUserProfile);
router.post("/shop/search", searchShop);

router.put("/shop/follow/:id", followShop);
router.put("/shop/unfollow/:id", unfollowShop);
router.get("/shop/follow/:id", getFollow);
router.get("/user/follow", getMyFollowUps);

module.exports = router;

function getMyProfile(req, res, next) {
    userService
        .getMyProfile(req)
        .then(list => {
            res.status(list.status).json(list.message);
        })
        .catch(err => next(err));
}

function getUserProfile(req, res, next) {
    userService
        .getUserProfile(req)
        .then(list => {
            res.status(list.status).json(list.message);
        })
        .catch(err => next(err));
}

function modifyUserProfile(req, res, next) {
    userService
        .modifyUserProfile(req)
        .then(list => {
            res.status(list.status).json(list.message);
        })
        .catch(err => next(err));
}

function listInf(req, res, next) {
    userService
        .listInf(req)
        .then(list => {
            res.status(list.status).json(list.message);
        })
        .catch(err => next(err));
}

function searchShop(req, res, next) {
    userService
        .searchShop(req)
        .then(user =>
            user
                ? res.json(user).status(204)
                : res.status(400).json({ message: "User can't be searched" })
                )
        .catch(err => next(err));        
}

function followShop(req, res, next) {
    userService
        .followShop(req)
        .then(list => {
            res.status(list.status).json(list.message);
        })
        .catch(err => next(err));
}

function unfollowShop(req, res, next) {
    userService
        .unfollowShop(req)
        .then(list => {
            res.status(list.status).json(list.message);
        })
        .catch(err => next(err));
}

function getFollow(req, res, next) {
    userService
        .getAllFollow(req)
        .then(list => {
            res.status(list.status).json(list.message);
        })
        .catch(err => next(err));
}

function getMyFollowUps(req, res, next) {
    userService
        .getMyFollowUps(req)
        .then(list => {
            res.status(list.status).json(list.message);
        })
        .catch(err => next(err));
}