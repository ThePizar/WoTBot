const pkg_json = require('./package.json');

module.exports = {
  version: pkg_json.version,
  slackToken: process.env.TT_KEY,
  wgAppId: process.env.WG_KEY,
  nodeEnv: process.env.NODE_ENV
};