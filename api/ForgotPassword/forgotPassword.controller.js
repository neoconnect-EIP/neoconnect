const   express = require("express"),
    router = express.Router(),
    Service = require("./forgotPassword.service");

router.post("/forgotPassword", forgotPassword);
router.get("/resetPassword/:resetPasswordToken", resetPassword);
router.put("/updatePassword", updatePassword);

module.exports = router;

function forgotPassword(req, res, next) {
    Service
        .forgotPassword(req.body)
        .then(list => {
            if (list !== undefined)
                res.json(list).status(200);
            else
                res.status(400).json({ message: "Bad request" })
        })
        .catch(err => next(err));
}

function resetPassword(req, res, next) {
    Service
        .resetPassword(req)
        .then(list => {
            if (list !== undefined)
                res.json(list).status(200);
            else
                res.status(400).json({ message: "Bad request" })
        })
        .catch(err => next(err));
}

function updatePassword(req, res, next) {
    Service
        .updatePassword(req.body)
        .then(list => {
            if (list !== undefined)
                res.json(list).status(200);
            else
                res.status(400).json({ message: "Bad request" })
        })
        .catch(err => next(err));
}