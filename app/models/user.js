'use strict';

var mongoose = require('mongoose'),
	Schema   = mongoose.Schema,
	_ = require('lodash');

var UserSchema = new Schema({
	name: String,
	email: String,
	ninjablocks: {
		userAccessToken: String,
		pusherChannelToken: String
	}
});

mongoose.model('User', UserSchema);