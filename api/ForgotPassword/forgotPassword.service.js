require('dotenv').config();
const   db = require("../_helpers/db"),
    Inf = db.Influencer,
    Shop = db.Shop,
    ForgotPassword = db.ForgotPassword,
    bcrypt = require("bcrypt"),
    validation = require("../utils/validation"),
    jwtUtils = require("../utils/jwt.utils");


const nodemailer = require('nodemailer');

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function forgotPassword(params) {
    if (params.email === undefined || params.email === '')
        return ({status: 400, message: "Bad Request, Please give an valid email"});
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
        return ({status: 400, message: "Bad Request, User doesn't exist"});
    const token = randomInteger(100000, 999999).toString();
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
        subject: `Réinitialisation de mot de passe`,
        text: `Bonjour,\n\n` +
            `Voici votre code d'accès temporaire.\n` +
            `Ce code d'accès ne peut être utilisé qu'une fois et expire dans 60 minutes :\n` +
            `${token}\n` +
            `Si vous n'êtes pas à l'origine de cette requête, ` +
            `veuillez nous envoyer un email directement en réponse de celui-ci\n`,
    };

    transporter.sendMail(mailOptions, function (err, response) {
        if (err) {
            return ({status: 400, message: "Error Send mail, Please try later or change your email"});
        } else {
            return ({status: 200, message:'recovery password email as been sent'});
        }
    });
    return ({status: 200, message:'recovery password email as been sent'});
}

async function resetPassword(req) {
    if (req === undefined || req.params.resetPasswordToken === undefined)
        return ({status: 400, message:'Bad request, Please give a resetPasswordToken'});
    let select = await ForgotPassword.findOne({
        where: {
            resetPasswordToken: req.params.resetPasswordToken,
        },
    });
    if (select === null)
        return ({status: 400, message:"Bad request, your reset token doesn't exist"});
    let tmp = new Date();
    if (select.dataValues.resetPasswordExpires.getTime() < tmp.getTime())
        return ({status: 400, message:"Bad request, your reset token is out of time"});
    return ({
            status: 200,
            message: {
                email: select.email,
                message: 'password reset link a-ok'
            }
        }
    );
}

async function updatePassword(params) {
    if (params === undefined || params.email === undefined || params.resetPasswordToken === undefined
        || params.password === undefined)
        return ({status: 400, message:'Bad request, Please give a email, resetPasswordToken and new password'});
    if (!validation.checkRegex('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{4,12}$', params.password))
        return ({status: 400, message: "Invalid password, the password must contain at least 1 capital letter, 1 small letter, 1 number and must be between 4 and 12 characters"});
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
        return ({status: 400, message:"Bad request, User doesn't exist"});
    let checkToken = await ForgotPassword.findOne({
       where: {
           resetPasswordToken: params.resetPasswordToken,
       }
    });
    if (checkToken === null)
        return ({status: 400, message:"Bad request, your reset token doesn't exist"});
    let tmp = await ForgotPassword.findOne({
        where: {
            email: params.email,
        }
    });
    await tmp.destroy();

    let hash = bcrypt.hashSync(params.password, 5);

    await user.update({
        password: hash
    });
    return ({status: 200, message:"Your password has been updated"});
}

module.exports = {
    forgotPassword,
    resetPassword,
    updatePassword,
};