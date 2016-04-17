var assert = require('assert');

var Pushpad = require('../lib/pushpad');

var AUTH_TOKEN = '5374d7dfeffa2eb49965624ba7596a09';
var PROJECT_ID = 123;

var project = new Pushpad({authToken: AUTH_TOKEN, projectId: PROJECT_ID});

describe('Pushpad', function () {

  describe('#signatureFor()', function () {
    it('should return correct signature', function () {
      var actual = project.signatureFor('Lorem ipsum dolor sit amet, cu eam veniam verear blandit');
      var expected = '71b88a1cab4fa14794128debecae12f5c091f7fe';
      assert.equal(actual, expected);
    });
  });

  describe('#path()', function (){
    it('should return correct path', function () {
      var actual = project.path();
      var expected = 'https://pushpad.xyz/projects/123/subscription/edit';
      assert.equal(actual, expected);
    });
  });

  describe('#pathFor()', function (){
    it('should return correct path for given user', function () {
      var actual = project.pathFor('testuser1234');
      var expected = 'https://pushpad.xyz/projects/123/subscription/edit?uid=testuser1234&uid_signature=f1c94d68e25af9f8f818f7016b78934fec99d4c9';
      assert.equal(actual, expected);
    });
  });

});