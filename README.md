# Pushpad - Web Push Notifications

[![npm version](https://img.shields.io/npm/v/pushpad.svg)](https://www.npmjs.com/package/pushpad)
![Build Status](https://github.com/pushpad/pushpad-node/workflows/CI/badge.svg)

[Pushpad](https://pushpad.xyz) is a service for sending push notifications from websites and web apps. It uses the **Push API**, which is a standard supported by all major browsers (Chrome, Firefox, Opera, Edge, Safari).

The notifications are delivered in real time even when the users are not on your website and you can target specific users or send bulk notifications.

## Installation

Add this package to your project dependencies:

```bash
npm install pushpad
```

Or add it with Yarn:

```bash
yarn add pushpad
```

## TL;DR Quickstart

```javascript
import Pushpad from "pushpad";

const pushpad = new Pushpad({
  authToken: "token", // from account settings
  projectId: 123 // from project settings
});

try {
  // send a notification
  const result = await pushpad.notification.create({
    body: "Your message",
    // and all the other fields
  });
  console.log(result.id);
} catch (err) {
  console.log(err);
}

// you can also pass projectId directly to a function (instead of setting it globally)
const result = await pushpad.notification.create({
  body: "Your message"
}, { projectId: 123 });

// Notifications API
pushpad.notification.create(data, options);
pushpad.notification.findAll(query, options);
pushpad.notification.find(id);
pushpad.notification.cancel(id);

// Subscriptions API
pushpad.subscription.create(data, options);
pushpad.subscription.count(query, options);
pushpad.subscription.findAll(query, options);
pushpad.subscription.find(id, options);
pushpad.subscription.update(id, data, options);
pushpad.subscription.delete(id, options);

// Projects API
pushpad.project.create(data);
pushpad.project.findAll();
pushpad.project.find(id);
pushpad.project.update(id, data);
pushpad.project.delete(id);

// Senders API
pushpad.sender.create(data);
pushpad.sender.findAll();
pushpad.sender.find(id);
pushpad.sender.update(id, data);
pushpad.sender.delete(id);
```

## Getting started

First you need to sign up to Pushpad and create a project there.

Then set your authentication credentials:

```javascript
import Pushpad from 'pushpad';

const pushpad = new Pushpad({
  authToken: '5374d7dfeffa2eb49965624ba7596a09',
  projectId: 123 // set it here or pass it as a param to methods later
});
```

- `authToken` can be found in the user account settings. 
- `projectId` can be found in the project settings.

If your application uses multiple projects, you can pass the `projectId` as an option to methods:

```javascript
pushpad.notification.create(data, { projectId: 123 });

pushpad.notification.findAll(query, { projectId: 123 });

pushpad.subscription.count(query, { projectId: 123 });

// ...
```

## Collecting user subscriptions to push notifications

You can subscribe the users to your notifications using the Javascript SDK, as described in the [getting started guide](https://pushpad.xyz/docs/pushpad_pro_getting_started).

If you need to generate the HMAC signature for the `uid` you can use this helper:

```javascript
pushpad.signatureFor(currentUserId);
```

## Sending push notifications

Use `pushpad.notification.create()` (or the `send()` alias) to create and send a notification:

```javascript
// send a simple notification
await pushpad.notification.send({ body: 'Your message' });

// a more complex notification with all the optional fields
const payload = {
  // required, the main content of the notification
  body: 'Hello world!',

  // optional, the title of the notification (defaults to your project name)
  title: 'Website Name',

  // optional, open this link on notification click (defaults to your project website)
  target_url: 'https://example.com',

  // optional, the icon of the notification (defaults to the project icon)
  icon_url: 'https://example.com/assets/icon.png',

  // optional, the small icon displayed in the status bar (defaults to the project badge)
  badge_url: 'https://example.com/assets/badge.png',

  // optional, an image to display in the notification content
  // see https://pushpad.xyz/docs/sending_images
  image_url: 'https://example.com/assets/image.png',

  // optional, drop the notification after this number of seconds if a device is offline
  ttl: 604800,

  // optional, prevent Chrome on desktop from automatically closing the notification after a few seconds
  require_interaction: true,

  // optional, enable this option if you want a mute notification without any sound
  silent: false,

  // optional, enable this option only for time-sensitive alerts (e.g. incoming phone call)
  urgent: false,

  // optional, a string that is passed as an argument to action button callbacks
  custom_data: '123',

  // optional, add some action buttons to the notification
  // see https://pushpad.xyz/docs/action_buttons
  actions: [
    {
      title: 'My Button 1',
      target_url: 'https://example.com/button-link', // optional
      icon: 'https://example.com/assets/button-icon.png', // optional
      action: 'myActionName' // optional
    }
  ],

  // optional, bookmark the notification in the Pushpad dashboard (e.g. to highlight manual notifications)
  starred: true,

  // optional, use this option only if you need to create scheduled notifications (max 5 days)
  // see https://pushpad.xyz/docs/schedule_notifications
  send_at: '2016-07-25T10:09:00Z',

  // optional, add the notification to custom categories for stats aggregation
  // see https://pushpad.xyz/docs/monitoring
  custom_metrics: ['examples', 'another_metric'] // up to 3 metrics per notification
};

// deliver to a user
await pushpad.notification.create({ ...payload, uids: ['user-1'] });

// deliver to a group of users
await pushpad.notification.create({ ...payload, uids: ['user-1', 'user-2', 'user-3'] });

// deliver to some users only if they have a given preference
// e.g. only "users" who have a interested in "events" will be reached
await pushpad.notification.create({ ...payload, uids: ['user-1', 'user-2'], tags: ['events'] });

// deliver to segments
// e.g. any subscriber that has the tag "segment1" OR "segment2"
await pushpad.notification.create({ ...payload, tags: ['segment1', 'segment2'] });

// you can use boolean expressions 
// they can include parentheses and the operators !, &&, || (from highest to lowest precedence)
// https://pushpad.xyz/docs/tags
await pushpad.notification.create({ ...payload, tags: ['zip_code:28865 && !optout:local_events || friend_of:Organizer123'] });
await pushpad.notification.create({ ...payload, tags: ['tag1 && tag2', 'tag3'] }); // equal to 'tag1 && tag2 || tag3'

// deliver to everyone
await pushpad.notification.create(payload);
```

You can set the default values for most fields in the project settings. See also [the docs](https://pushpad.xyz/docs/rest_api#notifications_api_docs) for more information about notification fields.

If you try to send a notification to a user ID, but that user is not subscribed, that ID is simply ignored.

These fields are also returned by the API:

```javascript
const result = await pushpad.notification.create(payload);

// Notification ID
console.log(result.id); // => 1000

// Estimated number of devices that will receive the notification
// Not available for notifications that use send_at
console.log(result.scheduled); // => 5

// Available only if you specify some user IDs (uids) in the request:
// it indicates which of those users are subscribed to notifications.
// Not available for notifications that use send_at
console.log(result.uids); // => ["user1", "user2"]

// The time when the notification will be sent.
// Available for notifications that use send_at
console.log(result.send_at); // => "2025-10-30T10:09:00.000Z"
```

## Getting push notification data

You can retrieve data for past notifications:

```javascript
const notification = await pushpad.notification.find(42);

// get basic attributes
notification.id; // => 42
notification.title; // => 'Foo Bar'
notification.body; // => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
notification.target_url; // => 'https://example.com'
notification.ttl; // => 604800
notification.require_interaction; // => false
notification.silent; // => false
notification.urgent; // => false
notification.icon_url; // => 'https://example.com/assets/icon.png'
notification.badge_url; // => 'https://example.com/assets/badge.png'
notification.created_at; // => '2025-07-06T10:09:14.000Z'

// get statistics
notification.scheduled_count; // => 1
notification.successfully_sent_count; // => 4
notification.opened_count; // => 2
```

Or for multiple notifications of a project at once:

```javascript
const notifications = await pushpad.notification.findAll({ page: 1 });

// same attributes as for single notification in example above
notifications[0].id; // => 42
notifications[0].title; // => 'Foo Bar'
```

The REST API paginates the result set. You can pass a `page` parameter to get the full list in multiple requests.

```javascript
const notifications = await pushpad.notification.findAll({ page: 2 });
```

## Scheduled notifications

You can create scheduled notifications that will be sent in the future:

```javascript
await pushpad.notification.create({
  body: 'This notification will be sent after 60 seconds',
  send_at: new Date(Date.now() + 60_000).toISOString()
});
```

You can also cancel a scheduled notification:

```javascript
await pushpad.notification.cancel(id);
```

## Getting subscription count

You can retrieve the number of subscriptions for a given project, optionally filtered by `tags` or `uids`:

```javascript
await pushpad.subscription.count(); // => 100
await pushpad.subscription.count({ uids: ['user1'] }); // => 2
await pushpad.subscription.count({ tags: ['sports'] }); // => 10
await pushpad.subscription.count({ tags: ['sports && travel'] }); // => 5
await pushpad.subscription.count({ uids: ['user1'], tags: ['sports && travel'] }); // => 1
```

## Getting push subscription data

You can retrieve the subscriptions for a given project, optionally filtered by `tags` or `uids`:

```javascript
await pushpad.subscription.findAll();
await pushpad.subscription.findAll({ uids: ['user1'] });
await pushpad.subscription.findAll({ tags: ['sports'] });
await pushpad.subscription.findAll({ tags: ['sports && travel'] });
await pushpad.subscription.findAll({ uids: ['user1'], tags: ['sports && travel'] });
```

The REST API paginates the result set. You can pass a `page` parameter to get the full list in multiple requests.

```javascript
const subscriptions = await pushpad.subscription.findAll({ page: 2 });
```

You can also retrieve the data of a specific subscription if you already know its id:

```javascript
await pushpad.subscription.find(123);
```

## Updating push subscription data

Usually you add data, like user IDs and tags, to the push subscriptions using the [JavaScript SDK](https://pushpad.xyz/docs/javascript_sdk_reference) in the frontend.

However you can also update the subscription data from your server:

```javascript
const subscriptions = await pushpad.subscription.findAll({ uids: ['user1'] });

for (const subscription of subscriptions) {
  // update the user ID associated to the push subscription
  await pushpad.subscription.update(subscription.id, { uid: 'myuser1' });
  
  // update the tags associated to the push subscription
  const tags = [...(subscription.tags ?? [])];
  tags.push('another_tag');
  await pushpad.subscription.update(subscription.id, { tags });
}
```

## Importing push subscriptions

If you need to [import](https://pushpad.xyz/docs/import) some existing push subscriptions (from another service to Pushpad, or from your backups) or if you simply need to create some test data, you can use this method:

```javascript
const attributes = {
  endpoint: 'https://example.com/push/f7Q1Eyf7EyfAb1', 
  p256dh: 'BCQVDTlYWdl05lal3lG5SKr3VxTrEWpZErbkxWrzknHrIKFwihDoZpc_2sH6Sh08h-CacUYI-H8gW4jH-uMYZQ4=',
  auth: 'cdKMlhgVeSPzCXZ3V7FtgQ==',
  uid: 'exampleUid', 
  tags: ['exampleTag1', 'exampleTag2']
};

const subscription = await pushpad.subscription.create(attributes);
```

Please note that this is not the standard way to collect subscriptions on Pushpad: usually you subscribe the users to the notifications using the [JavaScript SDK](https://pushpad.xyz/docs/javascript_sdk_reference) in the frontend.

## Deleting push subscriptions

Usually you unsubscribe a user from push notifications using the [JavaScript SDK](https://pushpad.xyz/docs/javascript_sdk_reference) in the frontend (recommended).

However you can also delete the subscriptions using this library. Be careful, the subscriptions are permanently deleted!

```javascript
await pushpad.subscription.delete(id);
```

## Managing projects

Projects are usually created manually from the Pushpad dashboard. However you can also create projects from code if you need advanced automation or if you manage [many different domains](https://pushpad.xyz/docs/multiple_domains).

```javascript
const attributes = {
  // required attributes
  sender_id: 123,
  name: 'My project',
  website: 'https://example.com',
  
  // optional configurations
  icon_url: 'https://example.com/icon.png',
  badge_url: 'https://example.com/badge.png',
  notifications_ttl: 604800,
  notifications_require_interaction: false,
  notifications_silent: false
};

const project = await pushpad.project.create(attributes);
```

You can also find, update and delete projects:

```javascript
const projects = await pushpad.project.findAll();
projects.forEach((p) => {
  console.log(`Project ${p.id}: ${p.name}`);
});

const existingProject = await pushpad.project.find(123);

await pushpad.project.update(existingProject.id, { name: 'The New Project Name' });

await pushpad.project.delete(existingProject.id);
```

## Managing senders

Senders are usually created manually from the Pushpad dashboard. However you can also create senders from code.

```javascript
const attributes = {
  // required attributes
  name: 'My sender',
  
  // optional configurations
  // do not include these fields if you want to generate them automatically
  vapid_private_key: '-----BEGIN EC PRIVATE KEY----- ...',
  vapid_public_key: '-----BEGIN PUBLIC KEY----- ...'
};

const sender = await pushpad.sender.create(attributes);
```

You can also find, update and delete senders:

```javascript
const senders = await pushpad.sender.findAll();
senders.forEach((s) => {
  console.log(`Sender ${s.id}: ${s.name}`);
});

const existingSender = await pushpad.sender.find(987);

await pushpad.sender.update(existingSender.id, { name: 'The New Sender Name' });

await pushpad.sender.delete(existingSender.id);
```

## Error handling

All API requests return promises. Failed requests throw a `PushpadError` that exposes the HTTP status, response body, headers, and request metadata:

```javascript
import { PushpadError } from 'pushpad';

try {
  await pushpad.notification.create({ body: 'Hello' });
} catch (error) {
  if (error instanceof PushpadError) {
    console.error(error.status, error.body);
  }
}
```

## TypeScript support

Type definitions ship with the package (`index.d.ts`) and cover all resources, input types, and response shapes. Importing from TypeScript works out of the box:

```typescript
import Pushpad from 'pushpad';

// types are inferred automatically from type definitions in the package
const client = new Pushpad({ authToken: 'token', projectId: 123 });
const result = await client.notification.create({ body: 'Hello' });
```

## Documentation

- Pushpad REST API reference: https://pushpad.xyz/docs/rest_api
- Getting started guide (for collecting subscriptions): https://pushpad.xyz/docs/pushpad_pro_getting_started
- JavaScript SDK reference (frontend): https://pushpad.xyz/docs/javascript_sdk_reference

## License

The package is available as open source under the terms of the [MIT License](https://opensource.org/license/MIT).
