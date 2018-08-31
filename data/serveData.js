#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const http = require('http');

const server = http.createServer();

server.on('request', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  const filePath = path.resolve(__dirname, 'data.json');
  const stream = fs.createReadStream(filePath);
  stream.on('end', () => res.end());
  stream.pipe(res);
});

server.listen(5005, () => console.info('localhost:5005'));
