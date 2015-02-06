var test = require('tape');
var validator = require('../').validator;

test('validate()', function (t) {
  var validate = validator('beepboop')

  t.equal(validate('/boom/300x250/http://foo.com/image.jpg'), false);
  t.equal(validate('/aaaaaaaaaaaaaaaaaaaaaaaaaa==/http://foo.com/image.jpg'), false);
  t.equal(validate('/Ca9Xp53bfhkjnOwbiRkCzoYfL14=/300x250/http://example.com/image.jpg'), true);
  t.equal(validate('/Ca9Xp53bfhkjnOwbiRkCzoYfL14/300x250/http://example.com/image.jpg'), true);

  t.end();
});