'use strict';

var cropRegexp = /(\d+)x(\d+):(\d+)x(\d+)/;
var widthHeightRegexp = /-(\d+)x-(\d+)/

module.exports.parseDecrypted = function (url) {
  var crop = url.match(cropRegexp);
  var size = url.match(widthHeightRegexp);

  return {
    image: url,
    crop: {
      left: crop ? parseInt(crop[1], 10) : null,
      top: crop ? parseInt(crop[2], 10) : null,
      right: crop ? parseInt(crop[3], 10) : null,
      bottom: crop ? parseInt(crop[4], 10) : null
    },
    width: size ? parseInt(size[1], 10) : null,
    height: size ? parseInt(size[2], 10) : null
  };
};
