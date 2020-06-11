const   express = require("express"),
        router = express.Router(),
        userService = require("./influencer.service");

router.get("/inf/me", getMyProfile);
router.put("/inf/me", modifyUserProfile);

router.get("/inf/listShop", listShop);
router.get("/inf/:id", getUserProfile);
module.exports = router;

function getMyProfile(req, res, next) {
    userService
        .getMyProfile(req)
        .then(user => {
            res.status(user.status).json(user.message);
        })
        .catch(err => next(err));
}

function getUserProfile(req, res, next) {
    userService
        .getUserProfile(req)
        .then(user => {
            res.status(user.status).json(user.message);
        })
        .catch(err => next(err));
}

function modifyUserProfile(req, res, next) {
    userService
        .modifyUserProfile(req)
        .then(user => {
            res.status(user.status).json(user.message);
        })
        .catch(err => next(err));
}

function listShop(req, res, next) {
    userService
        .listShop(req)
        .then(user => {
            res.status(user.status).json(user.message);
        })
        .catch(err => next(err));
}