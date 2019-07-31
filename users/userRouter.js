const express = require('express');
const Users = require('./userDb.js')
const router = express.Router();

router.post('/', async(req, res) => {
    try {
        const user = await Users.add(req.query)
        res.status(201).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error retrieving the users' })
    }
});

router.post('/:id/posts', async(req, res) => {
    const postInfo = {...req.body, user_id: req.params.id }
    try {
        const post = await Messages.add(postInfo);
        res.status(210).json(post)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error getting the posts for the user'
        })
    }
});

router.get('/', async(req, res) => {
    try {
        const users = await Users.find(req.query);
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error retrieving the users' })
    }
});

router.get('/:id', (req, res) => {
    res.status(200).json(req.hub)
});

router.get('/:id/posts', (req, res) => {

});

router.delete('/:id', (req, res) => {

});

router.put('/:id', (req, res) => {

});

//custom middleware

function validateUserId(req, res, next) {

};

function validateUser(req, res, next) {

};

function validatePost(req, res, next) {

};

module.exports = router;