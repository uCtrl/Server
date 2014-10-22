'use strict';

var mongoose = require('mongoose'),
	Schema   = mongoose.Schema,
	cleanJson = require('./cleanJson.js'),
	_ = require('lodash'),
	uuid = require('node-uuid');

/**
 * Constants
 * TODO : Déterminer les constantes ici.
 */
var ENUMCONDITIONTYPE = {
	None: -1,
	Date: 1,
	Day: 2,
	Time: 3,
	Device: 4
};

var ENUMCOMPARISONTYPE = {
	None: 0,
	GreaterThan: 0x1,
	LesserThan: 0x2,
	Equals: 0x4,
	InBetween: 0x8,
	Not: 0x16
};

/**
 * UCondition Schema
 */
var UConditionSchema = new Schema({
	id: {
		type: String,
		required: true,
		unique: true
	},
	tpId: {
		type: String,
		required: true,
		unique: true
	},
	type: {
		type: Number,
		required: true
	},
	comparisonType: {
		type: Number,
		required: true
	},
	beginValue: String,
	endValue: String,
	deviceId: String,
	deviceTpId: String,
	enabled: Boolean,
	lastUpdated: Number,
	_task: {
		type: Schema.Types.ObjectId, 
		ref: 'UTask',
		required: true
	}
});

/** 
 * Middlewares
 */
UConditionSchema.post('save', function (condition) {
	var UTask = mongoose.model('UTask');
	UTask.update(
		{ _id: condition._task }, 
		{ $addToSet: { _conditions: condition._id } }, 
		{ safe: true },
		function (err, num) { if (err) console.log("Error: ", err) });
	
	this.db.model('UCondition').emit('create', condition);
})

UConditionSchema.post('findOneAndUpdate', function (condition) {
	this.db.model('UCondition').emit('update', condition);
});

UConditionSchema.post('remove', function (condition) {
	var UTask = mongoose.model('UTask');

	UTask.update(
		{ _id: condition._task }, 
		{ $pull: { _conditions: condition._id } }, 
		{ safe: true },
		function (err, num) { if (err) console.log("Error: ", err) });
		
	this.db.model('UCondition').emit('destroy', condition);
})

/*
 * Receives the block (from NB) and will call the cb when mapped.
 * To logic here is only to do the mapping
 * ref: https://github.com/ninjablocks/ninjablocks.github.com/wiki/Rules-Engine-Documentation
 */
UConditionSchema.statics.fromNinjaBlocks = function (ninjaPrecondition, ninjaPreconditionId, cb) {
	var UCondition = mongoose.model('UCondition');
	var UDevice = mongoose.model('UDevice');
	// Mapping Ninja to uCtrl
	var condition = new UCondition({
		id : uuid.v1(),
		tpId : ninjaPreconditionId,
		type : null,
		comparisonType : null,
		beginValue : null,
		endValue : null,
		deviceId : null,
		deviceTpId : null,
		deviceValue : null,
		enabled : true,
		lastUpdated : null,
	});
	
	if (
		ninjaPrecondition.handler == 'ninjaChange' || 
		ninjaPrecondition.handler == 'ninjaEquality' || 
		ninjaPrecondition.handler == 'ninjaThreshold' || 
		ninjaPrecondition.handler == 'ninjaRangeToggle' 
	) {
		//TODO can't obtain de device.id if the device isn't in the database yet. Asynchronous fetching problem.
		UDevice.findOne({tpId : ninjaPrecondition.params.guid}, function(err, device){
				condition.deviceId = (err != null ? device.id : null);
				condition.type = ENUMCONDITIONTYPE.Device;
				
				switch (ninjaPrecondition.handler) {
					//When condition include a rf subdevice.
					case 'ninjaChange' : 	
						condition.deviceTpId = ninjaPrecondition.params.guid + ':' + ninjaPrecondition.params.to; //TODO don't have access to subdevice id
						condition.comparisonType = ENUMCOMPARISONTYPE.None;
						condition.deviceValue = ninjaPrecondition.params.to;
						break;
					case 'ninjaEquality' : 
					case 'ninjaThreshold' : 
						condition.deviceTpId = ninjaPrecondition.params.guid;
						switch (ninjaPrecondition.params.equality) {
							case 'GT' :
							case 'GTE' :
								condition.comparisonType = ENUMCOMPARISONTYPE.GreaterThan;
								break;
							case 'LT' :
							case 'LTE' :
								condition.comparisonType = ENUMCOMPARISONTYPE.LesserThan;
								break;
							case 'EQ' :
								condition.comparisonType = ENUMCOMPARISONTYPE.Equals;
								break;
						}
						condition.deviceValue = ninjaPrecondition.params.value;
						break;
					case 'ninjaRangeToggle' : 
						condition.deviceTpId = ninjaPrecondition.params.guid;
						condition.comparisonType = ENUMCOMPARISONTYPE.InBetween;
						condition.beginValue = ninjaPrecondition.params.between;
						condition.endValue = ninjaPrecondition.params.and;
						break;
				}
				
				cb(condition);
		});
	}
};

/*
 * Receives the task (from MongoDB) and will call the cb when mapped
 * To logic here is only to do the mapping
 * ref: https://github.com/ninjablocks/ninjablocks.github.com/wiki/Rules-Engine-Documentation
 */
UConditionSchema.statics.toNinjaBlocks = function (condition, cb) {
	var deviceTpIdSplit = condition.deviceTpId.split(":");	//Subdevice id, if one, is stored into id.
	
	var ninjaPrecondition = { 
		handler: null, 
		params: { 
			equality : null,
			guid : deviceTpIdSplit[0],
			to : null,
			value : null,
			between : null,
			and : null,
			shortName : null,
		}
	}

	switch (condition.comparisonType) {
		//When condition include a rf subdevice.
		case ENUMCOMPARISONTYPE.None :
			ninjaPrecondition.handler	= 'ninjaChange';
			ninjaPrecondition.params.to	= condition.deviceValue;
			break;
		case ENUMCOMPARISONTYPE.GreaterThan :
			ninjaPrecondition.handler = 'ninjaEquality';	//it can be ninjaThreshold
			ninjaPrecondition.params.equality = 'GT';
			ninjaPrecondition.params.value = condition.deviceValue;
			break;
		case ENUMCOMPARISONTYPE.LesserThan :
			ninjaPrecondition.handler = 'ninjaEquality';	//it can be ninjaThreshold
			ninjaPrecondition.params.equality = 'LT';	
			ninjaPrecondition.params.value = condition.deviceValue;
			break;
		case ENUMCOMPARISONTYPE.Equals :
			ninjaPrecondition.handler = 'ninjaEquality';	//it can be ninjaThreshold
			ninjaPrecondition.params.equality = 'EQ';
			ninjaPrecondition.params.value = condition.deviceValue;
			break;
		case ENUMCOMPARISONTYPE.InBetween :
			ninjaPrecondition.handler = 'ninjaRangeToggle';
			ninjaPrecondition.params.between = condition.beginValue;
			ninjaPrecondition.params.and = condition.endValue;
			break;
	}
	cb(ninjaPrecondition);
};

UConditionSchema.plugin(cleanJson);
mongoose.model('UCondition', UConditionSchema);