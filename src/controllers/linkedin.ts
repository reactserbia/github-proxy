import { RequestHandler } from 'express'
import axios from 'axios'

export const getLinkedInAccessToken: RequestHandler = (req, res, next) => {
    const { code } = req.body

    axios
        .post(
            'https://www.linkedin.com/oauth/v2/accessToken',
            {
                grant_type: 'authorization_code',
                code,
                client_id: process.env.LINKEDIN_CLIENT_ID,
                client_secret: process.env.LINKEDIN_CLIENT_SECRET,
                redirect_uri: 'http://localhost:5173/app/login/linkedin'
            },
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
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

export const getLinkedInProfileData: RequestHandler = (req, res, next) => {
    const accessToken = req.headers.authorization

    axios
        .get('https://api.linkedin.com/v2/userinfo', {
            headers: {
                Authorization: accessToken
            }
        })
        .then(response => {
            res.status(200).json({ response: response.data })
        })
        .catch(err => {
            next(err)
        })
}
