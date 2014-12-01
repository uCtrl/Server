'use strict';

var mongoose = require('mongoose');
var Stats = mongoose.model('Stats');
var UDevice = mongoose.model('UDevice');

exports.save = function (user) {
	return function (data) {
		var deviceID = data.GUID;

		if (data.D == 11) { // by RF, so has subdevices
			if (UDevice.isSwitch(data.DA)) {
				deviceID = deviceID + ':' + UDevice.switchOff(data.DA);
			} else {
				deviceID = deviceID + ':' + data.DA;
			}
		}

		UDevice.findOne({tpId: deviceID})
		.exec(function (err, device) {
			if (err || !device) { 
				console.log ("data in from Pusher. Can't find the related device.");
				return;
			}

			console.log("DATA from " + device.name + "  (" + deviceID + ")"); 

			device.value = UDevice.fromSpecialCase(deviceID, device.type, data.DA);

			device.lastUpdated = Date.now();

			device.save(function(err, d) {
				if (!err) UDevice.emit('update', user, d, 'ninja');
			});

			var o = new Stats({
				// Ninja equivalents
				id: device.id,
				data: device.value,
				type: data.D,

				// Custom fields
				timestamp: data.timestamp || Date.now()
			});
			o.save();

			Stats.emit('create', o);
		});
	};
};

