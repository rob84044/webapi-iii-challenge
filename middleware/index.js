const db = require('../users/userDb')

const logger = (req, res, next) => {
    const timestamp = new Date().toTimeString()
    const { method, url } = req
    console.log(`${method} ${url} -- ${timestamp}`)
    next()
}

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

module.exports = {
    logger,
    validateUserId,
    validateUser,
    validatePost,
}