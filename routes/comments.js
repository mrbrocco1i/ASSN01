let Comment = require('../models/comments');
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');



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

router.findOne = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    Comment.find({ "_id" : req.params.id },function(err, comment) {
        if (err) {
            res.status(404);
            res.send(err);
        }
        else if (comment.length === 0)
            res.json({message:'No Such Comment!'});
        else
            res.json(comment);

    });
}

module.exports = router;