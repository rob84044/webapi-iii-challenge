const express = require('express');
const userRouter = require('./users/userRouter.js')
const server = express();


server.use(logger)
server.use(express.json)
server.use('/api/users/', userRouter)


server.get('/', (req, res) => {
    res.send(`<h2>Let's write some middleware!</h2>`)
});

//custom middleware

function logger(req, res, next) {
    const now = Date.now()
    console.log(req.method, req.originalUrl, now)
};

module.exports = server;