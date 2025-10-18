import express from 'express'
import prisma from './lib/prisma'
import cors from 'cors'

const app = express()

app.use(cors())

app.get('/feed', async (_req, res) => {
  const languages = await prisma.chapter.groupBy({
    by: ['language'],
    _count: {
      language: true,
    },
    orderBy: {
      _count: {
        language: 'desc',
      },
    },
  });

  res.json(languages)
})

app.get('/feed/:language', async (req, res) => {
  const chapters = await prisma.chapter.findMany({
    where: {
      language: req.params.language,
    },
    orderBy: {
      release_date: 'desc',
    },
  })

  res.json(chapters)
})

app.get('/:id', async (req, res) => {
  const chapter = await prisma.chapter.findUnique({
    where: {
      id: req.params.id,
    },
  })

  res.json(chapter)
})

app.listen(3000, () => console.log("Server Running in http://localhost:3000/"))
