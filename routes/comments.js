let Comment = require('../models/comments');
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

var mongodbUri = 'mongodb://localhost:27017/vendingMdb';
mongoose.connect(mongodbUri, {
    useNewUrlParser: true, useUnifiedTopology: true
});
let db = mongoose.connection;
db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});

router.findAll = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    Comment.find(function (err, comment) {
        if (comment.length === 0)
            res.json({message: 'No Record Found!'});
        else
            res.json(comment);
    });
}

router.addComment = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    var comment = new Comment();
    comment.message = req.body.message;
    comment.save(function(err) {
        res.json({message:'Record Added!', data:comment});
    });
}

router.deleteRecord = (req,res) => {
    res.setHeader('Content-Type', 'application/json');
    Comment.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.status(404);
            res.send(err);
        }
        else
            res.json({message:'Record Successfully Deleted!'});
    });
}

module.exports = router;