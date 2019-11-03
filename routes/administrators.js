let Administrator = require('../models/administrators');
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let jwt = require('jsonwebtoken');
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
    Administrator.find(function (err, administrator) {
        if (administrator.length === 0)
            res.json({message: 'No Record!'});
        else
            res.send(JSON.stringify(administrator, null, 5))
    });
}

router.findOne = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    Administrator.find({ "_id" : req.params.id },function(err, administrator) {
        if (err){
            res.status(404);
            res.send(err);
        }
        else if (administrator.length === 0)
            res.json({message: 'No Such Admin!'});
        else
            res.json(administrator);

    });
}

router.addRecord = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    var administrator = new Administrator();
    administrator.username = req.body.username;
    administrator.password = req.body.password;
    administrator.authorised = true;
    administrator.privilege = 'read-only';

    administrator.save(function(err) {
        res.json({message:'Record Added!',data:administrator});
    });
}


router.deleteRecord = (req,res) => {
    Administrator.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.status(404);
            res.send(err);
        }
        else
            res.json({message:'Record Successfully Deleted!'});
    });
}

router.login = (req,res) => {
    res.setHeader('Content-Type', 'application/json');

    Administrator.find({"username": req.body.username}, function(err, administrator) {
        if (err)
            res.send(err);
        else if (administrator.length === 0)
            res.json({message: 'No Such Username!'});
        else if (administrator[0].password === req.body.password) {
            let token = administrator[0].generatetoken();
            res.json({message: `Welcome, ${administrator[0].username}!`, token: token});
        }
        else
            res.json({message: 'Password is not correct!'});

    })

}

router.loginByToken = (req,res) => {
    console.log(req.token);
    jwt.verify(req.token, 'secretkey',(err,authData) => {
        if (err)
            res.sendStatus(403);
        else {
            res.json({
                message: `Welcome Back, ${authData.username}!`
            })
        }
    })
}


module.exports = router;