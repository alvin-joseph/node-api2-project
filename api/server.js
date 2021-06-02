// implement your server here
const express = require('express');

const server = express();

// require your posts router and connect it here
const postRouter = require('./posts/posts-router');

server.use(express.json());

server.use('/api/posts', postRouter);

server.get('/', (req, res) => {
    res.send(`
      <h2>Lambda Posts API</h>
      <p>Welcome to the Lambda Posts API</p>
    `);
  });
  
  module.exports = server;
