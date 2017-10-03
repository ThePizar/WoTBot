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
    },
    '_help': {
      args: 0,
      func: () => {
        return Promise.resolve("Use `wotbot say` to make WoTBot talk back to you or use `player info` or `player search` to search about for players");
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
      func: (input) => {
        return players.searchPlayerNames(input).then(names => {
          if (name.length === 0) {
            return "No players found";
          }
          let truncatedNames = names.length > 10 ? names.slice(0, 10) : names;
          return truncatedNames.join('\n');
        }).catch(err => {
          console.log(err);
          return "Error occurred during searching";
        });
      }
    },
    '_help': {
      args: 0,
      func: () => {
        return Promise.resolve("Use `info` for a single player or use `search` to search by name");
      }
    },
    '_check' : {
      args: 1,
      length: [1],
      func: (input) => {
        return players.checkTanks(input).then(tanks => {
          if (tanks.length === 0) {
            return "Has none of the tanks";
          }
          return tanks.map(tank => tank.name).join(', ')
        }).catch(err => {
          console.log(err);
          return "Error occurred during checking";
        });
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
  if (config.nodeEnv === 'local' && input[0]) {
    if (input[0].toLowerCase() === 'local') {
      return process(input.slice(1), commands, {});
    }
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
    if (cmdTree.args !== undefined) {
      let len = cmdTree.length ? cmdTree.length[0] : 0;
      let next = input.slice(0, len); //TODO abstract over # of args and length of length
      if (cmdTree.func) {
        console.log(args.last, next.join(' '));
        return cmdTree.func(next.join(' '));
      }
    }
    
    else {
      let next = input[0];
      if (next && typeof next === 'string') {
        next = next.toLowerCase();
        args.last = next;
        return process(input.slice(1), cmdTree['_' + next], args);
      }
    }
  }
}