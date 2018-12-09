//@ts-check
'use strict'

const http = require('http');
const app = require('./app');

const port = 8082; // need a port that is opened on Azure

const server = http.createServer(app);
server.listen(port);
