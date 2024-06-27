import React from 'react';
import { Image, View } from 'react-native';
import { mapMarkerStyles } from './MapMarker.Styles';

const MapMarker = ({ imageUri }) => {
  return (
    <View style={mapMarkerStyles.markerContainer}>
      <Image source={{ uri: imageUri }} style={mapMarkerStyles.markerImage} />
      <View style={mapMarkerStyles.markerNeedle} />
    </View>
  );
};

export default MapMarker;
