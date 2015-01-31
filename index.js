'use strict';

var regexp = new RegExp([
  '/?',
  // unsafe
  '(unsafe/)?',
  // meta
  '(meta/)?',
  // trim
  '(trim(:([^\\d]+))?(:(\\d+))?/)?',
  // crop
  '((\\d+)x(\\d+):(\\d+)x(\\d+)/)?',
  // fit-in
  '(fit-in/)?',
  // dimensions
  '((\\-?)(\\d*)x(\\-?)(\\d*)/)?',
  // halign
  '((left|right|center)/)?',
  // valign
  '((top|bottom|middle)/)?',
  // smart
  '(smart/)?',
  // TODO:
  // filters
  '(filters\:(.+?\\))\\/)?',
  // image
  '(\.+)?'
].join(''));

module.exports.parseDecrypted = function(url) {
  var results = {
    image: '',
    crop: {
      left: null,
      top: null,
      right: null,
      bottom: null
    },
    width: null,
    height: null,
    meta: false,
    horizontalFlip: false,
    verticalFlip: false,
    halign: 'left',
    valign: 'top',
    smart: false,
    fitIn: false,
    filters: null,
    trim: {
      orientation: null,
      tolerance: null
    },
    unsafe: true
  };

  var match = url.match(regexp);
  var index = 1;

  if (match[index]) {
    results.unsafe = true;
  }
  index++;

  if (match[index]) {
    results.meta = true;
  }
  index++;

  if (match[index]) {
    results.trim.orientation = match[index + 2] || 'top-left';
    results.trim.tolerance = match[index + 4] && parseInt(match[index + 4], 10) || 0;
  }
  index = index + 5;

  if (match[index]) {
    results.crop.left = parseInt(match[index + 1], 10);
    results.crop.top = parseInt(match[index + 2], 10);
    results.crop.right = parseInt(match[index + 3], 10);
    results.crop.bottom = parseInt(match[index + 4], 10);
  }
  index = index + 5;

  if (match[index]) {
    results.fitIn = true;
  }
  index++;

  if (match[index]) {
    results.horizontalFlip = !!match[index + 1];
    if (match[index + 2]) {
      results.width = Math.abs(parseInt(match[index + 2], 10));
    }
    results.verticalFlip = !!match[index + 3];
    if (match[index + 4]) {
      results.height = Math.abs(parseInt(match[index + 4], 10));
    }
  }
  index = index + 5;

  if (match[index]) {
    results.halign = match[index + 1];
  }
  index = index + 2;

  if (match[index]) {
    results.valign = match[index + 1];
  }
  index = index + 2;

  if (match[index]) {
    results.smart = true;
  }
  index++;

  if (match[index]) {
    results.filters = match[index + 1];
  }

  index = index + 2;

  results.image = match[index];

  return results;
};
