'use strict';

var mongoose = require('mongoose');
var Stats = mongoose.model('Stats');

exports.save = function(data) {
	console.log("NINJA: Data received from device: " + data.GUID);

	var o = new Stats({
		// Ninja equivalents
		id: data.GUID,
		data: data.DA,
		type: data.D,
		vendor: data.V,

		// Custom fields
		timestamp: data.timestamp || Date.now()
	});
	o.save();

	Stats.emit('create', o);
};

