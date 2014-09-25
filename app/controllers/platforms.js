'use strict';

var _ = require('lodash'),
    ninjaBlocks = require(__base + 'app/apis/ninjablocks.js'),
    ninja = new ninjaBlocks( {userAccessToken:global.uctrl.ninja.userAccessToken} );

exports.all = function(req, res) {
	ninja.blocks(function(err, data){
		//res.json(data);
		var out = [];
		_.each(data, function(el, index){
			//filter actions for the device. We will use only one action by task (action[0])
			out.push({
				id : index,
				firmwareVersion: "TODO",
				name: el.short_name,
				port: "TODO",
				room: "TODO",
				enabled: "TODO",
				ip: "TODO",
				date_created : 'TODO : ' + el.date_created,	//date_created
				last_active : "TODO: " + el.last_active,	//last_active
			});
		});
		res.json(out);
	});
};

exports.create = function(req, res) {
	// Pair + activate is enough? Needs testing
	res.json("...");
};

exports.update = function(req, res) {
    // Can't update needs testing
    res.json("...");
};


exports.destroy = function(req, res) {
	var platformId = req.params["platformId"];

	ninja.block(platformId).delete(function(err, data) {
		if (err) {
      		return res.json(500, {
       			error: 'Cannot delete the platform' + platformId
      		});
    	}   	
    	res.json(data);
	});	
};

exports.show = function(req, res) {
	var platformId = req.params["platformId"];

	ninja.block(platformId, function(err, data) {
		if (err) 
			return next(new Error("Failed to find block " + platformId));
		//res.json(data);
		var out = [];
		//filter actions for the device. We will use only one action by task (action[0])
		out.push({
			id : platformId,
			firmwareVersion: "TODO",
			name: data.short_name,
			port: "TODO",
			room: "TODO",
			enabled: "TODO",
			ip: "TODO",
			date_created : 'TODO : ' + data.date_created,	//date_created
			last_active : "TODO: " + data.last_active,	//last_active
		});
		res.json(out);
	});
};