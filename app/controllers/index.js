'use strict';

var mongoose = require('mongoose');

exports.render = function(req, res) {
	mongoose.connection.db.collectionNames(function (err, names) {
        res.json(names);
    });
};