const express = require('express')
const mongoose = require('mongoose')
const configs = require('../config/config.js')

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

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '10mb' }));

app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`)
})

module.exports = app;