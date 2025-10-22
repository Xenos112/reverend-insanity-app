import Displayer from '@/components/displayer';
import {
  View,
  FlatList,
  Platform,
  StyleSheet,
  Pressable,
  Text,
  ViewToken
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router'
import useChapter from '@/hooks/useChapter';
import { useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar'
import { colors } from '@/styles/theme';
import { ChevronLeft } from 'lucide-react-native'

interface ViewableItemsChangedInfo {
  viewableItems: ViewToken[];
  changed: ViewToken[];
}

export default function ChapterPage() {
  const [UIHidden, setUIHidden] = useState<boolean>(true)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const { chapterId } = useLocalSearchParams<{ chapterId: string }>()
  const { data: chapter } = useChapter(chapterId)
  const scrollBeganRef = useRef<boolean>(false)
  const router = useRouter()

  const handlePress = () => {
    if (!scrollBeganRef.current) {
      setUIHidden(!UIHidden)
    }
  }

  const onViewableItemsChanged = useRef(({ viewableItems }: ViewableItemsChangedInfo) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      const firstVisibleIndex = viewableItems[0].index
      setCurrentPage(firstVisibleIndex + 1)
    }
  }).current

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50
  }).current

  const totalPages: number = chapter?.uri?.length || 0
  const progress: number = totalPages > 0 ? (currentPage / totalPages) * 100 : 0

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {chapter?.uri ?
        <FlatList
          data={chapter.uri}
          removeClippedSubviews={true}
          maxToRenderPerBatch={5}
          initialNumToRender={10}
          contentContainerStyle={Platform.OS === 'web' ? { minHeight: '100%' } : undefined}
          keyExtractor={(item: string) => item}
          onScrollBeginDrag={() => { scrollBeganRef.current = true }}
          onScrollEndDrag={() => { scrollBeganRef.current = false }}
          onMomentumScrollEnd={() => { scrollBeganRef.current = false }}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          renderItem={({ item }: { item: string }) =>
            <Pressable style={{ flex: 1 }} onPress={handlePress}>
              <Displayer uri={item} />
            </Pressable>
          }
        />
        : null
      }

      {/* Top Title Bar */}
      <View style={[styles.chapterTitleBar, UIHidden && styles.hidden]}>
        <Pressable
          onPress={() => router.push("../")}
          style={styles.backButton}
        >
          <ChevronLeft size={28} color={colors.text} />
        </Pressable>
        <View style={styles.titleContainer}>
          <Text style={styles.chapterTitle} numberOfLines={1}>
            Chapter {chapter?.number}
          </Text>
        </View>
      </View>

      {/* Bottom Details Bar */}
      <View style={[styles.chapterDetails, UIHidden && styles.hidden]}>
        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>
        </View>

        {/* Page Info */}
        <View style={styles.pageInfoContainer}>
          <Text style={styles.pageText}>
            Page {currentPage} of {totalPages}
          </Text>
          <Text style={styles.percentText}>
            {Math.round(progress)}%
          </Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  hidden: {
    display: 'none'
  },

  // Top Title Bar
  chapterTitleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  chapterTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '600',
  },

  // Bottom Details Bar
  chapterDetails: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 30 : 16,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  progressBarContainer: {
    marginBottom: 12,
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  pageInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pageText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  percentText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '500',
  },
})
