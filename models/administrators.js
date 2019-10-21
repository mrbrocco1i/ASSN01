let mongoose = require('mongoose');

let AdministratorSchema = new mongoose.Schema({
        username: String,
        password: String,
        authorised: Boolean,
        jurisdiction: String
    },
    {collection:'administrators'});

module.exports = mongoose.model('Administrator', AdministratorSchema);

/*

const administrators = [
    {"username": "Myron", "password": "123456", "authorised": true, jurisdiction: "read-write"},
    {"username": "Mike", "password": "123456", "authorised": true, jurisdiction: "read-only"},
    {"username": "Lucy", "password": "123456", "authorised": true, jurisdiction: "read-only"},
    {"username": "Tony", "password": "123456", "authorised": false, jurisdiction: "read-only"},
    {"username": "Helen", "password": "123456", "authorised": true, jurisdiction: "read-only"}
];

 */
