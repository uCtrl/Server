'use strict';

/**
 * Dependencies
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LogSchema = new Schema({
    // Rule executed, manual action, ?or stat update?
    type: { type: String, required: true}, 

    // Target.  examples:
    //             SYSTEM crashed
    //             LIGHT X manually turned on
    //             DOOR Y closed
    //             RULE Z executed
    target: { type: Number, required: false}, 
    newValue: { type: Object, required: false},
    timestamp: { type: Number, required: true},
});

// Model creation
var Logs = mongoose.model('Log', LogSchema);