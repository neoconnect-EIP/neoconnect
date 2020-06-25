const   express = require("express"),
        router = express.Router(),
        userService = require("./user.service");

router.post("/login", login);
router.post("/user/search", searchUser);
router.post("/user/report/:id", reportUser);
router.delete("/delete", deleteUser);

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
function searchUser(req, res, next) {
    userService
        .searchUser(req)
        .then(user =>
            user
                ? res.json(user).status(204)
                : res.status(400).json({ message: "User can't be searched" })
                )
        .catch(err => next(err));        
}

function reportUser(req, res, next) {
    userService
        .reportUser(req)
        .then(user =>
            user
                ? res.json(user).status(200)
                : res.status(400).json({ message: "User can't be reported" })
                )
        .catch(err => next(err));        
}

function deleteUser(req, res, next) {
    userService
        .deleteUser(req)
        .then(user =>
            user
                ? res.json(user).status(200)
                : res.status(200).json({ message: "Account deleted" })
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
