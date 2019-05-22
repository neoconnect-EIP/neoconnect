const   express = require("express"),
        router = express.Router(),
        userService = require("./influencer.service");

router.post("/inf/login", login);
router.post("/inf/register", register);
router.get("/inf/listShop", listShop);
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

//Récupère les données req.body appel register dans service
function register(req, res, next) {
    userService
        .register(req.body)
        .then(user =>
            user
                ? res.json(user)
                : res.status(400).json({ message: "Bad request" })
                )
        .catch(err => next(err));
}

function listShop(req, res, next) {
    userService
        .listShop()
        .then(list =>
            res.json(list).status(200))
        .catch(err => next(err));
}