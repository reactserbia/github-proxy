import { Router } from 'express'

import { promptAI } from '../controllers/openai'

const router = Router()

router.get('/prompt', promptAI)

export default router
