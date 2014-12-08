'use strict';

var config = require(__dirname + '../../../config/config.js'),
	mongoose = require('mongoose'),
	should = require('should'),
	UPlatform = mongoose.model('UPlatform'),
	UDevice = mongoose.model('UDevice'),
	UScenario = mongoose.model('UScenario');

var baseDevice;
var basePlatform;

describe('<Model Tests>', function () {
	describe('UDevice:', function () {
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
					basePlatform.save(done)
				});
			});
		});

		after(function (done) {
			mongoose.connection.close(done)
		});

		beforeEach(function (done) {
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
			done();
		});

		afterEach(function (done) {
			baseDevice.remove();
			done();
		});

		it("should create a device and link it in the associated platform", function (done) {
			baseDevice.save(function (err, device) {
				should.not.exist(err);
				should.exist(device);
				device.id.should.equal(baseDevice.id);
				device._platform.should.equal(basePlatform._id);

				UPlatform.findById(basePlatform._id, function (err, platform) {
					basePlatform = platform;
					should.exist(basePlatform._devices[0]);
					basePlatform._devices[0].should.eql(device._id);
					done();
				});
			});
		});

		it("should update a device", function (done) {
			baseDevice.save(function (err, device) {
				should.not.exist(err);
				should.exist(device);

				baseDevice.id = "123123123";
				baseDevice.save(function (err, device) {
					should.not.exist(err);
					should.exist(device);
					device.id.should.equal(baseDevice.id);
					done();
				});
			});
		});

		it("should remove a device", function (done) {
			baseDevice.save(function (err, device) {
				should.not.exist(err);
				should.exist(device);

				baseDevice.remove(function (err) {
					should.not.exist(err);
					done();
				});
			});
		});

		it("should remove a platform and all its devices", function (done) {
			baseDevice.save(function (err, device) {
				should.not.exist(err);
				should.exist(device);

				UPlatform.findOne({ id: basePlatform.id}, function (err, platform) {
					platform.remove(function (err) {
						UPlatform.find({}, function (err, platforms) {
							platforms.should.be.empty;
							UDevice.find({}, function (err, devices) {
								devices.should.be.empty;
								done();
							});
						});
					});
				});
			});
		});

	});
});