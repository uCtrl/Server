'use strict';

var _ = require('lodash');

module.exports  = function cleanJson (schema) {
	schema.methods.cleanJson = function() {
		return _.omit(this.toObject(), function(val, key) { return !key.lastIndexOf("_", 0) });
	}
}