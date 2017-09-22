const players = require('../wot/players');

let commands = {
  'wotbot': {
    'say': {
      args: 1,
      length: [Infinity],
      func: (string) => {
        return string;
      }
    }
  },
  'player': {
    'info': {
      func: players.playerInfoLink
    },
    'search': {
      args: 1,
      length: [1],
      func: players.searchPlayerNames
    }
  }
};
