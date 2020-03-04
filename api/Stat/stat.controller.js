const   express = require("express"),
        router = express.Router(),
        statService = require("./stat.service");

router.get("/user/mark/average/:id", getMarkAverage);
router.get("/offer/lastMonth/:id", offerLastMonth);

module.exports = router;

function getMarkAverage(req, res, next) {
    statService
        .getMarkAverage(req)
        .then(list => {
            if (list !== undefined)
                res.json(list).status(200);
            else
                res.status(400).json({ message: "Bad Token" })
        })
        .catch(err => next(err));
}

function offerLastMonth(req, res, next) {
    statService
        .offerLastMonth(req)
        .then(list => {
            if (list !== undefined)
                res.json(list).status(200);
            else
                res.status(400).json({ message: "Bad Token" })
        })
        .catch(err => next(err));
}