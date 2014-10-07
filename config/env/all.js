'use strict';

var path = require('path');
var rootPath = path.normalize(__dirname + '/../..');
var fs = require('fs');

module.exports = {
	root: rootPath,
	port: process.env.PORT || 3000,
	db: process.env.MONGOHQ_URL
};

//global variables
global.uctrl = {};
global.uctrl.target = 'ninja';

//global variables - for ninja target
global.uctrl.ninja = {};
global.uctrl.ninja.userAccessToken = "107f6f460bed2dbb10f0a93b994deea7fe07dad5";

var models_path = __dirname + '/../../app/models';
var walk = function(path) {
    fs.readdirSync(path).forEach(function(file) {
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);
        if (stat.isFile()) {
            if (/(.*)\.(js$)/.test(file)) {
                require(newPath);
            }
        } else if (stat.isDirectory()) {
            walk(newPath);
        }
    });
};
walk(models_path);