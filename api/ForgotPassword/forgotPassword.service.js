require('dotenv').config();
const   db = require("../_helpers/db"),
    Inf = db.Influencer,
    Shop = db.Shop,
    ForgotPassword = db.ForgotPassword,
    bcrypt = require("bcrypt"),
    jwtUtils = require("../utils/jwt.utils");
    crypto= require('crypto');


const nodemailer = require('nodemailer');

async function forgotPassword(params) {
    if (params.email === undefined || params.email === '')
        return (undefined);
    console.log("rest");
    let user = await Inf.findOne({
        where: {
            email: params.email,
        }
    });
    if (user === null) {
        user = await Shop.findOne({
            where: {
                email: params.email,
            }
        })
    }
    if (!user)
        return (undefined);
    const token = crypto.randomBytes(20).toString('hex');
    console.log(token);
    const row = await ForgotPassword.create({
        email: params.email,
        resetPasswordToken: token,
        resetPasswordExpires: Date.now() + (60*60*1000)
    });

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: `contact.neoconnect@gmail.com`,
            pass: `neo!support123`
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const mailOptions = {
        from: `neoconnect@gmail.com`,
        to: `${user.email}`,
        subject: `Link To Reset Password`,
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
            `Please click of the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n` +
            `http://localhost:3000/landing-page/reset-password?token=${token}\n\n` +
            `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    console.log(`sending mail`);

    transporter.sendMail(mailOptions, function (err, response) {
        if (err) {
            console.error('there was an error: ', err);
        } else {
            console.log('here is the res: ', response);
            return ('recovery email sent');
        }
    });
    return ('recovery email sent');
}

async function resetPassword(req) {
    if (req === undefined)
        return (undefined);
    let select = await ForgotPassword.findOne({
        where: {
            resetPasswordToken: req.params.resetPasswordToken,
        },
    });
    if (select === null)
        return (undefined);
    let tmp = new Date();
    if (select.dataValues.resetPasswordExpires.getTime() < tmp.getTime())
        return (undefined);
    return ({
        email: select.email,
        message: 'password reset link a-ok',
    });
}

async function updatePassword(params) {
    if (params.email === undefined)
        return (undefined);
    let user = await Inf.findOne({
        where: {
            email: params.email,
        }
    });
    if (user === null) {
        user = await Shop.findOne({
            where: {
                email: params.email,
            }
        })
    }
    if (user === null)
        return (undefined);
    let checkToken = await ForgotPassword.findOne({
       where: {
           resetPasswordToken: params.resetPasswordToken,
       }
    });
    if (checkToken === null)
        return (undefined);
    let tmp = await ForgotPassword.findOne({
        where: {
            email: params.email,
        }
    });
    console.log("Object ForgotPassword", tmp.dataValue);
    await tmp.destroy();

    let hash = bcrypt.hashSync(params.password, 5);

    await user.update({
        password: hash
    });
    return ("password updated");
}

module.exports = {
    forgotPassword,
    resetPassword,
    updatePassword,
};