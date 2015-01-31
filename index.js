'use strict';

var cropRegexp = /(\d+)x(\d+):(\d+)x(\d+)\//;
var sizeRegexp = /(\-?)(\d*)x(\-?)(\d*)\//;

module.exports.parseDecrypted = function (url) {
  var crop = url.match(cropRegexp);
  if (crop && crop[0]) url = url.replace(crop[0], '');
  var size = url.match(sizeRegexp);
  if (size && size[0]) url = url.replace(size[0], '');

  return {
    image: url,
    crop: {
      left: crop ? parseInt(crop[1], 10) : null,
      top: crop ? parseInt(crop[2], 10) : null,
      right: crop ? parseInt(crop[3], 10) : null,
      bottom: crop ? parseInt(crop[4], 10) : null
    },
    width: (size && size[2]) ? Math.abs(parseInt(size[2], 10)) : null,
    height: (size && size[4]) ? Math.abs(parseInt(size[4], 10)) : null,
    meta: url.indexOf('meta') !== -1,
    horizontalFlip: size && (size[1] === '-'),
    verticalFlip: size && (size[3] === '-')
  };
};
