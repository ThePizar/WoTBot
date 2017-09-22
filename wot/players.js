const axios = require('axios');
const config = require('../config');
const Cache = require('../utils/cache');
const playerCache = new Cache();

const SEARCH_URL = 'https://api.worldoftanks.com/wot/account/list/';
const CT_PLAYER_URL = 'https://clantools.us/servers/na/players';

module.exports = {
  playerInfoLink,
  searchPlayerNames,
  searchPlayers,
  clantoolsOf
};

/**
 * Get the an information link for the given player
 *
 * @param name
 * @returns {Promise<String>}
 */
function playerInfoLink (name) {
  return searchPlayers(name, {exact: true}).then(player => {
    if (player) {
      return clantoolsOf(player.account_id);
    }
    else {
      return 'Could not find player ' + name;
    }
  })
}

/**
 * Get the list of player names that start with the given term
 *
 * @param searchTerm {String} the name to search by
 * @param opts {Object} the options
 * @param opts.server {String} the server for the search
 * @returns {Promise<String[]>}
 */
function searchPlayerNames (searchTerm, opts = {}) {
  opts.exact = false;
  return searchPlayers(searchTerm, opts).then(players => {
    return players.map(player => {
      return player.nickname;
    })
  })
}

/**
 * Search among players for the given search term
 *
 * @param searchTerm {String} The term to search by
 * @param opts {Object} The options for the search
 * @param opts.exact {Boolean} Whether to search exactly or more generally
 * @param opts.server {String} The server to search
 * @returns {Promise<Object|Array>}
 */
function searchPlayers (searchTerm, opts = {}) {
  let exact = opts.exact;
  let server = opts.server || 'na';
  
  //Check cache if looking for exact player
  if (exact) {
    let player = playerCache.get(searchTerm);
    if (player) {
      return Promise.resolve(player);
    }
  }
  
  let exactParam = exact ? '&type=exact' : '';
  let url = SEARCH_URL + `?application_id=${config.wgAppId}${exactParam}&search=${searchTerm}`;
  return axios.get(url).then(res => {
    let body = res.data;
    if (body.status === 'ok') { //WTF WG
      let data = body.data;
      if (exact) {
        let player = data[0];
        //Add to cache if exact player
        playerCache.add(searchTerm, player);
        return player || null;
      }
      else {
        return data;
      }
    }
    else {
      console.log('status is', body.status);
      return Promise.reject('Error getting players')
    }
  }, err => {
    console.log(err);
    return Promise.reject('Call to WG failed')
  })
}

/**
 * The clantools link for the given player
 *
 * @param playerId the WGID fo the player
 * @returns {String}
 */
function clantoolsOf (playerId) {
  return CT_PLAYER_URL + `?id=${playerId}`;
}