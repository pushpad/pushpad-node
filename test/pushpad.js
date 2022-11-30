var assert = require('assert');

var Pushpad = require('../lib/pushpad');

var AUTH_TOKEN = '5374d7dfeffa2eb49965624ba7596a09';
var PROJECT_ID = 123;

var project = new Pushpad({authToken: AUTH_TOKEN, projectId: PROJECT_ID});

describe('Pushpad', function () {

  describe('#signatureFor()', function () {
    it('should return correct signature', function () {
      var actual = project.signatureFor('user12345');
      var expected = '6627820dab00a1971f2a6d3ff16a5ad8ba4048a02b2d402820afc61aefd0b69f';
      assert.equal(actual, expected);
    });
  });

});
