import { useState, useRef, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  ActivityIndicator,
  FlatList,
  Pressable,
  StatusBar,
  Animated,
  Dimensions
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { File } from 'expo-file-system';
import JSZip from 'jszip';
import Displayer from '@/components/displayer';

const { height } = Dimensions.get('window');

type ImageInfo = {
  filename: string;
  uri?: string;
};

export default function IndexPage() {
  const [images, setImages] = useState<ImageInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [showUI, setShowUI] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const zipRef = useRef<JSZip | null>(null);
  const bottomAnimation = useRef(new Animated.Value(-100)).current;

  const toggleUI = () => {
    const newShowUI = !showUI;
    setShowUI(newShowUI);
    Animated.parallel([
      Animated.timing(bottomAnimation, {
        toValue: newShowUI ? 0 : 100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const pickAndExtractCBZ = async () => {
    try {
      setLoading(true);
      setImages([]);
      zipRef.current = null;

      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/zip', 'application/x-cbz', '*/*'],
        copyToCacheDirectory: true
      });

      if (result.canceled) {
        setLoading(false);
        return;
      }

      const pickedFile = new File(result.assets[0].uri);
      const base64 = pickedFile.base64();

      const zip = new JSZip();
      const zipContent = await zip.loadAsync(base64, { base64: true });
      zipRef.current = zipContent;

      const imageFiles: ImageInfo[] = [];
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];

      // Only collect filenames, don't extract images yet
      for (const [filename, file] of Object.entries(zipContent.files)) {
        if (!file.dir) {
          const ext = filename.toLowerCase().slice(filename.lastIndexOf('.'));
          if (imageExtensions.includes(ext)) {
            imageFiles.push({ filename });
          }
        }
      }

      imageFiles.sort((a, b) =>
        a.filename.localeCompare(b.filename, undefined, {
          numeric: true,
          sensitivity: 'base'
        })
      );

      setImages(imageFiles);
      setCurrentPage(1);
      setLoading(false);

      // Pre-load first 3 images
      setTimeout(() => {
        extractImage(imageFiles, zipContent, 0);
        extractImage(imageFiles, zipContent, 1);
        extractImage(imageFiles, zipContent, 2);
      }, 100);
    } catch (err) {
      console.error('Error:', err);
      setLoading(false);
    }
  };

  const extractImage = useCallback(async (
    imageList: ImageInfo[],
    zip: JSZip,
    index: number
  ) => {
    if (!zip || !imageList[index] || imageList[index].uri) return;

    const imageInfo = imageList[index];
    const file = zip.files[imageInfo.filename];

    if (!file) return;

    try {
      const imageData = await file.async('base64');
      const ext = imageInfo.filename.toLowerCase().slice(imageInfo.filename.lastIndexOf('.') + 1);
      const mimeType = ext === 'png' ? 'image/png' :
        ext === 'gif' ? 'image/gif' :
          ext === 'webp' ? 'image/webp' : 'image/jpeg';

      const uri = `data:${mimeType};base64,${imageData}`;

      setImages(prev => {
        const newImages = [...prev];
        if (newImages[index]) {
          newImages[index] = { ...newImages[index], uri };
        }
        return newImages;
      });
    } catch (err) {
      console.error('Error extracting image:', err);
    }
  }, []);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0 && zipRef.current) {
      const currentIndex = viewableItems[0].index;
      setCurrentPage(currentIndex + 1);

      // Pre-load nearby images
      const imagesToLoad = [
        currentIndex - 1,
        currentIndex,
        currentIndex + 1,
        currentIndex + 2,
        currentIndex + 3
      ];

      imagesToLoad.forEach(idx => {
        if (idx >= 0 && idx < images.length && zipRef.current) {
          extractImage(images, zipRef.current, idx);
        }
      });
    }
  }).current;

  const renderItem = ({ item, index }: { item: ImageInfo; index: number }) => {
    // Trigger extraction when rendering
    if (!item.uri && zipRef.current) {
      extractImage(images, zipRef.current, index);
    }

    if (!item.uri) {
      return (
        <Pressable onPress={toggleUI} style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
        </Pressable>
      );
    }

    return (
      <Pressable onPress={toggleUI}>
        <Displayer uri={item.uri} />
      </Pressable>
    );
  };

  if (images.length === 0 && !loading) {
    return (
      <View style={styles.emptyContainer}>
        <StatusBar hidden />
        <TouchableOpacity style={styles.selectButton} onPress={pickAndExtractCBZ}>
          <Text style={styles.selectButtonText}>Open CBZ</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.emptyContainer}>
        <StatusBar hidden />
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading CBZ...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden={!showUI} />

      <FlatList
        data={images}
        maxToRenderPerBatch={3}
        initialNumToRender={2}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 10 }}
        removeClippedSubviews={true}
        windowSize={5}
      />

      {/* Bottom Bar */}
      <Animated.View
        style={[
          styles.bottombar,
          { transform: [{ translateY: bottomAnimation }] }
        ]}
        pointerEvents={showUI ? 'auto' : 'none'}
      >
        <View style={styles.pageInfo}>
          <Text style={styles.pageText}>
            Page {currentPage} / {images.length}
          </Text>
        </View>

        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              { width: `${(currentPage / images.length) * 100}%` }
            ]}
          />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
  },
  selectButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 14,
  },
  loadingContainer: {
    width: '100%',
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  bottombar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    paddingVertical: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  pageInfo: {
    alignItems: 'center',
    marginBottom: 15,
  },
  pageText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
});
