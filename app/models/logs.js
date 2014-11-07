'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ENUMLOGTYPE = {
    Action: 0,
    Status: 1,
    Condition: 2,
    Update: 3,
    Scenario: 4,
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

// Model creation
var Logs = mongoose.model('Log', LogSchema);