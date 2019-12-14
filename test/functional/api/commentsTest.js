const chai = require("chai");
const Comment = require('../../../models/comments');
const expect = chai.expect;
const request = require("supertest");
const _ = require("lodash");
const mongoose = require("mongoose");
const { MongoClient } = require("mongodb")
const MongoMemoryServer = require("mongodb-memory-server").MongoMemoryServer;

let server;
let db, validID, url, connection, collection;

describe("Comments", () => {
    before(async () => {
        try {
            let mongod = new MongoMemoryServer({
                instance: {
                    port: 27017,
                    dbPath: "./test/database2",
                    dbName: "vendingMdb" // by default generate random dbName
                }
            });
            // Async Trick - this ensures the database is created before
            // we try to connect to it or start the server
            url = await mongod.getConnectionString();

            connection = await MongoClient.connect(url, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
            db = connection.db(await mongod.getDbName())
             collection = db.collection('comments')
            server = require('../../../bin/www')
        } catch (error) {
            console.log(error);
        }
    });

    after(async () => {
        try {
          //  await db.dropDatabase();
        } catch (error) {
            console.log(error);
        }
    });

    beforeEach(async () => {
        try {
            await Comment.deleteMany({});
            let comment = new Comment();
            comment.message = "hi";
            await comment.save();
            comment = new Comment();
            comment.message = "hello";
            await comment.save();

            comment = await Comment.findOne({message: "hi"});
            validID = comment._id;
        } catch (error) {
            console.log(error);
        }
    });

    describe("GET /comment", () => {
        describe('when the collection is not empty', () => {
            it("should GET all the comments", done => {
                request(server)
                    .get("/comment")
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/) // regular expression
                    .expect(200)
                    .end((err, res) => {
                        try {
                            expect(res.body).to.be.a("array");
                            expect(res.body.length).to.equal(2);
                            let result = _.map(res.body, cmt => {
                                return {
                                    message: cmt.message
                                };
                            });
                            expect(result).to.deep.include({
                                message: "hi"
                            });
                            expect(result).to.deep.include({
                                message: "hello"
                            });

                            done();
                        } catch (e) {
                            done(e);
                        }
                    });
            });
        })
        describe('when the collection is empty', () => {
            it('should return a error message', () => {
                db.dropDatabase();
                return request(server)
                    .get('/comment')
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .then(res => {
                        expect(res.body.message).equals('No Record Found!');
                    });
            })
        })

    });

    describe("POST /addComment", () => {
        it("should return confirmation message and update database", () => {
            const comment = {
                message: 'Oh'
            };
            return request(server)
                .post("/addComment")
                .send(comment)
                .expect(200)
                .then(res => {
                    expect(res.body.message).equals("Record Added!");
                });
        });
        after(() => {
            return request(server)
                .get('/comment')
                .expect(200)
                .then(res => {
                    expect(res.body).to.be.a("array");
                    expect(res.body.length).to.equal(3);
                    let result = _.map(res.body, cmt => {
                        return {
                            message: cmt.message
                        };
                    });
                    expect(result).to.deep.include({
                        message: "Oh"
                    });
                });
        });
    });

    describe("Delete /deleteCmt/:id", () => {
        describe("when the id is valid", () => {
            it("should return a message and the record with this id will be discarded", () => {
                    return request(server)
                        .delete(`/deleteCmt/${validID}`)
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
                    .get(`/${validID}`)
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .then(res => {
                        expect(res.body.message).equals('No Such Comment!');
                    });
            });



        });
        describe("when the id is invalid", () => {
            it("should return a message for deleting failure", () => {
                return request(server)
                    .delete("/deleteCmt/9999")
                    .expect(404)
            })

        })

    });
})