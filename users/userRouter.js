const express = require("express");

const db = require("./userDb")
const postDb = require("../posts/postDb")

const router = express.Router();


router.post("/", validateUser, (req, res) => {
    const user = req.body;

    db.insert(user)
        .then(user => {
            res.status(201).json(user);
        })
        .catch(err => {
            res.status(500).json({
                error: "There was an error while saving the user to the database"
            });
        });
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
    const post = req.body;

    postDb.insert(post)
        .then(post => {
            res.status(201).json(post);
        })
        .catch(err => {
            res.status(500).json({
                error: "There was an error while saving the post to the database"
            });
        });
});

router.get('/', async(req, res) => {
    try {
        const users = await Users.get(req.query);
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error retrieving the users' })
    }
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    Users.getById(id)
        .then(user => {
            if (user) {
                res.status(200).json({ user });
            } else {
                res.status(404).json({ message: "Cannot find the user" });
            }
        })
        .catch(err => {
            res.status(500).json({ error: err, message: 'The user information could not be retrieved.' });
        });
})


router.get('/:id/posts', async(req, res) => {
    try {
        const posts = await Users.getUserPosts(req.params.id);

        res.status(200).json(posts);
    } catch (error) {
        // log error to server
        console.log(error);
        res.status(500).json({
            message: 'Error getting the posts for the user',
        });
    }
});

router.delete('/:id', async(req, res) => {
    try {
        const count = await Users.remove(req.params.id)
        if (count > 0) {
            res.status(200).json({ message: 'The user has been removed' })
        } else {
            res.status(404).json({ message: 'The user could not be found' })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error removing the user' })
    }
});

router.put('/:id', async(req, res) => {
    try {
        const user = await Users.update(req.params.id, req.body)
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'The user could not be found' })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error updating the user'
        })
    }
});

//custom middleware

function validateUserId(req, res, next) {

    const id = req.params.id;

    db.getById(id).then(user => {
        console.log(user);
        if (!user) {
            res.status(400).json({ message: "invalid user id" })
        } else {
            req.user = user;
            next();
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({ message: "user could not be retrieved" })
    })
};

function validateUser(req, res, next) {
    if (!req.body) {
        res.status(400).json({ message: "missing user data" })
    } else if (!req.body.name) {
        res.status(400).json({ message: "missing required name field" })
    } else {
        next();
    }
};

function validatePost(req, res, next) {
    if (!req.body) {
        res.status(400).json({ message: "missing post data" })
    } else if (!req.body.text) {
        res.status(400).json({ message: "missing required text field" })
    } else if (!req.body.user_id) {
        res.status(400).json({ message: "missing required user id field" })
    } else {
        next();
    }
};

module.exports = router;