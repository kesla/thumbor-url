// basis for this is
// https://github.com/thumbor/thumbor/blob/9d0e861145d15a50e6ac7800e9333d5d5149ccbd/vows/url_vows.py

var test = require('tape');
var url = require('../');

test('parse() without result', function(t) {
  var object = url.parse('some fake url');

  t.equal(object.image, 'some fake url');
  t.end();
});

test('parse() without image', function(t) {
  var object = url.parse('/meta/10x11:12x13/fit-in/-300x-200/left/top/smart/filters:some_filter()/img');

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
  t.deepEqual(object.filters, [{
    name: 'some_filter',
    args: []
  }], 'filters');
  t.end();
});

test('parse() with image', function(t) {
  var imageUrl = 's.glbimg.com/es/ge/f/original/2011/03/29/orlandosilva_60.jpg';
  var object = url.parse('/meta/10x11:12x13/-300x-200/left/top/smart/' + imageUrl);

  t.equal(object.image, imageUrl);
  t.end();
});

test('parse() with url in filter', function(t) {
  var object = url.parse(
    '/filters:watermark(s.glbimg.com/es/ge/f/original/2011/03/29/orlandosilva_60.jpg,0,0,0)/img');

  t.equal(object.image, 'img');
  t.deepEqual(object.filters, [{
    name: 'watermark',
    args: ['s.glbimg.com/es/ge/f/original/2011/03/29/orlandosilva_60.jpg', '0', '0', '0']
  }]);
  t.end();
});

test('parse() with multiple filters', function(t) {
  var object = url.parse(
    '/filters:watermark(s.glbimg.com/es/ge/f/original/2011/03/29/orlandosilva_60.jpg,0,0,0):brightness(-50):grayscale()/img');

  t.equal(object.image, 'img');
  t.deepEqual(object.filters, [{
    args: ['s.glbimg.com/es/ge/f/original/2011/03/29/orlandosilva_60.jpg', '0', '0', '0'],
    name: 'watermark'
    }, {
    args: ['-50'],
    name: 'brightness'
    }, {
    args: [],
    name: 'grayscale'
  }]);
  t.end();
});

test('parse() with thumbor of thumbor', function(t) {
  var object = url.parse(
    '/90x100/my.image.path/unsafe/filters:watermark(s.glbimg.com/some/image.jpg,0,0,0)/some.domain/img/path/img.jpg');

  t.equal(object.image, 'my.image.path/unsafe/filters:watermark(s.glbimg.com/some/image.jpg,0,0,0)/some.domain/img/path/img.jpg');
  t.equal(object.width, 90);
  t.equal(object.height, 100);
  t.end();
});

test('parse() with thumbor of thumbor with Filters', function(t) {
  var object = url.parse(
    '/90x100/filters:brightness(-50):contrast(20)/my.image.path/unsafe/filters:watermark(s.glbimg.com/some/image.jpg,0,0,0)/some.domain/img/path/img.jpg');

  t.equal(object.image, 'my.image.path/unsafe/filters:watermark(s.glbimg.com/some/image.jpg,0,0,0)/some.domain/img/path/img.jpg');
  t.deepEqual(object.filters, [{
    args: ['-50'],
    name: 'brightness'
    }, {
    args: ['20'],
    name: 'contrast'
  }]);
  t.equal(object.width, 90);
  t.equal(object.height, 100);
  t.end();
});

test('parse() with only width / height dimensions', function(t) {
  t.equal(url.parse('/100x/http://example.jpg').height, null);
  t.equal(url.parse('/100x/http://example.jpg').width, 100);
  t.equal(url.parse('/x100/http://example.jpg').height, 100);
  t.equal(url.parse('/x100/http://example.jpg').width, null);
  t.end();
});

test('parse() with halign / valign', function(t) {
  t.equal(url.parse('//http://example.jpg').halign, null);
  t.equal(url.parse('/left/http://example.jpg').halign, 'left');
  t.equal(url.parse('/right/http://example.jpg').halign, 'right');
  t.equal(url.parse('/center/http://example.jpg').halign, 'center');
  t.equal(url.parse('//http://example.jpg').valign, null);
  t.equal(url.parse('/top/http://example.jpg').valign, 'top');
  t.equal(url.parse('/bottom/http://example.jpg').valign, 'bottom');
  t.equal(url.parse('/middle/http://example.jpg').valign, 'middle');
  t.end();
});

test('parse() trim', function(t) {
  t.deepEqual(url.parse('/trim/http://example.jpg').trim, {
    orientation: 'top-left',
    tolerance: 0
  });
  t.deepEqual(url.parse('/trim:top-left/http://example.jpg').trim, {
    orientation: 'top-left',
    tolerance: 0
  });
  t.deepEqual(url.parse('/trim:bottom-right/http://example.jpg').trim, {
    orientation: 'bottom-right',
    tolerance: 0
  });
  t.deepEqual(url.parse('/trim:123/http://example.jpg').trim, {
    orientation: 'top-left',
    tolerance: 123
  });
  t.deepEqual(url.parse('/trim:top-left:123/http://example.jpg').trim, {
    orientation: 'top-left',
    tolerance: 123
  });
  t.deepEqual(url.parse('/http://example.jpg').trim, {
    orientation: null,
    tolerance: null
  });
  t.end();
});

test('parse() unsafe / hash', function(t) {
  t.equal(url.parse('/url/').unsafe, false);
  t.equal(url.parse('/url/').hash, null);
  t.equal(url.parse('/unsafe/url/').unsafe, true);
  t.equal(url.parse('/abcdefabcdefabcdefabcdefabcd/url/').hash, 'abcdefabcdefabcdefabcdefabcd');
  t.equal(url.parse('/abcdefefghijklmnopqrstuvwx-_/url/').hash, 'abcdefefghijklmnopqrstuvwx-_');
  t.equal(url.parse('/aaaaaaaaaaaaaaaaaaaaaaaaaa==/url/').hash, 'aaaaaaaaaaaaaaaaaaaaaaaaaa');
  t.equal(url.parse('/aaaaaaaaaaaaaaaaaaaaaaaaaa=/url/').hash, 'aaaaaaaaaaaaaaaaaaaaaaaaaa');
  t.equal(url.parse('/aaaaaaaaaaaaaaaaaaaaaaaaaa/url/').hash, 'aaaaaaaaaaaaaaaaaaaaaaaaaa');
  t.equal(url.parse('/aaaaaaaaaaaaaa=aaaaaaaaaaaa/url/').hash, null);
  // too long
  t.equal(url.parse('/aaaaaaaaaaaaaaaaaaaaaaaaaaaa=/url/').hash, null);
  t.equal(url.parse('/aaaaaaaaaaaaaaaaaaaaaaaaaaa==/url/').hash, null);
  t.equal(url.parse('/abc/').hash, null);
  t.end();
});


test('regression', function(t) {
  var parsed = url.parse('unsafe/200x200/smart/http://s3.amazonaws.com/policymic-images/filename2.jpg');

  t.equal(parsed.width, 200);
  t.equal(parsed.height, 200);
  t.equal(parsed.image, 'http://s3.amazonaws.com/policymic-images/filename2.jpg');
  t.end();
});
