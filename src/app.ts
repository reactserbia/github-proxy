import express from 'express'

import githubRoutes from './routes/github'

const app = express()

app.use(express.json())

app.use('/github', githubRoutes)

app.listen(3000, () => console.log('Server is running'))
