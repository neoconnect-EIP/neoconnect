const   express = require("express"),
        router = express.Router(),
        userService = require("./commentMark.service");

router.post("/user/comment/:id", addComment);
router.post("/user/mark/:id", addMark);
router.post("/offer/comment/:id", addOfferComment);
router.post("/offer/mark/:id", addOfferMark);

router.get("/user/comment/:id", getComment);
router.get("/user/mark/:id", getMark);
router.get("/offer/comment/:id", getOfferComment);
router.get("/offer/mark/:id", getOfferMark);

module.exports = router;

function addComment(req, res, next) {
    userService
        .addComment(req)
        .then(user => {
            res.status(user.status).json(user.message);
        })
        .catch(err => next(err));        
}

function addMark(req, res, next) {
    userService
        .addMark(req)
        .then(user => {
            res.status(user.status).json(user.message);
        })
        .catch(err => next(err));
}

function addOfferComment(req, res, next) {
    userService
        .addOfferComment(req)
        .then(user => {
            res.status(user.status).json(user.message);
        })
        .catch(err => next(err));
}

function addOfferMark(req, res, next) {
    userService
        .addOfferMark(req)
        .then(user => {
            res.status(user.status).json(user.message);
        })
        .catch(err => next(err));
}

function getComment(req, res, next) {
    userService
        .getComment(req)
        .then(user => {
            res.status(user.status).json(user.message);
        })
        .catch(err => next(err));
}

function getMark(req, res, next) {
    userService
        .getMark(req)
        .then(user => {
            res.status(user.status).json(user.message);
        })
        .catch(err => next(err));
}

function getOfferComment(req, res, next) {
    userService
        .getOfferComment(req)
        .then(user => {
            res.status(user.status).json(user.message);
        })
        .catch(err => next(err));
}

function getOfferMark(req, res, next) {
    userService
        .getOfferMark(req)
        .then(user => {
            res.status(user.status).json(user.message);
        })
        .catch(err => next(err));
}