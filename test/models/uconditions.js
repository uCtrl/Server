'use strict';

var config = require(__dirname + '../../../config/config.js'),
    mongoose = require('mongoose'),
    should = require('should'),
    UPlatform = mongoose.model('UPlatform'),
    UDevice = mongoose.model('UDevice'),
    UScenario = mongoose.model('UScenario'),
    UTask = mongoose.model('UTask'),
    UCondition = mongoose.model('UCondition');

var baseCondition;
var baseTask;
var baseScenario;
var baseDevice;
var basePlatform;

describe('<Model Tests>', function() {
    describe('UCondition:', function() {
        before(function(done) {
            mongoose.connect(config.db, function(err) {
                if (err) return;              
                mongoose.connection.db.dropDatabase(function() {
                    basePlatform = new UPlatform({
                        "firmwareVersion": "1.0.0.2225",
                        "id": "157252470",
                        "name": "Platforme du salon",
                        "port": 5003,
                        "room": "Salon",
                        "enabled": false,
                        "ip": "127.0.0.1"
                    });
                    basePlatform.save(function(err) {
                        if (err) return;
                        baseDevice = new UDevice({    
                            "description": "Lampe principale de la chambre des maîtres",
                            "enabled": true,
                            "id": "3454653456",
                            "isTriggerValue": true,
                            "maxValue": 1,
                            "minValue": 0,
                            "name": "Lampe principale",
                            "precision": 0,
                            "status": 0,
                            "type": 3,
                            "unitLabel": "",
                            "_platform": basePlatform._id
                        });

                        baseDevice.save(function(err) {
                            if (err) return;
                            baseScenario = new UScenario({
                                "id": 1782103622,
                                "name": "Semaine",
                                "_device": baseDevice._id
                            });
                            baseScenario.save(function(err) {
                                if (err) return;
                                baseTask = new UTask({         
                                    "id": 1782103623,
                                    "status": false,
                                    "_scenario": baseScenario._id
                                });
                                baseTask.save(done);
                            });

                        });
                    });
                });
            });
        });

        after(function(done) {
            mongoose.connection.close(done)
        });

        beforeEach(function(done) {
            baseCondition = new UCondition({
              "beginDate": "2014-09-09",
              "comparisonType": 2,
              "endDate": "2014-12-31",
              "id": 1350245612,
              "type": 1,
              "_task": baseTask._id
            });
            done();
        });

        afterEach(function(done) {
            baseCondition.remove();
            done();
        });

        it("should create a condition and link it in the associated task", function(done) {
            baseCondition.save(function(err, condition) {
                should.not.exist(err);
                should.exist(condition);
                condition.id.should.equal(baseCondition.id);
                condition._task.should.equal(baseTask._id);

                UTask.findById(baseTask._id, function(err, task) {
                    baseTask = task;
                    should.exist(baseTask._conditions[0]);
                    baseTask._conditions[0].should.eql(condition._id);
                    done();
                });
            });
        });

        it("should update a condition", function(done) {
            baseCondition.save(function(err, condition) {
                should.not.exist(err);
                should.exist(condition);

                baseCondition.id = "123123123";
                baseCondition.save(function(err, condition) {
                    should.not.exist(err);
                    should.exist(condition);
                    condition.id.should.equal(baseCondition.id);
                    done();
                });
            });
        });

        it("should remove a condition", function(done) {
            baseCondition.save(function(err, condition) {
                should.not.exist(err);
                should.exist(condition);

                baseCondition.remove(function(err) {
                    should.not.exist(err);
                    done();
                });
            });
        });

        it("should remove a task and all its conditions", function(done) {
            baseCondition.save(function(err, condition) {
                should.not.exist(err);
                should.exist(condition);
   
                UTask.findOne({ id: baseTask.id}, function(err, task) { 
                    task.remove(function(err) {
                        UTask.find({}, function(err, tasks) {
                            tasks.should.be.empty;
                            UCondition.find({}, function(err, conditions) {
                                conditions.should.be.empty;
                                done();
                            });
                        });
                    });
                });
            });
        });

    });
});