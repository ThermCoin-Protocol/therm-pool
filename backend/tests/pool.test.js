const request = require("supertest");
const chai = require("chai");
const expect = chai.expect;
const dbUtil = require("../services/db-util");
const app = require("../index.js");

describe("Mining pool registration test", function () {
  before(function () {
    process.env.NODE_ENV = "test"; // Setting an environment variable to 'test'
  });

  // Before each test, reset the database to its original state
  beforeEach(function () {
    dbUtil.clearDatabase("pool-test.db");
    dbUtil.initDatabase("pool-test.db");
    dbUtil.insertDummyData("pool-test.db");
  });

  // Reset the environment variable after all tests are done
  after(function () {
    process.env.NODE_ENV = "development";
  });

  // Test for GET multiple miners
  describe("GET /pool", function () {
    it("should retrieve multiple miners", function (done) {
      request(app)
        .get("/pool")
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).to.have.property("data");
          var data = res.body.data;
          expect(Object.keys(data).length).to.equal(4);
          expect(res.body).to.have.property("meta");
          done();
        });
    });
  });

  // Test for GET single miner
  describe("GET /pool/:nodeId", function () {
    it("should retrieve a miner by node ID", function (done) {
      const nodeId =
        "d2c37664c252655e3da74bdec9b0fb37d5a4f63252d64f7c7e0eb58b2af6d8a4";
      request(app)
        .get("/pool/" + nodeId)
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body.data[0]).to.have.property("node_id");
          expect(res.body.data[0]).to.have.property("wallet_address");
          done();
        });
    });
  });

  // Test for POST (create miner)
  describe("POST /pool", function () {
    it("should create a miner", function (done) {
      const newMiner = {
        nodeId:
          "94fde9c8b6c58880cbf45b7a34142d5f1a2a44f232d82b7a22d6b510db3a9ed1",
        walletAddress: "0x3b74fa3410e032fe519f7a8101a411b1b3e4564d",
      };
      request(app)
        .post("/pool")
        .send(newMiner)
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body)
            .to.have.property("message")
            .equal("Miner added successfully");
          done();
        });
    });
  });

  // Test for PUT (update miner)
  describe("PUT /pool/:nodeId", function () {
    it("should update a miner", function (done) {
      const nodeId =
        "cc1be0a288beb0f1c6b95bc5c75b3126153f2bb8fe3003e7c3e28e441e546f8d";
      const updatedData = {
        nodeId: "cc1be0a288beb0f1c6b95bc5c75b3126153f2bb8fe3003e7c3e28e441e546f8d",
        walletAddress: "0xbbb9d32f2c5f0875dcca42c6931b5e587b2a7c29",
      };
      request(app)
        .put("/pool/" + nodeId)
        .send(updatedData)
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body)
            .to.have.property("message")
            .equal("Miner updated successfully");
          done();
        });
    });
  });

  // Test for DELETE miner
  describe("DELETE /pool/:nodeId", function () {
    it("should delete a miner by node ID", function (done) {
      const nodeId =
        "cc1be0a288beb0f1c6b95bc5c75b3126153f2bb8fe3003e7c3e28e441e546f8d";
      request(app)
        .delete("/pool/" + nodeId)
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body)
            .to.have.property("message")
            .equal("Miner deleted successfully");
          done();
        });
    });
  });
});
