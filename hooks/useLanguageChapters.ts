import { useQuery } from "@tanstack/react-query";
import ky from 'ky'

// FIX: get this from the server
type Chapter = {
  id: string,
  number: number
  release_date: Date
  title?: string
}

export default function useLanguageChapters(lang: string) {
  return useQuery({
    queryKey: ['languageChapters', lang],
    queryFn: async () => {
      const res = await ky.get(`${process.env.EXPO_PUBLIC_API_URL!}/feed/${lang}`)
      const chapters = await res.json<Chapter[]>()
      console.log(chapters)

      return chapters
    },
  })
}
