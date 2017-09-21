const WebSocket = require('ws');
const axios = require('axios');
const qs = require('qs');

let key = process.env.TT_KEY;

axios.post('https://slack.com/api/auth.test', qs.stringify({token: key})).then(res =>{
  let data = res.data;
  let dest = data.url;
  console.dir(data);
  if (dest) {
    let socket = new WebSocket(dest);
  
    socket.on('message', (data) => {
      console.log(data.message);
    });
  }
  else {
    console.log('error');
  }
});