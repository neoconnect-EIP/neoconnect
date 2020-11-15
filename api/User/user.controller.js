const   express = require("express"),
        router = express.Router(),
        userService = require("./user.service");

router.post("/login", login);
router.post("/user/report/:id", reportUser);
router.delete("/user/delete", deleteUser);

router.get("/user/suggestion", userSuggestion);

router.post("/inf/register", registerInf);
router.post("/shop/register", registerShop);
router.post("/insertParrainage", addParrainage);

module.exports = router;

//Récupère les données req.body appel login dans service
function login(req, res, next) {
    userService
        .login(req.body)
        .then(user => {
            res.status(user.status).json(user.message);
        })
        .catch(err => next(err));        
}

function reportUser(req, res, next) {
    userService
        .reportUser(req)
        .then(user => {
            res.status(user.status).json(user.message);
        })
        .catch(err => next(err));        
}

function deleteUser(req, res, next) {
    userService
        .deleteUser(req)
        .then(user =>
            user
                ? res.json("Compte supprimé").status(200)
                : res.status(user.status).json(user.message)
                )
        .catch(err => next(err));
}

function userSuggestion(req, res, next) {
    userService
        .userSuggestion(req)
        .then(user => {
            res.status(user.status).json(user.message);
        })
        .catch(err => next(err));
}

function registerInf(req, res, next) {
    userService
        .registerInf(req.body)
        .then(user => {
            res.status(user.status).json(user.message);
        })
        .catch(err => next(err));
}

function registerShop(req, res, next) {
    userService
        .registerShop(req.body)
        .then(user => {
            res.status(user.status).json(user.message);
        })
        .catch(err => next(err));
}

function addParrainage(req, res, next) {
    userService
        .addParrainage(req)
        .then(user => {
            res.status(user.status).json(user.message);
        })
        .catch(err => next(err));
}
