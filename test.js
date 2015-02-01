// basis for this is
// https://github.com/thumbor/thumbor/blob/9d0e861145d15a50e6ac7800e9333d5d5149ccbd/vows/url_vows.py

var test = require('tape');
var url = require('./');

test('without result', function(t) {
  var object = url.parseDecrypted("some fake url");

  t.equal(object.image, "some fake url");
  t.end();
});

test('without image', function(t) {
  var object = url.parseDecrypted('/meta/10x11:12x13/fit-in/-300x-200/left/top/smart/filters:some_filter()/img');

  t.ok(object.meta, 'meta');
  t.equal(object.crop.left, 10, 'crop.left');
  t.equal(object.crop.top, 11, 'crop.top');
  t.equal(object.crop.right, 12, 'crop.right');
  t.equal(object.crop.bottom, 13, 'crop.bottom');
  t.equal(object.width, 300, 'width');
  t.equal(object.height, 200, 'height');
  t.ok(object.horizontalFlip, 'horizontalFlip');
  t.ok(object.verticalFlip, 'verticalFlip');
  t.equal(object.halign, 'left', 'halign');
  t.equal(object.valign, 'top', 'valign');
  t.ok(object.smart, 'smart');
  t.ok(object.fitIn, 'fitInt');
  t.equal(object.filters, 'some_filter()', 'filters');
  t.end();
});

test('with image', function(t) {
  var imageUrl = 's.glbimg.com/es/ge/f/original/2011/03/29/orlandosilva_60.jpg';
  var object = url.parseDecrypted('/meta/10x11:12x13/-300x-200/left/top/smart/' + imageUrl);

  t.equal(object.image, imageUrl);
  t.end();
});

test('with url in filter', function(t) {
  var object = url.parseDecrypted(
    '/filters:watermark(s.glbimg.com/es/ge/f/original/2011/03/29/orlandosilva_60.jpg,0,0,0)/img');

  t.equal(object.image, 'img');
  t.equal(object.filters, 'watermark(s.glbimg.com/es/ge/f/original/2011/03/29/orlandosilva_60.jpg,0,0,0)');
  t.end();
});

test('with multiple filters', function(t) {
  var object = url.parseDecrypted(
    '/filters:watermark(s.glbimg.com/es/ge/f/original/2011/03/29/orlandosilva_60.jpg,0,0,0):brightness(-50):grayscale()/img');

  t.equal(object.image, 'img');
  t.equal(object.filters, 'watermark(s.glbimg.com/es/ge/f/original/2011/03/29/orlandosilva_60.jpg,0,0,0):brightness(-50):grayscale()');
  t.end();
});

test('with thumbor of thumbor', function(t) {
  var object = url.parseDecrypted(
    '/90x100/my.image.path/unsafe/filters:watermark(s.glbimg.com/some/image.jpg,0,0,0)/some.domain/img/path/img.jpg');

  t.equal(object.image, 'my.image.path/unsafe/filters:watermark(s.glbimg.com/some/image.jpg,0,0,0)/some.domain/img/path/img.jpg');
  t.equal(object.width, 90);
  t.equal(object.height, 100);
  t.end();
});

test('with thumbor of thumbor with Filters', function(t) {
  var object = url.parseDecrypted(
    '/90x100/filters:brightness(-50):contrast(20)/my.image.path/unsafe/filters:watermark(s.glbimg.com/some/image.jpg,0,0,0)/some.domain/img/path/img.jpg');

  t.equal(object.image, 'my.image.path/unsafe/filters:watermark(s.glbimg.com/some/image.jpg,0,0,0)/some.domain/img/path/img.jpg');
  t.equal(object.filters, 'brightness(-50):contrast(20)');
  t.equal(object.width, 90);
  t.equal(object.height, 100);
  t.end();
});

test('with only width / height dimensions', function(t) {
  t.equal(url.parseDecrypted('/100x/http://example.jpg').height, null);
  t.equal(url.parseDecrypted('/100x/http://example.jpg').width, 100);
  t.equal(url.parseDecrypted('/x100/http://example.jpg').height, 100);
  t.equal(url.parseDecrypted('/x100/http://example.jpg').width, null);
  t.end();
});

test('with halign / valign', function(t) {
  t.equal(url.parseDecrypted('//http://example.jpg').halign, 'left');
  t.equal(url.parseDecrypted('/left/http://example.jpg').halign, 'left');
  t.equal(url.parseDecrypted('/right/http://example.jpg').halign, 'right');
  t.equal(url.parseDecrypted('/center/http://example.jpg').halign, 'center');
  t.equal(url.parseDecrypted('//http://example.jpg').valign, 'top');
  t.equal(url.parseDecrypted('/top/http://example.jpg').valign, 'top');
  t.equal(url.parseDecrypted('/bottom/http://example.jpg').valign, 'bottom');
  t.equal(url.parseDecrypted('/middle/http://example.jpg').valign, 'middle');
  t.end();
});

test('trim', function(t) {
  t.deepEqual(url.parseDecrypted('/trim/http://example.jpg').trim, {
    orientation: 'top-left',
    tolerance: 0
  });
  t.deepEqual(url.parseDecrypted('/trim:top-left/http://example.jpg').trim, {
    orientation: 'top-left',
    tolerance: 0
  });
  t.deepEqual(url.parseDecrypted('/trim:bottom-right/http://example.jpg').trim, {
    orientation: 'bottom-right',
    tolerance: 0
  });
  t.deepEqual(url.parseDecrypted('/trim:123/http://example.jpg').trim, {
    orientation: 'top-left',
    tolerance: 123
  });
  t.deepEqual(url.parseDecrypted('/trim:top-left:123/http://example.jpg').trim, {
    orientation: 'top-left',
    tolerance: 123
  });
  t.deepEqual(url.parseDecrypted('/http://example.jpg').trim, {
    orientation: null,
    tolerance: null
  });
  t.end();
});
