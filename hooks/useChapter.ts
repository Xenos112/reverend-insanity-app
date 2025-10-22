import { useQuery } from "@tanstack/react-query";
import ky from 'ky'

// FIX: get this from the server
type Chapter = {
  id: string,
  number: number
  release_date: Date
  uri: string[]
}

export default function useChapter(chapterId: string) {
  return useQuery({
    queryKey: ['chapter', chapterId],
    queryFn: async () => {
      const res = await ky.get(`${process.env.EXPO_PUBLIC_API_URL!}/${chapterId}`)
      const chapter = await res.json<Chapter>()

      return chapter
    },

  })
}
