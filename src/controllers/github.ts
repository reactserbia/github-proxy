import { RequestHandler } from 'express'

export const getGitHubAccessToken: RequestHandler = (req, res, next) => {
    const body = req.body
    console.log(body)

    res.status(200).json({ message: 'Hello from GitHub' })
}
