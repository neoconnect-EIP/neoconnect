require('dotenv').config();
const   db = require("../_helpers/db"),
    Inf = db.Influencer,
    Shop = db.Shop,
    ForgotPassword = db.ForgotPassword,
    bcrypt = require("bcrypt"),
    jwtUtils = require("../utils/jwt.utils");


const nodemailer = require('nodemailer');

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function forgotPassword(params) {
    if (params.email === undefined || params.email === '')
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
    if (!user)
        return (undefined);
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
        subject: `Votre code d'accès temporaire`,
        text: `Votre code d'accès temporaire.\n\n` +
            `Ce code d'accès ne peut être utilisé qu'une fois et expire dans 60 minutes :\n\n` +
            `${token}\n\n` +
            `Si vous n'êtes pas à l'origine de cette requête, envoyer nous un message dans le menu conctact\n`,
    };

    transporter.sendMail(mailOptions, function (err, response) {
        if (err) {
            console.error('there was an error: ', err);
        } else {
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