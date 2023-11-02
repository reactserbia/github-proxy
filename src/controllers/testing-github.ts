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

export const getRepository: RequestHandler = (req, res, next) => {
    const { owner, repo } = req.params

    octokit
        .request(`GET /repos/${owner}/${repo}`)
        .then(response => {
            console.log(response)
            res.status(200).json({ data: response.data })
        })
        .catch(err => {
            console.log(err)
            next(err)
        })
}

export const forkRepository: RequestHandler = (req, res, next) => {
    const { owner, repo } = req.params

    octokit
        .request(`POST /repos/${owner}/${repo}/forks`)
        .then(response => {
            console.log(response)
            res.status(200).json({ data: response.data })
        })
        .catch(err => {
            console.log(err)
            next(err)
        })
}
