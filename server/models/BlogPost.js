var mongoose = require('mongoose')

const BlogPostSchema = new mongoose.Schema({

    title: {
        type: String,
        default: '',
    },
    content: {
        type: String,
        default: '',
    },
    timestamp: {
        type: Date,
        default: Date.now()
    },
    author: {
        type: String,
        default: ''
    },
    name: {//For now Unique to user
        type: String,
        default: ''
    },
    isDeleted: {
        type: String,
        default: false
    }

})

module.exports = mongoose.model("BlogPost", BlogPostSchema);