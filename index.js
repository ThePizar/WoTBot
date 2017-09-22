const WebSocket = require('ws');
const axios = require('axios');
const qs = require('qs');

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
      //console.log(data);
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
          let params = {
            application_id: wg,
            type: 'exact',
            search: playerName
          };
          axios.get(`https://api.worldoftanks.com/wot/account/list/?application_id=${wg}&type=exact&search=${playerName}`).then(res => {
            console.dir(res.data);
            let player = res.data.data[0];
            let text = 'Player not found';
            if (player) {
              text = 'https://clantools.us/servers/na/players?id=' + player.account_id;
            }
            let slack = {
              id: id++,
              type: 'message',
              channel: channel,
              text: text
            };
            socket.send(JSON.stringify(slack));
          });
        }
        //https://api.worldoftanks.com/wot/account/list/?application_id=25197ff770476528cf3f98c4715287bf&type=exact&search=Pizar
      }
    });
  }
  else {
    console.log('error');
  }
});