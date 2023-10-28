import { Router } from 'express'

import { getLinkedInAccessToken } from '../controllers/linkedin'

const router = Router()

router.post('/get-access-token', getLinkedInAccessToken)

export default router
