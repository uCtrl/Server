'use strict';

var mongoose = require('mongoose');
var Stats = mongoose.model('Stats');
var UDevice = mongoose.model('UDevice');

exports.save = function(data) {
	var deviceID = data.GUID;
	
	if (data.D == 11) { // by RF, so has subdevices
		deviceID = deviceID + ':' + data.DA;
	}

	UDevice.find({tpId: deviceID})
	.select('id')
	.exec(function (err, device) {
		console.log("DATA from ", deviceID);

		if (err || !device || !device.length) { 
			console.log ("data in from Pusher. Can't find the related device.");
			console.log(" ");
			return;
		}
		
		var o = new Stats({
			// Ninja equivalents
			id: device[0].id,
			data: data.DA,
			type: data.D,

			// Custom fields
			timestamp: data.timestamp || Date.now()
		});
		o.save();

		Stats.emit('create', o);

	});


	
};

