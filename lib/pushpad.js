var crypto = require('crypto');

module.exports = Pushpad;

/**
 * Create new Pushpad project instance
 * @param {string} options.authToken - can be found in the user account settings
 * @param {string|number} options.projectId - can be found in the project settings
 * @constructor
 */
function Pushpad(options) {
  this.authToken = options.authToken;
  this.projectId = options.projectId;
}

/**
 * Create HMAC signature for given user id
 * @param {string} uid
 * @returns {string}
 */
Pushpad.prototype.signatureFor = function (uid) {
  var hmac = crypto.createHmac('sha1', this.authToken);
  hmac.update(uid);
  return hmac.digest('hex');
};

/**
 * Get anonymous subscription URL
 * @returns {string}
 */
Pushpad.prototype.path = function () {
  return 'https://pushpad.xyz/projects/' + this.projectId + '/subscription/edit';
};

/**
 * Get subscription URL for given user id
 * @param uid
 * @returns {string}
 */
Pushpad.prototype.pathFor = function (uid) {
  return this.path() + '?uid=' + uid + '&uid_signature=' + this.signatureFor(uid);
};