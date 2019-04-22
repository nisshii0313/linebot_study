'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const axios = require('axios');
require('dotenv').config();

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

  const item = encodeURIComponent(event.message.text);
  const contents = await axios.get(`http://script.google.com/macros/s/AKfycbweJFfBqKUs5gGNnkV2xwTZtZPptI6ebEhcCU2_JvOmHwM2TCk/exec?text=${item}&source=ja&target=en`);
  console.log(contents.data);
  // create a echoing text message
  const echo = { type: 'text', text: contents.data };

  // use reply API
  return client.replyMessage(event.replyToken, echo);
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`listening on ${port}`);
});