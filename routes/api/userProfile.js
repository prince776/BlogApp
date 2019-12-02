var User = require('../../models/User.js')
var UserSession = require('../../models/UserSession.js');

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

function sendMail(targetEmail, subject, text) {

    var transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: 'accverf007@gmail.com',
            pass: 'accountverifier007'
        }
    }));

    var mailOptions = {
        from: 'accverf007@gmail.com',
        to: targetEmail,
        subject: subject,
        text: text
    };
    var toReturn = true;
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err);
            toReturn = false;
        }
        else toReturn = true;
    });

    return toReturn;
}

var sendError = (res, errFront, errBack) => {
    if (!errBack) errBack = errFront;
    console.log('[-]Error: ' + String(errBack))
    return res.send({
        success: false,
        message: errFront
    });
}

var codeSent = "";

module.exports = (app) => {

    app.post('/api/account/profile', (req, res) => {
        const sessionToken = req.cookies.sessionToken;
        const ipAddress = String(req.headers['x-forwarded-for'] || req.connection.remoteAddress);
        UserSession.find({
            _id: sessionToken,
            isDeleted: false,
            ipAddress: ipAddress
        }, (err, previousSessions) => {
            if (err) return sendError(res, "Server Error", err);
            if (previousSessions.length < 1) return sendError(res, "Session Expired");

            //now find assocciated user
            var session = previousSessions[0];

            User.find({
                isDeleted: false,
                _id: session.userID
            }, (err, previousUsers) => {

                if (err) return sendError(res, "Server Error", err);
                if (previousUsers.length < 1) return sendError(res, "User doesn't exists");

                return res.send({
                    success: true,
                    username: previousUsers[0].username,
                    email: previousUsers[0].email,
                    isVerified: previousUsers[0].isVerified
                });

            })

        })
    });

    app.post('/api/account/profile/sendVerificationCode', (req, res) => {

        var { email } = req.body;
        email = email.trim();

        if (!email) return sendError(res, "Empty Email");

        var code = Math.random() * 100000;
        code = Math.floor(code);
        codeSent = code + "";
        var sent = sendMail(email, "Verification Code from BlogApp made by Prince Gupta", codeSent);
        if (sent) {
            return res.send({
                success: true,
                message: 'Email Verification Code Sent'
            })
        } else return sendError(res, "Can't Send Verification Code");

    });

    app.post('/api/account/profile/verifyCode', (req, res) => {
        var { verificationCode, email } = req.body;

        verificationCode = verificationCode.trim();
        if (verificationCode === codeSent) {

            User.find({
                email: email,
                isDeleted: false
            }, (err, previousUsers) => {
                if (err) return sendError(res, "Server Error");
                else if (previousUsers.length < 1) return sendError(res, "User Not Found");

                else {
                    var user = previousUsers[0];

                    user.isVerified = true;

                    user.save((err, doc) => {
                        if (err) return sendError(res, "Server Error");
                        else {
                            return res.send({
                                success: true,
                                message: "Email Verified Successfully"
                            });
                        }
                    })
                }
            })
        } else {
            return sendError(res, "Wrong Verification Code");
        }
    });

}