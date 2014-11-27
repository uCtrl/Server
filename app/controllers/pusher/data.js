'use strict';

var mongoose = require('mongoose');
var Stats = mongoose.model('Stats');
var UDevice = mongoose.model('UDevice');

exports.save = function(data) {
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
		//console.log(device);
		if (err || !device) { 
			console.log ("data in from Pusher. Can't find the related device.");//, data);
			return;
		}
		
		console.log("DATA from " + device.name + "  ("+deviceID+")"); 


		switch (data.D) {
			case 11:
			if (UDevice.isSwitch(data.DA)){
				device.value = UDevice.switchValue(data.DA);
			}
			break;
			case 1012:
			var obj = JSON.parse(data.DA);
			device.value = obj.on ? obj.bri : 0 ;
			break;
			default:
			device.value = data.DA;
		}
		
		device.lastUpdated = Date.now();
		device.save();

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

