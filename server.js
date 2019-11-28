const express = require('express')
const mongoose = require('mongoose')
const configs = require('./config/config.js')
const cors = require('cors');
var cookieParser = require('cookie-parser')
const path = require('path')

const PORT = process.env.PORT || 8080;

mongoose.connect(configs.mongodb, (err, docs) => {
    if (err) {
        console.log("Can't connect to MongoDB");
        console.log("Error: " + err);
    } else {
        console.log("MonogoDB successfully connected");
    }
});

mongoose.Promise = global.Promise;

var app = express();

//middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '10mb' }));
app.use(cors({
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'exposedHeaders': ['sessionId'],
    'credentials': true,
    'origin': ['http://localhost:3000', 'http://192.168.0.86:3000', 'http://localhost:5000', 'http://192.168.0.86:5000'],
}))
app.use(cookieParser());
//TODO: use env file
//routes
require('./routes/api/user.js')(app);
require('./routes/api/userProfile.js')(app);
require('./routes/api/blogPost.js')(app);

//Serve static assests if in production
if (process.env.NODE_ENV === 'production') {
    //set static folder
    app.use(express.static('client/build'));
    app.get("/service-worker.js", (req, res) => {
        res.sendFile(path.resolve(__dirname, "public", "worker.js"));
    });
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}

app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`)
})

module.exports = app;