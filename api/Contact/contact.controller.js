const   express = require("express"),
        router = express.Router(),
        nodemailer = require('nodemailer');


router.post("/contact", contact);
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
    
    
   /* pool.query('INSERT INTO contact (pseudo, subject, message) VALUES ($1, $2, $3)', [pseudo, subject, message], (error, results) => {
      if (error) {
        return console.error('Error executing query', error.stack)
      }
      response.status(201).send(`Contact added with ID: ${results.insertId}`)
    })*/
  }

 /* const getAllContacts = (request, response) => {
    pool.query('SELECT * FROM contact ORDER BY id ASC', (error, results) => {
      if (error) {
        return console.error('Error executing query', error.stack)
      }
      response.status(201).json(results.rows)
    })
  }*/