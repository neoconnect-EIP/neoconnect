const   express = require("express"),
        router = express.Router(),
        userService = require("./commentMark.service");

router.post("/user/comment/:id", addComment);
router.post("/user/mark/:id", addMark);

router.get("/user/comment/:id/:type", getComment);
router.get("/user/mark/:id/:type", getMark);

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