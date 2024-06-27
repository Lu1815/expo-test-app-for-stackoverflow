
import { StyleSheet } from 'react-native';

export const imagelistStyles = StyleSheet.create({
    imageListContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    imageContainer: {
      position: 'relative',
    },
    image: {
      width: "100%",
      height: 100,
      borderRadius: 10,
    },
    removeButton: {
      position: 'absolute',
      top: 0,
      right: 0,
    },
  });