var request = require('request');

module.exports = Notification;

/**
 * Create new Notification
 * @param {Pushpad} options.project
 *
 * @param {string} options.body - A string representing the main text of the push notification.
 *  Maximum length is 90 characters. This field is mandatory.
 *
 * @param {string} [options.title] - A string representing the title of the push notification.
 *  Maximum length is 30 characters. This field is optional and
 *  the value defaults to the project name set in project settings.
 *
 * @param {string} [options.targetUrl] - The url the user is redirected to when clicks the push notification.
 *  This field is optional and the value defaults to the project website.
 *
 * @constructor
 */
function Notification(options) {
  this.project = options.project;
  this.body = options.body;
  this.title = options.title;
  this.targetUrl = options.targetUrl;
}

/**
 * Send Notification to everyone
 * @param {function} callback
 */
Notification.prototype.broadcast = function (callback) {
  this._deliver(this._reqBody(), callback);
};

/**
 * Send Notification to given users
 * @param {string[]|string} uids
 * @param {function} callback
 */
Notification.prototype.deliverTo = function (uids, callback) {
  this._deliver(this._reqBody(uids), callback);
};


Notification.prototype._reqHeaders = function () {
  return {
    'Authorization': 'Token token="' + this.project.authToken + '"',
    'Content-Type': 'application/json;charset=UTF-8',
    'Accept': 'application/json'
  };
};

Notification.prototype._reqBody = function (uids) {
  var body = {
    'notification': {
      'body': this.body,
      'title': this.title,
      'target_url': this.targetUrl
    }
  };
  if (uids) {
    body.uids = uids;
  }
  return body;
};

Notification.prototype._deliver = function (body, callback) {
  request({
    url: 'https://pushpad.xyz/projects/' + this.project.projectId + '/notifications',
    method: 'POST',
    headers: this._reqHeaders(),
    body: body,
    json: true
  }, function (err, resp, body) {
    if (err) {
      callback(err);
    }
    else if (resp.statusCode != 201) {
      callback(new Error(body.trim()));
    }
    else {
      callback(null, body);
    }
  });
};
