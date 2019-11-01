const   express = require("express"),
        router = express.Router(),
        userService = require("./user.service");

router.post("/login", login);

router.post("/inf/register", registerInf);
router.post("/shop/register", registerShop);

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

//Récupère les données req.body appel register dans service
function registerInf(req, res, next) {
    userService
        .registerInf(req.body)
        .then(user =>
            user
                ? res.json(user).status(200)
                : res.status(400).json({ message: "Bad request" })
                )
        .catch(err => next(err));
}

function registerShop(req, res, next) {
    userService
        .registerShop(req.body)
        .then(user =>
            user
                ? res.json(user).status(200)
                : res.status(400).json({ message: "Bad request" })
        )
        .catch(err => next(err));
}