const   express = require("express"),
        router = express.Router(),
        jwtUtils = require("../utils/jwt.utils"),
        nodemailer = require('nodemailer');


router.post("/contact", contact);
router.post("/user/contact", sendEmail);
//router.get('/contact/list', getAllContacts)

module.exports = router;

function contact (request, response) {
    const { pseudo, email, subject, message } = request.body
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
      subject: subject,
      text: "Pseudo: " + pseudo + "\n" + email + "\n\n" + message
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log("Error :", error);
        response.status(400).json("Email sending failed")
      } else {
        console.log('Email sent: ' + info.response);
        response.status(200).json("Email sent")
      }
    });
  }

function sendEmail (request, response) {
    /*let headerAuth = request.headers['authorization'];
    let userId = jwtUtils.getUserId(headerAuth);
    if (userId < 0)
        return (undefined);*/

    const { pseudo, email, subject, message, to } = request.body;
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
            console.log("Error :", error);
            response.status(400).json("Email sending failed")
        } else {
            console.log('Email sent: ' + info.response);
            response.status(200).json("Email sent")
        }
    });
}


