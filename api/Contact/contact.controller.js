const   express = require("express"),
        router = express.Router(),
        jwtUtils = require("../utils/jwt.utils"),
        check = require("../utils/validation");
        nodemailer = require('nodemailer');


router.post("/contact", contact);
router.post("/user/contact", sendEmail);
router.post("/user/feedback", userFeedback);
//router.get('/contact/list', getAllContacts)

module.exports = router;

function contact (request, response) {
    const { pseudo, email, subject, message } = request.body;
    if (!pseudo || !email || !subject || !message)
        return response.status(400).json("Bad Request, Fields Missing, Please put all of fields (pseudo, email, subject, message)");
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'contact.neoconnect@gmail.com',
        pass: 'neo!support123'
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    var mailOptions = {
      from: pseudo,
      to: 'contact.neoconnect@gmail.com',
      subject: `[CONTACT] - ${subject}`,
      text: pseudo + " " + email + " vous a contacté :" + "\n" + message
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        response.status(400).json("Email sending failed")
      } else {
        response.status(200).json(`Email sent`)
      }
    });
  }

function sendEmail (request, response) {
    const { pseudo, email, subject, message, to } = request.body;
    if (!pseudo || !email || !subject || !message || !to)
        return response.status(400).json("Bad Request, Fields Missing, Please put all of fields (pseudo, email, subject, message, to)");
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'contact.neoconnect@gmail.com',
            pass: 'neo!support123'
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    var mailOptions = {
        from: pseudo,
        to: to,
        subject: subject,
        text: "Pseudo: " + pseudo + "\n" + email + "\n\n" + message
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            response.status(400).json("Email sending failed")
        } else {
            response.status(200).json(`Email sent`)
        }
    });
}

function userFeedback (req, res) {
    if (!check.checkSelectField(req.body.environnement, ['android', 'ios', 'web']) || !check.checkSelectField(req.body.type, ['bug', 'amelioration', 'commentaire']))
        return res.status(400).json("Bad Request, Fields Missing, Please put all of fields (environnement, type)");
    let message;
    if (req.body.type === 'commentaire' && req.body.commentaire === undefined || req.body.type !== 'commentaire' && req.body.fonctionnalite === undefined)
        return res.status(400).json("Bad Request, Fields Missing, Please put 'commentaire' or 'fonctionnalite' in body'");
    if (req.body.fonctionnalite !== undefined)
        message = req.body.fonctionnalite;
    else
        message = req.body.commentaire;
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'contact.neoconnect@gmail.com',
            pass: 'neo!support123'
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    var mailOptions = {
        from: `Feedback ${req.body.environnement}`,
        to: 'contact.neoconnect@gmail.com',
        subject: `[${req.body.type}][${req.body.environnement}]`,
        text: `Retour de ${req.body.pseudo} - ${req.body.email}` + "\n\n" + message
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            res.status(400).json("Email sending failed")
        } else {
            res.status(200).json(`Email sent`)
        }
    });
}


