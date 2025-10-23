import Displayer from '@/components/displayer';
import {
  View,
  FlatList,
  Platform,
  StyleSheet,
  Pressable,
  Text,
  ViewToken,
  Animated,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router'
import useChapter from '@/hooks/useChapter';
import { useRef, useState, useEffect } from 'react';
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
  const totalPages: number = chapter?.uri?.length || 0
  const progress: number = totalPages > 0 ? (currentPage / totalPages) * 100 : 0

  // Animation values
  const topBarAnimation = useRef(new Animated.Value(0)).current
  const bottomBarAnimation = useRef(new Animated.Value(0)).current
  const progressBarAnimation = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(topBarAnimation, {
        toValue: UIHidden ? 0 : 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(bottomBarAnimation, {
        toValue: UIHidden ? 0 : 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start()
  }, [UIHidden, bottomBarAnimation, topBarAnimation])

  useEffect(() => {
    Animated.timing(progressBarAnimation, {
      toValue: progress,
      duration: 200,
      useNativeDriver: false,
    }).start()
  }, [progress, progressBarAnimation])

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

  const topBarTranslateY = topBarAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 0],
  })

  const bottomBarTranslateY = bottomBarAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  })

  const topBarOpacity = topBarAnimation
  const bottomBarOpacity = bottomBarAnimation

  const progressWidth = progressBarAnimation.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  })

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
          renderItem={({ item }: { item: string }) =>
            <Pressable style={{ flex: 1 }} onPress={handlePress}>
              <Displayer uri={item} />
            </Pressable>
          }
        />
        : null
      }

      {/* Top Title Bar */}
      <Animated.View
        style={[
          styles.chapterTitleBar,
          {
            transform: [{ translateY: topBarTranslateY }],
            opacity: topBarOpacity,
          }
        ]}
        pointerEvents={UIHidden ? 'none' : 'auto'}
      >
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
      </Animated.View>

      {/* Bottom Details Bar */}
      <Animated.View
        style={[
          styles.chapterDetails,
          {
            transform: [{ translateY: bottomBarTranslateY }],
            opacity: bottomBarOpacity,
          }
        ]}
        pointerEvents={UIHidden ? 'none' : 'auto'}
      >
        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <Animated.View
              style={[
                styles.progressBarFill,
                { width: progressWidth }
              ]}
            />
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
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
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
