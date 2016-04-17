var pushpad = require('./index');

var AUTH_TOKEN = '5374d7dfeffa2eb49965624ba7596a09';
var PROJECT_ID = 123;

var user1 = 'user1';
var user2 = 'user2';
var user3 = 'user3';
var users = [user1, user2, user3];

var project = new pushpad.Pushpad({
  authToken: AUTH_TOKEN,
  projectId: PROJECT_ID
});

console.log('HMAC signature for the uid: %s is: %s', user1, project.signatureFor(user1));
console.log('Subscribe anonymous to push notifications: %s', project.path());
console.log('Subscribe current user: %s to push notifications: %s', user1, project.pathFor(user1));

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
