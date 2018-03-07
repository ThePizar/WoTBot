const WebSocket = require('ws');
const axios = require('axios');
const qs = require('qs');
const config = require('./config');
const parser = require('./slack/commands');
const players = require('./wot/players');

console.log('Version: ', config.version);
if (config.slackToken) {
  console.log(config.slackToken.slice(0, 4))
}
else {
  console.log('No token?!?!?!?!?!')
}

axios.post('https://slack.com/api/rtm.connect', qs.stringify({token: config.slackToken})).then(res =>{
  let body = res.data;
  let dest = body.url;
  if (dest) {
    let socket = new WebSocket(dest);
    
    let id = 1;
    
    socket.on('message', (json) => {
      let data = JSON.parse(json);
      let channel = data.channel;
      if (data.type === 'message') {
        let text = data.text || '';
        try {
          let promise = parser(text);
          if (promise) {
            promise.then(ans => {
              let res = {
                id: id++,
                type: 'message',
                channel: channel,
                text: ans
              };
              socket.send(JSON.stringify(res));
            })
          }
        }
        catch (err) {
          console.log(err)
        }
      }
    });
  }
  else {
    console.log('No destination');
    console.log(body)
  }
});