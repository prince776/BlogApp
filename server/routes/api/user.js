var User = require('../../models/User.js')

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
        password = password.trim();

        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var validEmail = re.test(String(email).toLowerCase());
        if (!validEmail) return sendError(res, 'Invalid Email')

        User.find({
            email: email
        }, (err, previousUsers) => {
            if (err) return sendError(res, err);
            if (previousUsers.length > 0) return sendError(res, "Email already registered");

            var newUser = new User();
            newUser.username = username;
            newUser.email = email;
            newUser.password = password;

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
    });

}