'use strict';

var config = require(__dirname + '../../../config/config.js'),
    mongoose = require('mongoose'),
    should = require('should'),
    UPlatform = mongoose.model('UPlatform'),
    UDevice = mongoose.model('UDevice'),
    UScenario = mongoose.model('UScenario'),
    UTask = mongoose.model('UTask'),
    UCondition = mongoose.model('UCondition');

var baseTask;
var baseScenario;
var baseDevice;
var basePlatform;

describe('<Model Tests>', function() {
    describe('UTask:', function() {
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
                            baseScenario.save(done);
                        });
                    });
                });
            });
        });

        after(function(done) {
            mongoose.connection.close(done)
        });

        beforeEach(function(done) {
            baseTask = new UTask({         
                "id": 1782103623,
                "status": false,
                "_scenario": baseScenario._id
            });
            done();
        });

        afterEach(function(done) {
            baseTask.remove();
            done();
        });

        it("should create a task and link it in the associated scenario", function(done) {
            baseTask.save(function(err, task) {
                should.not.exist(err);
                should.exist(task);
                task.id.should.equal(baseTask.id);
                task._scenario.should.equal(baseScenario._id);

                UScenario.findById(baseScenario._id, function(err, scenario) {
                    baseScenario = scenario;
                    should.exist(baseScenario._tasks[0]);
                    baseScenario._tasks[0].should.eql(task._id);
                    done();
                });
            });
        });

        it("should update a task", function(done) {
            baseTask.save(function(err, task) {
                should.not.exist(err);
                should.exist(task);

                baseTask.id = "123123123";
                baseTask.save(function(err, task) {
                    should.not.exist(err);
                    should.exist(task);
                    task.id.should.equal(baseTask.id);
                    done();
                });
            });
        });

        it("should remove a task", function(done) {
            baseTask.save(function(err, task) {
                should.not.exist(err);
                should.exist(task);

                baseTask.remove(function(err) {
                    should.not.exist(err);
                    done();
                });
            });
        });

        it("should remove a scenario and all its tasks", function(done) {
            baseTask.save(function(err, task) {
                should.not.exist(err);
                should.exist(task);
   
                UScenario.findOne({ id: baseScenario.id}, function(err, scenario) { 
                    scenario.remove(function(err) {
                        UScenario.find({}, function(err, scenarios) {
                            scenarios.should.be.empty;
                            UTask.find({}, function(err, tasks) {
                                tasks.should.be.empty;
                                done();
                            });
                        });
                    });
                });
            });
        });

    });
});