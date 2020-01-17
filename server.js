const express = require('express');
const cors = require('cors');
const server = express();
const helmet = require('helmet');

const projectRouter = require('./projects/projectRouter');
// const actionRouter = require('./action/actionRouter');

server.use(express.json());
server.use(cors());
server.use(logger);

server.get('/', (req, res) => {
    res.send(`<h2>Sprint endpoint / is accessible.</h2>`)
})

server.use('/api/projects', projectRouter);
// server.use('/api/actions', actionRouter);


function logger(req, res, next) {
    const { method, originalUrl } = req;
    console.log(`${method} to ${originalUrl} at ${Date.now()}`);
  
    next();
    }
  
module.exports = server;
  