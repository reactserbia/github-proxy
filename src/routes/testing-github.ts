import { Router } from 'express'

import {
    getLoggedInUser,
    getUserByUsername,
    getRepository
} from '../controllers/testing-github'

const router = Router()

router.get('/user', getLoggedInUser)
router.get('/users/:username', getUserByUsername)
router.get('/repos/:owner/:repo', getRepository)

export default router
