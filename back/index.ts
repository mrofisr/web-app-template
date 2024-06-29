import express from 'express'
import cors from 'cors'
import type { Request, Response } from 'express'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (_req: Request, res: Response) => res.send('i am express'))
app.get('/api/hello', (_req: Request, res: Response) =>
  res.json({ message: 'hello' }),
)

app.listen(8080, () => {
  console.info(`🚀 express http server started at http://localhost:${8080}`)
})
