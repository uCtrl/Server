'use strict';

var _ = require('lodash');
var ninjaBlocks = require(__base + 'app/apis/ninjablocks.js');
var ninja = new ninjaBlocks( {userAccessToken:global.uctrl.ninja.userAccessToken} );
var mongoose = require('mongoose');
var uplatform = mongoose.model('UPlatform');

exports.all = function(req, res) {
	uplatform.find(function(err, all){
		res.json(all);
	});
	console.log(uplatform.schema);

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
	var obj = new uplatform(req.body);
	obj.save();
	res.json("created");
};

exports.update = function(req, res) {
    // Can't update needs testing
	uplatform.findOne({id : req.params.platformId}, function(err, obj){
		if(!err){
			//obj.id			= req.body.id,
			obj.firmwareVersion	= req.body.firmwareVersion,
			obj.name			= req.body.name,
			obj.port			= req.body.port,
			obj.room			= req.body.room,
			obj.enabled			= req.body.enabled,
			obj.ip				= req.body.ip,
			obj.save();
		}
	});	
    res.json("updated");
};

exports.destroy = function(req, res) {
	uplatform.findOne({id : req.params.platformId}, function(err, obj){
		if(!err){
			obj.remove();
		}
	});
    res.json("destroyed");
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
	uplatform.findOne({id : req.params.platformId}, function(err, obj){
		res.json(obj);
	});
	/*
	ninja.block(req.params.platformId, function(err, data) {
		if (err) 
			return next(new Error("Failed to find block " + req.params.platformId));
		//res.json(data);
		var out = [];
		//filter actions for the device. We will use only one action by task (action[0])
		out.push({
			id : req.params.platformId,
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