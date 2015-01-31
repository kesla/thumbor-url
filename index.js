'use strict';

var cropRegexp = /(\d+)x(\d+):(\d+)x(\d+)\//;
var sizeRegexp = /(\-?)(\d*)x(\-?)(\d*)\//;
var halignRegexp = /(left|right|center)\//;
var valignRegexp = /(top|bottom|middle)\//;
var keywordsRegexp = /meta\/|smart\/|fit-in\//g;
var filtersRegexp = /filters:(.+)\//;
var trimRegexp = /trim(:([^\d]+))?(:(\d+))?\//;

module.exports.parseDecrypted = function (url) {
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
  };
  if (url[0] === '/') url = url.slice(1);

  var trim = url.match(trimRegexp);
  if (trim) {
    results.trim.orientation = trim[2] || 'top-left';
    results.trim.tolerance = trim[4] && parseInt(trim[4], 10) || 0;
    url.replace(trim[0], '');
  }

  var crop = url.match(cropRegexp);
  if (crop) {
    results.crop.left = parseInt(crop[1], 10);
    results.crop.top = parseInt(crop[2], 10);
    results.crop.right = parseInt(crop[3], 10);
    results.crop.bottom = parseInt(crop[4], 10);
    url = url.replace(crop[0], '');
  }

  var size = url.match(sizeRegexp);
  if (size) {
    results.horizontalFlip = !!size[1];
    if (size[2]) results.width = Math.abs(parseInt(size[2], 10));
    results.verticalFlip = !!size[3];
    if (size[4]) results.height = Math.abs(parseInt(size[4], 10));
    url = url.replace(size[0], '');
  }

  var halign = url.match(halignRegexp);
  if (halign && halign[0]) {
    results.halign = halign[1];
    url = url.replace(halign[0], '');
  }

  var valign = url.match(valignRegexp);
  if (valign && valign[0]) {
    results.valign = valign[1];
    url = url.replace(valign[0], '');
  }

  results.meta = url.indexOf('meta/') !== -1;
  results.smart = url.indexOf('smart/') !== -1;
  results.fitIn = url.indexOf('fit-in/') !== -1;
  url = url.replace(keywordsRegexp, '');

  var filters = url.match(filtersRegexp);
  if (filters) {
    results.filters = filters[1];
    url = url.replace(filters[0], '');
  }

  results.image = url;

  return results;
};
