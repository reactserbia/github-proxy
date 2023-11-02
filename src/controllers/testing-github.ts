import { RequestHandler } from 'express'

import { octokit } from '../api'

export const getGitHubUserProfile: RequestHandler = (_, res, next) => {
    octokit
        .request('GET /user')
        .then(response => {
            res.status(200).json({ data: response })
        })
        .catch(err => {
            next(err)
        })
}
