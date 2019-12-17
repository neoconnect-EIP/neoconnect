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
        .then(user =>
            user
                ? res.json(user).status(200)
                : res.status(400).json({ message: "Bad request" })
                )
        .catch(err => next(err));        
}

function addMark(req, res, next) {
    userService
        .addMark(req)
        .then(user =>
            user
                ? res.json(user).status(200)
                : res.status(400).json({ message: "Bad request" })
        )
        .catch(err => next(err));
}

function addOfferComment(req, res, next) {
    userService
        .addOfferComment(req)
        .then(user =>
            user
                ? res.json(user).status(200)
                : res.status(400).json({ message: "Bad request" })
        )
        .catch(err => next(err));
}

function addOfferMark(req, res, next) {
    userService
        .addOfferMark(req)
        .then(user =>
            user
                ? res.json(user).status(200)
                : res.status(400).json({ message: "Bad request" })
        )
        .catch(err => next(err));
}

function getComment(req, res, next) {
    userService
        .getComment(req)
        .then(user =>
            user
                ? res.json(user).status(200)
                : res.status(400).json({ message: "Bad request" })
        )
        .catch(err => next(err));
}

function getMark(req, res, next) {
    userService
        .getMark(req)
        .then(user =>
            user
                ? res.json(user).status(200)
                : res.status(400).json({ message: "Bad request" })
        )
        .catch(err => next(err));
}

function getOfferComment(req, res, next) {
    userService
        .getOfferComment(req)
        .then(user =>
            user
                ? res.json(user).status(200)
                : res.status(400).json({ message: "Bad request" })
        )
        .catch(err => next(err));
}

function getOfferMark(req, res, next) {
    userService
        .getOfferMark(req)
        .then(user =>
            user
                ? res.json(user).status(200)
                : res.status(400).json({ message: "Bad request" })
        )
        .catch(err => next(err));
}