const   express = require("express"),
        router = express.Router(),
        userService = require("./shop.service");

router.post("/shop/login", login);

router.get("/shop/:id", getUserProfile);
router.get("/shop/me", getMyProfile);
router.put("/shop/me", modifyUserProfile);

router.get("/shop/listInf", listInf);

module.exports = router;

//Récupère les données req.body appel login dans service
function login(req, res, next) {
    userService
        .login(req.body)
        .then(user =>
            user
                ? res.json(user)
                : res.status(400).json({ message: "Username or password is incorrect" })
                )
        .catch(err => next(err));        
}

function getMyProfile(req, res, next) {
    userService
        .getMyProfile(req)
        .then(list => {
            if (list !== undefined)
                res.json(list).status(200);
            else
                res.status(400).json({ message: "Bad Token" })
        })
        .catch(err => next(err));
}

function getUserProfile(req, res, next) {
    userService
        .getUserProfile(req)
        .then(list => {
            if (list !== undefined)
                res.json(list).status(200);
            else
                res.status(400).json({ message: "Bad Token" })
        })
        .catch(err => next(err));
}

function modifyUserProfile(req, res, next) {
    userService
        .modifyUserProfile(req)
        .then(list => {
            if (list !== undefined)
                res.json(list).status(200);
            else
                res.status(400).json({ message: "Bad request" })
        })
        .catch(err => next(err));
}

function listInf(req, res, next) {
    userService
        .listInf(req)
        .then(list => {
            if (list !== undefined)
                res.json(list).status(200);
            else
                res.status(400).json({ message: "Bad Token" })
        })
        .catch(err => next(err));
}