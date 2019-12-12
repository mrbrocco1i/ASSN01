let mongoose = require('mongoose');

let CommentSchema = new mongoose.Schema({
        message: String

    },
    {collection:'comments'});

module.exports = mongoose.model('Comment', CommentSchema);