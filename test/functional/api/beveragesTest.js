const chai = require("chai");
const Beverage = require('../../../models/beverages');
const expect = chai.expect;
const request = require("supertest");
const _ = require("lodash");
const MongoMemoryServer = require("mongodb-memory-server").MongoMemoryServer;
const mongoose = require("mongoose");
const { MongoClient } = require("mongodb")

let server;
let mongod;
let db, validID, validType, validName, url, connection, collection;

describe("Beverages", () => {
    before(async () => {
        try {
            console.log('1')
            mongod = await new MongoMemoryServer({
                instance: {
                    port: 27017,
                    dbPath: "./test/database",
                    dbName: "vendingMdb" // by default generate random dbName
                },
                debug: true
            });
            // Async Trick - this ensures the database is created before
            // we try to connect to it or start the server
            url = await mongod.getConnectionString();
            console.log(url)

            connection = await MongoClient.connect(url, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
            db = connection.db(await mongod.getDbName())
             collection = db.collection('beverages')
            server = require('../../../bin/www')
        } catch (error) {
            console.log(error);
        }
    });

    after(async () => {
        try {
           // await db.dropDatabase();
        } catch (error) {
            console.log(error);
        }
    });

    beforeEach(async () => {
        try {
            await Beverage.deleteMany({});
            let beverage = new Beverage();
            beverage.type = "water";
            beverage.name = "FIJI Natural Artesian Water Bottles";
            beverage.brand = "Fiji";
            beverage.size = 500;
            beverage.amount = 20;
            beverage.price = 0.8;
            await beverage.save();
            beverage = new Beverage();
            beverage.type = "fizzy drinks";
            beverage.name = "Coca-Cola Original Taste Cans";
            beverage.brand = "Cocacola";
            beverage.size = 330;
            beverage.amount = 20;
            beverage.price = 0.4;
            await beverage.save();
            beverage = await Beverage.findOne({size: 330});
            validID = beverage._id;
            validType = beverage.type;
            validName = beverage.name;
        } catch (error) {
            console.log(error);
        }
    });

    describe("GET /beverages", () => {
        describe('when the collection is not empty', () => {
            it("should GET all the beverages", done => {
                request(server)
                    .get("/beverages")
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/) // regular expression
                    .expect(200)
                    .end((err, res) => {
                        try {
                            expect(res.body).to.be.a("array");
                            expect(res.body.length).to.equal(2);
                            let result = _.map(res.body, beverage => {
                                return {
                                    name: beverage.name
                                };
                            });
                            expect(result).to.deep.include({
                                name: "FIJI Natural Artesian Water Bottles"
                            });
                            expect(result).to.deep.include({
                                name: "Coca-Cola Original Taste Cans"
                            });

                            done();
                        } catch (e) {
                            done(e);
                        }
                    });
            });
        })
     /*   describe('when the collection is empty', () => {
            it('should return a error message', () => {
                db.dropDatabase();
                return request(server)
                    .get('/beverages')
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .then(res => {
                        expect(res.body.message).equals('No Record Found!');
                    });
            })
        }) */

    });

    describe("GET /beverages/findById/:id", () => {
        describe("when the id is valid", () => {
            it("should return the matching beverage", done => {
                request(server)
                    .get(`/beverages/findById/${validID}`)
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body[0]).to.have.property('name', "Coca-Cola Original Taste Cans");
                        expect(res.body[0]).to.have.property("type", "fizzy drinks");
                        done(err);
                    });
            });
        });
        describe("when the id is invalid", () => {
            it("should return a 404 for invalid message", () => {
                return request(server)
                    .get("/beverages/findById/9999")
                    .expect(404)
            });
        });
        describe("when the id is valid but not right", () => {
            it("should return an error message", () => {
                return request(server)
                    .get("/beverages/findById/5da70ae77ae718085631ed02")
                    .expect(200)
                    .then(res => {
                        expect(res.body.message).equals('No Such Beverage!');
                    })
            });
        });
    });

    describe("GET /beverages/findByType/:type", () => {
        describe("when the id is valid", () => {
            it("should return the matching beverage", done => {
                request(server)
                    .get(`/beverages/findByType/${validType}`)
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body[0]).to.have.property('name', "Coca-Cola Original Taste Cans");
                        expect(res.body[0]).to.have.property("type", "fizzy drinks");
                        done(err);
                    });
            });
        });
        describe("when the id is invalid", () => {
            it("should return the NOT found message", done => {
                request(server)
                    .get("/beverages/findByType/abc")
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.message).equals('No such type of beverage!');
                        done(err);
                    });
            });
        });
    });

    describe("GET /beverages/findByName_fuzzy/:fname", () => {
        describe("when the id is valid", () => {
            it("should return the matching beverage", done => {
                request(server)
                    .get(`/beverages/findByName_fuzzy/Cans`)
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body[0]).to.have.property('name', "Coca-Cola Original Taste Cans");
                        expect(res.body[0]).to.have.property("type", "fizzy drinks");
                        done(err);
                    });
            });
        });
        describe("when the id is invalid", () => {
            it("should return the NOT found message", done => {
                request(server)
                    .get("/beverages/findByName_fuzzy/CCCCC")
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.message).equals('No Such Beverage!');
                        done(err);
                    });
            });
        });
    });

    describe("POST /beverages/addRecord", () => {
        it("should return confirmation message and update database", () => {
            const beverage = {
                type: "coffee",
                name: "Nescafe Azera Nitro",
                brand: "Nescafe",
                size: 192,
                amount: 20,
                price: 2.4
            };
            return request(server)
                .post("/beverages/addRecord")
                .send(beverage)
                .expect(200)
                .then(res => {
                    expect(res.body.message).equals("Record Added!");
                    validID = res.body.data._id;
                });
        });
        after(() => {
            return request(server)
                .get(`/beverages/findById/${validID}`)
                .expect(200)
                .then(res => {
                    expect(res.body[0]).to.have.property('name', "Nescafe Azera Nitro");
                    expect(res.body[0]).to.have.property("type", "coffee");
                });
        });
    });

    describe("PUT /beverages/addAmount/:id", () => {
        describe("when the id is valid", () => {
            it("should return a message and the beverage amount increased by 1", () => {
                return request(server)
                    .put(`/beverages/addAmount/${validID}`)
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.include({
                            message: "Amount Increased!"
                        });
                        expect(res.body.beverage).to.have.property("amount", 21);
                    });
            });
            after(() => {
                return request(server)
                    .get(`/beverages/findById/${validID}`)
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .then(res => {
                        expect(res.body[0]).to.have.property("amount", 21);
                    });
            });
        });
        describe("when the id is invalid", () => {
            it("should return a 404 for invalid message", () => {
                return request(server)
                    .put("/beverages/addAmount/9999")
                    .expect(404)

            });
        });
    });

    describe("PUT /beverages/changePrice/:id", () => {
        describe("when the id is valid", () => {
            it("should return a message and the price is changed", () => {
                return request(server)
                    .put(`/beverages/changePrice/${validID}`)
                    .send({price:1})
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.include({
                            message: "Price Changed Successfully!"
                        });
                        expect(res.body.beverage).to.have.property("price", 1);
                    });
            });
            after(() => {
                return request(server)
                    .get(`/beverages/findById/${validID}`)
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .then(res => {
                        expect(res.body[0]).to.have.property("price", 1);
                    });
            });
        });
        describe("when the id is invalid", () => {
            it("should return a 404 for invalid message", () => {
                return request(server)
                    .put("/beverages/changePrice/9999")
                    .expect(404)

            });
        });
    });

    describe("Delete /beverages/deleteById/:id", () => {
        describe("when the id is valid", () => {
                it("should return a message and the record with this id will be discarded", () => {
                        return request(server)
                            .delete(`/beverages/deleteById/${validID}`)
                            .expect(200)
                            .then(resp => {
                                expect(resp.body).to.include({
                                    message: 'Record Successfully Deleted!'
                                });
                            });
                    }
                );
                after(() => {
                    return request(server)
                        .get(`/beverages/findById/${validID}`)
                        .set("Accept", "application/json")
                        .expect("Content-Type", /json/)
                        .expect(200)
                        .then(res => {
                            expect(res.body.message).equals('No Such Beverage!');
                        });
                        });



                });
        describe("when the id is invalid", () => {
            it("should return a message for deleting failure", () => {
                return request(server)
                    .delete("/beverages/deleteById/9999")
                    .expect(404)
            })

        })

    });


    describe("Delete /beverages/deleteByName/:name", () => {
        it("should return a message and the record with this name will be discarded", () => {
                return request(server)
                    .delete(`/beverages/deleteByName/${validName}`)
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
                .get(`/beverages/findById/${validID}`)
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(200)
                .then(res => {
                    expect(res.body.message).equals('No Such Beverage!'); //something is wrong here
                });
        });

    });


})



