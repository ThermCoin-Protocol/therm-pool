const supertest = require('supertest');
const chai = require('chai');
const app = require('../app');
const Miner = require('../models/miner');

const expect = chai.expect;
const request = supertest(app);

describe('Miner Controller', () => {
    before((done) => {
        Miner.clearDB(() => done());
    });

    describe('POST /api/miner', () => {
        it('should register a new miner', (done) => {
            const data = {
                node_id: 'node_123',
                wallet_address: '0xwalletaddress'
            };

            request.post('/api/miner')
                .send(data)
                .expect(201)
                .end((err, res) => {
                    expect(res.body.message).to.equal('Miner registered successfully.');
                    done(err);
                });
        });
    });

    describe('GET /api/miner/:node_id', () => {
        it('should fetch a miner by node_id', (done) => {
            const node_id = 'node_123';

            request.get(`/api/miner/${node_id}`)
                .expect(200)
                .end((err, res) => {
                    expect(res.body.node_id).to.equal(node_id);
                    done(err);
                });
        });
    });

    describe('PUT /api/miner/:node_id', () => {
        it('should update a miner\'s wallet address by node_id', (done) => {
            const node_id = 'node_123';
            const data = {
                wallet_address: '0xnewwalletaddress'
            };

            request.put(`/api/miner/${node_id}`)
                .send(data)
                .expect(200)
                .end((err, res) => {
                    expect(res.body.message).to.equal('Wallet address updated successfully.');
                    done(err);
                });
        });
    });

    describe('GET /api/miners', () => {
        it('should fetch all miners', (done) => {
            request.get('/api/miners')
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.have.lengthOf(1);
                    done(err);
                });
        });
    });

    describe('DELETE /api/miner/:node_id', () => {
        it('should delete a miner by node_id', (done) => {
            const node_id = 'node_123';

            request.delete(`/api/miner/${node_id}`)
                .expect(200)
                .end((err, res) => {
                    expect(res.body.message).to.equal('Miner deleted successfully.');
                    done(err);
                });
        });
    });
    
    after((done) => {
        Miner.clearDB(() => done());
    });

});