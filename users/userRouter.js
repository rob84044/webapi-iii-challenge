const express = require('express');
const Users = require('./userDb.js')
const Posts = require('../posts/postRouter.js');

const router = express.Router();

router.post('/', async(req, res) => {
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

const validateUserId = async(req, res, next) => {

    try {
        const userId = req.params.id
        const user = await db.getById(userId)
        if (!user) {
            return res.status(400).json({
                message: `Invalid user id`
            })
        } else {
            req['user'] = user
            next()
        }
    } catch (error) {
        res.status(500).json({
            error: `An error occurred while attempting to lookup the user`
        })
    }
}

function validateUser(req, res, next) {
    if (!req.body) {
        res.status(400).json({ message: "missing user data" });
    } else
    if (!req.body.name) {
        res.status(400).json({ message: "missing required name field" });
    } else {
        next()
    }
}

function validatePost(req, res, next) {

};

module.exports = router;