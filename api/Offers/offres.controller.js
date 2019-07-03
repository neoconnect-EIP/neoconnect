const express = require("express");
const router = express.Router();
const offresService = require("./offres.service");

router.post("/offres/insert", insert);
router.get("/offres/list", getAll);
router.get("/offres/:id", getById);
router.put("/offres/:id", update);
router.delete("/offres/:id", _delete);

module.exports = router;

function insert(req, res, next) {
	console.log(req.body);
	offresService
		.insert(req.body)
		.then(() => res.json({}))
		.catch(err => next(err));
}

function getAll(req, res, next) {
	offresService
		.getAll()
		.then(offres => res.json(offres))
		.catch(err => next(err));
}

function getById(req, res, next) {
	offresService
		.getById(req.params.id)
		.then(() => res.json({}))
		.catch(err => next(err));
}

function update(req, res, next) {
	offresService
		.update(req.params.id, req.body)
		.then(() => res.json({}))
		.catch(err => next(err));
}

function _delete(req, res, next) {
	offresService
		.delete(req.params.id)
		.then(() => res.json({}))
		.catch(err => next(err));
}
