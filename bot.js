require('dotenv').config();

const line = require('@line/bot-sdk');
const express = require('express');
//const fetch = require('node-fetch');
const axios = require('axios');

// create LINE SDK config from env variables
const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET,
};

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', line.middleware(config), (req, res) => {
  Promise
  .all(req.body.events.map(handleEvent))
  .then((result) => res.json(result))
  .catch((err) => {
    console.error(err);
    res.status(500).end();
  });
});

// event handler
async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  const message = event.message.text;
  console.log(message);

  //translation API
  const item = encodeURIComponent(event.message.text);
  const contents = await axios.get(`http://script.google.com/macros/s/AKfycbweJFfBqKUs5gGNnkV2xwTZtZPptI6ebEhcCU2_JvOmHwM2TCk/exec?text=${item}&source=ja&target=en`).catch(e => console.error(e));0;
  

  let params = new URLSearchParams();
  params.append("apikey", process.env.API_KEY_REPLY);
  params.append("query", message);

  const contents2 = await axios.post('https://api.a3rt.recruit-tech.co.jp/talk/v1/smalltalk', params).catch(e => console.error(e));;
  console.log(contents2.data.results[0].reply);

  //const item = encodeURIComponent(event.message.text);

  // fetch(`http://script.google.com/macros/s/AKfycbweJFfBqKUs5gGNnkV2xwTZtZPptI6ebEhcCU2_JvOmHwM2TCk/exec?text=${item}&source=ja&target=en`)
  // .then(response => response.text())
  // .then(data => {
  //   console.log(data) // Prints result from `response.json()` in getRequest
  //   const echo = { type: 'text', text: data };
  //   return client.replyMessage(event.replyToken, echo);
  // })
  // .catch(error => console.error(error))

  // create a echoing text message
  //const echo = { type: 'text', text: message };

  // create a echoing text message by using translation API
  const echo = { type: 'text', text: contents2.data.results[0].reply };

  // use reply API
  client.replyMessage(event.replyToken, echo);

  const contents3 = await axios.get(`https://chatbot-api.userlocal.jp/api/chat?message=${encodeURIComponent(contents2.data.results[0].reply)}&key=${process.env.API_KEY_REPLY2}`).catch(e => console.error(e));
  console.log(contents3.data.result);
  const echo2 = { type: 'text', text: contents2.data.result[0].reply};

  client.replyMessage(event.replyToken, echo2);

}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});