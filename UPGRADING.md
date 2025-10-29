# Upgrading to version 2.x

This version is a major rewrite of the library and adds support for the full REST API, including Notifications, Subscriptions, Projects and Senders.

This version has some breaking changes:

- Import the package with `import Pushpad from 'pushpad';`.
- Create a Pushpad client instance with `const pushpad = new Pushpad({ authToken: "token", projectId: 123 });`.
- `notification.deliverTo` and `notification.broadcast` were removed. Instead you should use `const result = await pushpad.notification.create(data, options);` (or the `send()` alias).
- When you call `pushpad.notification.create()` with the `send_at` param, you should pass a ISO 8601 string. For example, you can use `new Date(Date.now() + 60_000).toISOString();` to send a notification after 60 seconds.
- When you call `pushpad.notification.create()` there isn't a `project` param (like in the previous version), instead you can optionally use `pushpad.notification.create(data, { projectId: 456 });` if you want to override the global `projectId`.
