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

  t.ok(object.meta);
  t.equal(object.crop.left, 10);
  t.equal(object.crop.top, 11);
  t.equal(object.crop.right, 12);
  t.equal(object.crop.bottom, 13);
  t.equal(object.width, 300);
  t.equal(object.height, 200);
  t.ok(object.horizontalFlip);
  t.ok(object.verticalFlip);
  t.equal(object.halign, 'left');
  t.equal(object.valign, 'top');
  t.ok(object.smart);
  t.ok(object.fit_in);
  t.equal(object.filters, 'some_filter()');
  t.end();
});

test('with image', function(t) {
  var imageUrl = 's.glbimg.com/es/ge/f/original/2011/03/29/orlandosilva_60.jpg'
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
