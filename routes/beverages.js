let Beverage = require('../models/beverages');
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
    Beverage.find(function (err, beverage) {
        if (err)
            res.send({message: 'SOMETHING IS WRONG!', err});
        else
            res.send(JSON.stringify(beverage, null, 5))
    });
}

router.findOne = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    Beverage.find({ "_id" : req.params.id },function(err, beverage) {
        if (err)
            res.send({message: 'Beverage NOT Found!', err});
        else
            res.send(JSON.stringify(beverage,null,5));

    });
}

router.addRecord = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    var beverage = new Beverage();
    beverage.type = req.body.type;
    beverage.name = req.body.name;
    beverage.brand = req.body.brand;
    beverage.size = req.body.size;
    beverage.amount = req.body.amount;
    beverage.price = req.body.price;

    beverage.save(function(err) {
        if (err)
            res.send({message: 'Fail To Add Record!', err});
        else
            res.send('Record Added!');
    });
}

router.incrementAmount = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    Beverage.findById(req.params.id, function(err,beverage) {
        if (err)
            res.send({message: 'Beverage NOT Found!', err});
        else {
            beverage.amount += 1;
            beverage.save(function (err) {
                if (err)
                    res.send(err);
                else
                    mes = {
                        message: 'Amount Increased',
                        beverage: beverage
                    }
                    res.send(JSON.stringify(mes,null,5));
            });
        }
    });
}

router.deleteRecord = (req,res) => {
    Beverage.findByIdAndRemove(req.params.id, function(err) {
        if (err)
            res.send(err);
        else
            res.send('Record Successfully Deleted!');
    });
}

function getByValue(array, id) {
    var result  = array.filter(function(obj){return obj.id == id;} );
    return result ? result[0] : null;
}

module.exports = router;