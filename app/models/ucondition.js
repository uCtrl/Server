'use strict';

var mongoose = require('mongoose'),
	Schema   = mongoose.Schema,
	cleanJson = require('./cleanJson.js'),
	_ = require('lodash');

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
	type: {
		type: Number,
		required: true
	},
	deviceId: {
		type: Number,
		required: true
	},
	deviceType: Number,
	comparisonType: {
		type: Number,
		required: true
	},
	beginValue: String,	//TODO : attr. converted to string
	endValue: String,	//TODO : attr. converted to string
	beginDate: Date,
	endDate: Date,
	beginTime: Date,
	endTime: Date,
	selectedWeekdays: Number,
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
})

UConditionSchema.post('remove', function (condition) {
	var UTask = mongoose.model('UTask');

	UTask.update(
		{ _id: condition._task }, 
		{ $pull: { _conditions: condition._id } }, 
		{ safe: true },
		function (err, num) { if (err) console.log("Error: ", err) });
})

/*
 * Receives the block (from NB) and will call the cb when mapped.
 * To logic here is only to do the mapping
 * ref: https://github.com/ninjablocks/ninjablocks.github.com/wiki/Rules-Engine-Documentation
 */
UConditionSchema.statics.fromNinjaBlocks = function (ninjaPrecondition, cb) {
	var UCondition = mongoose.model('UCondition');
	// Mapping Ninja to uCtrl
	var deviceIdSplit = task._scenario._device.id.split(":");	//Subdevice data, if one, is stored into id.
	var condition = new UCondition({
		id : null,
		type : null,
		deviceId : ninjaPrecondition.params.guid,
		deviceType : null,
		comparisonType : null,
		beginValue : null,
		endValue : null,
		beginDate : null,
		endDate : null,
		beginTime : null,
		endTime : null,
		selectedWeekdays: null,
	});

	switch (ninjaPrecondition.handler) {
		//When condition include a rf subdevice.
		case 'ninjaChange' : 	
			condition.deviceId += (ninjaPrecondition.params.to != null ? ':' + ninjaPrecondition.params.to : '');
			condition.type = ENUMCONDITIONTYPE.Device;
			condition.comparisonType = ENUMCOMPARISONTYPE.None;
			break;
		case 'ninjaEquality' : 
		case 'ninjaThreshold' : 
			condition.type = ENUMCONDITIONTYPE.Device;
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
			condition.beginValue = ninjaPrecondition.params.value;
			condition.endValue = ninjaPrecondition.params.value;
			break;
		case 'ninjaRangeToggle' : 
			condition.type = ENUMCONDITIONTYPE.Device;
			condition.comparisonType = ENUMCOMPARISONTYPE.InBetween;
			condition.beginValue = ninjaPrecondition.params.between;
			condition.endValue = ninjaPrecondition.params.and;
			break;
			break;
	}
	cb(condition);
};

/*
 * Receives the task (from MongoDB) and will call the cb when mapped
 * To logic here is only to do the mapping
 * ref: https://github.com/ninjablocks/ninjablocks.github.com/wiki/Rules-Engine-Documentation
 */
UConditionSchema.statics.toNinjaBlocks = function (condition, cb) {
	var deviceIdSplit = condition.deviceId.split(":");	//Subdevice data, if one, is stored into id.
	
	var ninjaPrecondition = { 
		handler: null, 
		params: { 
			guid : deviceIdSplit[0],
			to : null,
			value : null,
			between : null,
			and : null,
		}
	}

	switch (condition.comparisonType) {
		//When condition include a rf subdevice.
		case ENUMCOMPARISONTYPE.None :
			ninjaPrecondition.handler	= 'ninjaChange';
			ninjaPrecondition.params.to	= (deviceIdSplit.length > 1 ? deviceIdSplit[1] : null);
			break;
		case ENUMCOMPARISONTYPE.GreaterThan :
			ninjaPrecondition.handler = 'ninjaEquality';	//it can be ninjaThreshold
			ninjaPrecondition.params.equality = 'GT';
			ninjaPrecondition.params.value = condition.beginValue;
			break;
		case ENUMCOMPARISONTYPE.LesserThan :
			ninjaPrecondition.handler = 'ninjaEquality';	//it can be ninjaThreshold
			ninjaPrecondition.params.equality = 'LT';	
			ninjaPrecondition.params.value = condition.beginValue;
			break;
		case ENUMCOMPARISONTYPE.Equals :
			ninjaPrecondition.handler = 'ninjaEquality';	//it can be ninjaThreshold
			ninjaPrecondition.params.equality = 'EQ';
			ninjaPrecondition.params.value = condition.beginValue;
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