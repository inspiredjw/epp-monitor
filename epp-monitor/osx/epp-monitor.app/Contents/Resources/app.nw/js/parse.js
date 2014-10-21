'use strict';

var fs = require('fs');
var path = require('path');

// cache for comparing
var cachedData = '';

// get basePath
var basePath;
if (process.cwd().indexOf('.app') > -1)
  basePath = path.join(process.cwd(), '../../../../');
else
  basePath = path.dirname(process.execPath);

exports.parseFile = function(filename, callback) {
  var filePath = path.join(basePath, filename);
  var input = fs.readFileSync(filePath, 'utf-8');

  // split by line
  var data = input.split('\r\n');

  for (var i = 0; i < data.length; i++)
    // parse string only
    if (typeof data[i] === 'string')
      // remove empty line
      if (data[i].trim().length === 0)
        data.splice(i, 1);
      // split by comman and tab
      else
        data[i] = data[i].split(',\t').map(Number);

  var lastStr = data[data.length - 1].join(',\t');

  if (cachedData !== lastStr) {
    cachedData = lastStr;
  }

  return data;
};

/*
data[4] = flow, ozone, temp, humid
interval in milliseconds
*/
exports.lightFile = function(filename, interval) {
  // default: 5 mins
  interval = interval || 1000 * 60 * 5;

  var filePath = path.join(basePath, filename);
  var writtenData = '';

  setInterval(function() {
    if (writtenData !== cachedData) {
      writtenData = cachedData;
      fs.writeFile(filePath, writtenData, 'utf-8');
    }
  }, interval);
};

exports.watchFile = function(filename, callback) {
  fs.watchFile(filename, function(e, filename) {
    callback(e, filename);
  });
};

