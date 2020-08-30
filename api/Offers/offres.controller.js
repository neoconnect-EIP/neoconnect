const express = require("express");
const router = express.Router();
const offresService = require("./offres.service");

router.post("/offer/insert", insert);
router.get("/offer/list", getAll);
router.get("/offer/suggestion", offerSuggestion);
router.get("/offer/:id", getById);
router.get("/offer/shop/:id", getByShop);
router.put("/offer/:id", update);
router.delete("/offer/:id", _delete);
router.put("/offer/apply/:id", apply);
router.delete("/offer/noapply/:id", removeApply);
router.post("/offer/share/:id", shareOffer);
router.post("/offer/report/:id", reportOffer);
router.post("/offer/sharePublication/:id", sharePublication);

router.get("/offer/apply/:id", getApplyOffer);
router.get("/inf/offer/applied/:id", getApplyUser);
router.post("/offer/choiceApply", choiceApply);

module.exports = router;

function insert(req, res, next) {
	offresService
		.insert(req)
        .then(list => {
            res.status(list.status).json(list.message);
        })
		.catch(err => next(err));
}

function getAll(req, res, next) {
	offresService
		.getAll(req)
        .then(list => {
            res.status(list.status).json(list.message);
        })
        .catch(err => next(err));
}

function getById(req, res, next) {
	offresService
		.getById(req)
        .then(list => {
            res.status(list.status).json(list.message);
        })
        .catch(err => next(err));
}

function getByShop(req, res, next) {
    offresService
        .getByShop(req)
        .then(list => {
            res.status(list.status).json(list.message);
        })
        .catch(err => next(err));
}

function update(req, res, next) {
	offresService
		.update(req)
        .then(list => {
            res.status(list.status).json(list.message);
        })
        .catch(err => next(err));
}

function _delete(req, res, next) {
	offresService
		.delete(req)
        .then(list => {
            if (list !== undefined)
                res.json(list).status(200);
            else
                res.status(400).json({ message: "Bad request" })
        })
        .catch(err => next(err));
}

function apply(req, res, next) {
    offresService
        .apply(req)
        .then(list => {
            res.status(list.status).json(list.message);
        })
        .catch(err => next(err));
}

function removeApply(req, res, next) {
    offresService
        .removeApply(req)
        .then(list => {
            if (list !== undefined)
                res.json(list).status(204);
            else
                res.status(400).json({ message: "Bad request" })
        })
        .catch(err => next(err));
}

function getApplyOffer(req, res, next) {
    offresService
        .getApplyOffer(req)
        .then(list => {
            res.status(list.status).json(list.message);
        })
        .catch(err => next(err));
}

function getApplyUser(req, res, next) {
    offresService
        .getApplyUser(req)
        .then(list => {
            res.status(list.status).json(list.message);
        })
        .catch(err => next(err));
}

function shareOffer(req, res, next) {
	offresService
		.shareOffer(req)
		.then(list => {
            res.status(list.status).json(list.message);
		})
		.catch(err => next(err));
}

function reportOffer(req, res, next) {
	offresService
		.reportOffer(req)
		.then(list => {
            res.status(list.status).json(list.message);
		})
		.catch(err => next(err));
}

function sharePublication(req, res, next) {
    offresService
        .sharePublication(req)
        .then(list => {
            res.status(list.status).json(list.message);
        })
        .catch(err => next(err));
}

function offerSuggestion(req, res, next) {
    offresService
        .offerSuggestion(req)
        .then(list => {
            res.status(list.status).json(list.message);
        })
        .catch(err => next(err));
}

function choiceApply(req, res, next) {
    offresService
        .chooseApply(req)
        .then(list => {
            res.status(list.status).json(list.message);
        })
        .catch(err => next(err));
}

