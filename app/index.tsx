import Displayer from '@/components/displayer';
import { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';

export default function IndexPage() {
  const [chapter, setChapter] = useState<any>({})

  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch("http://10.18.229.244:3000/407a9c14-d636-4e13-844f-c43e646de208")
        .then(res => res.json())
      setChapter(res)
    }

    fetcher()
  }, [])

  return <View>
    {chapter.uri ?
      <FlatList
        data={chapter.uri}
        removeClippedSubviews={true}
        windowSize={5}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={10}
        renderItem={({ item, index }) => <Displayer uri={item} key={index} />}
      />
      : null
    }
  </View>
}
