//This invokes the express framework
const express = require('express')
    //This assigns the routes in the users file in the routers folder to the variable usersRouter
const usersRouter = require('./routers/users')
    //This line pulls the logger function from the middleware folder
const { logger } = require('./middleware')
    //This sets the variable of server to the express framework
const server = express()
    //This line forces all api calls to parse incoming requests with JSON payloads and is based on body-parser (https://expressjs.com/en/resources/middleware/body-parser.html). https://expressjs.com/en/api.html#express.json
server.use(express.json())
    //This line forces all API calls to use the middleware function "logger"
server.use(logger)
    //This line tells the server that all routes in the routers/users will be AFTER the users switch 
server.use('/api/users', usersRouter)
    //This line tells the server what is the landing page 
server.get('/', (req, res) => {
        res.send(`<h2>Let's write some middleware!</h2>`)
    })
    //This line exports server, which is assigned to the expressJS framework
module.exports = server