const chai = require("chai");
const Administrator = require('../../../models/administrators');
const expect = chai.expect;
const request = require("supertest");
const _ = require("lodash");
const MongoMemoryServer = require("mongodb-memory-server").MongoMemoryServer;
const mongoose = require("mongoose");

let server;
let mongod;
let db, validID ,validToken;

describe("Administrators", () => {
    before(async () => {
        try {
            mongod = new MongoMemoryServer({
                instance: {
                    port: 27017,
                    dbPath: "./test/database",
                    dbName: "vendingMdb" // by default generate random dbName
                }
            });
            // Async Trick - this ensures the database is created before
            // we try to connect to it or start the server
            await mongod.getConnectionString();

            mongoose.connect("mongodb://localhost:27017/vendingMdb", {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            server = require("../../../bin/www");
            db = mongoose.connection;
        } catch (error) {
            console.log(error);
        }
    });

    after(async () => {
        try {
            await db.dropDatabase();
        } catch (error) {
            console.log(error);
        }
    });

    beforeEach(async () => {
        try {
            await Administrator.deleteMany({});
            let administrator = new Administrator();
            administrator.username = "Myron";
            administrator.password = "123456";
            administrator.authorised = true;
            administrator.privilege = "read-write";
            await administrator.save();
            administrator = new Administrator();
            administrator.username = "Mike";
            administrator.password = "123456";
            administrator.authorised = true;
            administrator.privilege = "read-only";
            await administrator.save();
            administrator = await Administrator.findOne({username: 'Myron'});
            validID = administrator._id;

        } catch (error) {
            console.log(error);
        }
    });

    describe("GET /administrators", () => {
        it("should GET all the admins", done => {
            request(server)
                .get("/administrators")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/) // regular expression
                .expect(200)
                .end((err, res) => {
                    try {
                        expect(res.body).to.be.a("array");
                        expect(res.body.length).to.equal(2);
                        let result = _.map(res.body, admin => {
                            return {
                                username: admin.username
                            };
                        });
                        expect(result).to.deep.include({
                            username: "Myron"
                        });
                        expect(result).to.deep.include({
                            username: "Mike"
                        });

                        done();
                    } catch (e) {
                        done(e);
                    }
                });
        });
    });

    describe("GET /administrators/findById/:id", () => {
        describe("when the id is valid", () => {
            it("should return the matching admin", done => {
                request(server)
                    .get(`/administrators/findById/${validID}`)
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body[0]).to.have.property('username', "Myron");
                        expect(res.body[0]).to.have.property("password", "123456");
                        done(err);
                    });
            });
        });
        describe("when the id is invalid", () => {
            it("should return a 404 for invalid message", () => {
                return request(server)
                    .get("/administrators/findById/9999")
                    .expect(404)
            });
        });
    })

    describe("Post /administrators/login", () => {
        it("should return a \'welcome\' message", done => {
            const admin = {
                username: 'Myron',
                password: '123456'
            }
            request(server)
                .post('/administrators/login')
                .send(admin)
                .expect(200)
                .end((err,res) => {
                    expect(res.body.message).equals('Welcome, Myron!');
                    expect(res.body).to.have.property('token');
                    validToken = res.body.token;
                    done(err);
                })
        })
        after(() => {
            return request(server)
                .post('/administrators/loginByToken')
                .set('Authorization', 'Bearer '+validToken)
                .expect(200)
                .then(res => {
                    expect(res.body.message).equals('Welcome Back, Myron!');
                } )
        })
    })

    describe("POST /administrators/addRecord", () => {
        it("should return confirmation message and update database", () => {
            const admin = {
                username: "Lucy",
                password: "123456",
                authorised: true,
                privilege: "read-only"
            };
            return request(server)
                .post("/administrators/addRecord")
                .send(admin)
                .expect(200)
                .then(res => {
                    expect(res.body.message).equals("Record Added!");
                    validID = res.body.data._id;
                    console.log(validID)
                });
        });
        after(() => {
            return request(server)
                .get(`/administrators/findById/${validID}`)
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(200)
                .then(res => {
                    expect(res.body[0]).to.have.property("username", "Lucy");
                    expect(res.body[0]).to.have.property("password", "123456");
                });
        });
    });

    describe("POST /administrators/loginByToken", () => {
        it('should return a \'welcome\' message', () => {
            return request(server)
                .post('/administrators/loginByToken')
                .set('Authorization', 'Bearer '+validToken)
                .expect(200)
                .then(res => {
                    expect(res.body.message).equals('Welcome Back, Myron!');
                } );
        })
    })

    describe("Delete /administrators/deleteById/:id", () => {
        describe("when the id is valid", () => {
            it("should return a message and the record with this id will be discarded", () => {
                    return request(server)
                        .delete(`/administrators/deleteById/${validID}`)
                        .expect(200)
                        .then(res => {
                            expect(res.body).to.include({
                                message: 'Record Successfully Deleted!'
                            });
                        });
                }
            );
            after(() => {
                return request(server)
                    .get(`/administrators/findById/${validID}`)
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .then(res => {
                        expect(res.body.message).equals('No Such Admin!');
                    });
            });



        });
        describe("when the id is invalid", () => {
            it("should return a message for deleting failure", () => {
                return request(server)
                    .delete("/administrators/findById/9999")
                    .expect(404)

            })

        })

    });

})