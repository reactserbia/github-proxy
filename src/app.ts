import express, { json, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import 'dotenv/config'

import githubRoutes from './routes/github'

const app = express()

app.use(cors())

app.use(json())

app.use('/github', githubRoutes)

app.use((err: Error, _: Request, res: Response, _2: NextFunction) => {
    res.status(500).json({ message: err.message })
})

app.listen(3000, () => console.log('Server is running'))
