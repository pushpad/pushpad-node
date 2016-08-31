var assert = require('assert');
var nock = require('nock');

var Pushpad = require('../lib/pushpad');
var Notification = require('../lib/notification');

var AUTH_TOKEN = '5374d7dfeffa2eb49965624ba7596a09';
var PROJECT_ID = 123;

var project = new Pushpad({authToken: AUTH_TOKEN, projectId: PROJECT_ID});

var notification = new Notification({
  project: project,
  body: 'Hello world!',
  title: 'Website Name',
  targetUrl: 'http://example.com',
  iconUrl: 'http://example.com/assets/icon.png',
  ttl: 600
});


describe('Notification', function () {

  describe('#broadcast()', function () {
    it('should send correct request to broadcast notification', function (done) {
      notification.broadcast(function (err, result) {
        if (err) return done(err);
        assert.deepEqual(result, {scheduled: 0});
        done();
      });
    });

    before(function () {
      nock('https://pushpad.xyz', {
        reqheaders: {
          'authorization': 'Token token="5374d7dfeffa2eb49965624ba7596a09"',
          'content-type': 'application/json;charset=UTF-8',
          'accept': 'application/json'
        }
      })
        .post('/projects/123/notifications', {
          'notification': {
            'body': 'Hello world!',
            'title': 'Website Name',
            'target_url': 'http://example.com',
            'icon_url': 'http://example.com/assets/icon.png',
            'ttl': 600
          }
        })
        .reply(201, {scheduled: 0});
    });
  });

  after(function () {
    nock.restore();
  });

  describe('#deliverTo()', function () {
    it('should send correct request to deliver notification to single user', function (done) {
      notification.deliverTo('user1', function (err, result) {
        if (err) return done(err);
        assert.deepEqual(result, {scheduled: 0});
        done();
      });
    });

    before(function () {
      nock('https://pushpad.xyz/', {
        reqheaders: {
          'Authorization': 'Token token="5374d7dfeffa2eb49965624ba7596a09"',
          'Content-Type': 'application/json;charset=UTF-8',
          'Accept': 'application/json'
        }
      })
        .post('/projects/123/notifications', {
          'notification': {
            'body': 'Hello world!',
            'title': 'Website Name',
            'target_url': 'http://example.com',
            'icon_url': 'http://example.com/assets/icon.png',
            'ttl': 600
          },
          'uids': 'user1'
        })
        .reply(201, {scheduled: 0});
    });
  });

  after(function () {
    nock.restore();
  });

  describe('#deliverTo()', function () {
    it('should send correct request to deliver notification to multiple users', function (done) {
      notification.deliverTo(['user1', 'user2', 'user3'], function (err, result) {
        if (err) return done(err);
        assert.deepEqual(result, {scheduled: 0});
        done();
      });
    });

    before(function () {
      nock('https://pushpad.xyz/', {
        reqheaders: {
          'Authorization': 'Token token="5374d7dfeffa2eb49965624ba7596a09"',
          'Content-Type': 'application/json;charset=UTF-8',
          'Accept': 'application/json'
        }
      })
        .post('/projects/123/notifications', {
          'notification': {
            'body': 'Hello world!',
            'title': 'Website Name',
            'target_url': 'http://example.com',
            'icon_url': 'http://example.com/assets/icon.png',
            'ttl': 600
          },
          'uids': ['user1', 'user2', 'user3']
        })
        .reply(201, {scheduled: 0});
    });
  });

  after(function () {
    nock.restore();
  });

  describe('#deliverTo()', function () {
    it('should never broadcast a notification', function (done) {
      notification.deliverTo(null, function (err, result) {
        if (err) return done(err);
        done();
      });
    });

    before(function () {
      nock('https://pushpad.xyz/')
        .post('/projects/123/notifications', {
          'uids': []
        })
        .reply(201, {scheduled: 0});
    });
  });

  after(function () {
    nock.restore();
  });
});
