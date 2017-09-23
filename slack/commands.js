const players = require('../wot/players');
const config = require('../config');

module.exports = run;

let commands = {
  '_wotbot': {
    '_say': {
      args: 1,
      length: [Infinity],
      func: (str) => {
        return Promise.resolve(str);
      }
    }
  },
  '_player': {
    '_info': {
      args: 1,
      length: [1],
      func: players.playerInfoLink
    },
    '_search': {
      args: 1,
      length: [1],
      func: () => {
        return players.searchPlayerNames.then(names => {
          let truncatedNames = names.length > 10 ? names.slice(0, 10) : names;
          return truncatedNames.join('\n');
        });
      }
    },
    '_help': {
      args: 0,
      func: () => {
        return Promise.resolve("Use `info` for a single player or use `search` to search by name");
      }
    }
  }
};

/**
 * Run the given string command
 *
 * @param inputStr {String}
 * @returns {Promise.<String>}
 */
function run (inputStr) {
  let input = inputStr.split(' ');
  if (config.nodeEnv === 'local' && input[0].toLowerCase() === 'local') {
    return process(input.slice(1), commands, {});
  }
  else {
    return process(input, commands, {});
  }
}

/**
 * Process the current input and args for the given commands tree
 *
 * @param input {Array}
 * @param cmdTree {Object}
 * @param args {Object}
 * @returns {Promise.<String>}
 */
function process (input, cmdTree, args) {
  if (cmdTree) {
    if (cmdTree.args) {
      let next = input.slice(0, cmdTree.length[0]); //TODO abstract over # of args and length of length
      if (cmdTree.func) {
        return cmdTree.func(next.join(' '));
      }
    }
    
    else {
      let next = input[0].toLowerCase();
      if (next) {
        return process(input.slice(1), cmdTree['_' + next], args);
      }
    }
  }
}