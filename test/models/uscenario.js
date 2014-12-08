'use strict';

var config = require(__dirname + '../../../config/config.js'),
	mongoose = require('mongoose'),
	should = require('should'),
	UPlatform = mongoose.model('UPlatform'),
	UDevice = mongoose.model('UDevice'),
	UScenario = mongoose.model('UScenario'),
	UTask = mongoose.model('UTask');

var baseScenario;
var baseDevice;
var basePlatform;

describe('<Model Tests>', function () {
	describe('UScenario:', function () {
		before(function (done) {
			mongoose.connect(config.db, function (err) {
				if (err) return;
				mongoose.connection.db.dropDatabase(function () {
					basePlatform = new UPlatform({
						"firmwareVersion": "1.0.0.2225",
						"id": "157252470",
						"name": "Platforme du salon",
						"port": 5003,
						"room": "Salon",
						"enabled": false,
						"ip": "127.0.0.1"
					});
					basePlatform.save(function (err) {
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

						baseDevice.save(done);
					});
				});
			});
		});

		after(function (done) {
			mongoose.connection.close(done)
		});

		beforeEach(function (done) {
			baseScenario = new UScenario({
				"id": 1782103622,
				"name": "Semaine",
				"_device": baseDevice._id
			});
			done();
		});

		afterEach(function (done) {
			baseScenario.remove();
			done();
		});

		it("should create a scenario and link it in the associated device", function (done) {
			baseScenario.save(function (err, scenario) {
				should.not.exist(err);
				should.exist(scenario);
				scenario.id.should.equal(baseScenario.id);
				scenario._device.should.equal(baseDevice._id);

				UDevice.findById(baseDevice._id, function (err, device) {
					baseDevice = device;
					should.exist(baseDevice._scenarios[0]);
					baseDevice._scenarios[0].should.eql(scenario._id);
					done();
				});
			});
		});

		it("should update a scenario", function (done) {
			baseScenario.save(function (err, scenario) {
				should.not.exist(err);
				should.exist(scenario);

				baseScenario.id = "123123123";
				baseScenario.save(function (err, scenario) {
					should.not.exist(err);
					should.exist(scenario);
					scenario.id.should.equal(baseScenario.id);
					done();
				});
			});
		});

		it("should remove a scenario", function (done) {
			baseScenario.save(function (err, scenario) {
				should.not.exist(err);
				should.exist(scenario);

				baseScenario.remove(function (err) {
					should.not.exist(err);
					done();
				});
			});
		});

		it("should remove a device and all its scenarios", function (done) {
			baseScenario.save(function (err, device) {
				should.not.exist(err);
				should.exist(device);

				UDevice.findOne({ id: baseDevice.id}, function (err, device) {
					device.remove(function (err) {
						UDevice.find({}, function (err, devices) {
							devices.should.be.empty;
							UScenario.find({}, function (err, scenarios) {
								scenarios.should.be.empty;
								done();
							});
						});
					});
				});
			});
		});

	});
});