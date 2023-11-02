import express, { json, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import 'dotenv/config'

import githubRoutes from './routes/github'
import linkedinRoutes from './routes/linkedin'
import aiRoutes from './routes/openai'
import testingGitHub from './routes/testing-github'

const app = express()

app.use(cors())

app.use(json())

app.use('/github', githubRoutes)
app.use('/linkedin', linkedinRoutes)
app.use('/ai', aiRoutes)
app.use('/testing-github', testingGitHub)

app.use((_, res) => res.status(404).json({ message: 'Invalid Request' }))

app.use((err: Error, _: Request, res: Response, _2: NextFunction) => {
    res.status(500).json({ message: err.message })
})

app.listen(3000, () => console.log('Server is running'))
