let mongoose = require('mongoose');
let jwt = require('jsonwebtoken');

let AdministratorSchema = new mongoose.Schema({
        username: String,
        password: String,
        authorised: Boolean,
        privilege: String
    },
    {collection:'administrators'});

AdministratorSchema.methods.generatetoken = function() {
    let token = jwt.sign({
        username: this.username,
        exp: Math.floor((Date.now()/1000))+30
    }, 'secretkey');
    return token;
}

module.exports = mongoose.model('Administrator', AdministratorSchema);

/*

const administrators = [
	{"username": "Myron", "password": "123456", "authorised": true, "privilege": "read-write"}
    {"username": "Mike", "password": "123456", "authorised": true, "privilege": "read-only"}
    {"username": "Lucy", "password": "123456", "authorised": true, "privilege": "read-only"}
    {"username": "Tony", "password": "123456", "authorised": false, "privilege": "read-only"}
    {"username": "Helen", "password": "123456", "authorised": true, "privilege": "read-only"}
];

 */
