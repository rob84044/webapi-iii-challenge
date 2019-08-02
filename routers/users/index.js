    //Assigns router to the value of the expressJS router method 
    const router = require('express').Router()
        //This takes all routes from the posts/index file and assigns them to postsRouter
    const postsRouter = require('../posts')
        //This assigns all database functions to the db variable
    const db = require('../../users/userDb')
        //This line is importing the validateUser and validateUserId from the middleware file 
    const { validateUserId, validateUser } = require('../../middleware')
        //This line forces all API calls that would go through the postsRouter to use the validateUserId function that was imported above
    router.use('/:id/posts', validateUserId, postsRouter)
        //This is the get at the base url after the /api/users 
        //Async allows us to use the try/catch and allows us to use the await functionality
    router.get('/', async(req, res) => {
            //Initializes the try in the try/catch setup
            try {
                //Sets users variable to the db.get function in the userDb file
                //await is used to stop the progress of the app until the db.get value is assigned to the users variable 
                const users = await db.get()
                    //This line sends the response of a HTTP header of 200. It then sends back the users data in a json format
                res.status(200).json({
                        users
                    })
                    //This starts the catch and allows the passed in error (if there is one) to be used
            } catch (error) {
                //This line sends the response of a HTTP header of 500. It then sends back the passed in error in a json format
                res.status(500).json({
                    error: `An error occurred while attempting to get users`
                })
            }
        })
        //This is the get request of the individual user object
        //This uses the middleware function validateUserId 
    router.get('/:id', validateUserId, (req, res) => {
            //This pulls out the user object off of the req object 
            const { user } = req
            //This line returns an HTTP status of 200 and the user object in a json object
            res.status(200).json(user)
        })
        //This block of code adds to the existing database of values, uses the validateUser middleware function, and Initializes this function as an async function
    router.post('/', validateUser, async(req, res) => {
            //Initializes the try in the try/catch setup
            try {
                //Destructuring the name value from req.body
                const { name } = req.body
                    //After the destructured name object has been inserted into the database, it is assigned to the user object 
                const user = await db.insert({ name })
                    //Return an HTTP status of 201, and the user object in a json format 
                res.status(201).json(user)
                    //This starts the catch and allows the passed in error (if there is one) to be used
            } catch (error) {
                res.status(500).json({
                    error: `An error occurred while attempting to create a new user`
                })
            }
        })
        //This block of code removes a value from the existing database of values, uses the validateUserId middleware function, and Initializes this function as an async function
    router.delete('/:id', validateUserId, async(req, res) => {
            //Initializes the try in the try/catch setup
            try {
                //Destructuring the id value from req.user
                const { id } = req.user
                    //This removes the destructured id from the database
                await db.remove(id)
                    //This then returns an HTTP status of 204 and ends the api call
                res.status(204).end()
                    //This starts the catch and allows the passed in error (if there is one) to be used
            } catch (error) {
                res.status(500).json({
                    error: `An error occurred while attempting to delete user`
                })
            }
        })
        //This block of code updates a value from the existing database of values, uses the validateUserId and the validateUser middleware functions, and Initializes this function as an async function
    router.put('/:id', validateUserId, validateUser, async(req, res) => {
            //Initializes the try in the try/catch setup
            try {
                //Destructuring the id value from req.user
                const { id } = req.user
                    //Destructuring the name value from req.body
                const { name } = req.body
                    //This line performs an update method, which takes in two arguments, the id variable and the name object
                await db.update(id, { name })
                    //After the above action has been completed this line returns an HTTP status of 204, and then ends the API call
                res.status(204).end()
            } catch (error) {
                //This starts the catch and allows the passed in error (if there is one) to be used
                res.status(500).json({
                    error: `An error occurred while attempting to update user`
                })
            }
        })
        //This line exports router, which is assigned to the expressJS framework's Router method
    module.exports = router