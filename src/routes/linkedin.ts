import { Router } from 'express'

import {
    getLinkedInAccessToken,
    getLinkedInProfileData
} from '../controllers/linkedin'

const router = Router()

router.post('/get-access-token', getLinkedInAccessToken)
router.get('/get-user-data', getLinkedInProfileData)

export default router
