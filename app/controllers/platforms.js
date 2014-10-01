'use strict';

var _ = require('lodash');
var ninjaBlocks = require(__base + 'app/apis/ninjablocks.js');
var ninja = new ninjaBlocks( {userAccessToken:global.uctrl.ninja.userAccessToken} );
var mongoose = require('mongoose');
var uplatform = mongoose.model('UPlatform');

exports.all = function(req, res) {
	uplatform.all(req, function(data){
		res.json(data);
	});

	/*
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
	*/
};

exports.create = function(req, res) {
	// Pair + activate is enough? Needs testing
	uplatform.create(req, function(data){
		res.json(data);
	});
	
};

exports.update = function(req, res) {
	uplatform.update(req, function(data){
		res.json(data);
	});
	
};

exports.destroy = function(req, res) {
	uplatform.destroy(req, function(data){
		res.json(data);
	});
    
	/*
	ninja.block(platformId).delete(function(err, data) {
		if (err) {
      		return res.json(500, {
       			error: 'Cannot delete the platform' + platformId
      		});
    	}   	
    	res.json(data);
	});	
	*/
};

exports.show = function(req, res) {
	uplatform.show(req, function(data){
		res.json(data);
	});
	
	/*
	ninja.block(req.platformId, function(err, data) {
		if (err) 
			return next(new Error("Failed to find block " + req.platformId));
		//res.json(data);
		var out = [];
		//filter actions for the device. We will use only one action by task (action[0])
		out.push({
			id : req.platformId,
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
	*/
};