//This is importing server and reassigning it to the server variable
const server = require('./server')
    //This line creates the PORT variable and assigns it the port value in the .env file and if there isn't any assigned value then it will use the port 5000
const PORT = process.env.PORT || 5000
    //This line sets the server to use the assigned PORT variable
server.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`)
})