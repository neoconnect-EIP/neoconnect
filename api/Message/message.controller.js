const   express = require("express"),
        messageService = require("./message.service");
        router = express.Router();

router.get("/message", getMessage);
router.get("/message/:id", getMessageById);
router.post("/message", addMessage);

module.exports = router;

function getMessage(req, res, next) {
    messageService
        .get(req)
        .then(user => {
            res.status(user.status).json(user.message);
        })
        .catch(err => next(err));
}

function getMessageById(req, res, next) {
    messageService
        .getById(req.params.id)
        .then(user => {
            res.status(user.status).json(user.message);
        })
        .catch(err => next(err));
}

function addMessage(req, res, next) {
    messageService
        .add(req)
        .then(user => {
            res.status(user.status).json(user.message);
        })
        .catch(err => next(err));
}