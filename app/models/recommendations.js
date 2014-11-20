'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RecommendationsSchema = new Schema({
	id: { type: String, required: true}, 
	description: { type: String, required: true},
	deviceId: { type: String, required: true},
	taskValue: { type: String, required: true},
	conditionType: { type: Number, required: true},
	conditionComparisonType: { type: Number, required: true},
	conditionBeginValue: String,
	conditionEndValue: String,
	conditionDeviceId: String,
	accepted: Boolean
});

// Model creation
var Recommendations = mongoose.model('Recommendations', RecommendationsSchema);