
import { StyleSheet } from 'react-native';

export const mapMarkerStyles = StyleSheet.create({
    markerContainer: {
      alignItems: 'center',
    },
    markerImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: 'orange',
    },
    markerNeedle: {
      width: 0,
      height: 0,
      borderLeftWidth: 2,
      borderRightWidth: 2,
      borderTopWidth: 10,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderTopColor: 'orange',
      marginTop: -1, // Adjust to position the needle correctly
    },
  });