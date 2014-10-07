'use strict';

var mongoose = require('mongoose');
var Stats = mongoose.model('Stats');

exports.save = function(data) {
	console.log("NINJA: Data received from device: " + data.D);

	var o = new Stats({
		// Ninja equivalents
		guid: data.GUID, // required false for now, we don't want to conflit with ninja
		data: data.DA,
		deviceId: data.D,
		vendorId: data.V,
		portNumber: data.G,

		// Custom fields
		timestamp: data.timestamp || Date.now()
	});
	o.save();
};

