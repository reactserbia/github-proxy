import { Router } from 'express'

import { getGitHubAccessToken } from '../controllers/github'

const router = Router()

router.get('/get-access-token', getGitHubAccessToken)

export default router
