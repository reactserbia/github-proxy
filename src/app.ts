import express, { Request, Response, NextFunction } from 'express'

import githubRoutes from './routes/github'

const app = express()

app.use(express.json())

app.use('/github', githubRoutes)

app.use((err: Error, _: Request, res: Response, _2: NextFunction) => {
    res.status(500).json({ message: err.message })
})

app.listen(3000, () => console.log('Server is running'))
