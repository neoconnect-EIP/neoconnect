const   express = require("express"),
        router = express.Router(),
        userService = require("./influencer.service");

router.get("/inf/me", getMyProfile);
router.put("/inf/me", modifyUserProfile);

router.get("/inf/listShop", listShop);
router.get("/inf/:id", getUserProfile);
router.post("/inf/search", searchInf);
router.get("/updateFollowers", updateFollowers);

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

function searchInf(req, res, next) {
    userService
        .searchInf(req)
        .then(user =>
            user
                ? res.json(user).status(204)
                : res.status(400).json({ message: "User can't be searched" })
                )
        .catch(err => next(err));        
}

function updateFollowers(req, res, next) {
    userService
        .updateFollowers()
        .then(res.json(200))
        .catch(err => next(err));
}