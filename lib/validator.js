'use strict';

var crypto = require('crypto');

var regexp = /^\/?([^\/]{26,28})\/(.+)$/;
var trimRegexp = /[=]{0,2}$/;

module.exports = function (key) {
  return function (url) {
    var match = url.match(regexp);
    if (!match) return false;
    var hash1 = match[1];
    var hash2 = crypto
      .createHmac('sha1', key)
      .update(match[2])
      .digest('base64')
      .replace(/\+/, '-')
      .replace(/\//g, '_');

    return trim(hash1) === trim(hash2);
  };
};

function trim (base64) {
  return base64.replace(trimRegexp, '');
}