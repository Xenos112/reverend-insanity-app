import Displayer from '@/components/displayer';
import { View, FlatList, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router'
import useChapter from '@/hooks/useChapter';

// TEST: 407a9c14-d636-4e13-844f-c43e646de208
export default function ChapterPage() {
  const { chapterId } = useLocalSearchParams<{ chapterId: string }>()
  const { data: chapter } = useChapter(chapterId)


  return <View style={{ flex: 1 }}>
    {chapter?.uri ?
      <FlatList
        data={chapter.uri}
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        initialNumToRender={10}
        contentContainerStyle={Platform.OS === 'web' ? { minHeight: '100%' } : undefined}
        keyExtractor={(item) => item}
        renderItem={({ item, index }) => <Displayer uri={item} key={index} />}
      />
      : null
    }
  </View>
}
