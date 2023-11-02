import { RequestHandler } from 'express'

import { octokit } from '../api'

export const getLoggedInUser: RequestHandler = (_, res, next) => {
    octokit
        .request('GET /user')
        .then(response => {
            res.status(200).json({ data: response.data })
        })
        .catch(err => {
            next(err)
        })
}

export const getUserByUsername: RequestHandler = (req, res, next) => {
    const { username } = req.params

    console.log(username)

    octokit
        .request(`GET /users/${username}`)
        .then(response => {
            console.log(response)
            res.status(200).json({ data: response.data })
        })
        .catch(err => {
            console.log(err)
            next(err)
        })
}
