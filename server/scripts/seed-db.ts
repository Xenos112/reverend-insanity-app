import prisma from '../lib/prisma'
import chapter from '../manhua/chapter1_images.json'


const chaptersUris = chapter.map(chapter => chapter.replace('?ssl=1', ""))

await prisma.chapter.create({
  data: {
    language: "English",
    number: 1,
    release_date: new Date(),
    uri: chaptersUris
  }
})
