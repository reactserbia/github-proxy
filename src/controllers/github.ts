import { RequestHandler } from 'express'
import axios from 'axios'

export const getGitHubAccessToken: RequestHandler = (req, res, next) => {
    const { code } = req.body

    axios
        .post(
            'https://github.com/login/oauth/access_token',
            {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code
            },
            {
                headers: {
                    Accept: 'application/json'
                }
            }
        )
        .then(response => {
            res.status(200).json({ response: response.data })
        })
        .catch(err => {
            next(err)
        })
}
