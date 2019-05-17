const   express = require("express"),
        router = express.Router(),
        userService = require("./shop.service");

router.post("/login/shop", login);
router.post("/register/shop", register);
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
        .then(() => res.json({}).status(200))
        .catch(err => next(err));
}