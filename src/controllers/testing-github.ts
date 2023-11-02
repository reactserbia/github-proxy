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

    octokit
        .request(`GET /users/${username}`)
        .then(response => {
            res.status(200).json({ data: response.data })
        })
        .catch(err => {
            next(err)
        })
}

export const getRepository: RequestHandler = (req, res, next) => {
    const { owner, repo } = req.params

    octokit
        .request(`GET /repos/${owner}/${repo}`)
        .then(response => {
            res.status(200).json({ data: response.data })
        })
        .catch(err => {
            next(err)
        })
}

export const forkRepository: RequestHandler = (req, res, next) => {
    const { owner, repo } = req.params

    octokit
        .request(`POST /repos/${owner}/${repo}/forks`)
        .then(response => {
            res.status(200).json({ data: response.data })
        })
        .catch(err => {
            next(err)
        })
}

export const deleteFilesInRepository: RequestHandler = (req, res, next) => {
    const { owner, repo } = req.params

    octokit
        .request(`GET /repos/${owner}/${repo}/contents`)
        .then(({ data }) => {
            if (Array.isArray(data)) {
                data.forEach(file => {
                    octokit.repos
                        .deleteFile({
                            owner,
                            repo,
                            path: file.path,
                            message: 'delete file',
                            sha: file.sha
                        })
                        .catch(err => console.error(err))
                })
            }
        })
        .then(() => {
            res.status(200).json({ data: 'Data deleted.' })
        })
        .catch(err => {
            next(err)
        })
}
