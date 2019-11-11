const   express = require("express"),
        router = express.Router(),
        userService = require("./influencer.service");

router.post("/inf/login", login);

router.get("/inf/me", getUserProfile);
router.put("/inf/me", modifyUserProfile);

router.get("/inf/listShop", listShop);
module.exports = router;

//Récupère les données req.body appel login dans service
function login(req, res, next) {
    userService
        .login(req.body)
        .then(user =>
            user
                ? res.json(user).status(200)
                : res.status(400).json({ message: "Username or password is incorrect" })
                )
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

function listShop(req, res, next) {
    userService
        .listShop(req)
        .then(list => {
            if (list !== undefined)
                res.json(list).status(200);
            else
                res.status(400).json({ message: "Bad Token" })
        })
        .catch(err => next(err));
}