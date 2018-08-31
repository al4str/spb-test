#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const http = require('http');
const util = require('util');

const { promisify } = util;
const readFile = promisify(fs.readFile);
const server = http.createServer();

server.on('request', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  const filePath = path.resolve(__dirname, 'data.json');
  const data = await readFile(filePath, 'utf-8');
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(data);
});

server.listen(5005, () => console.info('localhost:5005'));
