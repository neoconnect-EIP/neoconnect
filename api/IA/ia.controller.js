const   express = require("express"),
        router = express.Router(),
        userService = require("./ia.service");

router.get("/ia", getIaInfo);
router.post("/ia", postIaInfo);

module.exports = router;

function getIaInfo(req, res, next) {
    userService
        .iaInfo(req)
        .then(user => {
            res.status(user.status).json(user.message);
        })
        .catch(err => next(err));
}

function postIaInfo(req, res, next) {
    userService
        .iaPostInfo(req)
        .then(user => {
            res.status(user.status).json(user.message);
        })
        .catch(err => next(err));
}