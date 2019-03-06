
import Joi from 'joi';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodeMailer from 'nodemailer';
import ENV from 'dotenv';

ENV.config();

const validator = (identifier, data) => {
    let schema = false;
    const options = {
        allowUnknown: true,
        abortEarly: false,
    };
    switch (identifier) {
        case 'meetup': {
            schema = {
                location: Joi.string().trim().min(5).required(),
                images: Joi.array().required(),
                topic: Joi.string().trim().min(5).required(),
                description: Joi.string().trim().required(),
                happeningon: Joi.date().required(),
                tags: Joi.array(),
            };
            break;
        }
        case 'rsvps': {
            schema = {
                response: Joi.string().trim().required().valid(['yes', 'no', 'maybe']),
            };
            break;
        }
        case 'question': {
            schema = {
                title: Joi.string().trim().min(5).required(),
                body: Joi.string().trim().min(10).required(),
            };
            break;
        }
        case 'user': {
            schema = {
                firstname: Joi.string().trim().min(3).required(),
                lastname: Joi.string().trim().min(3).required(),
                othername: Joi.string().trim(),
                email: Joi.string().trim().email({
                    minDomainAtoms: 2,
                }).required(),
                phonenumber: Joi.number().required(),
                username: Joi.string().trim().min(5).required(),
                password: Joi.string().trim().min(8).required(),
                registered: Joi.date(),
                isadmin: Joi.boolean().required(),
            };
            break;
        }
        case 'login': {
            schema = {
                username: Joi.string().trim().min(5).required(),
                password: Joi.string().trim().min(8).required(),
            };
            break;
        }
        case 'addMeetupImages': {
            schema = {
                images: Joi.array().required(),
            };
            break;
        }
        case 'removeMeetupImages': {
            schema = {
                images: Joi.string().trim().required(),
            };
            break;
        }
        case 'addMeetupTags': {
            schema = {
                tags: Joi.array().required(),
            };
            break;
        }
        case 'removeMeetupTags': {
            schema = {
                tags: Joi.string().trim().required(),
            };
            break;
        }
        case 'comment': {
            schema = {
                comment: Joi.string().trim().min(3).required(),
            };
            break;
        }
        case 'updateComment': {
            schema = {
                comment: Joi.string().trim().min(3).required(),
            };
            break;
        }
        case 'updateMeetup': {
            schema = {
                location: Joi.string().trim().min(5).required(),
                topic: Joi.string().trim().min(5).required(),
                description: Joi.string().trim().required(),
                happeningon: Joi.date().required(),
            };
            break;
        }
        case 'updateQuestion': {
            schema = {
                title: Joi.string().trim().min(5).required(),
                body: Joi.string().trim().min(10).required(),
            };
            break;
        }
        case 'updateUser': {
            schema = {
                firstname: Joi.string().trim().min(3).required(),
                lastname: Joi.string().trim().min(3).required(),
                othername: Joi.string().trim(),
                email: Joi.string().trim().email({
                    minDomainAtoms: 2,
                }).required(),
                phonenumber: Joi.number().required(),
                username: Joi.string().trim().min(5).required(),
                isadmin: Joi.boolean().required(),
            };
            break;
        }
        case 'recoverPassword': {
            schema = {
                email: Joi.string().trim().email({
                    minDomainAtoms: 2,
                }).required(),
            };
            break;
        }
        case 'ResetPasswordUsingHash': {
            schema = {
                password: Joi.string().trim().min(8).required(),
                confirmpassword: Joi.string().trim().min(8).required()
                .valid(Joi.ref('password'))
                .options({
                    language: {
                        any: {
                            allowOnly: '!!Passwords do not match',
                        },
                    },
                }),
            };
            break;
        }
        case 'ValidateResetCode': {
            schema = {
                code: Joi.number().min(1000).max(99999)
                .required(),
            };
            break;
        }
        case 'ResetPasswordUsingResetCode': {
            schema = {
                code: Joi.number().min(1000).max(99999)
                .required(),
                password: Joi.string().trim().min(8).required(),
                confirmpassword: Joi.string().trim().min(8).required()
                .valid(Joi.ref('password'))
                .options({
                    language: {
                        any: {
                            allowOnly: '!!Passwords do not match',
                        },
                    },
                }),
            };
            break;
        }
        default: {
            schema = false;
        }
    }
    return Joi.validate(data, schema, options);
};

const validationErrors = (res, error) => {
    const errorMessage = error.details.map(d => d.message);
    return res.status(400).send({
        status: 400,
        error: errorMessage,
    });
};

const hashPassword = (password) => {
    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(8));
    return hashedPassword;
};

const comparePassword = (passwordHash, password) => {
    const comparedPassword = bcrypt.compareSync(password, passwordHash);
    return comparedPassword;
};

const generateToken = (userinfo) => {
    const Issuetoken = jwt.sign(userinfo,
        process.env.SECRET, { expiresIn: '1d' });
    return Issuetoken;
};

const popularTags = (tags) => {
    const popularTagsList = [];
    const popularTagsOccurency = [];
    tags.forEach((tag) => {
        if (!(popularTagsList.includes(tag))) {
            popularTagsList.push(tag);
            popularTagsOccurency.push(tagOccurency(tags, tag));
        }
    });

    const processedPopular = [];
    for (let count = 0; count < popularTagsList.length; count += 1) {
        const tagProcessed = {
            tags: popularTagsList[count],
            occurency: popularTagsOccurency[count],
        };
        processedPopular.push(tagProcessed);
    }

    processedPopular.sort((a, b) => {
        const occurency1 = a.occurency;
        const occurency2 = b.occurency;
        return occurency1 < occurency2 ? 1 : -1;
    });

    return processedPopular;
};

const tagOccurency = (tags, tag) => {
    let counter = 0;
    tags.forEach((singletag) => {
        if (singletag === tag) {
            counter += 1;
        }
    });
    return counter;
};

// FROM https://medium.com/@chiragpatel_52497/how-to-send-emails-in-node-js-programming-school-183ea8aedf57
const sendPasswordRecoveryMail = (names, resetCode, hashedText, receiverEmail) => {
    // Converting secure to boolean
    const secure = (process.env.SENDER_EMAIL_SECURE === 'true');

    const transporter = nodeMailer.createTransport({
    host: process.env.SENDER_EMAIL_SMTP_HOST,
    port: process.env.SENDER_EMAIL_PORT,
    secure,
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_EMAIL_PASSWORD,
    },
    });
    const resetUrl = `${process.env.APP_URL}/api/v1/auth/reset/${hashedText}`;
    const htmlEmail = `<!doctype html><html> <head> <meta name="viewport" content="width=device-width"/> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/> <title>Questioner Reset Password</title> <style>img{border: none; -ms-interpolation-mode: bicubic; max-width: 100%;}body{background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;}table{border-collapse: separate; width: 100%;}table td{font-family: sans-serif; font-size: 14px; vertical-align: top;}.body{background-color: #f6f6f6; width: 100%;}.container{display: block; margin: 0 auto !important; max-width: 580px; padding: 10px; width: 580px;}.content{box-sizing: border-box; display: block; margin: 0 auto; max-width: 580px; padding: 10px;}.main{background: #ffffff; border-radius: 3px; width: 100%;}.wrapper{box-sizing: border-box; padding: 20px;}.content-block{padding-bottom: 10px; padding-top: 10px;}.footer{clear: both; margin-top: 10px; text-align: center; width: 100%;}.footer td, .footer p, .footer span, .footer a{color: #999999; font-size: 12px; text-align: center;}h1, h2, h3, h4{color: #000000; font-family: sans-serif; font-weight: 400; line-height: 1.4; margin: 0; margin-bottom: 30px;}h1{font-size: 35px; font-weight: 300; text-align: center; text-transform: capitalize;}p, ul, ol{font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;}p li, ul li, ol li{list-style-position: inside; margin-left: 5px;}a{color: #3498db; text-decoration: underline;}.btn{box-sizing: border-box; width: 100%;}.btn > tbody > tr > td{padding-bottom: 15px;}.btn table{width: auto;}.btn table td{background-color: #ffffff; border-radius: 5px; text-align: center;}.btn a{background-color: #ffffff; border: solid 1px #3498db; border-radius: 5px; box-sizing: border-box; color: #3498db; cursor: pointer; display: inline-block; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-decoration: none; text-transform: capitalize;}.btn-primary table td{background-color: #3498db;}.btn-primary a{background-color: #3498db; border-color: #3498db; color: #ffffff;}.last{margin-bottom: 0;}.first{margin-top: 0;}.align-center{text-align: center;}.align-right{text-align: right;}.align-left{text-align: left;}.clear{clear: both;}.mt0{margin-top: 0;}.mb0{margin-bottom: 0;}.preheader{color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; visibility: hidden; width: 0;}.powered-by a{text-decoration: none;}hr{border: 0; border-bottom: 1px solid #f6f6f6; margin: 20px 0;}@media only screen and (max-width: 620px){table[class=body] h1{font-size: 28px !important; margin-bottom: 10px !important;}table[class=body] p, table[class=body] ul, table[class=body] ol, table[class=body] td, table[class=body] span, table[class=body] a{font-size: 16px !important;}table[class=body] .wrapper, table[class=body] .article{padding: 10px !important;}table[class=body] .content{padding: 0 !important;}table[class=body] .container{padding: 0 !important; width: 100% !important;}table[class=body] .main{border-left-width: 0 !important; border-radius: 0 !important; border-right-width: 0 !important;}table[class=body] .btn table{width: 100% !important;}table[class=body] .btn a{width: 100% !important;}table[class=body] .img-responsive{height: auto !important; max-width: 100% !important; width: auto !important;}}@media all{.ExternalClass{width: 100%;}.ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div{line-height: 100%;}.apple-link a{color: inherit !important; font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; text-decoration: none !important;}.btn-primary table td:hover{background-color: #34495e !important;}.btn-primary a:hover{background-color: #34495e !important; border-color: #34495e !important;}}</style> </head> <body> <span class="preheader">Password resetting on Questioner.</span> <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body"> <tr> <td>&nbsp;</td><td class="container"> <div class="content"> <table role="presentation" class="main"> <tr> <td class="wrapper"> <table role="presentation" border="0" cellpadding="0" cellspacing="0"> <tr> <td> <p>Hi ${names},</p><p>We heard that you lost your Questioner password. Sorry about that! <br>But don’t worry! You can use the button below to reset your password</p><table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary"> <tbody> <tr> <td align="left"> <table role="presentation" border="0" cellpadding="0" cellspacing="0"> <tbody> <tr> <td> <a href="${resetUrl}" target="_blank">Reset Password</a> </td></tr></tbody> </table> </td></tr></tbody> </table> <p>OR use this this Access Code: ${resetCode}</p><p>Thanks! Meet you on the other side.</p></td></tr></table> </td></tr></table> <div class="footer"> <table role="presentation" border="0" cellpadding="0" cellspacing="0"> <tr> <td class="content-block"> If you don’t use this link or Access code, it will expire. </td></tr><tr> <td class="content-block"> <span class="apple-link">Questioner by <a href="https://twitter.com/j_nkindi">Jacques Nyilinkindi</a></span>. </td></tr></table> </div></div></td><td>&nbsp;</td></tr></table> </body></html>`;
    const mailOptions = {
        from: `"${process.env.SENDER_EMAIL_NAMES}" <${process.env.SENDER_EMAIL}>`, // sender address
        to: receiverEmail, // list of receivers
        subject: 'Reset Password of Questioner ', // Subject line
        html: htmlEmail, // html body
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return false;
        }
        return true;
    });
    return true;
};

export {
    validator,
    validationErrors,
    hashPassword,
    comparePassword,
    generateToken,
    popularTags,
    sendPasswordRecoveryMail,
};
