//This line allows us to take this router and merges all routers params with this routers params. This allows it to become a subRoute of an existing route. https://cedric.tech/blog/expressjs-accessing-req-params-from-child-routers/
const router = require('express').Router({ mergeParams: true })
    //This line imports the db functionality from the userDb and assigns it to the userDb variable
const userDb = require('../../users/userDb')
    //This line imports the db functionality from the postDb and assigns it to the postDb variable
const postDb = require('../../posts/postDb')
    //This line is importing the validateUser and validateUserId from the middleware file 
const { validatePost } = require('../../middleware')
    //This is the get at the base url after the /api/users/:id/posts 
    //Async allows us to use the try/catch and allows us to use the await functionality
router.get('/', async(req, res) => {
        //Initializes the try in the try/catch setup
        try {
            //Destructuring the id value from req.user
            const { id } = req.user
                //The destructured id value is passed into the function getUserPosts that is obtained from the userDb file. After that action has completed, that users posts are then assigned to the posts variable. 
            const posts = await userDb.getUserPosts(id)
                //After the above action completes, send an HTTP status of 200 back to the client and then send the users posts as a JSON object
            res.status(200).json({
                    posts
                })
                // This starts the catch and allows the passed in error(if there is one) to be used
        } catch (error) {
            res.status(500).json({
                error: `An error occurred while attempting to get the user's posts`
            })
        }
    })
    //This is the post at the base url after the /api/users/:id/posts 
    //Async allows us to use the try/catch and allows us to use the await functionality
    //Uses the validatePost middleware function
router.post('/', validatePost, async(req, res) => {
    //Initializes the try in the try/catch setup
    try {
        //Destructuring the text value from req.body
        const { text } = req.body
            //Destructuring the id value from req.user
        const { id } = req.user
            //Takes the two above destructured values and uses the postDbs function of insert to pass the two values in and assigns that result to post. Once it finishes the code moves on
        const post = await postDb.insert({ text, user_id: id })
            //After the above line completes, send an HTTP status of 201, and send the inserted object back as a JSON object
        res.status(201).json(post)
            // This starts the catch and allows the passed in error(if there is one) to be used
    } catch (error) {
        res.status(500).json({
            error: `An error occurred while attempting to create new post`
        })
    }
})

module.exports = router