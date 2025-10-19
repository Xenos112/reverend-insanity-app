import { memo } from 'react'
import { useImage, Image } from 'expo-image';
import { Dimensions } from 'react-native';

type DisplayerProps = {
  uri: string;
}

const { width } = Dimensions.get('window');
function Displayer({ uri }: DisplayerProps) {
  const image = useImage(uri, {
    onError: (e) => {
      console.log(e)
    }
  });

  const calculatedHeight = image?.width && image?.height
    ? (image.height / image.width) * width
    : width;

  return (
    <Image
      source={image}
      cachePolicy={'disk'}
      priority='high'
      style={{ width: width, height: calculatedHeight }}
    />
  );
}

export default memo(Displayer);
