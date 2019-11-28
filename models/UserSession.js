var mongoose = require('mongoose')

var UserSessionSchema = new mongoose.Schema({

    userID: {
        type: String,
        default: ''
    },
    timestamp: {
        type: Date,
        default: Date.now()
    },
    ipAddress: {
        type: String,
        default: ''
    },
    isDeleted: {
        type: Boolean,
        default: false
    }

})

module.exports = mongoose.model("UserSession", UserSessionSchema);