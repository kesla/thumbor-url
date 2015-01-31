'use strict';

var cropRegexp = /(\d+)x(\d+):(\d+)x(\d+)\//;
var sizeRegexp = /(\-?)(\d*)x(\-?)(\d*)\//;
var halignRegexp = /(left|right|center)\//;
var valignRegexp = /(top|bottom|middle)\//;
var keywordsRegexp = /meta\/|smart\/|fit-in\//g;
var filtersRegexp = /filters:(.+)\//;
var trimRegexp = /trim(:([^\d]+))?(:(\d+))?\//;

module.exports.parseDecrypted = function (url) {
  if (url[0] === '/') url = url.slice(1);

  var trim = url.match(trimRegexp);
  if (trim && trim[0]) url = url.replace(trim[0], '');

  var crop = url.match(cropRegexp);
  if (crop && crop[0]) url = url.replace(crop[0], '');

  var size = url.match(sizeRegexp);
  if (size && size[0]) url = url.replace(size[0], '');

  var halign = url.match(halignRegexp);
  if (halign && halign[0]) url = url.replace(halign[0], '');

  var valign = url.match(valignRegexp);
  if (valign && valign[0]) url = url.replace(valign[0], '');

  var meta = url.indexOf('meta/') !== -1;
  var smart = url.indexOf('smart/') !== -1;
  var fitIn = url.indexOf('fit-in/') !== -1;
  url = url.replace(keywordsRegexp, '');

  var filters = url.match(filtersRegexp);
  if (filters && filters[0]) url = url.replace(filters[0], '');

  return {
    image: url,
    crop: {
      left: (crop && parseInt(crop[1], 10)) || null,
      top: (crop && parseInt(crop[2], 10)) || null,
      right: (crop && parseInt(crop[3], 10)) || null,
      bottom: (crop && parseInt(crop[4], 10)) || null
    },
    width: (size && size[2] && Math.abs(parseInt(size[2], 10))) || null,
    height: (size && size[4] && Math.abs(parseInt(size[4], 10))) || null,
    meta: meta,
    horizontalFlip: size && (size[1] === '-'),
    verticalFlip: size && (size[3] === '-'),
    halign: (halign && halign[1]) || 'left',
    valign: (valign && valign[1]) || 'top',
    smart: smart,
    fitIn: fitIn,
    filters: (filters && filters[1]) || null,
    trim: {
      orientation: (trim && (trim[2] || 'top-left')) || null,
      tolerance: (trim && parseInt(trim[4], 10)) || 0
    }
  };
};
