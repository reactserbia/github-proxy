import { Router } from 'express'

import {
    getLoggedInUser,
    getUserByUsername,
    getRepository,
    forkRepository,
    deleteFilesInRepository
} from '../controllers/testing-github'

const router = Router()

router.get('/user', getLoggedInUser)
router.get('/users/:username', getUserByUsername)
router.get('/repos/:owner/:repo', getRepository)
router.post('/repos/:owner/:repo/forks', forkRepository)
router.delete('/repos/:owner/:repo/contents', deleteFilesInRepository)

export default router
