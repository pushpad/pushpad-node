var request = require('superagent');
var http = require('http');
var url = require('url');

module.exports = Notification;

/**
 * Create new Notification
 * @param {Pushpad} options.project
 *
 * @param {string} options.body - A string representing the main text of the push notification.
 *  Maximum length is 120 characters. This field is mandatory.
 *
 * @param {string} [options.title] - A string representing the title of the push notification.
 *  Maximum length is 30 characters. This field is optional and
 *  the value defaults to the project name set in project settings.
 *
 * @param {string} [options.targetUrl] - The url the user is redirected to when clicks the push notification.
 *  This field is optional and the value defaults to the project website.
 *
 * @param {string} [options.iconUrl] - The url of a PNG or JPEG image that will be imported 
 * and used as the notification icon. This field is optional and the value defaults to the project icon.
 *
 * @param {Number} [options.ttl] - The number of seconds after which the notification should be dropped 
 * if the device of the user is offline.
 *
 * @constructor
 */
function Notification(options) {
  this.project = options.project;
  this.body = options.body;
  this.title = options.title;
  this.targetUrl = options.targetUrl;
  this.iconUrl = options.iconUrl;
  this.imageUrl = options.imageUrl;
  this.ttl = options.ttl;
  this.requireInteraction = options.requireInteraction;
  this.customData = options.customData;
  this.actions = options.actions;
  this.starred = options.starred;
}

/**
 * Send Notification to everyone
 * @param {Object} options (optional)
 * @param {Array} options.tags
 * @param {function} callback
 */
Notification.prototype.broadcast = function () {
  var options, callback;
  if (arguments.length > 1) {
    options = arguments[0];
    callback = arguments[1];
  } else {
    options = {};
    callback = arguments[0];
  }
  this._deliver(this._reqBody(null, options.tags), callback);
};

/**
 * Send Notification to given users
 * @param {string[]|string} uids
 * @param {Object} options (optional)
 * @param {Array} options.tags
 * @param {function} callback
 */
Notification.prototype.deliverTo = function (uids) {
  var options, callback;
  if (arguments.length > 2) {
    options = arguments[1];
    callback = arguments[2];
  } else {
    options = {};
    callback = arguments[1];
  }
  if (!uids) {
    uids = []; // prevent broadcasting
  }
  this._deliver(this._reqBody(uids, options.tags), callback);
};


Notification.prototype._reqHeaders = function () {
  return {
    'Authorization': 'Token token="' + this.project.authToken + '"',
    'Content-Type': 'application/json;charset=UTF-8',
    'Accept': 'application/json'
  };
};

Notification.prototype._reqBody = function (uids, tags) {
  var body = {
    'notification': {
      'body': this.body
    }
  };
  if (this.title) {
    body.notification.title = this.title;
  }
  if (this.targetUrl) {
    body.notification.target_url = this.targetUrl;
  }
  if (this.iconUrl) {
    body.notification.icon_url = this.iconUrl;
  }
  if (this.imageUrl) {
    body.notification.image_url = this.imageUrl;
  }
  if (this.ttl != null) {
    body.notification.ttl = this.ttl;
  }
  if (this.requireInteraction != null) {
    body.notification.require_interaction = this.requireInteraction;
  }
  if (this.customData) {
    body.notification.custom_data = this.customData;
  }
  if (this.actions && this.actions.length > 0) {
    var actions = [];
    for (var i = 0; i < this.actions.length; i++) {
      actions[i] = {
        title: this.actions[i].title
      };
      if (this.actions[i].targetUrl) {
        actions[i].target_url = this.actions[i].targetUrl;
      }
      if (this.actions[i].icon) {
        actions[i].icon = this.actions[i].icon;
      }
      if (this.actions[i].action) {
        actions[i].action = this.actions[i].action;
      }
    }
    body.notification.actions = actions;
  }
  if (this.starred != null) {
    body.notification.starred = this.starred;
  }

  if (uids) {
    body.uids = uids;
  }
  if (tags) {
    body.tags = tags;
  }
  return body;
};

Notification.prototype._deliver = function (body, callback) {
  request
    .post('https://pushpad.xyz/projects/' + this.project.projectId + '/notifications')
    .set(this._reqHeaders())
    .send(body)
    .end(function (err, res) {
      if (err) {
        callback(err);
      }
      else if (res.statusCode != 201) {
        callback(new Error(res.body));
      }
      else {
        callback(null, res.body);
      }
    });
};
