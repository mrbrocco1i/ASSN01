let Beverage = require('../models/beverages');
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
    Beverage.find(function (err, beverage) {
        if (beverage.length === 0)
            res.json({message: 'No Record Found!'});
        else
            res.json(beverage);
    });
}

router.findOne = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    Beverage.find({ "_id" : req.params.id },function(err, beverage) {
        if (err) {
            res.status(404);
            res.send(err);
        }
        else if (beverage.length === 0)
            res.json({message:'No Such Beverage!'});
        else
            res.json(beverage);

    });
}

router.findByCategory = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    Beverage.find({"type": req.params.type}, function(err, beverage) {
        if (beverage.length === 0)
            res.send({message:'No such type of beverage!'});
        else {
            res.json(beverage);
        }
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
        res.json({message:'Record Added!', data:beverage});
    });
}

router.incrementAmount = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    Beverage.findById(req.params.id, function(err,beverage) {
        if (err) {
            res.status(404);
            res.send(err);
        }
        else {
            beverage.amount += 1;
            beverage.save(function (err) {
                mes = {
                    message: 'Amount Increased!',
                    beverage: beverage
                    };
                res.send(JSON.stringify(mes,null,5));
            });
        }
    });
}

router.deleteRecord = (req,res) => {
    res.setHeader('Content-Type', 'application/json');
    Beverage.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.status(404);
            res.send(err);
        }
        else
            res.json({message:'Record Successfully Deleted!'});
    });
}

router.changePrice = (req,res) => {
    res.setHeader('Content-Type', 'application/json');
    Beverage.findById(req.params.id, function(err,beverage){
        if (err) {
            res.status(404);
            res.send(err);
        }
        else {
            beverage.price = req.body.price;
            beverage.save(function (err) {
                mes = {
                    message: 'Price Changed Successfully!',
                    beverage: beverage
                    }
                res.send(JSON.stringify(mes,null,5));
            })
        }

    })



}

router.deleteByName = (req,res) => {
    res.setHeader('Content-Type', 'application/json');
    Beverage.findOneAndDelete({"name": req.params.name}, function(err, beverage){
        if (err) {
            res.status(404);
            res.send(err);
        }
        else
            res.json({message: 'Record Successfully Deleted!'});


    })

}

router.findByNameFuzzy = (req,res) => {
    res.setHeader('Content-Type', 'application/json');
    var regex = new RegExp(req.params.fname,'i');
    Beverage.find({"name":regex}, function(err,beverage) {
        if (beverage.length === 0)
            res.json({message:'No Such Beverage!'});
        else
            res.send(JSON.stringify(beverage,null,5));

    })

}

module.exports = router;