'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ENUMLOGTYPE = {
	Action: 0, // commande manuelle
	Status: 1, // never used.  changement de status
	Condition: 2, // rule executed
	Update: 3, /*   Genre name du plateforme
	 Ou name du device
	 ou maxValue du device
	 tout sauf value
	 */
	Scenario: 4, // tout changement par rapport aux scénarios, tasks, conditions
	Other: 5
};

var ENUMLOGSEVERITY = {
	Normal: 0,
	Inactive: 1,
	Warning: 2,
	Error: 3,
	Other: 4
};

var LogSchema = new Schema({
	type: { type: Number, required: true },
	severity: { type: Number, required: true },
	id: { type: String, required: false },
	message: { type: String, required: true },
	timestamp: { type: Number, required: true }
});

LogSchema.statics.LOGTYPE = ENUMLOGTYPE;
LogSchema.statics.LOGSEVERITY = ENUMLOGSEVERITY;

// Model creation
var Logs = mongoose.model('Log', LogSchema);