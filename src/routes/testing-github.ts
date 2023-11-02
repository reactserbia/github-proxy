import { Router } from 'express'

import { getGitHubUserProfile } from '../controllers/testing-github'

const router = Router()

router.get('/user', getGitHubUserProfile)

export default router
