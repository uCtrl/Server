'use strict';

var mongoose = require('mongoose');
var Stats = mongoose.model('Stats');
var UDevice = mongoose.model('UDevice');

exports.save = function(data) {
	var deviceID = data.GUID;
	
	if (data.D == 11) { // by RF, so has subdevices
		deviceID = deviceID + ':' + data.DA;
	}

	UDevice.findOne({tpId: deviceID})
	.select('id name')
	.exec(function (err, device) {
		//console.log(device);
		if (err || !device) { 
			console.log ("data in from Pusher. Can't find the related device.");
			console.log(" ");
			return;
		}
		
		console.log("DATA from " + device.name + "  ("+deviceID+")"); 
		var o = new Stats({
			// Ninja equivalents
			id: device.id,
			data: data.DA,
			type: data.D,

			// Custom fields
			timestamp: data.timestamp || Date.now()
		});
		o.save();

		Stats.emit('create', o);

	});
};

