# Pushpad - Web Push Notifications

![Build Status](https://github.com/pushpad/pushpad-node/workflows/CI/badge.svg)
 
[Pushpad](https://pushpad.xyz) is a service for sending push notifications from your web app. It supports the **Push API** (Chrome, Firefox, Opera, Edge) and **APNs** (Safari).

Features:

- notifications are delivered even when the user is not on your website
- users don't need to install any app or plugin
- you can target specific users or send bulk notifications

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

You can subscribe the users to your notifications using the Javascript SDK, as described in the [getting started guide](https://pushpad.xyz/docs/pushpad_pro_getting_started).

If you need to generate the HMAC signature for the `uid` you can use this helper:

```javascript
project.signatureFor(currentUserId)
```

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
  body: 'Hello world!',
  title: 'Website Name', // optional, defaults to your project name
  targetUrl: 'https://example.com', // optional, defaults to your project website
  iconUrl: 'https://example.com/assets/icon.png', // optional, defaults to the project icon
  imageUrl: 'https://example.com/assets/image.png', // optional, an image to display in the notification content
  ttl: 604800, // optional, drop the notification after this number of seconds if a device is offline
  requireInteraction: true, // optional, prevent Chrome on desktop from automatically closing the notification after a few seconds
  silent: false, // optional, enable this option if you want a mute notification without any sound
  urgent: false, // optional, enable this option only for time-sensitive alerts (e.g. incoming phone call)
  customData: '123', // optional, a string that is passed as an argument to action button callbacks
  // optional, add some action buttons to the notification
  // see https://pushpad.xyz/docs/action_buttons
  actions: [
    {
      title: 'My Button 1',
      targetUrl: 'https://example.com/button-link', // optional
      icon: 'https://example.com/assets/button-icon.png', // optional
      action: 'myActionName' // optional
    }
  ],
  starred: true, // optional, bookmark the notification in the Pushpad dashboard (e.g. to highlight manual notifications)
  // optional, use this option only if you need to create scheduled notifications (max 5 days)
  // see https://pushpad.xyz/docs/schedule_notifications
  sendAt: new Date(Date.UTC(2016, 7 - 1, 25, 10, 9)), // 2016-07-25 10:09 UTC
  // optional, add the notification to custom categories for stats aggregation
  // see https://pushpad.xyz/docs/monitoring
  customMetrics: ['examples', 'another_metric'] // up to 3 metrics per notification
});

// deliver to a user
notification.deliverTo(user1, function(err, result) { /*...*/ });

// deliver to a group of users
notification.deliverTo([user1, user2, user3], function(err, result) { /*...*/ });

// deliver to some users only if they have a given preference
// e.g. only "users" who have a interested in "events" will be reached
notification.deliverTo(users, { tags: ['events'] }, function (err, result) { /*...*/ });

// deliver to segments
// e.g. any subscriber that has the tag "segment1" OR "segment2"
notification.broadcast({ tags: ['segment1', 'segment2'] }, function (err, result) { /*...*/ });

// you can use boolean expressions 
// they must be in the disjunctive normal form (without parenthesis)
var filter1 = ['zip_code:28865 && !optout:local_events || friend_of:Organizer123'];
notification.broadcast({ tags: filter1 }, function (err, result) { /*...*/ });
var filter2 = ['tag1 && tag2', 'tag3']; //  equal to 'tag1 && tag2 || tag3'
notification.deliverTo(users, { tags: filter2 }, function (err, result) { /*...*/ });

// deliver to everyone
notification.broadcast(function(err, result) { /*...*/ });
```

You can set the default values for most fields in the project settings. See also [the docs](https://pushpad.xyz/docs/rest_api#notifications_api_docs) for more information about notification fields.

If you try to send a notification to a user ID, but that user is not subscribed, that ID is simply ignored.

The methods above return an object: 

- `id` is the id of the notification on Pushpad
- `scheduled` is the estimated reach of the notification (i.e. the number of devices to which the notification will be sent, which can be different from the number of users, since a user may receive notifications on multiple devices)
- `uids` (`deliverTo` only) are the user IDs that will be actually reached by the notification because they are subscribed to your notifications. For example if you send a notification to `['uid1', 'uid2', 'uid3']`, but only `'uid1'` is subscribed, you will get `['uid1']` in response. Note that if a user has unsubscribed after the last notification sent to him, he may still be reported for one time as subscribed (this is due to the way the W3C Push API works).
- `send_at` is present only for scheduled notifications. The fields `scheduled` and `uids` are not available in this case.


## License

The library is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).
