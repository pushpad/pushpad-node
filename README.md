# Pushpad - Web Push Notifications Service
 
[Pushpad](https://pushpad.xyz) is a service for sending push notifications from your web app. It supports the **Push API** (Chrome and Firefox) and **APNs** (Safari).

Features:

- notifications are delivered even when the user is not on your website
- users don't need to install any app or plugin
- you can target specific users or send bulk notifications

Currently push notifications work on the following browsers:

- Chrome (Desktop and Android)
- Firefox (44+)
- Safari

## Installation
Using NPM:
```bash
npm install pushpad
```

## Getting started

First you need to sign up to Pushpad and create a project there.

Then set your authentication credentials and project:

```javascript
var pushpad = require('pushpad');

var project = new pushpad.Pushpad({
  authToken: AUTH_TOKEN,
  projectId: PROJECT_ID
});
```

- `authToken` can be found in the user account settings.
- `projectId` can be found in the project settings.

## Collecting user subscriptions to push notifications

Pushpad offers two different products. [Learn more](https://pushpad.xyz/docs)

### Pushpad Pro

Choose Pushpad Pro if you want to use Javascript for a seamless integration. [Read the docs](https://pushpad.xyz/docs/pushpad_pro_getting_started)

If you need to generate the HMAC signature for the `uid` you can use this helper:

```javascript
project.signatureFor(currentUserId)
```

### Pushpad Express

If you want to use Pushpad Express, add a link to your website to let users subscribe to push notifications: 

```javascript
'<a href="' + project.path() + '">Push notifications</a>'

// If the user is logged in on your website you should track its user id to target him in the future
'<a href="' + project.pathFor(currentUserId) + '">Push notifications</a>'
```

`currentUserId` is an identifier (e.g. primary key in the database) of the user currently logged in on your website.

When a user clicks the link is sent to Pushpad, asked to receive push notifications and redirected back to your website.

## Sending push notifications

```javascript
var pushpad = require('./index');

var AUTH_TOKEN = 'e991832a51afc9da49baf29e7f9de6a6';
var PROJECT_ID = 763;

var project = new pushpad.Pushpad({
  authToken: AUTH_TOKEN,
  projectId: PROJECT_ID
});

var notification = new pushpad.Notification({
  project: project,
  body: 'Hello world!', // max 90 characters
  title: 'Website Name', // optional, defaults to your project name, max 30 characters
  targetUrl: 'http://example.com', // optional, defaults to your project website
  iconUrl: 'http://example.com/assets/icon.png', // optional, defaults to the project icon
  ttl: 604800 // optional, drop the notification after this number of seconds if a device is offline
});

// deliver to a user
notification.deliverTo(user1, function(err, result) { /*...*/ });

// deliver to a group of users
notification.deliverTo([user1, user2, user3], function(err, result) { /*...*/ });

// deliver to some users only if they have a given preference
// e.g. only "users" who have a interested in "events" will be reached
notification.deliverTo(users, { tags: ['events'] }, function (err, result) { /*...*/ });

// deliver to segments
notification.broadcast({ tags: ['segment1', 'segment2'] }, function (err, result) { /*...*/ });

// deliver to everyone
notification.broadcast(function(err, result) { /*...*/ });
```

If no user with that id has subscribed to push notifications, that id is simply ignored.

The methods above return an object: 

- `scheduled` is the number of devices to which the notification will be sent
- `uids` (`deliverTo` only) are the user IDs that will be actually reached by the notification (unless they have unsubscribed since the last notification)

## License

The library is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).
