var pushpad = require('./index');

// process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

var AUTH_TOKEN = '5374d7dfeffa2eb49965624ba7596a09';
var PROJECT_ID = 123;

var user1 = 'user1';
var user2 = 'user2';
var user3 = 'user3';
var users = [user1, user2, user3];
var tags = ['segment1', 'segment2'];

var project = new pushpad.Pushpad({
  authToken: AUTH_TOKEN,
  projectId: PROJECT_ID
});

console.log('HMAC signature for the uid: %s is: %s', user1, project.signatureFor(user1));

var notification = new pushpad.Notification({
  project: project,
  body: 'Hello world!',
  title: 'Website Name',
  targetUrl: 'http://example.com'
});

notification.deliverTo(user1, function (err, result) {
  console.log('Send notification to user:', user1);
  console.log(err || result);
});

notification.deliverTo(users, function (err, result) {
  console.log('Send notification to users:', users);
  console.log(err || result);
});

notification.broadcast(function (err, result) {
  console.log('Send broadcast notification');
  console.log(err || result);
});

notification.deliverTo(users, { tags: tags }, function (err, result) {
  console.log('Send notification to users:', users, 'if they have at least one of the following tags:', tags);
  console.log(err || result);
});

notification.broadcast({ tags: tags }, function (err, result) {
  console.log('Send broadcast notification to segments:', tags);
  console.log(err || result);
});
