import { memo, useEffect, useState } from 'react'
import { useImage, Image } from 'expo-image';
import { Dimensions, Text, View } from 'react-native';
import { File, Paths } from 'expo-file-system'
import { Loader, Loader2 } from 'lucide-react-native'
import { fetch } from 'expo/fetch'

type DisplayerProps = {
  uri: string;
}

const { width } = Dimensions.get('window');

function Displayer({ uri }: DisplayerProps) {
  const [imageUri, setImageUri] = useState('');

  useEffect(() => {
    (async () => {
      try {
        // Fix: Use proper array indexing (not [-2])
        const urlParts = uri.split('/');
        const fileName = urlParts[urlParts.length - 2] + '_' + urlParts[urlParts.length - 1];

        const cachedFile = new File(Paths.cache, fileName);

        // Check if file exists first
        if (cachedFile.exists) {
          const fileInfo = cachedFile.info();

          // Check if file has valid size
          if (fileInfo.size! > 0) {
            console.log("FROM CACHE:", fileName);
            setImageUri(cachedFile.uri);
            return;
          } else {
            // Delete empty file
            console.log("DELETING EMPTY FILE");
            cachedFile.delete();
          }
        }

        // Download and cache the image
        console.log("DOWNLOADING:", fileName);
        const image = await fetch(uri).then(res => res.bytes());

        // Create file and write
        cachedFile.create({ overwrite: true });
        cachedFile.write(image);

        console.log("SAVED IN CACHE");
        setImageUri(cachedFile.uri);

      } catch (error) {
        console.error("Error loading image:", error);
        // Fallback to direct URI if caching fails
        setImageUri(uri);
      }
    })();
  }, [uri]);

  const image = useImage(imageUri, {
    onError: (e) => console.log("Image load error:", e),
    maxWidth: 500
  });

  const calculatedHeight = image?.width && image?.height
    ? (image.height / image.width) * width
    : width * 1.5; // Default aspect ratio fallback

  // Only render when we have a valid URI
  if (!imageUri) {
    return <View style={{
      width: width,
      height: width * 1.5,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Text style={{ color: 'white' }}>
        <Loader2 size={24} color='white' />
      </Text>
    </View>
  }

  return (
    <Image
      source={{ uri: imageUri }}
      cachePolicy={'memory-disk'}
      priority='high'
      placeholder={{ blurhash: 'LEHV6nWB2yk8pyo0adR*.7kCMdnj' }}
      style={{ width: width, height: calculatedHeight }}
      transition={200}
    />
  );
}

export default memo(Displayer);
