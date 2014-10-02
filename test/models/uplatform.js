'use strict';

var config = require(__dirname + '../../../config/config.js'),
    mongoose = require('mongoose'),
    should = require('should'),
    UPlatform = mongoose.model('UPlatform');

var basePlatform;

describe('<Model Tests>', function() {
    describe('UPlatform:', function() {
         before(function(done) {
            mongoose.connect(config.db, function(err) {
                if (err) return;              
                mongoose.connection.db.dropDatabase(done);
            });
        });

        after(function(done) {
            mongoose.connection.close(done)
        });

        beforeEach(function(done) {
           basePlatform = new UPlatform({
                "firmwareVersion": "1.0.0.2225",
                "id": "157252470",
                "name": "Platforme du salon",
                "port": 5003,
                "room": "Salon",
                "enabled": false,
                "ip": "127.0.0.1"
            });
            done();
        });

        afterEach(function(done) {
            basePlatform.remove();
            done();
        });

        it("should create a platform", function(done) {
            basePlatform.save(function(err, platform) {
                should.not.exist(err);
                should.exist(platform);
                platform.id.should.equal(basePlatform.id);
                done();
            });
        });

        it("should update a platform", function(done) {
            basePlatform.save(function(err, platform) {
                should.not.exist(err);
                should.exist(platform);

                basePlatform.id = "11111111";
                basePlatform.save(function(err, platform) {
                    should.not.exist(err);
                    should.exist(platform);
                    platform.id.should.equal(basePlatform.id);
                    done();
                });
            });
        });

        it("should remove a platform", function(done) {
            basePlatform.save(function(err, platform) {
                should.not.exist(err);
                should.exist(platform);

                basePlatform.remove(function(err) {
                    should.not.exist(err);
                    done();
                });
            });
        });
    });
});