'use strict';

require(__dirname + '/udevice.js');
var mongoose = require('mongoose');

/**
 * uplatform Schema
 */
var UPlatformSchema	= new mongoose.Schema({
	firmwareVersion	: String,
	id				: Number,
	name			: String,
	port			: Number,
	room			: String,
	enabled			: String,
	ip				: String,
	devices			: [mongoose.model('UDevice').schema],
});

/**
 * Statics
 */
UPlatformSchema.statics = {

	/**
	* All
	*
	* @param {Object} req
	* @param {Function} cb callback
	*/
	all: function (req, cb) {
		this.find(function(err, all){
			return cb(all);
		});
	},
	
	/**
	* Show
	*
	* @param {Object} req
	* @param {Function} cb callback
	*/
	show: function (req, cb) {
		this.findOne({id : req.params.platformId}, function(err, obj){
			return cb(obj);
		});
	},
	
	/**
	* Create
	*
	* @param {Object} req
	* @param {Function} cb callback
	*/
	create: function (req, cb) {
		var obj = new this(req.body);
		obj.save();
		return cb("created");
	},
	
	/**
	* Update
	*
	* @param {Object} req
	* @param {Function} cb callback
	*/
	update: function (req, cb) {
		this.findOne({id : req.params.platformId}, function(err, obj){
			//obj.id			= req.body.id,
			obj.firmwareVersion	= req.body.firmwareVersion,
			obj.name			= req.body.name,
			obj.port			= req.body.port,
			obj.room			= req.body.room,
			obj.enabled			= req.body.enabled,
			obj.ip				= req.body.ip,
			obj.save();
		});	
		return cb("updated");
	},
	
	/**
	* Destroy
	*
	* @param {Object} req
	* @param {Function} cb callback
	*/
	destroy: function (req, cb) {
		this.findOne({id : req.params.platformId}, function(err, obj){
			obj.remove();
			return cb("destroyed");
		});
	},
}

mongoose.model('UPlatform', UPlatformSchema);