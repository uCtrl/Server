'use strict';

var mongoose = require('mongoose');
var Stats = mongoose.model('Stats');

exports.save = function(data) {
	console.log("NINJA: Data received from device: " + data.D);

	var o = new Stats({
		// Ninja equivalents
		guid: data.GUID,
		data: data.DA,
		deviceId: data.D,
		vendorId: data.V,
		portNumber: data.G,

		// Custom fields
		timestamp: data.timestamp || Date.now()
	});
	o.save();

	Stats.emit('create', o);
};

