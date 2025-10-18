import { useImage, Image } from 'expo-image';
import { Dimensions } from 'react-native';

type DisplayerProps = {
  uri: string;
}

const { width } = Dimensions.get('window');
export default function Displayer({ uri }: DisplayerProps) {
  const image = useImage(uri);

  const calculatedHeight = image?.width && image?.height
    ? (image.height / image.width) * width
    : width;

  return (
    <Image
      source={image}
      cachePolicy={'disk'}
      style={{ width: width, height: calculatedHeight }}
    />
  );
}
