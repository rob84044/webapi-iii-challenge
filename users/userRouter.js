const express = require("express");

const db = require("./userDb")
const postDb = require("../posts/postDb")

const router = express.Router();


router.post('/', this.validateUser, async(req, res) => {
    try {
        const user = await Users.insert(req.body)
        res.status(201).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error retrieving the users' })
    }
});

router.post('/:id/posts', async(req, res) => {
    const postInfo = { text: req.body.text, user_id: req.params.id }
    try {
        const post = await Posts.insert(postInfo);
        res.status(201).json(post)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error getting the posts for the user'
        })
    }
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

const validateUser = (req, res, next) => {
    const { body } = req
    if (Object.keys(body).length === 0) {
        return res.status(400).json({
            message: `Missing user data`
        })
    }
    const { name } = body
    if (!name) {
        return res.status(400).json({
            message: `Missing required field: name`
        })
    }
    next()
}

const validatePost = (req, res, next) => {
    const { body } = req
    if (Object.keys(body).length === 0) {
        return res.status(400).json({
            message: `Missing post data`
        })
    }
    const { text } = body
    if (!text) {
        return res.status(400).json({
            message: `Missing required field: text`
        })
    }
    next()
}

module.exports = router;