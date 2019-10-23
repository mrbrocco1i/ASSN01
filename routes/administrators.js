let Administrator = require('../models/administrators');
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
var mongodbUri = 'mongodb://localhost:27017/vendingMdb';

mongoose.connect(mongodbUri);
let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});

router.findAll = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    Administrator.find(function (err, administrator) {
        if (err)
            res.send({message: 'SOMETHING IS WRONG!', err});
        else if (administrator.length === 0)
            res.send('No Record!');
        else
            res.send(JSON.stringify(administrator, null, 5))
    });
}

router.findOne = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    Administrator.find({ "_id" : req.params.id },function(err, administrator) {
        if (err)
            res.send({message: 'Administrator NOT Found!', err});
        else if (administrator.length === 0)
            res.send('No Such Administrator!');
        else
            res.send(JSON.stringify(administrator,null,5));

    });
}

router.addRecord = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    var administrator = new Administrator();
    administrator.username = req.body.username;
    administrator.password = req.body.password;
    administrator.authorised = true;
    administrator.jurisdiction = 'read-only';

    administrator.save(function(err) {
        if (err)
            res.send({message: 'Fail To Add Record!', err});
        else
            res.send('Record Added!');
    });
}


router.deleteRecord = (req,res) => {
    Administrator.findByIdAndRemove(req.params.id, function(err) {
        if (err)
            res.send(err);
        else
            res.send('Record Successfully Deleted!');
    });
}

router.login = (req,res) => {
    res.setHeader('Content-Type', 'application/json');

    Administrator.find({"username": req.body.username}, function(err, administrator) {
        if (err)
            res.send(err);
        else if (administrator.length === 0)
            res.send('No Such Username!');
        else if (administrator[0].password === req.body.password)
            res.send('Welcome');
        else
            res.send('Password is not correct!');
    })

}


module.exports = router;