const WebSocket = require('ws');
const axios = require('axios');
const qs = require('qs');
const players = require('./wot/players');

let key = process.env.TT_KEY;
let wg = process.env.WG_KEY;

axios.post('https://slack.com/api/rtm.connect', qs.stringify({token: key})).then(res =>{
  let body = res.data;
  let dest = body.url;
  if (dest) {
    let socket = new WebSocket(dest);
    
    let id = 1;
    
    socket.on('message', (json) => {
      let data = JSON.parse(json);
      if (data.type === 'message') {
        let text = data.text || '';
        let say = 'wotbot say';
        let channel = data.channel;
        if (text.startsWith(say)) {
          let ans = text.slice(say.length + 1);
          let res = {
            id: id++,
            type: 'message',
            channel: channel,
            text: ans
          };
          socket.send(JSON.stringify(res));
        }
  
        let info = 'player info';
        if (text.startsWith(info)) {
          let playerName = text.slice(info.length + 1);
          players.playerInfoLink(playerName).then(link => {
            let slack = {
              id: id++,
              type: 'message',
              channel: channel,
              text: link
            };
            socket.send(JSON.stringify(slack));
          }, err => {
            console.log(err);
            let slack = {
              id: id++,
              type: 'message',
              channel: channel,
              text: 'Error: Could not get info on ' + playerName
            };
            socket.send(JSON.stringify(slack));
          });
        }
  
        let search = 'player search';
        if (text.startsWith(search)) {
          let playerName = text.slice(search.length + 1);
          console.log(playerName);
          players.searchPlayerNames(playerName).then(names => {
            console.log(names.length);
            let truncatedNames = names.length > 10 ? names.slice(0, 10) : names;
            let text = truncatedNames.join('\n');
            let slack = {
              id: id++,
              type: 'message',
              channel: channel,
              text: text
            };
            socket.send(JSON.stringify(slack));
          }, err => {
            console.log(err);
            let slack = {
              id: id++,
              type: 'message',
              channel: channel,
              text: 'Error: Could not search for ' + playerName
            };
            socket.send(JSON.stringify(slack));
          });
        }
      }
    });
  }
  else {
    console.log('error');
  }
});