import { memo, useEffect, useState } from 'react'
import { useImage, Image } from 'expo-image';
import { Dimensions } from 'react-native';
import { File, Paths } from 'expo-file-system'
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
        const fileName = uri.split('/').pop();
        const cachedFile = new File(Paths.cache, fileName!);

        if (cachedFile.exists) {
          console.log("FROM CACHE");
          console.log(cachedFile.uri);
          setImageUri(cachedFile.uri);
          return;
        } else if (cachedFile.info().size === 0) {
          cachedFile.delete()
          console.log("DELETING FILE");
          return
        }

        cachedFile.create({ overwrite: true })

        const image = await fetch(uri).then(res => res.bytes())
        console.log("DOWNLOADING...");

        cachedFile.write(image);
        console.log("SAVED IN CACHE");

        setImageUri(cachedFile.uri);
      } catch (error) {
        console.error("Error loading image:", error);
      }
    })();
  }, [uri]);

  const image = useImage(imageUri, {
    onError: (e) => console.log(e),
    maxWidth: 500
  });

  const calculatedHeight = image?.width && image?.height
    ? (image.height / image.width) * width
    : width;


  return (
    <Image
      source={imageUri}
      cachePolicy={'memory-disk'}
      priority='high'
      placeholder={{ blurhash: 'LEHV6nWB2yk8pyo0adR*.7kCMdnj' }}
      style={{ width: width, height: calculatedHeight }}
    />
  );
}

export default memo(Displayer);
