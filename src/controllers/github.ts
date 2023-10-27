import { RequestHandler } from 'express'

export const getGitHubAccessToken: RequestHandler = (req, res, next) => {
    res.status(200).json({ message: 'Hello from GitHub' })
}
