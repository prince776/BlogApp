var User = require('../../models/User.js')
var UserSession = require('../../models/UserSession.js');

var sendError = (res, errFront, errBack) => {
    if (!errBack) errBack = errFront;
    console.log('[-]Error: ' + String(errBack))
    return res.send({
        success: false,
        message: errFront
    });
}

module.exports = (app) => {

    app.post('/api/account/signup', (req, res) => {
        var { body } = req;
        var { username, email, password } = body;

        if (!username) return sendError(res, "Empty Username");
        else if (!email) return sendError(res, "Empty Email");
        else if (!password) return sendError(res, "Empty Password");

        username = username.trim();
        email = email.trim();
        email = email.toLowerCase();

        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var validEmail = re.test(String(email).toLowerCase());
        if (!validEmail) return sendError(res, 'Invalid Email')

        User.find({
            email: email,
            isDeleted: false
        }, (err, previousUsers) => {
            if (err) return sendError(res, err);
            if (previousUsers.length > 0) return sendError(res, "Email already registered");

            User.find({
                username: username,
                isDeleted: false
            }, (err, previousUsers1) => {
                if (err) return sendError(res, err);
                if (previousUsers1.length > 0) return sendError(res, "Username already registered");

                var newUser = User();
                newUser.username = username;
                newUser.email = email;
                newUser.password = newUser.generateHash(password);

                newUser.save((err, docs) => {
                    if (err) return sendError(res, "Server Error", err);
                    else {
                        return res.send({
                            success: true,
                            message: 'Signed up succesfully'
                        })
                    }
                })

            })


        })
    });

    app.post('/api/account/signin', (req, res) => {
        var { body } = req;
        var { email, password } = body;

        if (!email) return sendError(res, "Empty Email");
        else if (!password) return sendError(res, "Empty Email");

        email = email.trim();
        email = email.toLowerCase();

        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var validEmail = re.test(String(email).toLowerCase());
        if (!validEmail) return sendError(res, 'Invalid Email')


        User.find({
            email: email,
            isDeleted: false
        }, (err, previousUsers) => {
            if (err) return sendError(res, "Server Error", err);
            if (previousUsers.length < 1) return sendError(res, "User doesn't exists");

            const user = previousUsers[0];
            if (!user.validPassword(password)) return sendError(res, "Password Incorrect");

            //create login session
            var userSession = UserSession();
            userSession.userID = user._id;
            userSession.ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

            userSession.save((err, docs) => {
                if (err) return sendError(res, "Server error", err);
                //send Cookies
                var farFuture = new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 365 * 10)); // ~10y
                res.cookie('sessionToken', docs._id, { expires: farFuture });
                //send success message
                return res.send({
                    success: true,
                    message: 'Signed in succesfully'
                })
            })
        })

    });

    app.post('/api/account/verify', (req, res) => {

        const sessionToken = req.cookies.sessionToken;
        const ipAddress = String(req.headers['x-forwarded-for'] || req.connection.remoteAddress);

        UserSession.find({
            _id: sessionToken,
            isDeleted: false,
            ipAddress: ipAddress
        }, (err, previousSessions) => {
            if (err) return sendError(res, "Server Error", err);
            if (previousSessions.length < 1) return sendError(res, "Session Expired");

            return res.send({
                success: true,
                message: "Sesion valid"
            });

        })

    });

    app.post('/api/account/signout', (req, res) => {

        const sessionToken = req.cookies.sessionToken;
        const ipAddress = String(req.headers['x-forwarded-for'] || req.connection.remoteAddress);

        UserSession.find({
            _id: sessionToken,
            isDeleted: false,
            ipAddress: ipAddress
        }, (err, previousSessions) => {
            if (err) return sendError(res, "Server Error", err);
            if (previousSessions.length < 1) return sendError(res, "Session Already Expired");

            var userSession = previousSessions[0];
            userSession.isDeleted = true;

            userSession.save((err, docs) => {
                if (err) return sendError(res, "Server Error", err);
                res.clearCookie('sessionToken');
                return res.send({
                    success: true,
                    message: "Sesion Logged Out"
                });
            })
        })

    });


}