import { Router } from 'express'

import {
    getLoggedInUser,
    getUserByUsername
} from '../controllers/testing-github'

const router = Router()

router.get('/user', getLoggedInUser)
router.get('/users/:username', getUserByUsername)

export default router
