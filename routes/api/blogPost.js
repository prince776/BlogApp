var User = require('./../../models/User.js')
var UserSession = require('./../../models/UserSession.js')
var BlogPost = require('./../../models/BlogPost.js')

var sendError = (res, errFront, errBack) => {
    if (!errBack) errBack = errFront;
    console.log('[-]Error: ' + String(errBack))
    return res.send({
        success: false,
        message: errFront
    });
}

module.exports = (app) => {

    app.post('/api/blogPost/create', (req, res) => {

        var sessionToken = req.cookies.sessionToken;
        const ipAddress = String(req.headers['x-forwarded-for'] || req.connection.remoteAddress);
        var { name, title, content } = req.body;

        if (!name) return sendError(res, "Empty Name");
        if (!title) return sendError(res, "Empty Title");
        if (!content) return sendError(res, "Empty Cotent");

        name = name.trim();
        title = title.trim();
        content = content.trim();

        //get what user is signed in
        UserSession.find({
            _id: sessionToken,
            isDeleted: false,
            ipAddress: ipAddress
        }, (err, previousSessions) => {
            if (err) return sendError(res, "Server Error", err);
            if (previousSessions.length < 1) return sendError(res, "Invalid Session");

            var session = previousSessions[0];

            User.find({
                isDeleted: false,
                _id: session.userID
            }, (err, previousUsers) => {
                if (err) return sendError(res, "Server Error", err);
                if (previousUsers.length < 1) return sendError(res, "User doesn't exists");

                var user = previousUsers[0];
                //Now we have the user
                //check if the name is not already taken by this user

                BlogPost.find({
                    author: user._id,
                    isDeleted: false,
                    name: name
                }, (err, previousPosts) => {
                    if (err) return sendError(res, "Server Error", err);
                    if (previousPosts.length >= 1) return sendError(res, "Name already taken please choose another");

                    var newPost = BlogPost();
                    newPost.name = name;
                    newPost.title = title;
                    newPost.content = content;
                    newPost.author = user._id;

                    newPost.save((err, docs) => {
                        if (err) return sendError(res, "Error saving post to DB", err);
                        return res.send({
                            success: true,
                            message: 'Post created. Find it at: ' + 'https://fierce-retreat-71149.herokuapp.com/blogPosts' + '/' + user.username
                                + '/' + docs.name,
                        })
                    })

                })

            })
        })

    });

    app.post('/api/blogPost/getBlogPostData', (req, res) => {
        var { username, blogPostName } = req.body;

        if (!username) return sendError(res, "Username Empty");
        if (!blogPostName) return sendError(res, "Blog Post Name Empty");

        username = username.trim();
        blogPostName = blogPostName.trim();

        User.find({
            username: username,
            isDeleted: false
        }, (err, previousUsers) => {
            if (err) return sendError(res, "Server Error", err);
            if (previousUsers.length < 1) return sendError(res, "Username doesn't Exists");

            BlogPost.find({
                isDeleted: false,
                author: previousUsers[0]._id,
                name: blogPostName
            }, (err, previousBlogPosts) => {
                if (err) return sendError(res, "Server Error", err);
                if (previousBlogPosts.length < 1) return sendError(res, "Error:404 Blog Post Not Found")

                var post = previousBlogPosts[0];

                return res.send({
                    success: true,
                    title: post.title,
                    content: post.content,
                    timestamp: post.timestamp,
                    username: previousUsers[0].username,
                    blogPostName: post.name
                })

            })

        })




    });

    app.post('/api/blogPost/getMyPosts', (req, res) => {

        const sessionToken = req.cookies.sessionToken;
        const ipAddress = String(req.headers['x-forwarded-for'] || req.connection.remoteAddress);

        UserSession.find({
            _id: sessionToken,
            isDeleted: false,
            ipAddress: ipAddress
        }, (err, previousSessions) => {
            if (err) return sendError(res, "Server Error", err);
            if (previousSessions.length < 1) return sendError(res, "Session Expired");

            User.find({
                isDeleted: false,
                _id: previousSessions[0].userID
            }, (err, previousUsers) => {

                if (err) return sendError(res, "Server Error", err);
                if (previousUsers.length < 1) return sendError(res, "User Not Found!");

                var user = previousUsers[0];
                var blogPostNames = [];
                var blogPostTitles = [];

                BlogPost.find({
                    isDeleted: false,
                    author: user._id
                }, (err, previousPosts) => {

                    if (err) return sendError(res, "Server Error", err);

                    if (previousPosts.length < 1) {
                        return res.send({
                            success: false,
                            message: 'No Posts Yet',
                            username: user.username
                        })
                    }

                    previousPosts.forEach((post) => {
                        blogPostNames.push(post.name);
                        blogPostTitles.push(post.title);
                    });

                    return res.send({
                        blogPostNames: blogPostNames,
                        blogPostTitles: blogPostTitles,
                        username: user.username
                    })

                })

            })

        })
    });

    app.post('/api/blogPost/delete', (req, res) => {
        const sessionToken = req.cookies.sessionToken;
        const ipAddress = String(req.headers['x-forwarded-for'] || req.connection.remoteAddress);

        var { blogPostName } = req.body;

        if (!blogPostName) return sendError(res, "Empty Blog Name");

        UserSession.find({
            _id: sessionToken,
            isDeleted: false,
            ipAddress: ipAddress
        }, (err, previousSessions) => {
            if (err) return sendError(res, "Server Error", err);
            if (previousSessions.length < 1) return sendError(res, "Session Expired");

            User.find({
                isDeleted: false,
                _id: previousSessions[0].userID
            }, (err, previousUsers) => {
                if (err) return sendError(res, "Server Error", err);
                if (previousUsers.length < 1) return sendError(res, "User doesn't exists");

                var user = previousUsers[0];

                BlogPost.find({
                    isDeleted: false,
                    author: user._id,
                    name: blogPostName
                }, (err, previousPosts) => {
                    if (err) return sendError(res, "Server Error", err);
                    if (previousPosts.length < 1) return sendError(res, "Post doesn't exists");

                    var post = previousPosts[0];
                    post.isDeleted = true;
                    post.save((err, docs) => {
                        if (err) return sendError(res, "Server Error", err);
                        return res.send({
                            success: true,
                            message: 'Post deleted Successfully'
                        })
                    })

                })

            })

        })
    });

}