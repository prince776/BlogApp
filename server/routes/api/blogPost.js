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
            isDeleted: false
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
                            message: 'Post created. Find it at: ' + 'http://localhost:3000/blogPosts' + '/' + user.username
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

}