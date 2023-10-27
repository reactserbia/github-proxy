import { Router } from 'express'

import { getGitHubAccessToken } from '../controllers/github'

const router = Router()

router.post('/get-access-token', getGitHubAccessToken)

export default router
