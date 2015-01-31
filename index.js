'use strict';

var cropRegexp = /(\d+)x(\d+):(\d+)x(\d+)/;

module.exports.parseDecrypted = function (url) {
  var crop = url.match(cropRegexp);

  return {
    image: url,
    crop: {
      left: crop ? parseInt(crop[1], 10) : null,
      top: crop ? parseInt(crop[2], 10) : null,
      right: crop ? parseInt(crop[3], 10) : null,
      bottom: crop ? parseInt(crop[4], 10) : null
    }
  };
};
